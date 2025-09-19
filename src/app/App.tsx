import "../App.css";
import { useEffect, useMemo, useState } from "react";
import { getWallpaperSrcForDate } from "./assetsManifest";
import SplashScreen from "../screens/SplashScreen";
import LockScreen from "../screens/LockScreen";
import DesktopScreen from "../screens/DesktopScreen";

type ScreenName = "splash" | "lock" | "desktop";

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("splash");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const currentWallpaperSrc = useMemo(() => getWallpaperSrcForDate(currentDate), [currentDate]);

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
        <LockScreen currentDate={currentDate} isUnlocking={isUnlocking} onUnlock={handleUnlock} wallpaperSrc={currentWallpaperSrc} />
      </div>

      {currentScreen === "splash" ? <SplashScreen bootDate={currentDate} onComplete={() => setCurrentScreen("lock")} /> : null}
    </main>
  );
}

export default App;
