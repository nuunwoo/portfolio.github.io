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

function Dock() {
  return (
    <div
      className="material-surface material-light material-medium material-dynamic-on-light shape-squircle-lg"
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: "10px",
        padding: "10px 14px 12px",
        minHeight: "74px",
      }}
    >
      {dockItems.map((item) => (
        <button
          key={item.key}
          type="button"
          title={item.label}
          aria-label={item.label}
          style={{
            display: "grid",
            placeItems: "center",
            width: "48px",
            height: "48px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span
            className={`material-surface material-light material-thin shape-squircle-md ${item.accentClass}`}
            style={{
              width: "48px",
              height: "48px",
              display: "grid",
              placeItems: "center",
              fontSize: "22px",
              fontWeight: 700,
              textShadow: "0 1px 0 rgba(255,255,255,0.4)",
            }}
          >
            {item.glyph}
          </span>
        </button>
      ))}

      <div
        style={{
          width: "1px",
          alignSelf: "stretch",
          background: "rgba(60, 60, 67, 0.18)",
          margin: "0 2px 0 4px",
        }}
      />

      <button
        type="button"
        title="Trash"
        aria-label="Trash"
        style={{
          display: "grid",
          placeItems: "center",
          width: "48px",
          height: "48px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <span
          className="material-surface material-light material-thin shape-squircle-md text-secondary-light"
          style={{
            width: "48px",
            height: "48px",
            display: "grid",
            placeItems: "center",
            fontSize: "22px",
          }}
        >
          🗑
        </span>
      </button>
    </div>
  );
}

export default Dock;
