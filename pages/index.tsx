import { LatLngTuple } from "leaflet";

import { CredentialsDialog } from "@/components/Form/DialogForm";
import { Map } from "@/components/Map";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useGPSUpdate } from "@/hooks/useGPSUpdate";
import { useStoreCredentials } from "@/hooks/useStoreCredentials";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { BusError } from "./api/bus";

const DEFAULT_CENTER = [37.94185, 23.7619833] as LatLngTuple;

const getErrorDisplay = ({ code }: BusError, callbackConfig: () => void) => {
  if (code === "parse")
    return (
      <div className="inline-flex justify-center items-center gap-2">
        <p>Mauvais format de route / code</p>
        <Button onClick={callbackConfig} className="px-2 py-1 ">
          Verifier la configuration
        </Button>
      </div>
    );
  if (code === "no-location" || code === "no-gps")
    return "Pas de coordonnees transmis par le bus";
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
      <div className="absolute bottom-0 left-0 px-4 py-2 w-full z-20 bg-transparent">
        <Alert
          variant={
            data?.object === "position-error" ? "destructive" : "default"
          }
          className="bg-background max-w-md"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Status</AlertTitle>
          <AlertDescription>
            {data?.object === "position" &&
              `Derniere mise a jour : ${data.updatedAt}`}
            {data?.object === "position-error" &&
              getErrorDisplay(data, () => {
                setIsConfigModalOpen(true);
              })}
          </AlertDescription>
        </Alert>
      </div>
      <div className="absolute top-0 right-0 p-2 z-10">
        <Button
          onClick={() => {
            setIsConfigModalOpen(!isConfigModalOpen);
          }}
        >
          Configuration
        </Button>
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

      <CredentialsDialog
        open={isConfigModalOpen}
        onOpenChange={setIsConfigModalOpen}
        credentials={credentials}
        onSubmit={(e) => {
          debugger;
          e.preventDefault();
          e.stopPropagation();
          const formdata = new FormData(e.currentTarget);
          const data = Object.fromEntries(formdata.entries());
          console.log(data);
          saveCredentials(data as { code: string; route: string }); // This is the form below
          setIsConfigModalOpen(false);
        }}
      />
    </div>
  );
}
