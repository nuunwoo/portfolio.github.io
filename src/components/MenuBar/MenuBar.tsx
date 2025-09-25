import { formatMenuBarTime } from "../../utils/dateTime";
import { useCurrentDateTime } from "../../hooks/useCurrentDateTime";
import { useAppStore } from "../../shared/store/app-store";
import styles from "./MenuBar.module.css";

const leftItems = ["Finder", "File", "Edit", "View", "Go", "Window", "Help"];

const MenuBar = () => {
  const currentDate = useCurrentDateTime({ align: "minute" });
  const lockScreen = useAppStore((state) => state.lockScreen);

  return (
    <header
      className={`material-surface material-dark material-ultra-thin ${styles.root}`}
    >
      <div className={styles.leftSection}>
        <button
          type="button"
          className={`text-footnote font-semibold text-primary-dark ${styles.appleButton}`}
          onClick={lockScreen}
          aria-label="Open Apple menu and lock screen"
        >
          
        </button>
        {leftItems.map((item, index) => (
          <span
            key={item}
            className={`${index === 0 ? "text-footnote font-semibold text-primary-dark" : "text-footnote font-medium text-secondary-dark"} ${styles.menuLabel}`}
          >
            {item}
          </span>
        ))}
      </div>

      <div className={styles.rightSection}>
        <span className="text-footnote font-medium text-secondary-dark">⌘</span>
        <span className="text-footnote font-medium text-secondary-dark">􀙇</span>
        <span className="text-footnote font-medium text-secondary-dark">􀛨</span>
        <span className="text-footnote font-medium text-secondary-dark">100%</span>
        <span className="text-footnote font-semibold text-primary-dark">
          {formatMenuBarTime(currentDate)}
        </span>
      </div>
    </header>
  );
};

export default MenuBar;
