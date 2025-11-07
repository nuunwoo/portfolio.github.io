import {motion} from 'framer-motion';
import {useEffect, useRef, useState} from 'react';
import {LaunchpadPanel, type LaunchpadAppItem} from '../../../launchpad';
import {CLOSE_ANIMATION_MS, launchpadOverlayVariants} from '../../../launchpad/ui/animations/launchpadAnimations';
import styles from './LaunchpadOverlayMotion.module.css';

type LaunchpadOverlayMotionProps = {
  isOpen: boolean;
  apps: LaunchpadAppItem[];
  onMoveApp: (fromIndex: number, toIndex: number) => void;
  onClose: () => void;
};

export type LaunchpadPhase = 'hidden' | 'open' | 'closing';

const LaunchpadOverlayMotion = ({isOpen, apps, onMoveApp, onClose}: LaunchpadOverlayMotionProps) => {
  const [phase, setPhase] = useState<LaunchpadPhase>(isOpen ? 'open' : 'hidden');
  const [hasOpenedOnce, setHasOpenedOnce] = useState(isOpen);
  const closeTimerRef = useRef<number | null>(null);
  const isClosing = phase === 'closing';
  const isFirstOpening = isOpen && !hasOpenedOnce;

  useEffect(() => {
    if (isOpen) {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setPhase('open');
      return;
    }

    if (phase !== 'open') {
      return;
    }

    setPhase('closing');
    closeTimerRef.current = window.setTimeout(() => {
      setPhase('hidden');
      closeTimerRef.current = null;
    }, CLOSE_ANIMATION_MS);
  }, [isOpen, phase]);

  useEffect(() => {
    if (isOpen && !hasOpenedOnce) {
      setHasOpenedOnce(true);
    }
  }, [hasOpenedOnce, isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className={`${styles.launchpadOverlay} ${phase === 'hidden' ? styles.launchpadOverlayBehind : styles.launchpadOverlayVisible}`}
      onPointerDown={onClose}
      variants={launchpadOverlayVariants}
      initial={false}
      animate={phase}>
      <LaunchpadPanel
        apps={apps}
        isFirstOpening={isFirstOpening}
        isOpen={isOpen}
        isClosing={isClosing}
        phase={phase}
        onMoveApp={onMoveApp}
        onClose={onClose}
      />
    </motion.div>
  );
};

export default LaunchpadOverlayMotion;
