import { type CSSProperties, type PropsWithChildren } from "react";
import type { Transition } from "framer-motion";
import AppLayerMotion from "./animations/AppLayerMotion";

type AppLayerProps = PropsWithChildren<{
  layerClassName: "app-layer-desktop" | "app-layer-lock" | "app-layer-splash";
  layerScale?: number;
  style?: CSSProperties;
  transition?: Transition;
  noTransition?: boolean;
  visible: boolean;
}>;

const AppLayer = ({
  children,
  layerClassName,
  layerScale = 1,
  style,
  transition,
  noTransition = false,
  visible,
}: AppLayerProps) => {
  const className = ["app-layer", layerClassName].join(" ");
  return (
    <AppLayerMotion
      className={className}
      layerScale={layerScale}
      style={style}
      transition={transition}
      visible={visible}
      noTransition={noTransition}>
      {children}
    </AppLayerMotion>
  );
};

export default AppLayer;
