import type {PropsWithChildren, ReactNode} from 'react';
import styles from './BootstrapLayout.module.css';

type BootstrapLayoutProps = PropsWithChildren<{
  logo: ReactNode;
}>;

const BootstrapLayout = ({children, logo}: BootstrapLayoutProps) => (
  <div className={styles.layout}>
    {logo}
    {children}
  </div>
);

export default BootstrapLayout;
