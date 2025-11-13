import {type CSSProperties, useCallback} from 'react';
import {useCurrentDateTime} from '../../../shared/hooks/useCurrentDateTime';
import {useAppStore} from '../../../shared/store/app-store';

export const useLockState = () => {
  const currentDateTime = useCurrentDateTime({align: 'minute'});
  const currentScreen = useAppStore(state => state.currentScreen);
  const hasUnlockedOnce = useAppStore(state => state.hasUnlockedOnce);
  const isUnlocking = useAppStore(state => state.isUnlocking);
  const unlockScreen = useAppStore(state => state.unlockScreen);

  const isVisible = currentScreen === 'lock';
  const disableAnimation = !hasUnlockedOnce && isVisible && !isUnlocking;
  const isExiting = isUnlocking || !isVisible;
  const pointerCursor = isExiting ? 'var(--cursor-default)' : 'var(--cursor-pointer)';
  const pointerEvents: CSSProperties['pointerEvents'] = !isVisible || isUnlocking ? 'none' : 'auto';

  const handleUnlock = useCallback(() => {
    if (!isVisible || isUnlocking) return;
    unlockScreen();
  }, [isVisible, isUnlocking, unlockScreen]);

  return {
    currentDateTime,
    disableAnimation,
    isExiting,
    pointerCursor,
    pointerEvents,
    handleUnlock,
  };
};
