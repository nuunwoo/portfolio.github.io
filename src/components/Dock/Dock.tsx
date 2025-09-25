import styles from "./Dock.module.css";

type DockItem = {
  key: string;
  label: string;
  accentClass: string;
  glyph: string;
};

const dockItems: DockItem[] = [
  { key: "finder", label: "Finder", accentClass: "accent-blue-light", glyph: "F" },
  { key: "projects", label: "Projects", accentClass: "accent-purple-light", glyph: "P" },
  { key: "about", label: "About", accentClass: "accent-green-light", glyph: "A" },
  { key: "contact", label: "Contact", accentClass: "accent-pink-light", glyph: "C" },
  { key: "music", label: "Music", accentClass: "accent-red-light", glyph: "♪" },
  { key: "notes", label: "Notes", accentClass: "accent-yellow-dark", glyph: "N" },
  { key: "settings", label: "Settings", accentClass: "accent-gray-light", glyph: "⚙" },
];

const Dock = () => {
  return (
    <div
      className={`material-surface material-light material-medium material-dynamic-on-light shape-squircle-lg ${styles.root}`}
    >
      {dockItems.map((item) => (
        <button
          key={item.key}
          type="button"
          title={item.label}
          aria-label={item.label}
          className={styles.dockButton}
        >
          <span
            className={`material-surface material-light material-thin shape-squircle-md ${item.accentClass} ${styles.dockIcon}`}
          >
            {item.glyph}
          </span>
        </button>
      ))}

      <div className={styles.separator} />

      <button
        type="button"
        title="Trash"
        aria-label="Trash"
        className={styles.dockButton}
      >
        <span
          className={`material-surface material-light material-thin shape-squircle-md text-secondary-light ${styles.trashIcon}`}
        >
          🗑
        </span>
      </button>
    </div>
  );
};

export default Dock;
