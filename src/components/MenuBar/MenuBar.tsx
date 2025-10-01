import { formatMenuBarDateTime } from "../../utils/dateTime";
import AppleLogo from "../icons/AppleLogo";
import { useCurrentDateTime } from "../../hooks/useCurrentDateTime";
import { menuBarClockSettings } from "../../shared/settings/clock-settings";
import { useAppStore } from "../../shared/store/app-store";
import styles from "./MenuBar.module.css";

const leftItems = ["Finder", "파일", "편집", "보기", "이동", "윈도우", "도움말"];
const rightSymbols = ["􀙇", "􀛨", "􀋦", "􀊰"];

const MenuBar = () => {
  const currentDate = useCurrentDateTime({ align: "minute" });
  const lockScreen = useAppStore((state) => state.lockScreen);

  return (
    <header className={styles.root}>
      <div className={styles.leftSection}>
        <button
          type="button"
          className={styles.appleButton}
          onClick={lockScreen}
          aria-label="Open Apple menu and lock screen"
        >
          <AppleLogo
            aria-hidden={true}
            className={styles.appleLogo}
          />
        </button>
        {leftItems.map((item, index) => (
          <span
            key={item}
            className={`${index === 0 ? styles.menuAppName : styles.menuItem} ${styles.menuLabel}`}
          >
            {item}
          </span>
        ))}
      </div>

      <div className={styles.rightSection}>
        <span className={styles.menuItem}>⌘</span>
        {rightSymbols.map((symbol) => (
          <span key={symbol} className={styles.menuItem}>
            {symbol}
          </span>
        ))}
        <span className={styles.menuItem}>100%</span>
        <span className={styles.languageChip}>한</span>
        <span className={styles.menuClock}>
          {formatMenuBarDateTime(currentDate, menuBarClockSettings)}
        </span>
      </div>
    </header>
  );
};

export default MenuBar;
