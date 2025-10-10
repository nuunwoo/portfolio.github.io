import styles from './LaunchpadGrid.module.css';
const LaunchpadGrid = ({ apps }: { apps: { key: string; glyph: string; label: string }[] }) => (
  <section className={styles.root}>{apps.map((app) => <div key={app.key} className={styles.item}><div className={styles.icon}>{app.glyph}</div><div className={styles.label}>{app.label}</div></div>)}</section>
);
export default LaunchpadGrid;
