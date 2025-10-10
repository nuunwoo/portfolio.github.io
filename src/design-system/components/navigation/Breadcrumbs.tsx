import styles from './Breadcrumbs.module.css';
const Breadcrumbs = ({ items }: { items: string[] }) => (
  <nav className={styles.root} aria-label='Breadcrumb'>
    {items.map((item, idx) => (
      <span key={item} className={styles.item}>{item}{idx < items.length - 1 ? <span className={styles.sep}>›</span> : null}</span>
    ))}
  </nav>
);
export default Breadcrumbs;
