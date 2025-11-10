import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { bootScreenProgressFillTransition, bootScreenRootTransition, bootScreenRootVariants } from "../../lib/bootScreenViewMotionConfig";
import styles from "./BootScreenViewMotion.module.css";

type BootScreenViewMotionProps = {
  isExiting: boolean;
  logo: ReactNode;
  progress: number;
};

const BootScreenViewMotion = ({ isExiting, logo, progress }: BootScreenViewMotionProps) => (
  <motion.section
    aria-label="MacBook boot splash screen"
    className={styles.root}
    animate={isExiting ? "exit" : "show"}
    variants={bootScreenRootVariants}
    transition={bootScreenRootTransition}>
    <div className={styles.backgroundGlow} />
    <div className={styles.content}>
      {logo}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.statusLabel}>Starting portfolio OS</span>
          <span className={styles.progressValue}>{Math.round(progress)}%</span>
        </div>
        <div className={styles.progressTrack}>
          <motion.div
            className={styles.progressFill}
            animate={{ width: `${progress}%` }}
            transition={bootScreenProgressFillTransition}
          />
        </div>
      </div>
    </div>
  </motion.section>
);

export default BootScreenViewMotion;
