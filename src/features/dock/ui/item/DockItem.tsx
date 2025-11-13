import type {ReactNode} from 'react';
import {PopoverSurface} from '../../../../design-system/components';
import styles from './DockItem.module.css';

export type DockItem = {
  key: string;
  label: string;
  glyph: ReactNode;
  section: 'pinned' | 'unpinned' | 'system';
  running?: boolean;
  badge?: string;
};

type DockItemProps = {
  item: DockItem;
  isActive: boolean;
  isHovered: boolean;
  isRecentlyAdded: boolean;
  shouldShiftLeft: boolean;
  shouldShiftRight: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  itemRef: (element: HTMLButtonElement | null) => void;
};

const DockItem = ({
  item,
  isActive,
  isHovered,
  isRecentlyAdded,
  shouldShiftLeft,
  shouldShiftRight,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  itemRef,
}: DockItemProps) => {
  return (
    <button
      ref={itemRef}
      type="button"
      className={`${styles.root} ${isActive ? styles.active : ''} ${isRecentlyAdded ? styles.recentlyAdded : ''} ${shouldShiftLeft ? styles.shiftLeft : ''} ${shouldShiftRight ? styles.shiftRight : ''}`}
      aria-label={item.label}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}>
      {isHovered ? (
        <PopoverSurface className={styles.popoverPosition} placement="north-center" role="tooltip">
          {item.label}
        </PopoverSurface>
      ) : null}
      {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
      <span className={styles.icon}>{item.glyph}</span>
      {item.running ? <span className={styles.runningDot} /> : null}
    </button>
  );
};

export default DockItem;
