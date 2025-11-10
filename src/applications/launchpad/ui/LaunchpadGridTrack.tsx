import {LaunchpadGrid} from '../../../design-system/components';
import type {LaunchpadAppItem} from '../model/types';
import styles from './Launchpad.module.css';

type LaunchpadGridTrackProps = {
  pagedApps: LaunchpadAppItem[][];
  pageIndex: number;
  isItemDragging: boolean;
  isSearchMode: boolean;
  draggingKey: string | null;
  hoveredTargetKey: string | null;
  hasDragged: boolean;
  onItemMouseDown: (app: LaunchpadAppItem, index: number, event: React.MouseEvent<HTMLDivElement>) => void;
};

const LaunchpadGridTrack = ({
  pagedApps,
  pageIndex,
  isItemDragging,
  isSearchMode,
  draggingKey,
  hoveredTargetKey,
  hasDragged,
  onItemMouseDown,
}: LaunchpadGridTrackProps) => {
  const isPageVisible = (index: number) => isItemDragging || Math.abs(index - pageIndex) <= 1;

  return (
    <>
      {pagedApps.map((pageApps, index) => (
        <div key={`launchpad-page-${index + 1}`} className={styles.launchpadGridPage}>
          {isPageVisible(index) ? (
            <LaunchpadGrid
              apps={pageApps}
              searchMode={isSearchMode}
              highlightFirst={pageIndex === 0 && index === pageIndex}
              draggingKey={draggingKey}
              hoveredTargetKey={hoveredTargetKey}
              hasDragged={hasDragged}
              onItemMouseDown={onItemMouseDown}
            />
          ) : (
            <div className={styles.launchpadGridPlaceholder} aria-hidden={true} />
          )}
        </div>
      ))}
    </>
  );
};

export default LaunchpadGridTrack;
