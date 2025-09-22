import "../App.css";
import { useEffect, useMemo, useState } from "react";
import { getWallpaperSrcForDate } from "./assetsManifest";
import { useCurrentDateTime } from "../hooks/useCurrentDateTime";
import { useWindowKeyboardShortcuts } from "../hooks/useWindowKeyboardShortcuts";
import { WINDOW_KEYS, type WindowKey } from "../utils/windowKeys";
import SplashScreen from "../screens/SplashScreen";
import LockScreen from "../screens/LockScreen";
import DesktopScreen from "../screens/DesktopScreen";

type ScreenName = "splash" | "lock" | "desktop";

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("splash");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [focusedWindowKey, setFocusedWindowKey] = useState<WindowKey | null>(WINDOW_KEYS.splashScreen);
  const currentDateTime = useCurrentDateTime();

  const currentWallpaperSrc = useMemo(() => getWallpaperSrcForDate(currentDateTime), [currentDateTime]);

  const handleUnlock = () => {
    if (isUnlocking) return;

    setIsUnlocking(true);
    window.setTimeout(() => {
      setCurrentScreen("desktop");
      setIsUnlocking(false);
      setFocusedWindowKey(WINDOW_KEYS.desktopScreen);
    }, 360);
  };

  const handleLock = () => {
    setCurrentScreen("lock");
    setIsUnlocking(false);
    setFocusedWindowKey(WINDOW_KEYS.lockScreen);
  };

  useEffect(() => {
    if (currentScreen === "splash") {
      setFocusedWindowKey(WINDOW_KEYS.splashScreen);
      return;
    }

    if (currentScreen === "lock") {
      setFocusedWindowKey(WINDOW_KEYS.lockScreen);
      return;
    }

    if (currentScreen === "desktop" && !isUnlocking) {
      setFocusedWindowKey(WINDOW_KEYS.desktopScreen);
    }
  }, [currentScreen, isUnlocking]);

  const handlersByWindowKey = useMemo(
    () => ({
      [WINDOW_KEYS.lockScreen]: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleUnlock();
        }
      },
      [WINDOW_KEYS.desktopScreen]: ({ event }: { event: KeyboardEvent }) => {
        const isLockShortcut =
          (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "l";

        if (event.key === "Escape" || isLockShortcut) {
          event.preventDefault();
          handleLock();
        }
      },
    }),
    [handleUnlock, handleLock]
  );

  useWindowKeyboardShortcuts({
    focusedWindowKey,
    handlersByWindowKey,
  });

  return (
    <main className="app-shell">
      <div className={`app-layer ${currentScreen === "splash" ? "app-layer-hidden" : "app-layer-visible"}`}>
        <DesktopScreen
          isFocused={focusedWindowKey === WINDOW_KEYS.desktopScreen}
          onFocusWindow={() => setFocusedWindowKey(WINDOW_KEYS.desktopScreen)}
          wallpaperSrc={currentWallpaperSrc}
          windowKey={WINDOW_KEYS.desktopScreen}
        />
      </div>

      <div
        className={`app-layer ${
          currentScreen === "lock" || isUnlocking ? "app-layer-visible" : "app-layer-hidden"
        }`}
      >
        <LockScreen
          currentDate={currentDateTime}
          isFocused={focusedWindowKey === WINDOW_KEYS.lockScreen}
          isUnlocking={isUnlocking}
          onFocusWindow={() => setFocusedWindowKey(WINDOW_KEYS.lockScreen)}
          onUnlock={handleUnlock}
          wallpaperSrc={currentWallpaperSrc}
          windowKey={WINDOW_KEYS.lockScreen}
        />
      </div>

      {currentScreen === "splash" ? (
        <SplashScreen
          bootDate={currentDateTime}
          onComplete={() => setCurrentScreen("lock")}
        />
      ) : null}
    </main>
  );
}

export default App;
