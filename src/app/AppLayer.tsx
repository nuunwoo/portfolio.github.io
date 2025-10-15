import { type PropsWithChildren } from "react";
import AppLayerMotion from "./animations/AppLayerMotion";

type AppLayerProps = PropsWithChildren<{
  layerClassName: "app-layer-desktop" | "app-layer-lock" | "app-layer-splash";
  noTransition?: boolean;
  visible: boolean;
}>;

const AppLayer = ({
  children,
  layerClassName,
  noTransition = false,
  visible,
}: AppLayerProps) => {
  const className = ["app-layer", layerClassName].join(" ");
  return (
    <AppLayerMotion className={className} visible={visible} noTransition={noTransition}>
      {children}
    </AppLayerMotion>
  );
};

export default AppLayer;
