import {motion} from 'framer-motion';
import {useEffect, useRef, useState} from 'react';
import {LaunchpadPanel, type LaunchpadAppItem} from '../../../launchpad';
import styles from '../../../launchpad/ui/Launchpad.module.css';

type LaunchpadOverlayMotionProps = {
  isOpen: boolean;
  apps: LaunchpadAppItem[];
  onClose: () => void;
};

const CLOSE_ANIMATION_MS = 220;
type LaunchpadPhase = 'hidden' | 'open' | 'closing';

const overlayMotion = {
  hidden: {},
  visible: {},
} as const;

const LaunchpadOverlayMotion = ({isOpen, apps, onClose}: LaunchpadOverlayMotionProps) => {
  const [phase, setPhase] = useState<LaunchpadPhase>(isOpen ? 'open' : 'hidden');
  const closeTimerRef = useRef<number | null>(null);
  const isClosing = phase === 'closing';

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
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className={`${styles.launchpadOverlay} ${
        phase === 'open'
          ? styles.launchpadOverlayOpen
          : phase === 'closing'
            ? styles.launchpadOverlayClosing
            : styles.launchpadOverlayBehind
      } ${isOpen ? styles.launchpadOverlayEnter : ''}`}
      onPointerDown={onClose}
      variants={overlayMotion}
      initial={false}
      animate={isOpen ? 'visible' : 'hidden'}>
      <LaunchpadPanel apps={apps} isOpen={isOpen} isClosing={isClosing} onClose={onClose} />
    </motion.div>
  );
};

export default LaunchpadOverlayMotion;
