import { useEffect, useState } from "react";

export type SystemAppearance = "light" | "dark";

const getSystemAppearance = (): SystemAppearance => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const useSystemAppearance = () => {
  const [appearance, setAppearance] = useState<SystemAppearance>(() => getSystemAppearance());

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const syncAppearance = () => {
      setAppearance(mediaQuery.matches ? "dark" : "light");
    };

    syncAppearance();
    mediaQuery.addEventListener("change", syncAppearance);

    return () => {
      mediaQuery.removeEventListener("change", syncAppearance);
    };
  }, []);

  return appearance;
};
