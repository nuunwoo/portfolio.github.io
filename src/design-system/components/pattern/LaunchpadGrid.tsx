import type {DragEvent, ReactNode} from 'react';
import {useState} from 'react';
import styles from './LaunchpadGrid.module.css';

type LaunchpadGridItem = {
  key: string;
  icon: ReactNode;
  label: string;
};

const LaunchpadGrid = ({
  apps,
  searchMode = false,
  highlightFirst = false,
  onMoveItem,
  onDragStateChange,
}: {
  apps: LaunchpadGridItem[];
  searchMode?: boolean;
  highlightFirst?: boolean;
  onMoveItem?: (fromIndex: number, toIndex: number) => void;
  onDragStateChange?: (dragging: boolean) => void;
}) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const canReorder = !searchMode && Boolean(onMoveItem);

  const resetDragState = () => {
    setDragIndex(null);
    setDropIndex(null);
    onDragStateChange?.(false);
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>, index: number) => {
    if (!canReorder) return;

    setDragIndex(index);
    setDropIndex(index);
    onDragStateChange?.(true);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', apps[index]?.key ?? '');
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>, index: number) => {
    if (!canReorder || dragIndex === null) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (dropIndex !== index) {
      setDropIndex(index);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, index: number) => {
    if (!canReorder || dragIndex === null) {
      resetDragState();
      return;
    }

    event.preventDefault();
    if (dragIndex !== index) {
      onMoveItem?.(dragIndex, index);
    }
    resetDragState();
  };

  return (
    <section className={`${styles.root} ${searchMode ? styles.rootSearch : ''}`}>
      {apps.map((app, index) => {
        const isDragging = dragIndex === index;
        const isDropTarget = dropIndex === index && dragIndex !== null && dragIndex !== index;

        return (
          <div
            key={app.key}
            className={`${styles.item} ${searchMode ? styles.itemSearch : ''} ${
              searchMode && highlightFirst && index === 0 ? styles.itemSearchPrimary : ''
            } ${isDragging ? styles.itemDragging : ''} ${isDropTarget ? styles.itemDropTarget : ''}`}
            data-launchpad-item="true"
            data-launchpad-grid-item="true"
            data-launchpad-interactive="true"
            draggable={canReorder}
            onDragStart={event => handleDragStart(event, index)}
            onDragOver={event => handleDragOver(event, index)}
            onDrop={event => handleDrop(event, index)}
            onDragEnd={resetDragState}>
            <div className={styles.icon} data-launchpad-interactive="true">
              {app.icon}
            </div>
            <div className={styles.label} data-launchpad-interactive="true">
              {app.label}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default LaunchpadGrid;
