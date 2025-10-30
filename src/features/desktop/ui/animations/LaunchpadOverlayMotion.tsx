import {motion} from 'framer-motion';
import {useEffect, useRef, useState} from 'react';
import {LaunchpadPanel, type LaunchpadAppItem} from '../../../launchpad';
import styles from './LaunchpadOverlayMotion.module.css';

type LaunchpadOverlayMotionProps = {
  isOpen: boolean;
  apps: LaunchpadAppItem[];
  onClose: () => void;
};

const CLOSE_ANIMATION_MS = 320;
export type LaunchpadPhase = 'hidden' | 'open' | 'closing';

const overlayMotion = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.34,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  closing: {
    opacity: 0,
    transition: {
      duration: 0.32,
      ease: [0.4, 0, 1, 1],
    },
  },
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
      className={`${styles.launchpadOverlay} ${phase === 'hidden' ? styles.launchpadOverlayBehind : styles.launchpadOverlayVisible}`}
      onPointerDown={onClose}
      variants={overlayMotion}
      initial={false}
      animate={phase}>
      <LaunchpadPanel apps={apps} isOpen={isOpen} isClosing={isClosing} phase={phase} onClose={onClose} />
    </motion.div>
  );
};

export default LaunchpadOverlayMotion;
