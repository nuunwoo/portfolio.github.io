import '../App.css';
import {motion, type Transition} from 'framer-motion';
import {type CSSProperties, type PropsWithChildren} from 'react';
import {useAppKeyboardShortcuts} from './hooks/useAppKeyboardShortcuts';
import BootScreen from '../features/boot-screen';
import Desktop from '../features/desktop';
import LockScreen from '../features/lock-screen';
import {useSystemAppearance} from '../shared/hooks/useSystemAppearance';
import {useAppStore} from '../shared/store/app-store';

type AppLayerProps = PropsWithChildren<{
  layerClassName: 'app-layer-desktop' | 'app-layer-lock' | 'app-layer-splash';
  layerScale?: number;
  style?: CSSProperties;
  transition?: Transition;
  noTransition?: boolean;
  visible: boolean;
}>;

const AppLayer = ({
  children,
  layerClassName,
  layerScale = 1,
  style,
  transition,
  noTransition = false,
  visible,
}: AppLayerProps) => (
  <motion.div
    className={['app-layer', layerClassName].join(' ')}
    style={style}
    animate={{
      '--layer-zoom': `${layerScale}`,
      opacity: visible ? 1 : 0,
      visibility: visible ? 'visible' : 'hidden',
      pointerEvents: visible ? 'auto' : 'none',
    }}
    transition={noTransition ? {duration: 0} : (transition ?? {duration: 0.36, ease: [0.22, 1, 0.36, 1]})}>
    {children}
  </motion.div>
);

const App = () => {
  const isBooting = useAppStore(state => state.isBooting);
  const hasUnlockedOnce = useAppStore(state => state.hasUnlockedOnce);
  const currentScreen = useAppStore(state => state.currentScreen);
  const isUnlocking = useAppStore(state => state.isUnlocking);
  const systemAppearance = useSystemAppearance();
  const isDesktopScaledDown = hasUnlockedOnce && currentScreen === 'lock' && !isUnlocking;
  const desktopLayerStyle = {zIndex: isUnlocking ? 40 : 10};
  const lockLayerStyle = {zIndex: isUnlocking ? 20 : 30};

  useAppKeyboardShortcuts();

  return (
    <main className="app-shell" data-appearance={systemAppearance}>
      <AppLayer layerClassName="app-layer-desktop" style={desktopLayerStyle} visible={currentScreen !== 'splash'}>
        <Desktop isScaledDown={isDesktopScaledDown} disableScaleTransition={!hasUnlockedOnce && !isUnlocking} hideAnimatedItems={!hasUnlockedOnce && currentScreen === 'lock' && !isUnlocking} />
      </AppLayer>

      <AppLayer layerClassName="app-layer-lock" noTransition={!hasUnlockedOnce && currentScreen === 'lock'} style={lockLayerStyle} visible={currentScreen === 'lock' || isUnlocking}>
        <LockScreen />
      </AppLayer>

      {isBooting && (
        <AppLayer layerClassName="app-layer-splash" visible={true}>
          <BootScreen />
        </AppLayer>
      )}
    </main>
  );
};

export default App;
