import styles from './Radio.module.css';

type RadioProps = { checked: boolean; onChange?: () => void; };
const Radio = ({ checked, onChange }: RadioProps) => (
  <button type="button" role="radio" aria-checked={checked} className={styles.root} onClick={onChange}>
    {checked ? <span className={styles.dot} /> : null}
  </button>
);
export default Radio;
