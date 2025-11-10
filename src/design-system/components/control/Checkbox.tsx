import {useCallback} from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = { checked: boolean; onChange?: (next: boolean) => void; };
const Checkbox = ({ checked, onChange }: CheckboxProps) => {
  const handleClick = useCallback(() => {
    onChange?.(!checked);
  }, [checked, onChange]);

  return (
    <button type="button" role="checkbox" aria-checked={checked} className={`${styles.root} ${checked ? styles.checked : ''}`.trim()} onClick={handleClick}>
      {checked ? '✓' : ''}
    </button>
  );
};
export default Checkbox;
