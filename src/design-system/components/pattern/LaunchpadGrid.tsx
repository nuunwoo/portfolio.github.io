import type { ReactNode } from 'react';
import styles from './LaunchpadGrid.module.css';
const LaunchpadGrid = ({
  apps,
  searchMode = false,
  highlightFirst = false,
}: {
  apps: { key: string; icon: ReactNode; label: string }[];
  searchMode?: boolean;
  highlightFirst?: boolean;
}) => (
  <section className={`${styles.root} ${searchMode ? styles.rootSearch : ''}`}>
    {apps.map((app, index) => (
      <div
        key={app.key}
        className={`${styles.item} ${searchMode ? styles.itemSearch : ''} ${
          searchMode && highlightFirst && index === 0 ? styles.itemSearchPrimary : ''
        }`}
        data-launchpad-item="true">
        <div className={styles.icon}>{app.icon}</div>
        <div className={styles.label}>{app.label}</div>
      </div>
    ))}
  </section>
);
export default LaunchpadGrid;
