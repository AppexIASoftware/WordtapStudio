"use client";

export interface WordPair {
  term: string;
  translation: string;
}

export interface SandboxEngineProps {
  wordPairs: WordPair[];
  onCorrect: (pts?: number) => void;
  onMistake: () => void;
  onWin: () => void;
}

function hashKey(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function deterministicShuffle<T>(items: T[], keyFn: (item: T) => string, seed = ""): T[] {
  return [...items].sort((a, b) => hashKey(`${seed}:${keyFn(a)}`) - hashKey(`${seed}:${keyFn(b)}`));
}
