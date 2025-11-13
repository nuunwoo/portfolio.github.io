import {motion} from 'framer-motion';
import {bootstrapProgressFillTransition} from '../../lib/bootstrapMotionConfig';
import styles from './BootstrapProgress.module.css';

type BootstrapProgressProps = {
  progressValue: number;
};

const BootstrapProgress = ({progressValue}: BootstrapProgressProps) => (
  <div className={styles.progressSection}>
    <div className={styles.progressHeader}>
      <span className={styles.statusLabel}>Starting portfolio OS</span>
      <span className={styles.progressValue}>{Math.round(progressValue)}%</span>
    </div>
    <div className={styles.progressTrack}>
      <motion.div
        className={styles.progressFill}
        animate={{width: `${progressValue}%`}}
        transition={bootstrapProgressFillTransition}
      />
    </div>
  </div>
);

export default BootstrapProgress;
