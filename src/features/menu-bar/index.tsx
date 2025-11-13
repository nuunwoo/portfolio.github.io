import {MenuPanel} from '../../design-system/components';
import {useAppStore} from '../../shared/store/app-store';
import useMenuBarState from './lib/useMenuBarState';
import {MenuBarMotion, MenuBarPrimaryMenus, MenuBarStatusArea, MenuBarSurface} from './ui';
import styles from './ui/MenuBar.module.css';

export type MenuBarProps = Record<string, never>;

const MenuBar = () => {
  const hasUnlockedOnce = useAppStore(state => state.hasUnlockedOnce);
  const currentScreen = useAppStore(state => state.currentScreen);
  const isUnlocking = useAppStore(state => state.isUnlocking);
  const {
    rootRef,
    lockScreen,
    menuPreset,
    isMenuOpen,
    activePrimaryMenuKey,
    submenuItems,
    submenuLeft,
    handlePrimaryMenuSelect,
  } = useMenuBarState();
  const disableAnimation = !hasUnlockedOnce && !isUnlocking;
  const hideItems = currentScreen === 'lock' && !isUnlocking;

  return (
    <MenuBarMotion disableAnimation={disableAnimation} hideItems={hideItems}>
      <div ref={rootRef} className={styles.root} data-menu-open={isMenuOpen}>
        <MenuBarSurface>
          <MenuBarPrimaryMenus
            items={menuPreset.leftItems}
            activeKey={activePrimaryMenuKey}
            isMenuOpen={isMenuOpen}
            onItemSelect={handlePrimaryMenuSelect}
            onAppleClick={lockScreen}
          />
          <MenuBarStatusArea />
        </MenuBarSurface>

        {isMenuOpen && activePrimaryMenuKey && submenuItems.length > 0 ? (
          <MenuPanel menuKey={activePrimaryMenuKey} items={submenuItems} left={submenuLeft} />
        ) : null}
      </div>
    </MenuBarMotion>
  );
};

export default MenuBar;
