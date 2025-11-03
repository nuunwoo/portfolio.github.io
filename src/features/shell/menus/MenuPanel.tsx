import {useState} from 'react';
import {MenuRow} from '../../../design-system/components';
import type {SubmenuEntry} from '../../../shared/settings/menu-bar-menus';
import surfaceStyles from './MenuSurface.module.css';
import SubmenuPanel from './SubmenuPanel';
import styles from './MenuPanel.module.css';

type MenuPanelProps = {
  menuKey: string;
  items: SubmenuEntry[];
  left: number;
};

const MenuPanel = ({menuKey, items, left}: MenuPanelProps) => {
  if (items.length === 0) return null;
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<{
    key: string;
    top: number;
    items: SubmenuEntry[];
  } | null>(null);

  const handleItemHover = (item: SubmenuEntry, element: HTMLButtonElement) => {
    if (item.disabled || !item.hasSubmenu || !item.submenuItems?.length) {
      setOpenSubmenu(null);
      return;
    }

    setOpenSubmenu({
      key: item.label,
      top: element.offsetTop,
      items: item.submenuItems,
    });
  };

  return (
    <div className={`${surfaceStyles.panel} ${styles.panel}`} style={{left}} role="menu" aria-label={`${menuKey} menu`}>
      {items.map(item => {
        const isSubmenuOpen = openSubmenu?.key === item.label;
        return (
          <MenuRow
            key={`${menuKey}-${item.label}`}
            item={item}
            submenuOpen={isSubmenuOpen}
            hovered={hoveredKey === item.label}
            onHover={element => {
              setHoveredKey(item.label);
              handleItemHover(item, element);
            }}
            onHoverEnd={() => {
              setHoveredKey(prev => (prev === item.label ? null : prev));
            }}
          />
        );
      })}

      {openSubmenu ? <SubmenuPanel menuKey={menuKey} items={openSubmenu.items} top={openSubmenu.top} /> : null}
    </div>
  );
};

export default MenuPanel;
