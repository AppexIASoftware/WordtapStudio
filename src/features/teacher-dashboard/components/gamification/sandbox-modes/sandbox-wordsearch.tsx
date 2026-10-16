"use client";

import { useState } from "react";
import { SandboxEngineProps } from "./sandbox-types";
import { Check, Sparkles } from "lucide-react";

// Sopa de letras precalculada 6x6
// F L U E N C
// Y M A S T E
// R X P A T I
// E N C E O L
// S I L I E N
// C E Z Z Z Z
const GRID_LETTERS = [
  ["F", "L", "U", "E", "N", "C"],
  ["Y", "M", "A", "S", "T", "E"],
  ["R", "X", "P", "A", "T", "I"],
  ["E", "N", "C", "E", "O", "L"],
  ["S", "I", "L", "I", "E", "N"],
  ["C", "E", "G", "O", "A", "L"],
];

const TARGET_WORDS = ["FLUENCY", "MASTERY", "GOAL"];

export function SandboxWordSearch({
  onCorrect,
  onMistake,
  onWin,
}: SandboxEngineProps) {
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string>("");

  const handleLetterClick = (letter: string) => {
    const next = selectedWord + letter;
    setSelectedWord(next);

    // Verificar si coincide con alguna palabra objetivo
    if (TARGET_WORDS.includes(next) && !foundWords.includes(next)) {
      const nextFound = [...foundWords, next];
      setFoundWords(nextFound);
      setSelectedWord("");
      onCorrect(25);

      if (nextFound.length === TARGET_WORDS.length) {
        onWin();
      }
    } else if (next.length > 7) {
      // Excedió longitud máxima posible
      setSelectedWord("");
      onMistake();
    }
  };

  const handleClear = () => {
    setSelectedWord("");
  };

  return (
    <div className="w-full space-y-4 text-center">
      <div className="flex justify-between items-center text-slate-muted text-[11px] font-semibold px-1">
        <span>Sopa de Letras ({foundWords.length}/{TARGET_WORDS.length} palabras)</span>
        <span className="text-mint-brand font-mono text-[10px] flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Matriz 6x6
        </span>
      </div>

      {/* Lista de palabras a encontrar */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {TARGET_WORDS.map((w) => {
          const isFound = foundWords.includes(w);
          return (
            <span
              key={w}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 border ${
                isFound
                  ? "bg-emerald-brand/20 border-emerald-brand text-emerald-brand line-through"
                  : "bg-card border-border-default text-slate-300"
              }`}
            >
              {isFound && <Check className="w-3 h-3" />}
              {w}
            </span>
          );
        })}
      </div>

      {/* Cuadrícula 6x6 */}
      <div className="inline-grid grid-cols-6 gap-1.5 p-3 bg-canvas/80 rounded-2xl border border-border-default/60 mx-auto">
        {GRID_LETTERS.map((row, rIdx) =>
          row.map((letter, cIdx) => (
            <button
              key={`${rIdx}-${cIdx}`}
              type="button"
              onClick={() => handleLetterClick(letter)}
              className="w-9 h-9 rounded-xl bg-card border border-border-default hover:border-mint-brand text-white font-mono font-bold text-sm transition-all cursor-pointer active:scale-90"
            >
              {letter}
            </button>
          ))
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs">
        <span className="text-slate-muted font-mono">Selección actual:</span>
        <span className="font-mono font-bold text-mint-brand px-2 py-0.5 rounded bg-card border border-border-default">
          {selectedWord || "..."}
        </span>
        {selectedWord && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[10px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
