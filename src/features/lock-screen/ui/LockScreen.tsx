import { useCurrentDateTime } from "../../../hooks/useCurrentDateTime";
import { useCurrentWallpaper } from "../../../hooks/useCurrentWallpaper";
import { useAppStore } from "../../../shared/store/app-store";
import { formatLockScreenDate, formatLockScreenTime } from "../../../utils/dateTime";
import { WINDOW_KEYS } from "../../../utils/windowKeys";
import LockScreenMotion from "./animations/LockScreenMotion";
import styles from "./LockScreen.module.css";

const LockScreen = () => {
  const currentDate = useCurrentDateTime({ align: "minute" });
  const wallpaperSrc = useCurrentWallpaper();
  const currentScreen = useAppStore((state) => state.currentScreen);
  const hasUnlockedOnce = useAppStore((state) => state.hasUnlockedOnce);
  const isUnlocking = useAppStore((state) => state.isUnlocking);
  const unlockScreen = useAppStore((state) => state.unlockScreen);

  const isActive = currentScreen === "lock";
  const disableTransition = !hasUnlockedOnce && currentScreen === "lock" && !isUnlocking;
  const isTransitioningOut = isUnlocking || !isActive;

  return (
    <LockScreenMotion
      disableTransition={disableTransition}
      isTransitioningOut={isTransitioningOut}
      onClick={() => {
        if (!isActive) return;
        if (!isUnlocking) unlockScreen();
      }}
      aria-label="Lock screen"
      data-window-key={WINDOW_KEYS.lockScreen}
      style={{
        cursor: isTransitioningOut ? "default" : "pointer",
        pointerEvents: !isActive || isUnlocking ? "none" : "auto",
      }}
    >
      <img src={wallpaperSrc} alt="Lock screen wallpaper" className="wallpaper" />
      <div className={styles.overlay}>
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
    </LockScreenMotion>
  );
};

export default LockScreen;
