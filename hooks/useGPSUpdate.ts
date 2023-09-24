import useSwr from "swr";

import { BusData, BusError, RequestData } from "@/pages/api/bus";

export type UseGPSUpdate = RequestData;

export const useGPSUpdate = ({ code, route }: UseGPSUpdate) =>
  useSwr<BusData | BusError>(
    ["/api/bus", code, route],
    async ([url, code, route]) => {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ code, route }),
      });
      return res.json();
    },
    {
      refreshInterval: 10000,
    }
  );
