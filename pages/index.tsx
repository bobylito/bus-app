import { LatLngTuple } from "leaflet";

import { CredentialsForm } from "@/components/Form";
import { Map } from "@/components/Map";
import { useGPSUpdate } from "@/hooks/useGPSUpdate";
import { useStoreCredentials } from "@/hooks/useStoreCredentials";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { BusError } from "./api/bus";

const DEFAULT_CENTER = [37.94185, 23.7619833] as LatLngTuple;

const getErrorDisplay = ({ code }: BusError, callbackConfig: () => void) => {
  if (code === "parse")
    return (
      <div className="inline-block">
        Mauvais format de route / code{" "}
        <button
          onClick={callbackConfig}
          className="bg-slate-50 px-2 py-1 text-red-400 rounded"
        >
          Verifier la configuration
        </button>
      </div>
    );
  if (code === "no-location" || code === "no-gps") return "Pas de coordonnees";
  if (code === "technical-error" || code === "parse-error")
    return "Erreur technique";
};

export default function Home() {
  const { credentials, saveCredentials } = useStoreCredentials();
  const { isLoading, data, error } = useGPSUpdate(credentials);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selfPosition, setSelfposition] = useState<LatLngTuple | null>(null);

  useEffect(() => {
    navigator.geolocation.watchPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setSelfposition([latitude, longitude]);
    });
  }, []);

  const position =
    isLoading || error || !data || data.object === "position-error"
      ? DEFAULT_CENTER
      : data.position;

  console.log({ data, error });

  return (
    <div>
      <div className="absolute bottom-0 left-0 px-4 py-2 w-full bg-slate-900 z-20">
        Status :{" "}
        {data?.object === "position" &&
          `Derniere mise a jour : ${data.updatedAt}`}
        {data?.object === "position-error" &&
          getErrorDisplay(data, () => {
            setIsConfigModalOpen(true);
          })}
      </div>
      <div className="absolute top-0 right-0 p-2 z-10">
        <button
          className="bg-slate-50 text-black px-4 py-2 rounded hover:bg-slate-100 active:bg-slate-200"
          onClick={() => {
            setIsConfigModalOpen(!isConfigModalOpen);
          }}
        >
          Configuration
        </button>
      </div>
      <Map
        width={800}
        height={400}
        // center={selfPosition || position || DEFAULT_CENTER}
        bounds={[selfPosition || DEFAULT_CENTER, position || DEFAULT_CENTER]}
        scrollWheelZoom={false}
      >
        {({ TileLayer, Marker }: any, { icon }: any) => {
          const family = icon({
            iconUrl: "images/Family.png",
            iconSize: [48, 48],
            iconAnchor: [24, 48],
          });
          const bus = icon({
            iconUrl: "images/Bus.png",
            iconSize: [48, 48],
            iconAnchor: [24, 48],
          });

          return (
            <>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={position || DEFAULT_CENTER} icon={bus}></Marker>
              {selfPosition && (
                <Marker
                  position={selfPosition || DEFAULT_CENTER}
                  icon={family}
                ></Marker>
              )}
            </>
          );
        }}
      </Map>
      <ReactModal
        isOpen={isConfigModalOpen}
        style={{
          overlay: {
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            alignContent: "center",
            backdropFilter: "blur(2px)",
            background: "rgba(0,0,0,0.5)",
          },
          content: {
            padding: 0,
            width: "fit-content",
            height: "fit-content",
            position: "unset",
            margin: "auto",
          },
        }}
        onRequestClose={() => {}}
      >
        <CredentialsForm
          credentials={credentials}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const formdata = new FormData(e.currentTarget);
            const data = Object.fromEntries(formdata.entries());
            saveCredentials(data as { code: string; route: string }); // This is the form below
            setIsConfigModalOpen(false);
          }}
        />
      </ReactModal>
    </div>
  );
}
