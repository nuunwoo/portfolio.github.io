import {formatLockScreenDate, formatLockScreenTime} from '../../../utils/dateTime';
import {
  getLockClockMotion,
  getLockClockTransition,
  getLockProfileMotion,
  getLockProfileTransition,
} from './lockMotionConfig';
import {useLockState} from './useLockState';

export const useLockScreenViewState = () => {
  const {currentDateTime, disableAnimation, isExiting, pointerCursor, pointerEvents, handleUnlock} = useLockState();

  return {
    disableAnimation,
    isExiting,
    pointerCursor,
    pointerEvents,
    handleUnlock,
    dateLabel: formatLockScreenDate(currentDateTime),
    timeLabel: formatLockScreenTime(currentDateTime),
    clockMotion: getLockClockMotion(isExiting),
    clockTransition: getLockClockTransition(disableAnimation),
    unlockPanelMotion: getLockProfileMotion(isExiting),
    unlockPanelTransition: getLockProfileTransition(disableAnimation),
  };
};
