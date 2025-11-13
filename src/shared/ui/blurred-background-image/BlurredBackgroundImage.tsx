import type {CSSProperties} from 'react';
import styles from './BlurredBackgroundImage.module.css';

type BlurredBackgroundImageProps = {
  src: string;
  style?: CSSProperties;
  className?: string;
};

const BlurredBackgroundImage = ({src, style, className}: BlurredBackgroundImageProps) => {
  const resolvedClassName = [styles.image, className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={styles.root} aria-hidden={true}>
      <img
        src={src}
        alt=""
        aria-hidden={true}
        className={resolvedClassName}
        style={style}
      />
    </div>
  );
};

export default BlurredBackgroundImage;
