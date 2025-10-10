import styles from './SearchField.module.css';
import {SearchMagnifyingglassIcon} from '../../icons';

type SearchFieldProps = {
  placeholder?: string;
  className?: string;
};

const SearchField = ({placeholder = '검색', className}: SearchFieldProps) => {
  return (
    <label className={`${styles.root} ${className ?? ''}`.trim()}>
      <span className={styles.icon} aria-hidden={true}>
        <SearchMagnifyingglassIcon className={styles.iconSvg} />
      </span>
      <input className={styles.input} type="text" placeholder={placeholder} />
    </label>
  );
};

export default SearchField;
