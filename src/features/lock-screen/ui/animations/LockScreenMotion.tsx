import { motion } from "framer-motion";
import type { CSSProperties, PropsWithChildren } from "react";
import styles from "./LockScreenMotion.module.css";

type LockScreenMotionProps = PropsWithChildren<{
  disableTransition: boolean;
  isTransitioningOut: boolean;
  onClick?: () => void;
  "aria-label"?: string;
  "data-window-key"?: string;
  style?: CSSProperties;
}>;

const LockScreenMotion = ({
  children,
  disableTransition,
  isTransitioningOut,
  ...rest
}: LockScreenMotionProps) => (
  <motion.section
    {...rest}
    className={styles.root}
    animate={isTransitioningOut ? "exit" : "show"}
    variants={{
      show: { opacity: 1, scale: 1, filter: "blur(0px)" },
      exit: { opacity: 0, scale: 1.015, filter: "blur(10px)" },
    }}
    transition={disableTransition ? { duration: 0 } : { duration: 0.36, ease: "easeInOut" }}>
    {children}
  </motion.section>
);

export default LockScreenMotion;
