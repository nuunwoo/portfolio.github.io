import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";

type AppLayerMotionProps = PropsWithChildren<{
  className: string;
  visible: boolean;
  noTransition?: boolean;
}>;

const AppLayerMotion = ({ children, className, visible, noTransition = false }: AppLayerMotionProps) => (
  <motion.div
    className={className}
    animate={{
      opacity: visible ? 1 : 0,
      visibility: visible ? "visible" : "hidden",
      pointerEvents: visible ? "auto" : "none",
    }}
    transition={noTransition ? { duration: 0 } : { duration: 0.22, ease: "easeInOut" }}>
    {children}
  </motion.div>
);

export default AppLayerMotion;

