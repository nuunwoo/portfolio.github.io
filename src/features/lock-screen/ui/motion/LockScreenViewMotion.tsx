import { motion } from "framer-motion";
import type { CSSProperties, PropsWithChildren } from "react";
import { getLockScreenRootTransition, lockScreenRootVariants } from "../../lib/lockScreenMotionConfig";
import styles from "./LockScreenViewMotion.module.css";

type LockScreenViewMotionProps = PropsWithChildren<{
  disableAnimation: boolean;
  isExiting: boolean;
  onClick?: () => void;
  "aria-label"?: string;
  "data-window-key"?: string;
  style?: CSSProperties;
}>;

const LockScreenViewMotion = ({
  children,
  disableAnimation,
  isExiting,
  ...rest
}: LockScreenViewMotionProps) => (
  <motion.section
    {...rest}
    className={styles.root}
    animate={isExiting ? "exit" : "show"}
    variants={lockScreenRootVariants}
    transition={getLockScreenRootTransition(disableAnimation)}>
    {children}
  </motion.section>
);

export default LockScreenViewMotion;
