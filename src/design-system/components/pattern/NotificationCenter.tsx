import styles from './NotificationCenter.module.css';
const NotificationCenter = ({ notifications }: { notifications: { title: string; body: string }[] }) => (
  <section className={styles.root}>{notifications.map((n, i) => <article key={i} className={styles.card}><div className={styles.title}>{n.title}</div><div className={styles.body}>{n.body}</div></article>)}</section>
);
export default NotificationCenter;
