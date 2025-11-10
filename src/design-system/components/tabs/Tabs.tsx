import {useMemo} from 'react';
import styles from "./Tabs.module.css";

type TabsProps = { items: string[]; active: string; onChange?: (value: string) => void };
const Tabs = ({ items, active, onChange }: TabsProps) => {
  const itemHandlers = useMemo(
    () =>
      Object.fromEntries(
        items.map(item => [
          item,
          () => onChange?.(item),
        ]),
      ),
    [items, onChange],
  );

  return (
    <div className={styles.root} role="tablist">
      {items.map((item) => (
        <button key={item} type="button" role="tab" className={`${styles.tab} ${active === item ? styles.active : ""}`.trim()} onClick={itemHandlers[item]}>
          {item}
        </button>
      ))}
    </div>
  );
};
export default Tabs;
