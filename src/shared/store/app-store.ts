import { create } from "zustand";
import { WINDOW_KEYS, type WindowKey } from "../../utils/windowKeys";

export type ScreenName = "splash" | "lock" | "desktop";

type AppStoreState = {
  isBooting: boolean;
  hasUnlockedOnce: boolean;
  currentScreen: ScreenName;
  focusedWindowKey: WindowKey | null;
  isUnlocking: boolean;
  isLaunchpadOpen: boolean;
  completeSplash: () => void;
  closeLaunchpad: () => void;
  focusWindow: (windowKey: WindowKey) => void;
  lockScreen: () => void;
  syncFocusedWindow: () => void;
  toggleLaunchpad: () => void;
  unlockScreen: () => void;
};

export const useAppStore = create<AppStoreState>((set, get) => ({
  isBooting: true,
  hasUnlockedOnce: false,
  currentScreen: "splash",
  focusedWindowKey: WINDOW_KEYS.splashScreen,
  isUnlocking: false,
  isLaunchpadOpen: false,
  completeSplash: () =>
    set({
      isBooting: false,
      currentScreen: "lock",
      focusedWindowKey: WINDOW_KEYS.lockScreen,
      isLaunchpadOpen: false,
    }),
  closeLaunchpad: () => set({ isLaunchpadOpen: false }),
  focusWindow: (windowKey) => set({ focusedWindowKey: windowKey }),
  lockScreen: () =>
    set((state) => {
      if (state.isUnlocking) {
        return {
          currentScreen: "lock",
          focusedWindowKey: WINDOW_KEYS.lockScreen,
          isUnlocking: false,
          isLaunchpadOpen: false,
        };
      }

      return {
        currentScreen: "lock",
        focusedWindowKey: WINDOW_KEYS.lockScreen,
        isUnlocking: false,
        isLaunchpadOpen: false,
      };
    }),
  syncFocusedWindow: () => {
    const { currentScreen, isBooting, isUnlocking } = get();

    if (isBooting) {
      set({ focusedWindowKey: WINDOW_KEYS.splashScreen });
      return;
    }

    if (currentScreen === "splash") {
      set({ focusedWindowKey: WINDOW_KEYS.splashScreen });
      return;
    }

    if (currentScreen === "lock") {
      set({ focusedWindowKey: WINDOW_KEYS.lockScreen, isLaunchpadOpen: false });
      return;
    }

    if (currentScreen === "desktop" && !isUnlocking) {
      set({ focusedWindowKey: WINDOW_KEYS.desktopScreen });
    }
  },
  toggleLaunchpad: () => set((state) => ({ isLaunchpadOpen: !state.isLaunchpadOpen })),
  unlockScreen: () => {
    const { currentScreen, isBooting, isUnlocking } = get();
    if (isBooting || currentScreen !== "lock" || isUnlocking) return;

    set({ isUnlocking: true });

    window.setTimeout(() => {
      set({
        currentScreen: "desktop",
        focusedWindowKey: WINDOW_KEYS.desktopScreen,
        hasUnlockedOnce: true,
        isLaunchpadOpen: false,
      });

      // Keep unlocking state briefly so the lock layer can finish its own fade-out.
      window.setTimeout(() => {
        set({ isUnlocking: false });
      }, 220);
    }, 360);
  },
}));
