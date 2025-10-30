import {useCurrentBackground} from '../../../hooks/useCurrentBackground';
import styles from './ScreenBackground.module.css';

type ScreenBackgroundProps = {
  blurred?: boolean;
  className?: string;
};

const ScreenBackground = ({blurred = false, className}: ScreenBackgroundProps) => {
  const screenBackgroundSrc = useCurrentBackground();
  const resolvedClassName = [styles.root, blurred ? styles.blurred : '', className ?? ''].filter(Boolean).join(' ');

  return <img src={screenBackgroundSrc} alt="" aria-hidden={true} className={resolvedClassName} />;
};

export default ScreenBackground;
