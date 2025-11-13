import {motion} from 'framer-motion';
import type {PropsWithChildren} from 'react';
import {bootstrapRootTransition, bootstrapRootVariants} from '../../lib/bootstrapMotionConfig';
import styles from './BootstrapMotion.module.css';

type BootstrapMotionProps = PropsWithChildren<{
  isExiting: boolean;
}>;

const BootstrapMotion = ({children, isExiting}: BootstrapMotionProps) => (
  <motion.section
    aria-label="MacBook boot splash screen"
    className={styles.root}
    animate={isExiting ? "exit" : "show"}
    variants={bootstrapRootVariants}
    transition={bootstrapRootTransition}>
    <div className={styles.backgroundGlow} />
    {children}
  </motion.section>
);

export default BootstrapMotion;
