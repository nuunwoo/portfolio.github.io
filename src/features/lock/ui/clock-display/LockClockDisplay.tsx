import type {Transition} from 'framer-motion';
import {motion} from 'framer-motion';
import styles from './LockClockDisplay.module.css';

type LockClockDisplayProps = {
  dateLabel: string;
  timeLabel: string;
  motionState: {opacity: number};
  transition: Transition;
};

const LockClockDisplay = ({dateLabel, timeLabel, motionState, transition}: LockClockDisplayProps) => (
  <motion.div animate={motionState} transition={transition} initial={false}>
    <p className={styles.date}>{dateLabel}</p>
    <h1 className={styles.time}>{timeLabel}</h1>
  </motion.div>
);

export default LockClockDisplay;
