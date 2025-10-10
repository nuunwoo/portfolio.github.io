import styles from './Switch.module.css';

type SwitchProps = { checked: boolean; onChange?: (next: boolean) => void; };
const Switch = ({ checked, onChange }: SwitchProps) => (
  <button type="button" role="switch" aria-checked={checked} className={`${styles.root} ${checked ? styles.checked : ''}`.trim()} onClick={() => onChange?.(!checked)}>
    <span className={styles.thumb} />
  </button>
);
export default Switch;
