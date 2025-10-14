import { AppleLogoIcon } from "../../design-system/icons";
import styles from "./MenuBar.module.css";

type MenuBarLeftMenuProps = {
  items: readonly string[];
  activeKey: string | null;
  isMenuOpen: boolean;
  onItemSelect: (key: string, element: HTMLElement) => void;
  onAppleClick: () => void;
};

const APPLE_MENU_KEY = "__apple_menu__";

const MenuBarLeftMenu = ({ items, activeKey, isMenuOpen, onItemSelect, onAppleClick }: MenuBarLeftMenuProps) => {
  return (
    <div className={styles.leftSection}>
      <button
        type="button"
        className={`${styles.leftButton} ${styles.appleButton} ${activeKey === APPLE_MENU_KEY ? styles.leftButtonActive : ""}`}
        onClick={(event) => {
          onItemSelect(APPLE_MENU_KEY, event.currentTarget);
          onAppleClick();
        }}
        onMouseEnter={(event) => {
          if (!isMenuOpen) return;
          onItemSelect(APPLE_MENU_KEY, event.currentTarget);
        }}
        aria-label="Open Apple menu and lock screen"
      >
        <AppleLogoIcon aria-hidden={true} className={styles.appleLogo} />
      </button>

      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          className={`${styles.leftButton} ${styles.textButton} ${
            index === 0
              ? `${styles.appNameLabel} text-headline-regular`
              : `${styles.menuItemLabel} text-body-emphasized`
          } ${activeKey === item ? styles.leftButtonActive : ""}`}
          onClick={(event) => onItemSelect(item, event.currentTarget)}
          onMouseEnter={(event) => {
            if (!isMenuOpen) return;
            onItemSelect(item, event.currentTarget);
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default MenuBarLeftMenu;
