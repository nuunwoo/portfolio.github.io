import type {Transition} from 'framer-motion';
import {motion} from 'framer-motion';
import styles from './LockContent.module.css';

type LockContentProps = {
  currentDateLabel: string;
  currentTimeLabel: string;
  clockMotion: {opacity: number};
  clockTransition: Transition;
  profileMotion: {opacity: number; scale: number};
  profileTransition: Transition;
};

const LockContent = ({
  currentDateLabel,
  currentTimeLabel,
  clockMotion,
  clockTransition,
  profileMotion,
  profileTransition,
}: LockContentProps) => (
  <div className={styles.overlay}>
    <div className={styles.content}>
      <motion.div animate={clockMotion} transition={clockTransition} initial={false}>
        <p className={styles.date}>{currentDateLabel}</p>
        <h1 className={styles.time}>{currentTimeLabel}</h1>
      </motion.div>
      <motion.div className={styles.unlock} animate={profileMotion} transition={profileTransition} initial={false}>
        <div className={styles.avatar}>
          <span>👤</span>
        </div>
        <p className={styles.profileName}>이현우</p>
        <p className={styles.unlockHint}>클릭하거나 Enter 키를 눌러 잠금 해제</p>
      </motion.div>
    </div>
  </div>
);

export default LockContent;
