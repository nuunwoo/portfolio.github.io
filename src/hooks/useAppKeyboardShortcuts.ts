import { useMemo } from "react";
import { useAppStore } from "../shared/store/app-store";
import { WINDOW_KEYS } from "../utils/windowKeys";
import { useWindowKeyboardShortcuts } from "./useWindowKeyboardShortcuts";

export const useAppKeyboardShortcuts = () => {
  const focusedWindowKey = useAppStore((state) => state.focusedWindowKey);
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
  });
};
