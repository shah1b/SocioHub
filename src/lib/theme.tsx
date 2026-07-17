"use client";

import { useSyncExternalStore } from "react";

export type ThemePref = "dark" | "light" | "system";

const STORAGE_KEY = "flow.theme";

/* Runs before first paint (inlined by ThemeScript) and again whenever the
   preference changes: resolves "system" and stamps <html data-theme>. */
export const THEME_INIT_SCRIPT = `(function(){try{var p=localStorage.getItem("${STORAGE_KEY}")||"dark";var t=p==="system"?(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):p;document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="dark";}})();`;

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  const media = matchMedia("(prefers-color-scheme: light)");
  media.addEventListener("change", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
    media.removeEventListener("change", callback);
  };
}

function getSnapshot(): ThemePref {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "system" ? stored : "dark";
}

function getServerSnapshot(): ThemePref {
  return "dark";
}

function apply(pref: ThemePref) {
  const resolved =
    pref === "system"
      ? matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark"
      : pref;
  document.documentElement.dataset.theme = resolved;
}

function setTheme(pref: ThemePref) {
  localStorage.setItem(STORAGE_KEY, pref);
  apply(pref);
  listeners.forEach((notify) => notify());
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Re-apply on every render so a system-preference change while in
  // "system" mode restamps the resolved theme.
  if (typeof document !== "undefined") apply(theme);
  return { theme, setTheme };
}
