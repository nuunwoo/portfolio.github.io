import styles from "./Tabs.module.css";

type TabsProps = { items: string[]; active: string; onChange?: (value: string) => void };
const Tabs = ({ items, active, onChange }: TabsProps) => (
  <div className={styles.root} role="tablist">
    {items.map((item) => (
      <button key={item} type="button" role="tab" className={`${styles.tab} ${active === item ? styles.active : ""}`.trim()} onClick={() => onChange?.(item)}>
        {item}
      </button>
    ))}
  </div>
);
export default Tabs;
