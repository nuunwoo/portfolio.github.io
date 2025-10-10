import styles from './TableView.module.css';
type TableViewProps = { columns: string[]; rows: string[][] };
const TableView = ({ columns, rows }: TableViewProps) => (
  <table className={styles.table}>
    <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
    <tbody>{rows.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j}>{v}</td>)}</tr>)}</tbody>
  </table>
);
export default TableView;
