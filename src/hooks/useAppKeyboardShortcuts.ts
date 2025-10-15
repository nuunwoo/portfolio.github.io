import { useEffect, useMemo } from "react";
import { useAppStore } from "../shared/store/app-store";
import { WINDOW_KEYS } from "../utils/windowKeys";
import { useWindowKeyboardShortcuts } from "./useWindowKeyboardShortcuts";

export const useAppKeyboardShortcuts = () => {
  const closeLaunchpad = useAppStore((state) => state.closeLaunchpad);
  const focusedWindowKey = useAppStore((state) => state.focusedWindowKey);
  const isLaunchpadOpen = useAppStore((state) => state.isLaunchpadOpen);
  const lockScreen = useAppStore((state) => state.lockScreen);
  const unlockScreen = useAppStore((state) => state.unlockScreen);

  const handlersByWindowKey = useMemo(
    () => ({
      [WINDOW_KEYS.lockScreen]: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          unlockScreen();
        }
      },
      [WINDOW_KEYS.desktopScreen]: ({ event }: { event: KeyboardEvent }) => {
        const isLockShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "l";

        if (event.key === "Escape" || isLockShortcut) {
          event.preventDefault();
          lockScreen();
        }
      },
    }),
    [lockScreen, unlockScreen]
  );

  useWindowKeyboardShortcuts({
    focusedWindowKey,
    handlersByWindowKey,
    enabled: !isLaunchpadOpen,
  });

  useEffect(() => {
    if (!isLaunchpadOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeLaunchpad();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeLaunchpad, isLaunchpadOpen]);
};
