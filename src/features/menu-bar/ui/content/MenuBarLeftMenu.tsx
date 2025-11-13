import {useCallback, useMemo} from 'react';
import type {MouseEvent as ReactMouseEvent} from 'react';
import {AppleLogoIcon} from '../../../../design-system/icons';
import styles from './MenuBarContent.module.css';

type MenuBarLeftMenuProps = {
  items: readonly string[];
  activeKey: string | null;
  isMenuOpen: boolean;
  onItemSelect: (key: string, element: HTMLElement) => void;
  onAppleClick: () => void;
};

const APPLE_MENU_KEY = '__apple_menu__';

const MenuBarLeftMenu = ({
  items,
  activeKey,
  isMenuOpen,
  onItemSelect,
  onAppleClick,
}: MenuBarLeftMenuProps) => {
  const handleAppleClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      onItemSelect(APPLE_MENU_KEY, event.currentTarget);
      onAppleClick();
    },
    [onAppleClick, onItemSelect],
  );

  const handleAppleMouseEnter = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      if (!isMenuOpen) return;
      onItemSelect(APPLE_MENU_KEY, event.currentTarget);
    },
    [isMenuOpen, onItemSelect],
  );

  const itemHandlers = useMemo(() => {
    return Object.fromEntries(
      items.map(item => [
        item,
        {
          onClick: (event: ReactMouseEvent<HTMLButtonElement>) => onItemSelect(item, event.currentTarget),
          onMouseEnter: (event: ReactMouseEvent<HTMLButtonElement>) => {
            if (!isMenuOpen) return;
            onItemSelect(item, event.currentTarget);
          },
        },
      ]),
    );
  }, [isMenuOpen, items, onItemSelect]);

  return (
    <div className={styles.leftSection}>
      <button
        type="button"
        className={`${styles.leftButton} ${styles.appleButton} ${
          activeKey === APPLE_MENU_KEY ? styles.leftButtonActive : ''
        }`}
        onClick={handleAppleClick}
        onMouseEnter={handleAppleMouseEnter}
        aria-label="Open Apple menu and lock screen">
        <AppleLogoIcon aria-hidden={true} className={styles.appleLogo} />
      </button>
      {items.map((item, index) => {
        const handlers = itemHandlers[item];

        return (
          <button
            key={item}
            type="button"
            className={`${styles.leftButton} ${styles.textButton} ${
              index === 0
                ? `${styles.appNameLabel} text-headline-regular`
                : `${styles.menuItemLabel} text-body-emphasized`
            } ${activeKey === item ? styles.leftButtonActive : ''}`}
            onClick={handlers.onClick}
            onMouseEnter={handlers.onMouseEnter}>
            {item}
          </button>
        );
      })}
    </div>
  );
};

export default MenuBarLeftMenu;
