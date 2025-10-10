import styles from "./OsDock.module.css";

type DockItem = {
  key: string;
  label: string;
  glyph: string;
  tint: string;
  running?: boolean;
  badge?: string;
};

type OsDockProps = {
  items: DockItem[];
};

const OsDock = ({ items }: OsDockProps) => {
  return (
    <div className={styles.root}>
      {items.map(item => (
        <button key={item.key} type="button" className={styles.item} title={item.label} aria-label={item.label}>
          {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
          <span className={styles.icon} style={{ background: item.tint }}>
            {item.glyph}
          </span>
          {item.running ? <span className={styles.runningDot} /> : null}
        </button>
      ))}
    </div>
  );
};

export type { DockItem };
export default OsDock;
