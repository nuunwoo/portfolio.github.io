import {motion} from 'framer-motion';
import type {PropsWithChildren} from 'react';
import {getDockMotion, getDockTransition} from '../../lib/dockMotionConfig';
import styles from './DockMotion.module.css';

type DockMotionProps = PropsWithChildren<{
  disableAnimation?: boolean;
  hideItems?: boolean;
}>;

const DockMotion = ({children, disableAnimation = false, hideItems = false}: DockMotionProps) => {
  return (
    <div className={styles.root}>
      <motion.div className={styles.content} animate={getDockMotion(hideItems)} transition={getDockTransition(disableAnimation)} initial={false}>
        {children}
      </motion.div>
    </div>
  );
};

export default DockMotion;
