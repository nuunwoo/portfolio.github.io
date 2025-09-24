import { formatMenuBarTime } from "../../utils/dateTime";

type MenuBarProps = {
  currentDate: Date;
  onRequestLock?: () => void;
};

const leftItems = ["Finder", "File", "Edit", "View", "Go", "Window", "Help"];

function MenuBar({ currentDate, onRequestLock }: MenuBarProps) {
  return (
    <header
      className="material-surface material-dark material-ultra-thin"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        minHeight: "30px",
        padding: "0 14px",
        borderRadius: "0",
        borderLeft: "none",
        borderRight: "none",
        borderTop: "none",
        background: "rgba(18, 20, 26, 0.28)",
        boxShadow: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
        <button
          type="button"
          className="text-footnote font-semibold text-primary-dark"
          onClick={onRequestLock}
          aria-label="Open Apple menu and lock screen"
          style={{
            fontSize: "15px",
            lineHeight: 1,
            border: "none",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          
        </button>
        {leftItems.map((item, index) => (
          <span
            key={item}
            className={index === 0 ? "text-footnote font-semibold text-primary-dark" : "text-footnote font-medium text-secondary-dark"}
            style={{ whiteSpace: "nowrap" }}
          >
            {item}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span className="text-footnote font-medium text-secondary-dark">⌘</span>
        <span className="text-footnote font-medium text-secondary-dark">􀙇</span>
        <span className="text-footnote font-medium text-secondary-dark">􀛨</span>
        <span className="text-footnote font-medium text-secondary-dark">100%</span>
        <span className="text-footnote font-semibold text-primary-dark">
          {formatMenuBarTime(currentDate)}
        </span>
      </div>
    </header>
  );
}

export default MenuBar;
