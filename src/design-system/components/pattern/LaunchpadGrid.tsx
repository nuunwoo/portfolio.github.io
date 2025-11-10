import {motion} from 'framer-motion';
import type {MouseEvent as ReactMouseEvent, ReactNode} from 'react';
import styles from './LaunchpadGrid.module.css';

export type LaunchpadGridItem = {
  key: string;
  icon: ReactNode;
  iconSrc?: string;
  label: string;
};

const ITEM_SPRING = {
  type: 'spring',
  stiffness: 560,
  damping: 38,
  mass: 0.72,
} as const;

export const LaunchpadGridItemVisual = ({
  icon,
  label,
  overlay = false,
}: {
  icon: ReactNode;
  iconSrc?: string;
  label: string;
  overlay?: boolean;
}) => (
  <>
    <div className={styles.icon} data-launchpad-interactive={overlay ? undefined : 'true'}>
      {icon}
    </div>
    <div className={styles.label} data-launchpad-interactive={overlay ? undefined : 'true'}>
      {label}
    </div>
  </>
);

export const getLaunchpadGridItemClassName = ({
  index,
  searchMode,
  highlightFirst,
  dragging = false,
  pressed = false,
}: {
  index: number;
  searchMode: boolean;
  highlightFirst: boolean;
  dragging?: boolean;
  pressed?: boolean;
}) =>
  `${styles.item} ${searchMode ? styles.itemSearch : ''} ${
    searchMode && highlightFirst && index === 0 ? styles.itemSearchPrimary : ''
  } ${dragging ? styles.itemDragging : ''} ${pressed ? styles.itemPressed : ''}`.trim();

const LaunchpadGrid = ({
  apps,
  searchMode = false,
  highlightFirst = false,
  draggingKey = null,
  hoveredTargetKey = null,
  hasDragged = false,
  onItemMouseDown,
}: {
  apps: LaunchpadGridItem[];
  searchMode?: boolean;
  highlightFirst?: boolean;
  draggingKey?: string | null;
  hoveredTargetKey?: string | null;
  hasDragged?: boolean;
  onItemMouseDown?: (app: LaunchpadGridItem, index: number, event: ReactMouseEvent<HTMLDivElement>) => void;
}) => (
  <section className={`${styles.root} ${searchMode ? styles.rootSearch : ''}`}>
    {apps.map((app, index) => {
      const isDragging = draggingKey === app.key;
      const isPressed = isDragging && !hasDragged;
      const isActivelyDragging = isDragging && hasDragged;

      return (
        <motion.div
          key={app.key}
          layout={true}
          transition={ITEM_SPRING}
          className={getLaunchpadGridItemClassName({
            index,
            searchMode,
            highlightFirst,
            dragging: isActivelyDragging,
            pressed: isPressed,
          })}
          data-launchpad-item="true"
          data-launchpad-grid-item="true"
          data-launchpad-key={app.key}
          data-launchpad-interactive="true"
          animate={
            isActivelyDragging
              ? {
                  opacity: 0,
                  scale: 1,
                  zIndex: 1,
                }
              : {
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  zIndex: 1,
                }
          }
          onMouseDown={event => onItemMouseDown?.(app, index, event)}>
          {hoveredTargetKey === app.key && !isActivelyDragging ? <div className={styles.itemDropTarget} aria-hidden={true} /> : null}
          <LaunchpadGridItemVisual icon={app.icon} iconSrc={app.iconSrc} label={app.label} />
        </motion.div>
      );
    })}
  </section>
);

export default LaunchpadGrid;
