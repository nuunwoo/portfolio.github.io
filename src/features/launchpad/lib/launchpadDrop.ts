import type {LaunchpadDisplayItem} from '../model/types';
import {LAUNCHPAD_PAGE_COLUMNS} from '../model/constants';

const GRID_OUTER_ZONE_HORIZONTAL_MULTIPLIER = 1.5;
const GRID_OUTER_ZONE_VERTICAL_MULTIPLIER = 2;
const HORIZONTAL_INSERT_ZONE_PX = 18;
const VERTICAL_INSERT_ZONE_PX = 14;
const HORIZONTAL_OUTER_INSERT_ZONE_PX = 42;
const VERTICAL_OUTER_INSERT_ZONE_PX = 32;

export type LaunchpadGridCandidate = {
  itemElement: HTMLElement;
  rect: DOMRect;
};

export type PositionedLaunchpadGridCandidate = LaunchpadGridCandidate & {
  targetKey: string;
  targetPosition: {
    pageIndex: number;
    rowIndex: number;
    columnIndex: number;
  };
};

export type LaunchpadGridPosition = {
  rowIndex: number;
  columnIndex: number;
};

export type LaunchpadDropPlacement = 'before' | 'after';

export type LaunchpadDropDirection = 'left' | 'right' | 'up' | 'down';

export type LaunchpadDropTarget = {
  sourceIndex: number;
  targetKey: string;
  projectedIndex: number;
  direction: LaunchpadDropDirection;
  placement: LaunchpadDropPlacement;
};

export type LaunchpadGridMetrics = {
  left: number;
  top: number;
  width: number;
  height: number;
  cellWidth: number;
  cellHeight: number;
  columnStep: number;
  rowStep: number;
};

export type LaunchpadGridOuterGap = {
  horizontal: number;
  vertical: number;
  topVertical: number;
};

export const getGridPositionByKey = (pagedApps: LaunchpadDisplayItem[][], itemKey: string) => {
  for (let pageIndex = 0; pageIndex < pagedApps.length; pageIndex += 1) {
    const page = pagedApps[pageIndex] ?? [];
    const itemIndex = page.findIndex(item => item.key === itemKey);

    if (itemIndex !== -1) {
      return {
        pageIndex,
        rowIndex: Math.floor(itemIndex / LAUNCHPAD_PAGE_COLUMNS),
        columnIndex: itemIndex % LAUNCHPAD_PAGE_COLUMNS,
      };
    }
  }

  return null;
};

export const getPageStartIndex = (pagedApps: LaunchpadDisplayItem[][], pageIndex: number) =>
  pagedApps.slice(0, pageIndex).reduce((count, page) => count + page.length, 0);

export const getSlotIndexFromPosition = ({rowIndex, columnIndex}: LaunchpadGridPosition) =>
  (rowIndex * LAUNCHPAD_PAGE_COLUMNS) + columnIndex;

export const getGridPositionFromSlotIndex = (slotIndex: number): LaunchpadGridPosition => ({
  rowIndex: Math.floor(slotIndex / LAUNCHPAD_PAGE_COLUMNS),
  columnIndex: slotIndex % LAUNCHPAD_PAGE_COLUMNS,
});

export const isIgnoredDropSlot = (sourceSlotIndex: number, targetSlotIndex: number) =>
  sourceSlotIndex === targetSlotIndex;

export const resolveReorderMove = ({
  sourceIndex,
  projectedIndex,
}: Pick<LaunchpadDropTarget, 'sourceIndex' | 'projectedIndex'>) => {
  if (sourceIndex === -1 || projectedIndex === -1 || sourceIndex === projectedIndex) {
    return null;
  }

  return projectedIndex;
};

export const getLaunchpadGridMetrics = (
  gridRootRect: DOMRect | null,
  candidates: PositionedLaunchpadGridCandidate[],
): LaunchpadGridMetrics | null => {
  const sampleCandidate = candidates[0];

  if (!gridRootRect || !sampleCandidate) {
    return null;
  }

  const lastPopulatedRowIndex = Math.max(...candidates.map(candidate => candidate.targetPosition.rowIndex));

  return {
    left: gridRootRect.left,
    top: gridRootRect.top,
    width: gridRootRect.width,
    height: gridRootRect.height,
    cellWidth: sampleCandidate.rect.width,
    cellHeight: sampleCandidate.rect.height,
    columnStep:
      LAUNCHPAD_PAGE_COLUMNS > 1
        ? (gridRootRect.width - sampleCandidate.rect.width) / (LAUNCHPAD_PAGE_COLUMNS - 1)
        : sampleCandidate.rect.width,
    rowStep:
      lastPopulatedRowIndex > 0
        ? (gridRootRect.height - sampleCandidate.rect.height) / lastPopulatedRowIndex
        : sampleCandidate.rect.height,
  };
};

export const getGridCellBounds = (
  metrics: LaunchpadGridMetrics | null,
  rowIndex: number,
  columnIndex: number,
) => {
  if (!metrics) {
    return null;
  }

  const cellCenterX = metrics.left + (columnIndex * metrics.columnStep) + metrics.cellWidth / 2;
  const cellCenterY = metrics.top + (rowIndex * metrics.rowStep) + metrics.cellHeight / 2;
  const left = Math.max(metrics.left, cellCenterX - metrics.columnStep / 2);
  const right = Math.min(metrics.left + metrics.width, cellCenterX + metrics.columnStep / 2);
  const top = Math.max(metrics.top, cellCenterY - metrics.rowStep / 2);
  const bottom = Math.min(metrics.top + metrics.height, cellCenterY + metrics.rowStep / 2);

  return {left, right, top, bottom};
};

export const getGridOuterGap = (metrics: LaunchpadGridMetrics | null): LaunchpadGridOuterGap => {
  if (!metrics) {
    return {horizontal: 0, vertical: 0, topVertical: 0};
  }

  const vertical = Math.max(0, (metrics.rowStep - metrics.cellHeight) * GRID_OUTER_ZONE_VERTICAL_MULTIPLIER);
  return {
    horizontal: Math.max(0, (metrics.columnStep - metrics.cellWidth) * GRID_OUTER_ZONE_HORIZONTAL_MULTIPLIER),
    vertical,
    topVertical: vertical * 1.75,
  };
};

export const getDropDirectionInCell = (
  cellBounds: {left: number; right: number; top: number; bottom: number} | null,
  clientX: number,
  clientY: number,
): LaunchpadDropDirection => {
  if (!cellBounds) {
    return 'right';
  }

  const centerX = (cellBounds.left + cellBounds.right) / 2;
  const centerY = (cellBounds.top + cellBounds.bottom) / 2;
  const deltaX = clientX - centerX;
  const deltaY = clientY - centerY;

  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    return deltaX < 0 ? 'left' : 'right';
  }

  return deltaY < 0 ? 'up' : 'down';
};

export const getGridColumnIndexByPoint = (
  metrics: LaunchpadGridMetrics | null,
  clientX: number,
  outerGapPx = 0,
) => {
  if (!metrics) {
    return null;
  }

  const firstCellBounds = getGridCellBounds(metrics, 0, 0);
  if (firstCellBounds && clientX < firstCellBounds.left && clientX >= metrics.left - outerGapPx) {
    return 0;
  }

  for (let columnIndex = 0; columnIndex < LAUNCHPAD_PAGE_COLUMNS; columnIndex += 1) {
    const cellBounds = getGridCellBounds(metrics, 0, columnIndex);

    if (cellBounds && clientX >= cellBounds.left && clientX <= cellBounds.right) {
      return columnIndex;
    }
  }

  const lastCellBounds = getGridCellBounds(metrics, 0, LAUNCHPAD_PAGE_COLUMNS - 1);
  if (lastCellBounds && clientX > lastCellBounds.right && clientX <= metrics.left + metrics.width + outerGapPx) {
    return LAUNCHPAD_PAGE_COLUMNS - 1;
  }

  return null;
};

export const getGridRowIndexByPoint = (
  metrics: LaunchpadGridMetrics | null,
  clientY: number,
  maxRowIndex: number,
  outerGapPx:
    | number
    | {
        top: number;
        bottom: number;
      } = 0,
) => {
  if (!metrics) {
    return null;
  }

  const resolvedOuterGap =
    typeof outerGapPx === 'number'
      ? {top: outerGapPx, bottom: outerGapPx}
      : outerGapPx;

  const firstCellBounds = getGridCellBounds(metrics, 0, 0);
  if (firstCellBounds && clientY < firstCellBounds.top && clientY >= metrics.top - resolvedOuterGap.top) {
    return 0;
  }

  for (let rowIndex = 0; rowIndex <= maxRowIndex; rowIndex += 1) {
    const cellBounds = getGridCellBounds(metrics, rowIndex, 0);

    if (cellBounds && clientY >= cellBounds.top && clientY <= cellBounds.bottom) {
      return rowIndex;
    }
  }

  const lastCellBounds = getGridCellBounds(metrics, maxRowIndex, 0);
  if (lastCellBounds && clientY > lastCellBounds.bottom && clientY <= metrics.top + metrics.height + resolvedOuterGap.bottom) {
    return maxRowIndex;
  }

  return null;
};

export const getGridSlotIndexByPoint = (
  metrics: LaunchpadGridMetrics | null,
  pageRect: DOMRect,
  clientX: number,
  clientY: number,
  maxRowIndex: number,
  outerGap: LaunchpadGridOuterGap = {horizontal: 0, vertical: 0, topVertical: 0},
) => {
  if (!metrics) {
    return null;
  }

  const firstCellBounds = getGridCellBounds(metrics, 0, 0);
  const lastCellBounds = getGridCellBounds(metrics, maxRowIndex, LAUNCHPAD_PAGE_COLUMNS - 1);
  const rowIndex =
    getGridRowIndexByPoint(metrics, clientY, maxRowIndex, {
      top: outerGap.topVertical,
      bottom: outerGap.vertical,
    }) ??
    (firstCellBounds && clientY < firstCellBounds.top && clientY >= pageRect.top - outerGap.topVertical
      ? 0
      : lastCellBounds && clientY > lastCellBounds.bottom && clientY <= pageRect.bottom + outerGap.vertical
        ? maxRowIndex
        : null);
  const columnIndex =
    getGridColumnIndexByPoint(metrics, clientX, outerGap.horizontal) ??
    (firstCellBounds && clientX < firstCellBounds.left && clientX >= pageRect.left - outerGap.horizontal
      ? 0
      : lastCellBounds && clientX > lastCellBounds.right && clientX <= pageRect.right + outerGap.horizontal
        ? LAUNCHPAD_PAGE_COLUMNS - 1
        : null);

  if (rowIndex === null || columnIndex === null) {
    return null;
  }

  return getSlotIndexFromPosition({rowIndex, columnIndex});
};

export const isPointerInsideGridCell = (
  metrics: LaunchpadGridMetrics | null,
  clientX: number,
  clientY: number,
  rowIndex: number,
  columnIndex: number,
) => {
  const cellBounds = getGridCellBounds(metrics, rowIndex, columnIndex);

  if (!cellBounds) {
    return false;
  }

  return (
    clientX >= cellBounds.left &&
    clientX <= cellBounds.right &&
    clientY >= cellBounds.top &&
    clientY <= cellBounds.bottom
  );
};

export const isPointerInHorizontalInsertZone = (
  clientX: number,
  clientY: number,
  rect: DOMRect,
  direction: 'left' | 'right',
) => {
  const zoneTop = rect.top - 8;
  const zoneBottom = rect.bottom + 8;

  if (clientY < zoneTop || clientY > zoneBottom) {
    return false;
  }

  if (direction === 'left') {
    return clientX >= rect.left - HORIZONTAL_INSERT_ZONE_PX && clientX < rect.left;
  }

  return clientX > rect.right && clientX <= rect.right + HORIZONTAL_INSERT_ZONE_PX;
};

export const isPointerInVerticalInsertZone = (
  clientX: number,
  clientY: number,
  rect: DOMRect,
  direction: 'up' | 'down',
) => {
  const zoneLeft = rect.left - 8;
  const zoneRight = rect.right + 8;

  if (clientX < zoneLeft || clientX > zoneRight) {
    return false;
  }

  if (direction === 'up') {
    return clientY >= rect.top - VERTICAL_INSERT_ZONE_PX && clientY < rect.top;
  }

  return clientY > rect.bottom && clientY <= rect.bottom + VERTICAL_INSERT_ZONE_PX;
};

export const isPointerInHorizontalOuterInsertZone = (
  clientX: number,
  clientY: number,
  rect: DOMRect,
  side: 'left' | 'right',
) => {
  const zoneTop = rect.top - 8;
  const zoneBottom = rect.bottom + 8;

  if (clientY < zoneTop || clientY > zoneBottom) {
    return false;
  }

  if (side === 'left') {
    return clientX < rect.left - HORIZONTAL_INSERT_ZONE_PX && clientX >= rect.left - HORIZONTAL_OUTER_INSERT_ZONE_PX;
  }

  return clientX > rect.right + HORIZONTAL_INSERT_ZONE_PX && clientX <= rect.right + HORIZONTAL_OUTER_INSERT_ZONE_PX;
};

export const isPointerInVerticalOuterInsertZone = (
  clientX: number,
  clientY: number,
  rect: DOMRect,
  side: 'up' | 'down',
) => {
  const zoneLeft = rect.left - 8;
  const zoneRight = rect.right + 8;

  if (clientX < zoneLeft || clientX > zoneRight) {
    return false;
  }

  if (side === 'up') {
    return clientY < rect.top - VERTICAL_INSERT_ZONE_PX && clientY >= rect.top - VERTICAL_OUTER_INSERT_ZONE_PX;
  }

  return clientY > rect.bottom + VERTICAL_INSERT_ZONE_PX && clientY <= rect.bottom + VERTICAL_OUTER_INSERT_ZONE_PX;
};

export const isPointerInHorizontalRowRange = (
  clientX: number,
  clientY: number,
  rowLeft: number,
  rowRight: number,
  rowTop: number,
  rowBottom: number,
) => {
  const zoneTop = rowTop - 8;
  const zoneBottom = rowBottom + 8;

  return clientX >= rowLeft && clientX <= rowRight && clientY >= zoneTop && clientY <= zoneBottom;
};

export const isPointerInVerticalColumnRange = (
  clientX: number,
  clientY: number,
  columnLeft: number,
  columnRight: number,
  columnTop: number,
  columnBottom: number,
) => {
  const zoneLeft = columnLeft - 8;
  const zoneRight = columnRight + 8;

  return clientX >= zoneLeft && clientX <= zoneRight && clientY >= columnTop && clientY <= columnBottom;
};
