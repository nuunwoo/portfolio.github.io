import styles from './DockSeparator.module.css';

type DockSeparatorProps = {
  shouldShiftLeft: boolean;
  shouldShiftRight: boolean;
};

const DockSeparator = ({shouldShiftLeft, shouldShiftRight}: DockSeparatorProps) => {
  return (
    <span
      className={`${styles.root} ${shouldShiftLeft ? styles.shiftLeft : ''} ${shouldShiftRight ? styles.shiftRight : ''}`}
      aria-hidden={true}
    />
  );
};

export default DockSeparator;
