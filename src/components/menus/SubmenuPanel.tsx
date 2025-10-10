import {useState} from 'react';
import {MenuRow} from '../../design-system/components';
import type {SubmenuEntry} from '../../shared/settings/menu-bar-menus';
import styles from './MenuPanel.module.css';
import submenuStyles from './SubmenuPanel.module.css';

type SubmenuPanelProps = {
  menuKey: string;
  items: SubmenuEntry[];
  top: number;
};

const SubmenuPanel = ({menuKey, items, top}: SubmenuPanelProps) => {
  if (items.length === 0) return null;
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <div
      className={`${styles.panel} ${submenuStyles.root}`}
      style={{top}}
      role="menu"
      aria-label={`${menuKey} submenu`}>
      {items.map(item => (
        <MenuRow
          key={`${menuKey}-nested-${item.label}`}
          item={item}
          submenuOpen={false}
          hovered={hoveredKey === item.label}
          onHover={() => setHoveredKey(item.label)}
          onHoverEnd={() => {
            setHoveredKey(prev => (prev === item.label ? null : prev));
          }}
        />
      ))}
    </div>
  );
};

export default SubmenuPanel;
