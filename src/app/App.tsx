import "../App.css";
import { useEffect, useMemo } from "react";
import { getWallpaperSrcForDate } from "./assetsManifest";
import BootSplash from "../features/boot/ui/BootSplash";
import DesktopScreen from "../features/desktop/ui/DesktopScreen";
import LockScreen from "../features/lock-screen/ui/LockScreen";
import { useCurrentDateTime } from "../hooks/useCurrentDateTime";
import { useSystemAppearance } from "../hooks/useSystemAppearance";
import { useWindowKeyboardShortcuts } from "../hooks/useWindowKeyboardShortcuts";
import { useAppStore } from "../shared/store/app-store";
import { WINDOW_KEYS } from "../utils/windowKeys";

function App() {
  const completeSplash = useAppStore((state) => state.completeSplash);
  const currentScreen = useAppStore((state) => state.currentScreen);
  const focusedWindowKey = useAppStore((state) => state.focusedWindowKey);
  const focusWindow = useAppStore((state) => state.focusWindow);
  const isUnlocking = useAppStore((state) => state.isUnlocking);
  const lockScreen = useAppStore((state) => state.lockScreen);
  const syncFocusedWindow = useAppStore((state) => state.syncFocusedWindow);
  const unlockScreen = useAppStore((state) => state.unlockScreen);
  const currentDateTime = useCurrentDateTime();
  const systemAppearance = useSystemAppearance();

  const currentWallpaperSrc = useMemo(() => getWallpaperSrcForDate(currentDateTime), [currentDateTime]);

  useEffect(() => {
    syncFocusedWindow();
  }, [currentScreen, isUnlocking, syncFocusedWindow]);

  const handlersByWindowKey = useMemo(
    () => ({
      [WINDOW_KEYS.lockScreen]: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          unlockScreen();
        }
      },
      [WINDOW_KEYS.desktopScreen]: ({ event }: { event: KeyboardEvent }) => {
        const isLockShortcut =
          (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "l";

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

  return (
    <main className="app-shell" data-appearance={systemAppearance}>
      <div className={`app-layer ${currentScreen === "splash" ? "app-layer-hidden" : "app-layer-visible"}`}>
        <DesktopScreen
          currentDate={currentDateTime}
          isFocused={focusedWindowKey === WINDOW_KEYS.desktopScreen}
          onFocusWindow={() => focusWindow(WINDOW_KEYS.desktopScreen)}
          onRequestLock={lockScreen}
          wallpaperSrc={currentWallpaperSrc}
          windowKey={WINDOW_KEYS.desktopScreen}
        />
      </div>

      <div
        className={`app-layer ${currentScreen === "lock" || isUnlocking ? "app-layer-visible" : "app-layer-hidden"}`}
      >
        <LockScreen
          currentDate={currentDateTime}
          isFocused={focusedWindowKey === WINDOW_KEYS.lockScreen}
          isUnlocking={isUnlocking}
          onFocusWindow={() => focusWindow(WINDOW_KEYS.lockScreen)}
          onUnlock={unlockScreen}
          wallpaperSrc={currentWallpaperSrc}
          windowKey={WINDOW_KEYS.lockScreen}
        />
      </div>

      {currentScreen === "splash" ? (
        <BootSplash bootDate={currentDateTime} onComplete={completeSplash} />
      ) : null}
    </main>
  );
}

export default App;
