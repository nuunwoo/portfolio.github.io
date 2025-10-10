import type { ReactNode } from 'react';
import styles from './Tooltip.module.css';
const Tooltip = ({ children }: { children: ReactNode }) => <span className={styles.root} role='tooltip'>{children}</span>;
export default Tooltip;
