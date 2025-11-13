import {formatLockScreenDate, formatLockScreenTime} from '../../utils/dateTime';
import {WINDOW_KEYS} from '../../utils/windowKeys';
import {useLockState} from './lib/useLockState';
import {
  getLockClockMotion,
  getLockClockTransition,
  getLockProfileMotion,
  getLockProfileTransition,
} from './lib/lockMotionConfig';
import {LockContent, LockMotion} from './ui';

const Lock = () => {
  const {currentDateTime, disableAnimation, isExiting, pointerCursor, pointerEvents, handleUnlock} = useLockState();

  return (
    <LockMotion
      disableAnimation={disableAnimation}
      isExiting={isExiting}
      onClick={handleUnlock}
      aria-label="Lock screen"
      data-window-key={WINDOW_KEYS.lockScreen}
      style={{
        cursor: pointerCursor,
        pointerEvents,
      }}>
      <LockContent
        currentDateLabel={formatLockScreenDate(currentDateTime)}
        currentTimeLabel={formatLockScreenTime(currentDateTime)}
        clockMotion={getLockClockMotion(isExiting)}
        clockTransition={getLockClockTransition(disableAnimation)}
        profileMotion={getLockProfileMotion(isExiting)}
        profileTransition={getLockProfileTransition(disableAnimation)}
      />
    </LockMotion>
  );
};

export default Lock;
