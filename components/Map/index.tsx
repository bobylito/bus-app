import dynamic from "next/dynamic";

import { DynMapProps } from "./DynamicMap";

const DynamicMap = dynamic(() => import("./DynamicMap"), {
  ssr: false,
});

// Set default sizing to control aspect ratio which will scale responsively
// but also help avoid layout shift

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

export type MapProps = DynMapProps;
export const Map = (props: MapProps) => {
  return (
    <div className="absolute top-0 left-0 z-0 w-full h-full">
      <DynamicMap {...props} />
    </div>
  );
};
