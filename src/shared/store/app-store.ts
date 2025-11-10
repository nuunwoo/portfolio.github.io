import { create } from "zustand";

export type ScreenName = "splash" | "lock" | "desktop";

type AppStoreState = {
  isBooting: boolean;
  hasUnlockedOnce: boolean;
  currentScreen: ScreenName;
  isUnlocking: boolean;
  isLaunchpadOpen: boolean;
  completeSplash: () => void;
  closeLaunchpad: () => void;
  lockScreen: () => void;
  toggleLaunchpad: () => void;
  unlockScreen: () => void;
};

export const useAppStore = create<AppStoreState>((set, get) => ({
  isBooting: true,
  hasUnlockedOnce: false,
  currentScreen: "splash",
  isUnlocking: false,
  isLaunchpadOpen: false,
  completeSplash: () =>
    set({
      isBooting: false,
      currentScreen: "lock",
      isLaunchpadOpen: false,
    }),
  closeLaunchpad: () => set({ isLaunchpadOpen: false }),
  lockScreen: () =>
    set({
      currentScreen: "lock",
      isUnlocking: false,
      isLaunchpadOpen: false,
    }),
  toggleLaunchpad: () => set((state) => ({ isLaunchpadOpen: !state.isLaunchpadOpen })),
  unlockScreen: () => {
    const { currentScreen, isBooting, isUnlocking } = get();
    if (isBooting || currentScreen !== "lock" || isUnlocking) return;

    set({ isUnlocking: true });

    window.setTimeout(() => {
      set({
        currentScreen: "desktop",
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
