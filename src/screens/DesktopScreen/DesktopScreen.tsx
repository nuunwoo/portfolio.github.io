import type { WindowKey } from "../../utils/windowKeys";

type DesktopScreenProps = {
  isFocused?: boolean;
  onFocusWindow?: (windowKey: WindowKey) => void;
  wallpaperSrc: string;
  windowKey: WindowKey;
};

function DesktopScreen({
  isFocused = false,
  onFocusWindow,
  wallpaperSrc,
  windowKey,
}: DesktopScreenProps) {
  return (
    <section
      data-window-key={windowKey}
      onPointerDown={() => onFocusWindow?.(windowKey)}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        outline: isFocused ? "1px solid rgba(255,255,255,0.12)" : "none",
        outlineOffset: "-1px",
      }}
    >
      <img src={wallpaperSrc} alt="Desktop wallpaper" className="wallpaper" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateRows: "40px 1fr",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            color: "#fff",
            background: "rgba(10, 12, 20, 0.24)",
            backdropFilter: "blur(18px)",
          }}
        >
          <strong style={{ fontSize: "14px", fontWeight: 600 }}>nuunwoo</strong>
          <span style={{ fontSize: "13px", opacity: 0.84 }}>Portfolio Desktop</span>
        </div>
        <div
          style={{
            display: "grid",
            placeItems: "center",
            padding: "24px",
          }}
        >
          <div
            style={{
              width: "min(520px, 100%)",
              borderRadius: "28px",
              padding: "28px",
              color: "#f5f7fb",
              background: "rgba(11, 14, 22, 0.24)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.16)",
              boxShadow: "0 20px 80px rgba(0,0,0,0.32)",
            }}
          >
            <p style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.64 }}>
              Desktop Preview
            </p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", marginTop: "10px", lineHeight: 1.04 }}>
              macOS-inspired portfolio workspace
            </h2>
            <p style={{ marginTop: "14px", lineHeight: 1.6, opacity: 0.82 }}>
              Next step is turning this desktop into a portfolio launcher for projects,
              profile, and contact windows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DesktopScreen;
