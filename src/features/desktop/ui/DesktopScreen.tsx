import Dock from "../../../components/Dock/Dock";
import MenuBar from "../../../components/MenuBar/MenuBar";
import type { WindowKey } from "../../../utils/windowKeys";

type DesktopScreenProps = {
  currentDate: Date;
  isFocused?: boolean;
  onFocusWindow?: (windowKey: WindowKey) => void;
  onRequestLock?: () => void;
  wallpaperSrc: string;
  windowKey: WindowKey;
};

function DesktopScreen({
  currentDate,
  isFocused = false,
  onFocusWindow,
  onRequestLock,
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
      <div style={{ position: "absolute", inset: 0 }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 20,
          }}
        >
          <MenuBar currentDate={currentDate} onRequestLock={onRequestLock} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr",
            alignItems: "start",
            padding: "54px 28px 110px",
            gap: "24px",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "18px",
              justifyItems: "center",
            }}
          >
            {[
              { label: "About Me", glyph: "👤" },
              { label: "Projects", glyph: "🗂" },
              { label: "Contact", glyph: "✉" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                style={{
                  border: "none",
                  background: "transparent",
                  display: "grid",
                  gap: "8px",
                  justifyItems: "center",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <span
                  className="material-surface material-light material-medium material-dynamic-on-light shape-squircle-lg"
                  style={{
                    width: "72px",
                    height: "72px",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "30px",
                  }}
                >
                  {item.glyph}
                </span>
                <span
                  className="text-footnote font-medium text-primary-dark"
                  style={{
                    padding: "2px 8px",
                    borderRadius: "10px",
                    background: "rgba(8, 10, 14, 0.18)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              placeItems: "center",
              paddingTop: "48px",
            }}
          >
            <div
              className="material-surface material-dark material-thick material-dynamic-on-dark shape-squircle-lg"
              style={{
                width: "min(560px, 100%)",
                padding: "28px",
                color: "#f5f7fb",
              }}
            >
              <p
                className="text-caption-1 font-semibold text-secondary-dark"
                style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
              >
                Desktop Preview
              </p>
              <h2
                className="text-large-title font-semibold text-primary-dark"
                style={{ marginTop: "10px" }}
              >
                macOS-inspired portfolio workspace
              </h2>
              <p
                className="text-body font-regular text-secondary-dark"
                style={{ marginTop: "14px", maxWidth: "44ch" }}
              >
                Menu bar and dock are now separated into reusable components so we can
                evolve the desktop into a real portfolio launcher next.
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "16px",
            transform: "translateX(-50%)",
            zIndex: 20,
          }}
        >
          <Dock />
        </div>
      </div>
    </section>
  );
}

export default DesktopScreen;
