"use client";

import { useState, useMemo } from "react";
import { SandboxEngineProps } from "./sandbox-types";

export function SandboxTrivia({
  wordPairs,
  onCorrect,
  onMistake,
  onWin,
}: SandboxEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPair = wordPairs[currentIndex] || wordPairs[0];

  const options = useMemo(() => {
    if (!currentPair) return [];
    const others = wordPairs.filter((p) => p.term !== currentPair.term);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    return [currentPair, ...shuffledOthers].sort(() => 0.5 - Math.random());
  }, [wordPairs, currentPair]);

  const handleSelect = (translation: string) => {
    if (translation === currentPair.translation) {
      onCorrect(15);
      if (currentIndex + 1 >= wordPairs.length) {
        onWin();
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    } else {
      onMistake();
    }
  };

  if (!currentPair) return null;

  return (
    <div className="w-full space-y-4 text-center">
      <div className="flex justify-between items-center text-slate-muted text-[11px] font-semibold px-1">
        <span>Trivia Quiz: Pregunta {currentIndex + 1} de {wordPairs.length}</span>
        <span className="text-emerald-brand font-mono text-[10px]">
          Selecciona la traducción correcta
        </span>
      </div>

      <div className="p-4 bg-canvas/80 rounded-2xl border border-border-default/60">
        <span className="text-[10px] text-slate-muted font-mono uppercase block mb-1">
          Término en Evaluación
        </span>
        <h4 className="text-2xl font-bold text-white font-mono tracking-wide">
          {currentPair.term}
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {options.map((opt, i) => (
          <button
            key={opt.translation}
            type="button"
            onClick={() => handleSelect(opt.translation)}
            className="p-3 rounded-xl bg-card border border-border-default hover:border-mint-brand text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center justify-between cursor-pointer group"
          >
            <span className="text-[10px] font-mono text-slate-muted group-hover:text-mint-brand">
              0{i + 1}.
            </span>
            <span>{opt.translation}</span>
            <span className="w-2" />
          </button>
        ))}
      </div>
    </div>
  );
}
