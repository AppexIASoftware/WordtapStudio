"use client";

import { useState, useMemo } from "react";
import { SandboxEngineProps } from "./sandbox-types";
import { Check, X, Zap } from "lucide-react";

export function SandboxSpeed({
  wordPairs,
  onCorrect,
  onMistake,
  onWin,
}: SandboxEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPair = wordPairs[currentIndex] || wordPairs[0];

  // Determinar si la traducción mostrada es la real o una trampa
  const [isMatchChallenge, setIsMatchChallenge] = useState(true);
  const [displayedTranslation, setDisplayedTranslation] = useState(currentPair?.translation || "");

  useMemo(() => {
    if (!currentPair) return;
    const shouldMatch = Math.random() > 0.45;
    setIsMatchChallenge(shouldMatch);
    if (shouldMatch) {
      setDisplayedTranslation(currentPair.translation);
    } else {
      const others = wordPairs.filter((p) => p.term !== currentPair.term);
      const fallback = others.length > 0 ? others[Math.floor(Math.random() * others.length)].translation : currentPair.translation;
      setDisplayedTranslation(fallback);
    }
  }, [currentIndex, currentPair, wordPairs]);

  const handleAnswer = (userSaysMatch: boolean) => {
    const isCorrect = userSaysMatch === isMatchChallenge;
    if (isCorrect) {
      onCorrect(10);
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
        <span>Ronda Rápida {currentIndex + 1} de {wordPairs.length}</span>
        <span className="text-amber-300 flex items-center gap-1 font-mono text-[10px]">
          <Zap className="w-3 h-3 fill-current" /> Speed Match
        </span>
      </div>

      <div className="p-6 bg-canvas/80 rounded-2xl border border-border-default/60 space-y-2">
        <h4 className="text-2xl font-black text-white font-mono tracking-wider">
          {currentPair.term}
        </h4>
        <div className="text-xs text-slate-muted font-mono">=</div>
        <p className="text-lg font-bold text-mint-brand">
          &quot;{displayedTranslation}&quot;
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={() => handleAnswer(false)}
          className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 hover:bg-rose-500/25 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <X className="w-4 h-4 stroke-[3]" />
          <span>Falso</span>
        </button>
        <button
          type="button"
          onClick={() => handleAnswer(true)}
          className="p-3.5 rounded-xl bg-emerald-brand/15 border border-emerald-brand/40 hover:bg-emerald-brand/25 text-emerald-brand font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Correcto</span>
        </button>
      </div>
    </div>
  );
}
