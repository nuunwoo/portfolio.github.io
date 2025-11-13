import LaunchpadGrid from '../grid/LaunchpadGrid';
import type {LaunchpadDisplayItem} from '../../model/types';
import styles from './LaunchpadPageTrack.module.css';

type LaunchpadPageTrackProps = {
  pagedApps: LaunchpadDisplayItem[][];
  pageIndex: number;
  isItemDragging: boolean;
  isSearchMode: boolean;
  draggingItemKey: string | null;
  dropTargetItemKey: string | null;
  dropPreviewPageIndex: number | null;
  dropPreviewSlotIndex: number | null;
  hasDragged: boolean;
  onItemMouseDown: (app: LaunchpadDisplayItem, index: number, event: React.MouseEvent<HTMLDivElement>) => void;
};

const LaunchpadPageTrack = ({
  pagedApps,
  pageIndex,
  isItemDragging,
  isSearchMode,
  draggingItemKey,
  dropTargetItemKey,
  dropPreviewPageIndex,
  dropPreviewSlotIndex,
  hasDragged,
  onItemMouseDown,
}: LaunchpadPageTrackProps) => {
  const isPageVisible = (index: number) => isItemDragging || Math.abs(index - pageIndex) <= 1;

  return (
    <>
      {pagedApps.map((pageApps, index) => (
        <div
          key={`launchpad-page-${index + 1}`}
          className={styles.launchpadGridPage}
          data-launchpad-grid-page="true"
          data-launchpad-page-index={index}>
          {isPageVisible(index) ? (
            <LaunchpadGrid
              apps={pageApps}
              searchMode={isSearchMode}
              highlightFirst={pageIndex === 0 && index === pageIndex}
              draggingItemKey={draggingItemKey}
              dropTargetItemKey={dropTargetItemKey}
              dropPreviewSlotIndex={dropPreviewPageIndex === index ? dropPreviewSlotIndex : null}
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

export default LaunchpadPageTrack;
