import {motion} from 'framer-motion';
import type {CSSProperties, PropsWithChildren} from 'react';
import {getLockRootTransition, lockRootVariants} from '../../lib/lockMotionConfig';
import styles from './LockMotion.module.css';

type LockMotionProps = PropsWithChildren<{
  disableAnimation: boolean;
  isExiting: boolean;
  onClick?: () => void;
  'aria-label'?: string;
  'data-window-key'?: string;
  style?: CSSProperties;
}>;

const LockMotion = ({children, disableAnimation, isExiting, ...rest}: LockMotionProps) => (
  <motion.section
    {...rest}
    className={styles.root}
    animate={isExiting ? 'exit' : 'show'}
    variants={lockRootVariants}
    transition={getLockRootTransition(disableAnimation)}>
    <div className={styles.scaledContent}>{children}</div>
  </motion.section>
);

export default LockMotion;
