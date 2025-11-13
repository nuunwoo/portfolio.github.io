import type {Transition} from 'framer-motion';
import {motion} from 'framer-motion';
import styles from './LockUnlockPanel.module.css';

type LockUnlockPanelProps = {
  motionState: {opacity: number; scale: number};
  transition: Transition;
};

const LockUnlockPanel = ({motionState, transition}: LockUnlockPanelProps) => (
  <motion.div className={styles.panel} animate={motionState} transition={transition} initial={false}>
    <div className={styles.avatar}>
      <span>👤</span>
    </div>
    <p className={styles.profileName}>이현우</p>
    <p className={styles.unlockHint}>클릭하거나 Enter 키를 눌러 잠금 해제</p>
  </motion.div>
);

export default LockUnlockPanel;
