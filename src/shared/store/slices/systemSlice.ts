import type {StateCreator} from 'zustand';
import type {AppStoreState, ScreenName} from '../app-store';

export type SystemSlice = {
  hasUnlockedOnce: boolean;
  currentScreen: ScreenName;
  isUnlocking: boolean;
  lockScreen: () => void;
  unlockScreen: () => void;
};

export const createSystemSlice: StateCreator<AppStoreState, [], [], SystemSlice> = (set, get) => ({
  hasUnlockedOnce: false,
  currentScreen: 'lock',
  isUnlocking: false,
  lockScreen: () =>
    set({
      currentScreen: 'lock',
      isUnlocking: false,
      isLaunchpadOpen: false,
    }),
  unlockScreen: () => {
    const {currentScreen, isUnlocking} = get();
    if (currentScreen !== 'lock' || isUnlocking) return;

    set({isUnlocking: true});

    window.setTimeout(() => {
      set({
        currentScreen: 'desktop',
        hasUnlockedOnce: true,
        isLaunchpadOpen: false,
      });

      window.setTimeout(() => {
        set({isUnlocking: false});
      }, 220);
    }, 360);
  },
});
