import styles from "./Dock.module.css";

type DockItem = {
  key: string;
  label: string;
  glyph: string;
  tint: string;
  running?: boolean;
  badge?: string;
};

const dockItems: DockItem[] = [
  { key: "finder", label: "Finder", glyph: "🙂", tint: "#8fc6ff", running: true },
  { key: "launchpad", label: "Launchpad", glyph: "◻", tint: "#f3f4f8", running: true },
  { key: "mail", label: "Mail", glyph: "✉", tint: "#6ec7ff", badge: "109", running: true },
  { key: "calendar", label: "Calendar", glyph: "14", tint: "#ffffff", running: true },
  { key: "notes", label: "Notes", glyph: "📝", tint: "#ffe47f", running: true },
  { key: "notion", label: "Notion", glyph: "N", tint: "#232428", running: true },
  { key: "chrome", label: "Chrome", glyph: "◉", tint: "#f7f7fb", running: true },
  { key: "terminal", label: "Terminal", glyph: ">_", tint: "#1a1b20", running: true },
  { key: "vscode", label: "VS Code", glyph: "⌁", tint: "#53a9ff", running: true },
  { key: "chat", label: "Chat", glyph: "💬", tint: "#6a6cff", badge: "4", running: true },
  { key: "docs", label: "Docs", glyph: "B.", tint: "#0f1014", running: true },
  { key: "figma", label: "Figma", glyph: "◍", tint: "#25262c", running: true },
  { key: "openai", label: "OpenAI", glyph: "◎", tint: "#0d0e11", running: true },
  { key: "kakao", label: "KakaoTalk", glyph: "톡", tint: "#f6df27", badge: "626", running: true },
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
          {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
          <span
            className={`shape-squircle-md ${styles.dockIcon}`}
            style={{ background: item.tint }}
          >
            {item.glyph}
          </span>
          {item.running ? <span className={styles.runningDot} /> : null}
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
          className={`shape-squircle-md ${styles.trashIcon}`}
        >
          🗑
        </span>
        <span className={styles.runningDot} />
      </button>
    </div>
  );
};

export default Dock;
