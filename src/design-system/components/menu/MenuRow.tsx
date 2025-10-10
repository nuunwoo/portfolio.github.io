import { MenuChevronIcon } from "../../icons";
import type { SubmenuEntry } from "../../../shared/settings/menu-bar-menus";
import styles from "./MenuRow.module.css";

type MenuRowProps = {
  item: SubmenuEntry;
  submenuOpen: boolean;
  hovered: boolean;
  onHover?: (element: HTMLButtonElement) => void;
  onHoverEnd?: () => void;
};

const MenuRow = ({ item, submenuOpen, hovered, onHover, onHoverEnd }: MenuRowProps) => {
  return (
    <div className={styles.entryRow}>
      {item.dividerAbove ? (
        <div className={styles.separatorRow} role="presentation">
          <div className={styles.separatorLine} />
        </div>
      ) : null}

      {item.header ? (
        <div className={styles.headerRow} role="presentation">
          <span className={styles.headerLabel}>{item.label}</span>
        </div>
      ) : (
        <button
          type="button"
          className={`${styles.item} ${item.disabled ? styles.itemDisabled : ""} ${
            item.emphasized ? styles.itemEmphasized : ""
          } ${item.hasSubmenu && item.selected ? styles.itemSelected : ""} ${
            item.hasSubmenu && submenuOpen ? styles.itemSubmenuOpen : ""
          }`}
          role="menuitem"
          disabled={item.disabled}
          onMouseEnter={(event) => onHover?.(event.currentTarget)}
          onMouseLeave={onHoverEnd}
        >
          {item.symbol ? (
            <div className={styles.symbol}>
              <span>{item.symbol}</span>
            </div>
          ) : null}

          <span className={styles.label}>{item.label}</span>

          <span className={styles.meta}>
            {item.shortcut ? <span className={styles.shortcut}>{item.shortcut}</span> : null}
            {item.hasSubmenu ? (
              <MenuChevronIcon
                className={styles.arrow}
                state={item.disabled ? "disabled" : hovered ? "hover" : "idle"}
                aria-hidden={true}
              />
            ) : null}
          </span>
        </button>
      )}
    </div>
  );
};

export default MenuRow;
