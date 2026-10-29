"use client";

import { useState, type Dispatch, type SetStateAction } from "react";

/** Keep unsaved designer values separate while the designer stays mounted. */
export function useLessonDraftValue<T>(lessonId: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [values, setValues] = useState<Record<string, T>>({});
  const value = Object.hasOwn(values, lessonId) ? values[lessonId] : initialValue;
  const setValue: Dispatch<SetStateAction<T>> = (next) => {
    setValues((previous) => {
      const current = Object.hasOwn(previous, lessonId) ? previous[lessonId] : initialValue;
      const updated = typeof next === "function" ? (next as (value: T) => T)(current) : next;
      return { ...previous, [lessonId]: updated };
    });
  };
  return [value, setValue];
}
