"use client";

import { useSyncExternalStore, useCallback } from "react";

const THEME_CHANGE_EVENT = "wordtap-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

function getSnapshot(): "light" | "dark" {
  const saved = localStorage.getItem("wordtap_theme");
  if (saved === "light" || saved === "dark") return saved;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): "light" | "dark" {
  return "light";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: "light" | "dark") => {
    localStorage.setItem("wordtap_theme", next);
    const html = document.documentElement;
    html.classList.toggle("dark", next === "dark");
    html.classList.toggle("light", next === "light");
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    const current = getSnapshot();
    const next = current === "light" ? "dark" : "light";
    localStorage.setItem("wordtap_theme", next);
    const html = document.documentElement;
    html.classList.toggle("dark", next === "dark");
    html.classList.toggle("light", next === "light");
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  return {
    theme,
    isDark: theme === "dark",
    toggleTheme,
    setTheme,
  };
}
