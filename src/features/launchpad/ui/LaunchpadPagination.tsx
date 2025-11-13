import styles from './Launchpad.module.css';

type LaunchpadPaginationProps = {
  pageCount: number;
  pageIndex: number;
};

const LaunchpadPagination = ({pageCount, pageIndex}: LaunchpadPaginationProps) => {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <div className={styles.launchpadPagination} aria-hidden={true}>
      {Array.from({length: pageCount}).map((_, index) => (
        <span key={`launchpad-page-dot-${index + 1}`} className={`${styles.launchpadDot} ${index === pageIndex ? styles.launchpadDotActive : ''}`} />
      ))}
    </div>
  );
};

export default LaunchpadPagination;
