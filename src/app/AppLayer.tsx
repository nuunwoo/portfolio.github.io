import { type PropsWithChildren } from "react";

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
  const classNames = [
    "app-layer",
    layerClassName,
    visible ? "app-layer-visible" : "app-layer-hidden",
    noTransition ? "app-layer-no-transition" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classNames}>{children}</div>;
};

export default AppLayer;
