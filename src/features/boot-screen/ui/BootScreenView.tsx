import {AppleLogoIcon} from '../../../design-system/icons';
import {useBootScreenState} from '../lib/useBootScreenState';
import BootScreenViewMotion from './motion/BootScreenViewMotion';

const BootScreenView = () => {
  const {progressValue, isExiting} = useBootScreenState();

  return (
    <BootScreenViewMotion
      isExiting={isExiting}
      progress={progressValue}
      logo={
        <AppleLogoIcon
          mode="dark"
          role="img"
          aria-label="Apple inspired boot logo"
          width={110}
          height={123}
        />
      }
    />
  );
};

export default BootScreenView;
