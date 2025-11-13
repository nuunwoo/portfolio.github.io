import DesktopView from './ui/DesktopView';
import {useDesktopWorkspaceState} from './lib/useDesktopViewState';

type DesktopProps = {
  isScaledDown?: boolean;
  disableScaleTransition?: boolean;
  hideAnimatedItems?: boolean;
};

const Desktop = ({
  isScaledDown = false,
  disableScaleTransition = false,
  hideAnimatedItems = false,
}: DesktopProps) => {
  const workspaceState = useDesktopWorkspaceState();

  return (
    <DesktopView
      workspaceState={workspaceState}
      isScaledDown={isScaledDown}
      disableScaleTransition={disableScaleTransition}
      hideAnimatedItems={hideAnimatedItems}
    />
  );
};

export default Desktop;
export {DesktopView};
export {useDesktopWorkspaceState} from './lib/useDesktopViewState';
export {useDesktopState} from './lib/useDesktopViewState';
export {useDesktopViewState} from './lib/useDesktopViewState';
