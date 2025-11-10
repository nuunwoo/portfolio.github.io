import type {ScreenBackgroundTarget} from '../../../app/assets-manifest';
import {useCurrentBackground} from '../../hooks/useCurrentBackground';
import styles from './ScreenBackground.module.css';

type ScreenBackgroundProps = {
  blurred?: boolean;
  className?: string;
  target?: ScreenBackgroundTarget;
};

const ScreenBackground = ({blurred = false, className, target = 'desktop'}: ScreenBackgroundProps) => {
  const screenBackgroundSrc = useCurrentBackground(target);
  const resolvedClassName = [styles.root, blurred ? styles.blurred : '', className ?? ''].filter(Boolean).join(' ');

  return <img src={screenBackgroundSrc} alt="" aria-hidden={true} className={resolvedClassName} />;
};

export default ScreenBackground;
