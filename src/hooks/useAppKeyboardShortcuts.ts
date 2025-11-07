import {useEffect, useMemo} from 'react';
import {useAppStore} from '../shared/store/app-store';
import {WINDOW_KEYS} from '../utils/windowKeys';
import {useWindowKeyboardShortcuts} from './useWindowKeyboardShortcuts';

const isApplePlatform = () => {
  if (typeof navigator === 'undefined') return false;

  const userAgentData = (navigator as Navigator & {userAgentData?: {platform?: string}}).userAgentData;
  const platform = userAgentData?.platform ?? navigator.platform ?? '';
  return /mac|iphone|ipad|ipod/i.test(platform);
};

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  return target.isContentEditable || tagName === 'input' || tagName === 'textarea' || tagName === 'select';
};

const isLockShortcut = (event: KeyboardEvent) => {
  const isMacLockShortcut = isApplePlatform() && event.metaKey && event.ctrlKey && event.code === 'KeyL';
  const isWindowsLockShortcut = !isApplePlatform() && event.ctrlKey && event.altKey && event.code === 'KeyL';

  return isMacLockShortcut || isWindowsLockShortcut;
};

export const useAppKeyboardShortcuts = () => {
  const closeLaunchpad = useAppStore(state => state.closeLaunchpad);
  const focusedWindowKey = useAppStore(state => state.focusedWindowKey);
  const isLaunchpadOpen = useAppStore(state => state.isLaunchpadOpen);
  const lockScreen = useAppStore(state => state.lockScreen);
  const unlockScreen = useAppStore(state => state.unlockScreen);

  const handlersByWindowKey = useMemo(
    () => ({
      [WINDOW_KEYS.lockScreen]: ({event}: {event: KeyboardEvent}) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          unlockScreen();
        }
      },
      [WINDOW_KEYS.desktopScreen]: ({event}: {event: KeyboardEvent}) => {
        if (isLockShortcut(event)) {
          event.preventDefault();
          lockScreen();
        }
      },
    }),
    [lockScreen, unlockScreen],
  );

  useWindowKeyboardShortcuts({
    focusedWindowKey,
    handlersByWindowKey,
    enabled: !isLaunchpadOpen,
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (!isLockShortcut(event)) return;

      event.preventDefault();
      lockScreen();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lockScreen]);

  useEffect(() => {
    if (!isLaunchpadOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closeLaunchpad();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closeLaunchpad, isLaunchpadOpen]);
};
