import styles from "./ProgressBar.module.css";
const ProgressBar = ({ value }: { value: number }) => (
  <div className={styles.track} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
    <div className={styles.value} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);
export default ProgressBar;
