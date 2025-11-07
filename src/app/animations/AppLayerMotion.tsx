import type { CSSProperties, PropsWithChildren } from "react";
import { motion, type Transition } from "framer-motion";

type AppLayerMotionProps = PropsWithChildren<{
  className: string;
  layerScale?: number;
  style?: CSSProperties;
  transition?: Transition;
  visible: boolean;
  noTransition?: boolean;
}>;

const AppLayerMotion = ({
  children,
  className,
  layerScale = 1,
  style,
  transition,
  visible,
  noTransition = false,
}: AppLayerMotionProps) => (
  <motion.div
    className={className}
    style={style}
    animate={{
      "--layer-zoom": `${layerScale}`,
      opacity: visible ? 1 : 0,
      visibility: visible ? "visible" : "hidden",
      pointerEvents: visible ? "auto" : "none",
    }}
    transition={noTransition ? { duration: 0 } : (transition ?? { duration: 0.36, ease: [0.22, 1, 0.36, 1] })}>
    {children}
  </motion.div>
);

export default AppLayerMotion;
