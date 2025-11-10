import {motion} from 'framer-motion';
import {formatLockScreenDate, formatLockScreenTime} from '../../../utils/dateTime';
import {WINDOW_KEYS} from '../../../utils/windowKeys';
import {
  getLockScreenClockMotion,
  getLockScreenClockTransition,
  getLockScreenProfileMotion,
  getLockScreenProfileTransition,
} from '../lib/lockScreenMotionConfig';
import {useLockScreenState} from '../lib/useLockScreenState';
import LockScreenViewMotion from './motion/LockScreenViewMotion';
import styles from './LockScreenView.module.css';

const LockScreenView = () => {
  const {currentDateTime, disableAnimation, isExiting, pointerCursor, pointerEvents, handleUnlock} = useLockScreenState();

  return (
    <LockScreenViewMotion
      disableAnimation={disableAnimation}
      isExiting={isExiting}
      onClick={handleUnlock}
      aria-label="Lock screen"
      data-window-key={WINDOW_KEYS.lockScreen}
      style={{
        cursor: pointerCursor,
        pointerEvents,
      }}>
      <div className={styles.overlayLayer}>
        <div className={styles.content}>
          <motion.div
            animate={getLockScreenClockMotion(isExiting)}
            transition={getLockScreenClockTransition(disableAnimation)}
            initial={false}>
            <p className={styles.dateLabel}>{formatLockScreenDate(currentDateTime)}</p>
            <h1 className={styles.timeLabel}>{formatLockScreenTime(currentDateTime)}</h1>
          </motion.div>
          <motion.div
            className={styles.unlockSection}
            animate={getLockScreenProfileMotion(isExiting)}
            transition={getLockScreenProfileTransition(disableAnimation)}
            initial={false}>
            <div className={styles.profileAvatar}>
              <span>👤</span>
            </div>
            <p className={styles.profileName}>이현우</p>
            <p className={styles.unlockHint}>클릭하거나 Enter 키를 눌러 잠금 해제</p>
          </motion.div>
        </div>
      </div>
    </LockScreenViewMotion>
  );
};

export default LockScreenView;
