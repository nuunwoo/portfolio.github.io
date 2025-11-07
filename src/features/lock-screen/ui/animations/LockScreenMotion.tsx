import { motion } from "framer-motion";
import type { CSSProperties, PropsWithChildren } from "react";
import { getLockScreenRootTransition, lockScreenRootVariants } from "./lockScreenAnimations";
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
    variants={lockScreenRootVariants}
    transition={getLockScreenRootTransition(disableTransition)}>
    {children}
  </motion.section>
);

export default LockScreenMotion;
