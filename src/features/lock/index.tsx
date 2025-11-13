import {WINDOW_KEYS} from '../../utils/windowKeys';
import {useLockScreenViewState} from './lib/useLockScreenViewState';
import {LockClockDisplay, LockMotion, LockScreenLayout, LockUnlockPanel} from './ui';

const Lock = () => {
  const {
    disableAnimation,
    isExiting,
    pointerCursor,
    pointerEvents,
    handleUnlock,
    dateLabel,
    timeLabel,
    clockMotion,
    clockTransition,
    unlockPanelMotion,
    unlockPanelTransition,
  } = useLockScreenViewState();

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
      <LockScreenLayout
        clockDisplay={
          <LockClockDisplay
            dateLabel={dateLabel}
            timeLabel={timeLabel}
            motionState={clockMotion}
            transition={clockTransition}
          />
        }
        unlockPanel={
          <LockUnlockPanel
            motionState={unlockPanelMotion}
            transition={unlockPanelTransition}
          />
        }
      />
    </LockMotion>
  );
};

export default Lock;
