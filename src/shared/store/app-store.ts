import { create } from "zustand";
import { WINDOW_KEYS, type WindowKey } from "../../utils/windowKeys";

export type ScreenName = "splash" | "lock" | "desktop";

type AppStoreState = {
  currentScreen: ScreenName;
  focusedWindowKey: WindowKey | null;
  isUnlocking: boolean;
  completeSplash: () => void;
  focusWindow: (windowKey: WindowKey) => void;
  lockScreen: () => void;
  syncFocusedWindow: () => void;
  unlockScreen: () => void;
};

export const useAppStore = create<AppStoreState>((set, get) => ({
  currentScreen: "splash",
  focusedWindowKey: WINDOW_KEYS.splashScreen,
  isUnlocking: false,
  completeSplash: () =>
    set({
      currentScreen: "lock",
      focusedWindowKey: WINDOW_KEYS.lockScreen,
    }),
  focusWindow: (windowKey) => set({ focusedWindowKey: windowKey }),
  lockScreen: () =>
    set({
      currentScreen: "lock",
      focusedWindowKey: WINDOW_KEYS.lockScreen,
      isUnlocking: false,
    }),
  syncFocusedWindow: () => {
    const { currentScreen, isUnlocking } = get();

    if (currentScreen === "splash") {
      set({ focusedWindowKey: WINDOW_KEYS.splashScreen });
      return;
    }

    if (currentScreen === "lock") {
      set({ focusedWindowKey: WINDOW_KEYS.lockScreen });
      return;
    }

    if (currentScreen === "desktop" && !isUnlocking) {
      set({ focusedWindowKey: WINDOW_KEYS.desktopScreen });
    }
  },
  unlockScreen: () => {
    const { isUnlocking } = get();
    if (isUnlocking) return;

    set({ isUnlocking: true });

    window.setTimeout(() => {
      set({
        currentScreen: "desktop",
        focusedWindowKey: WINDOW_KEYS.desktopScreen,
        isUnlocking: false,
      });
    }, 360);
  },
}));
