import {useBootstrapState} from './lib/useBootstrapState';
import {BootstrapContent, BootstrapLogo, BootstrapMotion, BootstrapProgress} from './ui';

const Bootstrap = () => {
  const {progressValue, isExiting, isFinished} = useBootstrapState();

  if (isFinished) {
    return null;
  }

  return (
    <BootstrapMotion isExiting={isExiting}>
      <BootstrapContent
        logo={
          <BootstrapLogo role="img" aria-label="Apple inspired boot logo" width={110} height={123} />
        }>
        <BootstrapProgress progressValue={progressValue} />
      </BootstrapContent>
    </BootstrapMotion>
  );
};

export default Bootstrap;
