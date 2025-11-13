import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {getMenuBarPreset} from '../../../shared/settings/menu-bar-menus';
import {useAppStore} from '../../../shared/store/app-store';

const useMenuBarState = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activePrimaryMenuKey, setActivePrimaryMenuKey] = useState<string | null>(null);
  const [submenuLeft, setSubmenuLeft] = useState(0);
  const currentScreen = useAppStore(state => state.currentScreen);
  const lockScreen = useAppStore(state => state.lockScreen);
  const menuPreset = useMemo(() => getMenuBarPreset(currentScreen), [currentScreen]);
  const isMenuOpen = activePrimaryMenuKey !== null;
  const submenuItems = activePrimaryMenuKey ? (menuPreset.submenuByKey[activePrimaryMenuKey] ?? []) : [];

  useEffect(() => {
    if (currentScreen !== 'desktop') {
      setActivePrimaryMenuKey(null);
    }
  }, [currentScreen]);

  useEffect(() => {
    if (!activePrimaryMenuKey) return;
    if (menuPreset.submenuByKey[activePrimaryMenuKey]) return;
    setActivePrimaryMenuKey(null);
  }, [activePrimaryMenuKey, menuPreset]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target)) return;
      setActivePrimaryMenuKey(null);
    };

    window.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, []);

  const handlePrimaryMenuSelect = useCallback((key: string, element: HTMLElement) => {
    const rootRect = rootRef.current?.getBoundingClientRect();
    const itemRect = element.getBoundingClientRect();

    if (rootRect) {
      setSubmenuLeft(Math.max(0, itemRect.left - rootRect.left));
    }

    setActivePrimaryMenuKey(key);
  }, []);

  return {
    rootRef,
    lockScreen,
    menuPreset,
    isMenuOpen,
    activePrimaryMenuKey,
    submenuItems,
    submenuLeft,
    handlePrimaryMenuSelect,
  };
};

export default useMenuBarState;
