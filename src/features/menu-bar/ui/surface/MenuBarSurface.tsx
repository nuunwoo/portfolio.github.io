import type {PropsWithChildren} from 'react';
import {useBlurredBackgroundImage} from '../../../../shared/hooks/useBlurredBackgroundImage';
import {BlurredBackgroundImage} from '../../../../shared/ui/blurred-background-image';
import styles from './MenuBarSurface.module.css';

type MenuBarSurfaceProps = PropsWithChildren;

const MenuBarSurface = ({children}: MenuBarSurfaceProps) => {
  const {backgroundImageStyle, backgroundSrc, setBackgroundImageRef} = useBlurredBackgroundImage({
    target: 'desktop',
  });

  return (
    <header
      ref={node => {
        setBackgroundImageRef(node);
      }}
      className={styles.root}>
      <BlurredBackgroundImage src={backgroundSrc} className={styles.backgroundImage} style={backgroundImageStyle} />
      {children}
    </header>
  );
};

export default MenuBarSurface;
