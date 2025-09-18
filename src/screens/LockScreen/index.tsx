import { useMemo } from "react";

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);

type LockScreenProps = {
  onUnlock?: () => void;
};

function LockScreen({ onUnlock }: LockScreenProps) {
  const now = useMemo(() => new Date(), []);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <img
        src="/wallpapers/wallpapers_14.webp"
        alt="Lock screen wallpaper"
        className="wallpaper"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(6, 9, 16, 0.2) 0%, rgba(3, 3, 6, 0.56) 100%)",
          color: "#fff",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <p style={{ fontSize: "18px", opacity: 0.72, marginBottom: "12px" }}>{formatDate(now)}</p>
          <h1
            style={{
              fontSize: "clamp(68px, 14vw, 124px)",
              lineHeight: 1,
              fontWeight: 500,
              letterSpacing: "-0.06em",
            }}
          >
            {formatTime(now)}
          </h1>
          <p style={{ marginTop: "20px", fontSize: "17px", opacity: 0.84 }}>
            Hyunwoo Lee
          </p>
          <button
            type="button"
            onClick={() => onUnlock?.()}
            style={{
              marginTop: "28px",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              padding: "12px 22px",
              fontSize: "14px",
              cursor: "pointer",
              backdropFilter: "blur(14px)",
            }}
          >
            Click to unlock
          </button>
        </div>
      </div>
    </section>
  );
}

export default LockScreen;
