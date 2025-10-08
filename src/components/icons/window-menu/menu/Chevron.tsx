import type { ComponentType, SVGProps } from "react";
import ChevronDisabled from "./ChevronDisabled";
import ChevronHover from "./ChevronHover";
import ChevronIdle from "./ChevronIdle";

type ChevronState = "idle" | "hover" | "disabled";

type ChevronProps = SVGProps<SVGSVGElement> & {
  state?: ChevronState;
};

const Chevron = ({ state = "idle", ...props }: ChevronProps) => {
  let IconComponent: ComponentType<SVGProps<SVGSVGElement>> = ChevronIdle;

  if (state === "hover") IconComponent = ChevronHover;
  if (state === "disabled") IconComponent = ChevronDisabled;

  return <IconComponent {...props} />;
};

export default Chevron;
