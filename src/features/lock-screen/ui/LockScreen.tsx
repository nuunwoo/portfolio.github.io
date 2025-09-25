import { useEffect } from "react";
import { useCurrentDateTime } from "../../../hooks/useCurrentDateTime";
import { useCurrentWallpaper } from "../../../hooks/useCurrentWallpaper";
import { useAppStore } from "../../../shared/store/app-store";
import { formatLockScreenDate, formatLockScreenTime } from "../../../utils/dateTime";
import { WINDOW_KEYS } from "../../../utils/windowKeys";
import styles from "./LockScreen.module.css";

const LockScreen = () => {
  const currentDate = useCurrentDateTime({ align: "minute" });
  const wallpaperSrc = useCurrentWallpaper();
  const currentScreen = useAppStore((state) => state.currentScreen);
  const hasUnlockedOnce = useAppStore((state) => state.hasUnlockedOnce);
  const isUnlocking = useAppStore((state) => state.isUnlocking);
  const isFocused = useAppStore(
    (state) => state.focusedWindowKey === WINDOW_KEYS.lockScreen
  );
  const focusWindow = useAppStore((state) => state.focusWindow);
  const unlockScreen = useAppStore((state) => state.unlockScreen);

  const isActive = currentScreen === "lock";
  const disableTransition = !hasUnlockedOnce && currentScreen === "lock" && !isUnlocking;
  const isTransitioningOut = isUnlocking || !isActive;

  useEffect(() => {
    if (!isActive || isUnlocking) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        unlockScreen();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isActive, isUnlocking, unlockScreen]);

  return (
    <section
      aria-label="Lock screen"
      onClick={() => {
        if (!isActive) return;
        focusWindow(WINDOW_KEYS.lockScreen);
        if (!isUnlocking) unlockScreen();
      }}
      onPointerDown={() => {
        if (!isActive) return;
        focusWindow(WINDOW_KEYS.lockScreen);
      }}
      data-window-key={WINDOW_KEYS.lockScreen}
      className={[
        styles.root,
        disableTransition ? styles.noTransition : "",
        isTransitioningOut ? styles.transitioningOut : "",
        isFocused ? styles.focused : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        cursor: isTransitioningOut ? "default" : "pointer",
        pointerEvents: !isActive || isUnlocking ? "none" : "auto",
      }}
    >
      <img src={wallpaperSrc} alt="Lock screen wallpaper" className="wallpaper" />
      <div className={styles.overlay}>
        <div className={styles.topBarWrap}>
          <div className={styles.statusBar}>
            <span>ABC</span>
            <span>􀙇</span>
            <span>􀛨</span>
            <span>􀋦</span>
          </div>
        </div>

        <div className={styles.centerWrap}>
          <p className={styles.dateText}>
            {formatLockScreenDate(currentDate)}
          </p>
          <h1 className={styles.timeText}>
            {formatLockScreenTime(currentDate)}
          </h1>
          <div className={styles.unlockWrap}>
            <div className={styles.avatar}>
              <span>👤</span>
            </div>
            <p className={styles.nameText}>이현우</p>
            <p className={styles.hintText}>
              클릭하거나 Enter 키를 눌러 잠금 해제
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LockScreen;
