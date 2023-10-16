import "leaflet/dist/leaflet.css";

import Leaflet, { LatLngBoundsExpression } from "leaflet";
import { useEffect } from "react";
import * as ReactLeaflet from "react-leaflet";

const { MapContainer } = ReactLeaflet;

type SetPositionProps = {
  bounds?: LatLngBoundsExpression;
};

const SetBounds = ({ bounds }: SetPositionProps) => {
  const map = ReactLeaflet.useMap();

  if (bounds) {
    map.fitBounds(bounds);
  }

  return null;
};

export type DynMapProps = Omit<ReactLeaflet.MapContainerProps, "children"> & {
  width: number;
  height: number;
  children: any;
};

const Map = ({
  children,
  className,
  width,
  height,
  bounds,
  ...rest
}: DynMapProps) => {
  useEffect(() => {
    (async function init() {
      // @ts-ignore
      delete Leaflet.Icon.Default.prototype._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
        iconUrl: "leaflet/images/marker-icon.png",
        shadowUrl: "leaflet/images/marker-shadow.png",
      });
    })();
  }, []);

  return (
    <MapContainer {...rest} style={{ width: "100%", height: "100%" }}>
      {children(ReactLeaflet, Leaflet)}
      <SetBounds bounds={bounds} />
    </MapContainer>
  );
};

export default Map;
