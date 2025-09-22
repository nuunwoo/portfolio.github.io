import { useEffect, useState } from "react";
import {
  bootReadiness,
  type BootReadinessSnapshot,
} from "../core/bootReadiness";

export const useBootReadiness = () => {
  const [snapshot, setSnapshot] = useState<BootReadinessSnapshot>(() =>
    bootReadiness.getSnapshot()
  );

  useEffect(() => bootReadiness.subscribe(setSnapshot), []);

  return snapshot;
};
