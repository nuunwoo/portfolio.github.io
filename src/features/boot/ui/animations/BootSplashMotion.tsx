import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { bootSplashProgressTransition, bootSplashRootTransition, bootSplashRootVariants } from "./bootSplashAnimations";
import styles from "./BootSplashMotion.module.css";

type BootSplashMotionProps = {
  isExiting: boolean;
  logo: ReactNode;
  progress: number;
};

const BootSplashMotion = ({ isExiting, logo, progress }: BootSplashMotionProps) => (
  <motion.section
    aria-label="MacBook boot splash screen"
    className={styles.root}
    animate={isExiting ? "exit" : "show"}
    variants={bootSplashRootVariants}
    transition={bootSplashRootTransition}>
    <div className={styles.glow} />
    <div className={styles.container}>
      {logo}
      <div className={styles.progressWrap}>
        <div className={styles.progressMeta}>
          <span className={styles.status}>Starting portfolio OS</span>
          <span className={styles.percent}>{Math.round(progress)}%</span>
        </div>
        <div className={styles.progress}>
          <motion.div
            className={styles.bar}
            animate={{ width: `${progress}%` }}
            transition={bootSplashProgressTransition}
          />
        </div>
      </div>
    </div>
  </motion.section>
);

export default BootSplashMotion;
