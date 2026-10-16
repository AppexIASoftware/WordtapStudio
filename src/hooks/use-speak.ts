"use client";

import { useCallback, useEffect, useRef } from "react";

interface SpeakOptions {
  /** Speech rate. Defaults to 0.9. */
  rate?: number;
  /** Called when playback starts. */
  onStart?: () => void;
  /** Called when playback ends or fails. */
  onEnd?: () => void;
  /** Called when the browser has no speech engine, so callers can fall back. */
  onUnavailable?: (text: string) => void;
}

/**
 * Reads a term aloud with the browser speech engine.
 *
 * Centralises the availability guard, the language and the rate that were
 * duplicated across the studio views, and returns one stable identity so
 * callers can pass it straight to child components.
 */
export function useSpeak(options: SpeakOptions = {}) {
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  return useCallback((text: string) => {
    const { rate = 0.9, onStart, onEnd, onUnavailable } = optionsRef.current;

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      onUnavailable?.(text);
      return;
    }
    if (!text) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = rate;
      if (onStart) utterance.onstart = onStart;
      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      onEnd?.();
    }
  }, []);
}
