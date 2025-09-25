import "../App.css";
import { useEffect } from "react";
import AppLayer from "./AppLayer";
import BootSplash from "../features/boot/ui/BootSplash";
import DesktopScreen from "../features/desktop/ui/DesktopScreen";
import LockScreen from "../features/lock-screen/ui/LockScreen";
import { useAppKeyboardShortcuts } from "../hooks/useAppKeyboardShortcuts";
import { useSystemAppearance } from "../hooks/useSystemAppearance";
import { useAppStore } from "../shared/store/app-store";

const App = () => {
  const isBooting = useAppStore((state) => state.isBooting);
  const hasUnlockedOnce = useAppStore((state) => state.hasUnlockedOnce);
  const currentScreen = useAppStore((state) => state.currentScreen);
  const isUnlocking = useAppStore((state) => state.isUnlocking);
  const syncFocusedWindow = useAppStore((state) => state.syncFocusedWindow);
  const systemAppearance = useSystemAppearance();

  useEffect(() => {
    syncFocusedWindow();
  }, [currentScreen, isUnlocking, syncFocusedWindow]);

  useAppKeyboardShortcuts();

  return (
    <main className="app-shell" data-appearance={systemAppearance}>
      <AppLayer layerClassName="app-layer-desktop" visible={currentScreen !== "splash"}>
        <DesktopScreen />
      </AppLayer>

      <AppLayer
        layerClassName="app-layer-lock"
        noTransition={!hasUnlockedOnce && currentScreen === "lock" && !isUnlocking}
        visible={currentScreen === "lock" || isUnlocking}
      >
        <LockScreen />
      </AppLayer>

      {isBooting && (
        <AppLayer layerClassName="app-layer-splash" visible={true}>
          <BootSplash />
        </AppLayer>
      )}
    </main>
  );
};

export default App;
