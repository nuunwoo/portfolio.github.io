import "../App.css";
import { useState } from "react";
import SplashScreen from "../screens/SplashScreen";
import LockScreen from "../screens/LockScreen";
import DesktopScreen from "../screens/DesktopScreen";

type ScreenName = "splash" | "lock" | "desktop";

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("splash");

  return (
    <main className="app-shell">
      <div className={`app-layer ${currentScreen === "desktop" ? "app-layer-visible" : "app-layer-hidden"}`}>
        <DesktopScreen />
      </div>

      <div className={`app-layer ${currentScreen === "lock" ? "app-layer-visible" : "app-layer-hidden"}`}>
        <LockScreen onUnlock={() => setCurrentScreen("desktop")} />
      </div>

      {currentScreen === "splash" ? <SplashScreen onComplete={() => setCurrentScreen("lock")} /> : null}
    </main>
  );
}

export default App;
