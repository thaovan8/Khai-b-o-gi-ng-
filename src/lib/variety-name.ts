import { useSyncExternalStore } from "react";

const KEY = "variety:name";
export const DEFAULT_VARIETY_NAME = "Sầu riêng Monthong";

let name = DEFAULT_VARIETY_NAME;
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw !== null) name = raw;
  } catch {
    /* ignore */
  }
}

export function setVarietyName(next: string) {
  if (next === name) return;
  name = next;
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function useVarietyName(): string {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => name,
    () => DEFAULT_VARIETY_NAME,
  );
}
