import { useSyncExternalStore } from "react";

export type SharedStage = { id: string; name: string; description?: string };

const KEY = "variety:extra-stages";

let stages: SharedStage[] = [];
let serialized = "[]";
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      stages = JSON.parse(raw) as SharedStage[];
      serialized = raw;
    }
  } catch {
    /* ignore */
  }
}
load();

export function setExtraStages(next: SharedStage[]) {
  const s = JSON.stringify(next);
  if (s === serialized) return;
  stages = next;
  serialized = s;
  try {
    window.localStorage.setItem(KEY, s);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const emptySnapshot: SharedStage[] = [];

export function useExtraStages(): SharedStage[] {
  return useSyncExternalStore(
    subscribe,
    () => stages,
    () => emptySnapshot,
  );
}

export const DEFAULT_STAGES: SharedStage[] = [
  { id: "ktcb", name: "Kiến thiết cơ bản" },
  { id: "g1", name: "Phục hồi sau thu hoạch" },
  { id: "g2", name: "Ra hoa & Đậu trái non" },
  { id: "g3", name: "Nuôi trái lớn nhanh" },
  { id: "g5", name: "Thúc chín & Tích lũy" },
];

export function useVarietyStages(): SharedStage[] {
  const extra = useExtraStages();
  return extra.length > 0 ? extra : DEFAULT_STAGES;
}
