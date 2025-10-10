import styles from './Checkbox.module.css';

type CheckboxProps = { checked: boolean; onChange?: (next: boolean) => void; };
const Checkbox = ({ checked, onChange }: CheckboxProps) => (
  <button type="button" role="checkbox" aria-checked={checked} className={`${styles.root} ${checked ? styles.checked : ''}`.trim()} onClick={() => onChange?.(!checked)}>
    {checked ? '✓' : ''}
  </button>
);
export default Checkbox;
