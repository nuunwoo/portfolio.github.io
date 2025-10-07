import {useEffect, useMemo, useRef, useState} from 'react';
import {formatMenuBarDateTime} from '../../utils/dateTime';
import {useCurrentDateTime} from '../../hooks/useCurrentDateTime';
import {menuBarClockSettings} from '../../shared/settings/clock-settings';
import {APPLE_MENU_KEY, getMenuBarPreset} from '../../shared/settings/menu-bar-menus';
import {useAppStore} from '../../shared/store/app-store';
import {WINDOW_KEYS} from '../../utils/windowKeys';
import MenuBarLeftMenu from './MenuBarLeftMenu';
import styles from './MenuBar.module.css';
const rightSymbols = ['􀙇', '􀛨', '􀋦', '􀊰'];

const MenuBar = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeLeftMenuKey, setActiveLeftMenuKey] = useState<string | null>(null);
  const [submenuLeft, setSubmenuLeft] = useState(0);
  const currentDate = useCurrentDateTime({align: 'minute'});
  const focusedWindowKey = useAppStore(state => state.focusedWindowKey);
  const lockScreen = useAppStore(state => state.lockScreen);
  const menuPreset = useMemo(() => getMenuBarPreset(focusedWindowKey), [focusedWindowKey]);
  const isMenuOpen = activeLeftMenuKey !== null;
  const submenuItems = activeLeftMenuKey ? (menuPreset.submenuByKey[activeLeftMenuKey] ?? []) : [];

  useEffect(() => {
    if (focusedWindowKey !== WINDOW_KEYS.desktopScreen) {
      setActiveLeftMenuKey(null);
    }
  }, [focusedWindowKey]);

  useEffect(() => {
    if (!activeLeftMenuKey) return;
    if (menuPreset.submenuByKey[activeLeftMenuKey]) return;
    setActiveLeftMenuKey(null);
  }, [activeLeftMenuKey, menuPreset]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target)) return;
      setActiveLeftMenuKey(null);
    };

    window.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, []);

  const handleItemSelect = (key: string, element: HTMLElement) => {
    const rootRect = rootRef.current?.getBoundingClientRect();
    const itemRect = element.getBoundingClientRect();
    if (rootRect) {
      setSubmenuLeft(Math.max(6, itemRect.left - rootRect.left - 6));
    }
    setActiveLeftMenuKey(key);
  };

  return (
    <div ref={rootRef} className={`${styles.wrapper} ${isMenuOpen ? styles.menuOpen : ''}`}>
      <header className={styles.root}>
        <MenuBarLeftMenu
          items={menuPreset.leftItems}
          activeKey={activeLeftMenuKey}
          isMenuOpen={isMenuOpen}
          onItemSelect={handleItemSelect}
          onAppleClick={lockScreen}
        />

        <div className={styles.rightSection}>
          <span className={styles.menuItem}>⌘</span>
          {rightSymbols.map(symbol => (
            <span key={symbol} className={styles.menuItem}>
              {symbol}
            </span>
          ))}
          <span className={styles.menuItem}>100%</span>
          <span className={styles.languageChip}>한</span>
          <span className={styles.menuClock}>{formatMenuBarDateTime(currentDate, menuBarClockSettings)}</span>
        </div>
      </header>

      {isMenuOpen && submenuItems.length > 0 && (
        <div
          className={styles.submenuPanel}
          style={{left: submenuLeft}}
          role="menu"
          aria-label={`${activeLeftMenuKey} menu`}>
          {submenuItems.map(item => (
            <button
              key={`${activeLeftMenuKey}-${item.label}`}
              type="button"
              className={`${styles.submenuItem} ${item.disabled ? styles.submenuItemDisabled : ''} ${
                item.emphasized ? styles.submenuItemEmphasized : ''
              } ${item.dividerAbove ? styles.submenuItemWithDivider : ''}`}
              role="menuitem"
              disabled={item.disabled}>
              <div className={styles.symbol}></div>
              <span className={styles.submenuLabel}>{item.label}</span>
              <span className={styles.submenuMeta}>
                {item.shortcut ? <span className={styles.submenuShortcut}>{item.shortcut}</span> : null}
                {item.hasSubmenu ? <span className={styles.submenuArrow}>›</span> : null}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuBar;
