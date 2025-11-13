import {motion} from 'framer-motion';
import type {PointerEvent} from 'react';
import {useEffect, useRef, useState} from 'react';
import type {LaunchpadMoveMode} from '../../model/useLaunchpadLayout';
import type {LaunchpadDisplayItem} from '../../model/types';
import {CLOSE_ANIMATION_MS, launchpadOverlayVariants} from '../../lib/launchpadViewMotion';
import LaunchpadSurface from '../surface/LaunchpadSurface';
import styles from './LaunchpadMotion.module.css';

type LaunchpadMotionProps = {
  isOpen: boolean;
  apps: LaunchpadDisplayItem[];
  pagedApps: LaunchpadDisplayItem[][];
  onMoveApp: (fromIndex: number, toIndex: number, mode?: LaunchpadMoveMode) => void;
  onMoveAppToNewPage: (fromIndex: number) => void;
  onMoveAppToPageEnd: (fromIndex: number, targetPageIndex: number) => void;
  onCopyAppToDock: (appKey: string) => void;
  onDockDragHoverChange?: (clientX: number | null, clientY: number | null) => void;
  onClose: () => void;
};

export type LaunchpadPhase = 'hidden' | 'open' | 'closing';

const LaunchpadMotion = ({isOpen, apps, pagedApps, onMoveApp, onMoveAppToNewPage, onMoveAppToPageEnd, onCopyAppToDock, onDockDragHoverChange, onClose}: LaunchpadMotionProps) => {
  const [phase, setPhase] = useState<LaunchpadPhase>(isOpen ? 'open' : 'hidden');
  const [hasOpenedOnce, setHasOpenedOnce] = useState(isOpen);
  const closeTimerRef = useRef<number | null>(null);
  const isClosing = phase === 'closing';
  const isFirstOpening = isOpen && !hasOpenedOnce;
  const handleOverlayPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    onClose();
  };

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
      onPointerDown={handleOverlayPointerDown}
      variants={launchpadOverlayVariants}
      initial={false}
      animate={phase}>
      <LaunchpadSurface
        apps={apps}
        pagedApps={pagedApps}
        isFirstOpening={isFirstOpening}
        isClosing={isClosing}
        phase={phase}
        onMoveApp={onMoveApp}
        onMoveAppToNewPage={onMoveAppToNewPage}
        onMoveAppToPageEnd={onMoveAppToPageEnd}
        onCopyAppToDock={onCopyAppToDock}
        onDockDragHoverChange={onDockDragHoverChange}
        onClose={onClose}
      />
    </motion.div>
  );
};

export default LaunchpadMotion;
