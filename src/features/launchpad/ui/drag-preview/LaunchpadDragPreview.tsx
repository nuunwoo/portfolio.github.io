import {motion} from 'framer-motion';
import {createPortal} from 'react-dom';
import type {CSSProperties, ReactNode} from 'react';
import type {LaunchpadDisplayItem} from '../../model/types';
import {LaunchpadGridItemVisual} from '../grid/LaunchpadGrid';
import launchpadGridStyles from '../grid/LaunchpadGrid.module.css';

export type LaunchpadDragPreviewItem = {
  icon: ReactNode;
  iconSrc?: string;
  label: string;
  itemType?: LaunchpadDisplayItem['itemType'];
  previewChildren?: ReactNode[];
};

export type LaunchpadDragPreviewPortalMetrics = {
  left: number;
  top: number;
  scaleX: number;
  scaleY: number;
};

type LaunchpadDragPreviewProps = {
  className: string;
  dragOriginRect: {left: number; top: number; width: number; height: number};
  position: {left: number; top: number};
  portalHost: HTMLElement;
  portalMetrics: LaunchpadDragPreviewPortalMetrics;
  styleVars: CSSProperties;
  previewItem: LaunchpadDragPreviewItem | null;
};

const LaunchpadDragPreview = ({
  className,
  dragOriginRect,
  position,
  portalHost,
  portalMetrics,
  styleVars,
  previewItem,
}: LaunchpadDragPreviewProps) =>
  createPortal(
    <motion.div
      className={`${className} ${launchpadGridStyles.dragOverlay}`.trim()}
      data-launchpad-drag-overlay="true"
      style={{
        width: dragOriginRect.width / portalMetrics.scaleX,
        height: dragOriginRect.height / portalMetrics.scaleY,
        left: (position.left - portalMetrics.left) / portalMetrics.scaleX,
        top: (position.top - portalMetrics.top) / portalMetrics.scaleY,
        ...styleVars,
      }}
      animate={{x: 0, y: 0, scale: 1}}
      transition={{type: 'spring', stiffness: 560, damping: 38, mass: 0.72}}
      aria-hidden={true}>
      <LaunchpadGridItemVisual
        icon={previewItem?.icon}
        iconSrc={previewItem?.iconSrc}
        label={previewItem?.label ?? ''}
        itemType={previewItem?.itemType}
        previewChildren={previewItem?.previewChildren}
        overlay={true}
      />
    </motion.div>,
    portalHost,
  );

export default LaunchpadDragPreview;
