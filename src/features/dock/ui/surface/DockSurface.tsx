import type {CSSProperties, PropsWithChildren} from 'react';
import {useBlurredBackgroundImage} from '../../../../shared/hooks/useBlurredBackgroundImage';
import {BlurredBackgroundImage} from '../../../../shared/ui/blurred-background-image';
import styles from './DockSurface.module.css';

type DockSurfaceProps = PropsWithChildren<{
  watch?: unknown[];
  isPreviewActive?: boolean;
  previewExpandLeft?: number;
  previewExpandRight?: number;
}>;

const DockSurface = ({
  children,
  watch = [],
  isPreviewActive = false,
  previewExpandLeft = 0,
  previewExpandRight = 0,
}: DockSurfaceProps) => {
  const {backgroundImageStyle, backgroundSrc, setBackgroundImageRef} = useBlurredBackgroundImage({
    target: 'desktop',
    watch,
  });

  return (
    <div
      ref={setBackgroundImageRef}
      className={`${styles.root} ${isPreviewActive ? styles.rootPreviewActive : ''}`}
      style={
        isPreviewActive
          ? ({
              '--dock-preview-expand-left': `${previewExpandLeft}px`,
              '--dock-preview-expand-right': `${previewExpandRight}px`,
            } as CSSProperties)
          : undefined
      }>
      <BlurredBackgroundImage src={backgroundSrc} style={backgroundImageStyle} />
      {children}
    </div>
  );
};

export default DockSurface;
