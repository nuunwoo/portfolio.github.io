import { useEffect } from "react";
import { formatLockScreenDate, formatLockScreenTime } from "../../utils/dateTime";

type LockScreenProps = {
  currentDate: Date;
  isUnlocking?: boolean;
  onUnlock?: () => void;
  wallpaperSrc: string;
};

function LockScreen({
  currentDate,
  isUnlocking = false,
  onUnlock,
  wallpaperSrc,
}: LockScreenProps) {
  useEffect(() => {
    if (isUnlocking) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        onUnlock?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isUnlocking, onUnlock]);

  return (
    <section
      aria-label="Lock screen"
      onClick={() => {
        if (!isUnlocking) onUnlock?.();
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        cursor: isUnlocking ? "default" : "pointer",
        transition: "opacity 360ms ease, transform 360ms ease, filter 360ms ease",
        opacity: isUnlocking ? 0 : 1,
        transform: isUnlocking ? "scale(1.015)" : "scale(1)",
        filter: isUnlocking ? "blur(10px)" : "blur(0px)",
        pointerEvents: isUnlocking ? "none" : "auto",
      }}
    >
      <img
        src={wallpaperSrc}
        alt="Lock screen wallpaper"
        className="wallpaper"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(9, 14, 18, 0.12) 0%, rgba(7, 11, 15, 0.22) 40%, rgba(4, 7, 10, 0.28) 100%)",
          color: "#fff",
          display: "grid",
          gridTemplateRows: "1fr auto",
          textAlign: "center",
          padding: "36px 24px 56px",
          backdropFilter: "blur(10px) saturate(1.04)",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "grid",
            placeItems: "center",
            alignSelf: "start",
            paddingTop: "18px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              paddingRight: "2px",
              fontSize: "12px",
              fontWeight: 600,
              opacity: 0.92,
              letterSpacing: "0.02em",
            }}
          >
            <span>ABC</span>
            <span>􀙇</span>
            <span>􀛨</span>
            <span>􀋦</span>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            display: "grid",
            placeItems: "center",
            alignSelf: "center",
          }}
        >
          <p
            style={{
              fontSize: "clamp(20px, 2.2vw, 34px)",
              fontWeight: 700,
              opacity: 0.84,
              marginBottom: "14px",
              textShadow: "0 12px 30px rgba(0,0,0,0.18)",
            }}
          >
            {formatLockScreenDate(currentDate)}
          </p>
          <h1
            style={{
              fontSize: "clamp(88px, 12vw, 136px)",
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: "-0.07em",
              textShadow: "0 18px 40px rgba(0,0,0,0.24)",
            }}
          >
            {formatLockScreenTime(currentDate)}
          </h1>
          <div
            style={{
              marginTop: "clamp(180px, 24vh, 280px)",
              display: "grid",
              gap: "12px",
              justifyItems: "center",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "999px",
                background: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.08))",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                backdropFilter: "blur(14px)",
                display: "grid",
                placeItems: "center",
                fontSize: "24px",
              }}
            >
              <span>👤</span>
            </div>
            <p style={{ fontSize: "18px", fontWeight: 600, opacity: 0.9 }}>
              이현우
            </p>
            <p style={{ fontSize: "13px", opacity: 0.78, letterSpacing: "0.02em" }}>
              클릭하거나 Enter 키를 눌러 잠금 해제
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LockScreen;
