import styles from "./ListView.module.css";

type ListViewProps = { items: string[]; active?: string };
const ListView = ({ items, active }: ListViewProps) => (
  <div className={styles.root}>
    {items.map((item) => (
      <div key={item} className={`${styles.row} ${active === item ? styles.rowActive : ""}`.trim()}>
        {item}
      </div>
    ))}
  </div>
);
export default ListView;
