import type {PropsWithChildren, ReactNode} from 'react';
import styles from './BootstrapContent.module.css';

type BootstrapContentProps = PropsWithChildren<{
  logo: ReactNode;
}>;

const BootstrapContent = ({children, logo}: BootstrapContentProps) => (
  <div className={styles.root}>
    {logo}
    {children}
  </div>
);

export default BootstrapContent;
