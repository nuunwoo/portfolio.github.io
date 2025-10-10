import styles from './SpotlightOverlay.module.css';
import { SearchField } from '../search';
const SpotlightOverlay = ({ items }: { items: string[] }) => (
  <section className={styles.root}>
    <div className={styles.search}><SearchField placeholder='Spotlight 검색' /></div>
    <div className={styles.list}>{items.map((item) => <div key={item} className={styles.item}>{item}</div>)}</div>
  </section>
);
export default SpotlightOverlay;
