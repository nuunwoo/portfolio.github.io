import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {formatMenuBarDateTime} from '../../../utils/dateTime';
import {useCurrentDateTime} from '../../../shared/hooks/useCurrentDateTime';
import {menuBarClockSettings} from '../../../shared/settings/clock-settings';
import {APPLE_MENU_KEY, getMenuBarPreset} from '../../../shared/settings/menu-bar-menus';
import {useAppStore} from '../../../shared/store/app-store';
import {MenuPanel} from '../../../design-system/components';
import MenuBarLeftMenu from './MenuBarLeftMenu';
import {
  StatusBattery100PercentIcon,
  StatusBluetoothIcon,
  StatusSpeakerWave2Icon,
  StatusWifiIcon,
} from '../../../design-system/icons';
import styles from './MenuBar.module.css';

const MenuBar = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeLeftMenuKey, setActiveLeftMenuKey] = useState<string | null>(null);
  const [submenuLeft, setSubmenuLeft] = useState(0);
  const currentDate = useCurrentDateTime({align: 'minute'});
  const currentScreen = useAppStore(state => state.currentScreen);
  const lockScreen = useAppStore(state => state.lockScreen);
  const menuPreset = useMemo(() => getMenuBarPreset(currentScreen), [currentScreen]);
  const isMenuOpen = activeLeftMenuKey !== null;
  const submenuItems = activeLeftMenuKey ? (menuPreset.submenuByKey[activeLeftMenuKey] ?? []) : [];

  useEffect(() => {
    if (currentScreen !== 'desktop') {
      setActiveLeftMenuKey(null);
    }
  }, [currentScreen]);

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

  const handleItemSelect = useCallback((key: string, element: HTMLElement) => {
    const rootRect = rootRef.current?.getBoundingClientRect();
    const itemRect = element.getBoundingClientRect();
    if (rootRect) {
      setSubmenuLeft(Math.max(0, itemRect.left - rootRect.left));
    }
    setActiveLeftMenuKey(key);
  }, []);

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
          <span className={styles.statusItem} aria-label="Bluetooth">
            <StatusBluetoothIcon className={styles.statusIcon} />
          </span>
          <span className={styles.statusItem} aria-label="Speaker volume">
            <StatusSpeakerWave2Icon className={styles.statusIcon} />
          </span>
          <span className={styles.statusItem} aria-label="Wi-Fi">
            <StatusWifiIcon className={styles.statusIcon} />
          </span>
          <span className={styles.statusItem} aria-label="Battery">
            <StatusBattery100PercentIcon className={`${styles.statusIcon} ${styles.batteryIcon}`} />
          </span>
          <span className={styles.menuItem}>100%</span>
          <span className={styles.languageChip}>한</span>
          <span className={styles.menuClock}>{formatMenuBarDateTime(currentDate, menuBarClockSettings)}</span>
        </div>
      </header>

      {isMenuOpen && activeLeftMenuKey && submenuItems.length > 0 && (
        <MenuPanel menuKey={activeLeftMenuKey} items={submenuItems} left={submenuLeft} />
      )}
    </div>
  );
};

export default MenuBar;
