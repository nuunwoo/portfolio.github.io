import "../App.css";
import { useMemo, useState } from "react";
import { getWallpaperSrcForDate } from "./assetsManifest";
import { useCurrentDateTime } from "../hooks/useCurrentDateTime";
import SplashScreen from "../screens/SplashScreen";
import LockScreen from "../screens/LockScreen";
import DesktopScreen from "../screens/DesktopScreen";

type ScreenName = "splash" | "lock" | "desktop";

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("splash");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const currentDateTime = useCurrentDateTime();

  const currentWallpaperSrc = useMemo(() => getWallpaperSrcForDate(currentDateTime), [currentDateTime]);

  const handleUnlock = () => {
    setIsUnlocking(true);
    window.setTimeout(() => {
      setCurrentScreen("desktop");
      setIsUnlocking(false);
    }, 360);
  };

  return (
    <main className="app-shell">
      <div className={`app-layer ${currentScreen === "splash" ? "app-layer-hidden" : "app-layer-visible"}`}>
        <DesktopScreen wallpaperSrc={currentWallpaperSrc} />
      </div>

      <div
        className={`app-layer ${
          currentScreen === "lock" || isUnlocking ? "app-layer-visible" : "app-layer-hidden"
        }`}
      >
        <LockScreen
          currentDate={currentDateTime}
          isUnlocking={isUnlocking}
          onUnlock={handleUnlock}
          wallpaperSrc={currentWallpaperSrc}
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
