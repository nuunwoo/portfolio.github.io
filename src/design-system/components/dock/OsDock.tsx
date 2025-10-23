import type {ReactNode} from 'react';
import {Fragment, useState} from 'react';
import {PopoverSurface} from '../popover';
import styles from './OsDock.module.css';

type DockItem = {
  key: string;
  label: string;
  glyph: ReactNode;
  running?: boolean;
  badge?: string;
  separatorBefore?: boolean;
};

type OsDockProps = {
  items: DockItem[];
  activeItemKey?: string | null;
  onItemClick?: (item: DockItem) => void;
};

const OsDock = ({items, activeItemKey = null, onItemClick}: OsDockProps) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <div className={styles.root} onMouseLeave={() => setHoveredKey(null)}>
      {items.map(item => {
        return (
          <Fragment key={item.key}>
            {item.separatorBefore ? <span className={styles.separator} aria-hidden={true} /> : null}
            <button
              type="button"
              className={`${styles.item} ${activeItemKey === item.key ? styles.itemActive : ''}`}
              aria-label={item.label}
              onClick={() => onItemClick?.(item)}
              onMouseEnter={() => setHoveredKey(item.key)}
              onMouseLeave={() => setHoveredKey(prev => (prev === item.key ? null : prev))}
              onFocus={() => setHoveredKey(item.key)}
              onBlur={() => setHoveredKey(prev => (prev === item.key ? null : prev))}>
              {hoveredKey === item.key ? (
                <PopoverSurface className={styles.popoverPosition} placement="north-center" role="tooltip">
                  {item.label}
                </PopoverSurface>
              ) : null}
              {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
              <span className={styles.icon}>{item.glyph}</span>
              {item.running ? <span className={styles.runningDot} /> : null}
            </button>
          </Fragment>
        );
      })}
    </div>
  );
};

export type {DockItem};
export default OsDock;
