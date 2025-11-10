import {useMemo, useState} from 'react';
import {MenuRow} from '../menu';
import type {SubmenuEntry} from '../../../shared/settings/menu-bar-menus';
import surfaceStyles from './MenuSurface.module.css';
import submenuStyles from './SubmenuPanel.module.css';

type SubmenuPanelProps = {
  menuKey: string;
  items: SubmenuEntry[];
  top: number;
};

const SubmenuPanel = ({menuKey, items, top}: SubmenuPanelProps) => {
  if (items.length === 0) return null;
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const itemHandlers = useMemo(
    () =>
      Object.fromEntries(
        items.map(item => [
          item.label,
          {
            onHover: () => setHoveredKey(item.label),
            onHoverEnd: () => {
              setHoveredKey(prev => (prev === item.label ? null : prev));
            },
          },
        ]),
      ),
    [items],
  );

  return (
    <div
      className={`${surfaceStyles.panel} ${submenuStyles.root}`}
      style={{top}}
      role="menu"
      aria-label={`${menuKey} submenu`}>
      {items.map(item => {
        const handlers = itemHandlers[item.label];
        return (
          <MenuRow
            key={`${menuKey}-nested-${item.label}`}
            item={item}
            submenuOpen={false}
            hovered={hoveredKey === item.label}
            onHover={handlers.onHover}
            onHoverEnd={handlers.onHoverEnd}
          />
        );
      })}
    </div>
  );
};

export default SubmenuPanel;
