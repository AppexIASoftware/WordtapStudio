"use client";

import { useState, useMemo, useEffect } from "react";
import { SandboxEngineProps } from "./sandbox-types";
import { Sparkles } from "lucide-react";

interface MemoryCard {
  id: string;
  pairKey: string;
  text: string;
  type: "term" | "trans";
}

export function SandboxMemory({
  wordPairs,
  onCorrect,
  onMistake,
  onWin,
}: SandboxEngineProps) {
  // Tomar hasta 6 pares para cuadrícula óptima de 8 a 12 cartas
  const activePairs = useMemo(() => wordPairs.slice(0, 6), [wordPairs]);

  const deck = useMemo<MemoryCard[]>(() => {
    const cards: MemoryCard[] = [];
    activePairs.forEach((p, idx) => {
      cards.push({ id: `term-${idx}`, pairKey: p.term, text: p.term, type: "term" });
      cards.push({ id: `trans-${idx}`, pairKey: p.term, text: p.translation, type: "trans" });
    });
    return cards.sort(() => 0.5 - Math.random());
  }, [activePairs]);

  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedKeys, setMatchedKeys] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleCardClick = (card: MemoryCard) => {
    if (isEvaluating || flippedIds.includes(card.id) || matchedKeys.includes(card.pairKey)) {
      return;
    }

    const nextFlipped = [...flippedIds, card.id];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setIsEvaluating(true);
      const firstCard = deck.find((c) => c.id === nextFlipped[0])!;
      const secondCard = deck.find((c) => c.id === nextFlipped[1])!;

      if (firstCard.pairKey === secondCard.pairKey && firstCard.type !== secondCard.type) {
        // Acierto
        setTimeout(() => {
          const nextMatched = [...matchedKeys, firstCard.pairKey];
          setMatchedKeys(nextMatched);
          setFlippedIds([]);
          setIsEvaluating(false);
          onCorrect(15);

          if (nextMatched.length === activePairs.length) {
            onWin();
          }
        }, 500);
      } else {
        // Fallo
        setTimeout(() => {
          setFlippedIds([]);
          setIsEvaluating(false);
          onMistake();
        }, 900);
      }
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-center text-slate-muted text-[11px] font-semibold px-1">
        <span>Encuentra las parejas ocultas ({matchedKeys.length}/{activePairs.length})</span>
        <span className="text-mint-brand flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Memoria Visual
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[260px] overflow-y-auto p-1">
        {deck.map((card) => {
          const isFlipped = flippedIds.includes(card.id);
          const isMatched = matchedKeys.includes(card.pairKey);

          return (
            <button
              key={card.id}
              type="button"
              disabled={isMatched || isEvaluating}
              onClick={() => handleCardClick(card)}
              className={`h-16 rounded-xl font-bold text-xs p-2 flex items-center justify-center text-center transition-all cursor-pointer border select-none ${
                isMatched
                  ? "bg-emerald-brand/15 border-emerald-brand/50 text-emerald-brand shadow-sm scale-95"
                  : isFlipped
                  ? "bg-mint-brand/20 border-mint-brand text-white shadow-md rotate-y-180"
                  : "bg-card border-border-default text-slate-400 hover:border-slate-500 hover:bg-canvas/80"
              }`}
            >
              {isFlipped || isMatched ? (
                <span className="line-clamp-2 text-[11px] leading-tight font-semibold">
                  {card.text}
                </span>
              ) : (
                <span className="text-slate-600 font-mono text-lg font-black">?</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
