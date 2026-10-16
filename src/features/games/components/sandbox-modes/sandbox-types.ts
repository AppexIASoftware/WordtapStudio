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
