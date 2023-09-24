import { LatLngTuple } from "leaflet";

import { CredentialsForm } from "@/components/Form";
import { Map } from "@/components/Map";
import { useGPSUpdate } from "@/hooks/useGPSUpdate";
import { useStoreCredentials } from "@/hooks/useStoreCredentials";
import { BusError } from "./api/bus";

const DEFAULT_CENTER = [37.94185, 23.7619833] as LatLngTuple;

const getErrorDisplay = ({ code }: BusError) => {
  if (code === "parse") return "Mauvais format de route / code";
  if (code === "no-location" || code === "no-gps") return "Pas de coordonnees";
  if (code === "technical-error" || code === "parse-error")
    return "Erreur technique";
};

export default function Home() {
  const { credentials, saveCredentials } = useStoreCredentials();
  const { isLoading, data, error } = useGPSUpdate(credentials);

  const position =
    isLoading || error || !data || data.object === "position-error"
      ? DEFAULT_CENTER
      : data.position;

  console.log({ data, error });

  return (
    <div>
      <div>
        Status :{" "}
        {data?.object === "position" &&
          `Derniere mise a jour : ${data.updatedAt}`}
        {data?.object === "position-error" && getErrorDisplay(data)}
      </div>
      <Map
        width={800}
        height={400}
        center={position || DEFAULT_CENTER}
        position={position || DEFAULT_CENTER}
        zoom={14}
        scrollWheelZoom={false}
      >
        {({ TileLayer, Marker }: any /*, { map }*/) => (
          <>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position || DEFAULT_CENTER}></Marker>
          </>
        )}
      </Map>
      <CredentialsForm
        credentials={credentials}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const formdata = new FormData(e.currentTarget);
          const data = Object.fromEntries(formdata.entries());
          saveCredentials(data as { code: string; route: string }); // This is the form below
        }}
      />
    </div>
  );
}
