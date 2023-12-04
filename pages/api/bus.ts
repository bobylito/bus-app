import { LatLngTuple } from "leaflet";
import { NextApiRequest, NextApiResponse } from "next";
import { get } from "node:http";
import { z } from "zod";

const MOCK = Boolean(process.env.MOCK) || false;

const requestDataSchema = z.object({
  route: z.string().regex(/^\d\d$/, "Invalid route"),
  code: z.string().regex(/^\d{3,4}$/, "Invalid code"),
});
export type RequestData = z.infer<typeof requestDataSchema>;

export type BusData = {
  object: "position";
  position: LatLngTuple;
  updatedAt: string;
};
export type BusError = {
  object: "position-error";
  code: "no-location" | "no-gps" | "technical-error" | "parse-error" | "parse";
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BusData | BusError>
) {
  const parsedBody = requestDataSchema.safeParse(JSON.parse(req.body));
  if (parsedBody.success === false) {
    console.error(JSON.stringify({ parsedBody, body: req.body }));
    return res.status(400).json({
      object: "position-error",
      code: "parse",
    });
  }

  const { route, code } = parsedBody.data;

  if (MOCK === true) {
    return res.status(200).json({
      object: "position",
      position: [37.94185, 23.7619833],
      updatedAt: Date.now().toString(),
    });
  } else {
    get(
      `http://lfh.panolympia.gr/?action=redirect&la=fr&ROUTENUMBER=${route}&given_password=${code}`,
      (response) => {
        if (response.statusCode === 302) {
          if (response.headers.location) {
            const locationURL = new URL(response.headers.location);
            const q = locationURL.searchParams.get("q");
            if (q === null) {
              return res.status(500).json({
                object: "position-error",
                code: "parse-error",
              });
            }
            const [position, updatedAt] = q.split("\n");
            console.log(updatedAt);
            console.log(position);
            return res.status(200).json({
              object: "position",
              position: position.split(",").map(parseFloat) as [number, number],
              updatedAt,
            });
          } else
            return res
              .status(400)
              .json({ object: "position-error", code: "no-location" });
        } else if (response.statusCode === 200) {
          return res
            .status(404)
            .json({ object: "position-error", code: "no-gps" });
        }

        return res
          .status(500)
          .json({ object: "position-error", code: "technical-error" });
      }
    );
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
