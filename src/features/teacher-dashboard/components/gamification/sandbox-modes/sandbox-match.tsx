"use client";

import { useState, useMemo } from "react";
import { SandboxEngineProps } from "./sandbox-types";

export function SandboxMatch({
  wordPairs,
  onCorrect,
  onMistake,
  onWin,
}: SandboxEngineProps) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [mistakeFlash, setMistakeFlash] = useState<string | null>(null);

  const shuffledTranslations = useMemo(() => {
    return [...wordPairs].sort(() => 0.5 - Math.random());
  }, [wordPairs]);

  const verifyMatch = (term: string, translation: string) => {
    const pair = wordPairs.find((p) => p.term === term);
    if (pair && pair.translation === translation) {
      const nextMatched = [...matchedPairs, term];
      setMatchedPairs(nextMatched);
      onCorrect(10);
      setSelectedTerm(null);
      setSelectedTranslation(null);

      if (nextMatched.length === wordPairs.length) {
        onWin();
      }
    } else {
      setMistakeFlash(term);
      setTimeout(() => setMistakeFlash(null), 700);
      setSelectedTerm(null);
      setSelectedTranslation(null);
      onMistake();
    }
  };

  const handleTermClick = (term: string) => {
    if (matchedPairs.includes(term)) return;
    setSelectedTerm(term);
    if (selectedTranslation) {
      verifyMatch(term, selectedTranslation);
    }
  };

  const handleTranslationClick = (translation: string) => {
    const pair = wordPairs.find((p) => p.translation === translation);
    if (!pair || matchedPairs.includes(pair.term)) return;
    setSelectedTranslation(translation);
    if (selectedTerm) {
      verifyMatch(selectedTerm, translation);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between text-slate-muted text-[11px] font-semibold px-1">
        <span>Término en Inglés</span>
        <span>Traducción en Español</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {/* Términos */}
        <div className="space-y-2">
          {wordPairs.map((p) => {
            const isMatched = matchedPairs.includes(p.term);
            const isSelected = selectedTerm === p.term;
            const isError = mistakeFlash === p.term;

            return (
              <button
                key={p.term}
                type="button"
                disabled={isMatched}
                onClick={() => handleTermClick(p.term)}
                className={`w-full p-2.5 rounded-xl font-bold text-xs text-left transition-all border cursor-pointer ${
                  isMatched
                    ? "bg-emerald-brand/10 border-emerald-brand/40 text-emerald-brand opacity-60"
                    : isError
                    ? "bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse"
                    : isSelected
                    ? "bg-mint-brand/20 border-mint-brand text-white shadow-sm"
                    : "bg-card border-border-default text-slate-200 hover:border-slate-500"
                }`}
              >
                {p.term}
              </button>
            );
          })}
        </div>

        {/* Traducciones */}
        <div className="space-y-2">
          {shuffledTranslations.map((p) => {
            const isMatched = matchedPairs.includes(p.term);
            const isSelected = selectedTranslation === p.translation;

            return (
              <button
                key={p.translation}
                type="button"
                disabled={isMatched}
                onClick={() => handleTranslationClick(p.translation)}
                className={`w-full p-2.5 rounded-xl font-bold text-xs text-left transition-all border cursor-pointer ${
                  isMatched
                    ? "bg-emerald-brand/10 border-emerald-brand/40 text-emerald-brand opacity-60"
                    : isSelected
                    ? "bg-mint-brand/20 border-mint-brand text-white shadow-sm"
                    : "bg-card border-border-default text-slate-200 hover:border-slate-500"
                }`}
              >
                {p.translation}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
