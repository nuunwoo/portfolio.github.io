import {motion} from 'framer-motion';
import type {MouseEvent as ReactMouseEvent, ReactNode} from 'react';
import type {LaunchpadDisplayItem} from '../../model/types';
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
  itemType = 'app',
  previewChildren,
  overlay = false,
}: {
  icon: ReactNode;
  iconSrc?: string;
  label: string;
  itemType?: LaunchpadDisplayItem['itemType'];
  previewChildren?: ReactNode[];
  overlay?: boolean;
}) => (
  <>
    <div className={styles.icon} data-launchpad-interactive={overlay ? undefined : 'true'} data-launchpad-icon="true">
      {itemType === 'folder' && (previewChildren?.length ?? 0) > 0 ? (
        <div className={styles.folderPreviewGrid}>
          {previewChildren?.slice(0, 9).map((previewChild, index) => (
            <div key={index} className={styles.folderPreviewCell}>
              {previewChild}
            </div>
          ))}
        </div>
      ) : (
        icon
      )}
    </div>
    <div className={styles.label} data-launchpad-interactive={overlay ? undefined : 'true'} data-launchpad-label="true">
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
  draggingItemKey = null,
  dropTargetItemKey = null,
  dropPreviewSlotIndex = null,
  hasDragged = false,
  onItemMouseDown,
}: {
  apps: LaunchpadDisplayItem[];
  searchMode?: boolean;
  highlightFirst?: boolean;
  draggingItemKey?: string | null;
  dropTargetItemKey?: string | null;
  dropPreviewSlotIndex?: number | null;
  hasDragged?: boolean;
  onItemMouseDown?: (app: LaunchpadDisplayItem, index: number, event: ReactMouseEvent<HTMLDivElement>) => void;
}) => (
  <section className={`${styles.root} ${searchMode ? styles.rootSearch : ''}`} data-launchpad-grid-root="true">
    {apps.map((app, index) => {
      const isDragging = draggingItemKey === app.key;
      const isPressed = isDragging && !hasDragged;
      const isActivelyDragging = isDragging && hasDragged;
      const isProjectedTarget = dropPreviewSlotIndex === index;
      const shouldShowDropTarget =
        dropPreviewSlotIndex !== null ? isProjectedTarget : dropTargetItemKey === app.key;

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
          {shouldShowDropTarget && !isActivelyDragging ? (
            <div className={styles.itemDropTarget} aria-hidden={true} />
          ) : null}
          <LaunchpadGridItemVisual
            icon={app.icon}
            iconSrc={app.iconSrc}
            label={app.label}
            itemType={app.itemType}
            previewChildren={app.itemType === 'folder' ? app.previewChildren : undefined}
          />
        </motion.div>
      );
    })}
  </section>
);

export default LaunchpadGrid;
