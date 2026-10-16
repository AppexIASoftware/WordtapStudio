"use client";

import { useState, useMemo, useEffect } from "react";
import { SandboxEngineProps } from "./sandbox-types";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function SandboxHangman({
  wordPairs,
  onCorrect,
  onMistake,
  onWin,
}: SandboxEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPair = wordPairs[currentIndex] || wordPairs[0];

  const targetWord = (currentPair?.term || "").toUpperCase().replace(/[^A-Z]/g, "");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  useEffect(() => {
    setGuessedLetters([]);
  }, [currentIndex]);

  const isWordRevealed = useMemo(() => {
    return targetWord.split("").every((ch) => guessedLetters.includes(ch));
  }, [targetWord, guessedLetters]);

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter)) return;
    const nextGuessed = [...guessedLetters, letter];
    setGuessedLetters(nextGuessed);

    if (targetWord.includes(letter)) {
      // Letra correcta
      const allDone = targetWord.split("").every((ch) => nextGuessed.includes(ch));
      if (allDone) {
        onCorrect(20);
        if (currentIndex + 1 >= wordPairs.length) {
          onWin();
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }
    } else {
      // Letra incorrecta
      onMistake();
    }
  };

  if (!currentPair) return null;

  return (
    <div className="w-full space-y-4 text-center">
      <div className="flex justify-between items-center text-slate-muted text-[11px] font-semibold px-1">
        <span>Ahorcado Fonético {currentIndex + 1} de {wordPairs.length}</span>
        <span className="text-amber-300 font-mono text-[10px]">
          Pista: {currentPair.translation}
        </span>
      </div>

      {/* Letras descubiertas */}
      <div className="py-3 flex justify-center items-center gap-2">
        {targetWord.split("").map((ch, idx) => {
          const revealed = guessedLetters.includes(ch);
          return (
            <div
              key={idx}
              className={`w-9 h-11 border-b-2 font-mono font-black text-xl flex items-center justify-center transition-all ${
                revealed
                  ? "border-mint-brand text-white"
                  : "border-slate-600 text-transparent"
              }`}
            >
              {revealed ? ch : "_"}
            </div>
          );
        })}
      </div>

      {/* Teclado A-Z */}
      <div className="flex flex-wrap justify-center gap-1.5 max-w-sm mx-auto pt-2">
        {ALPHABET.map((letter) => {
          const isGuessed = guessedLetters.includes(letter);
          const isCorrect = isGuessed && targetWord.includes(letter);
          const isWrong = isGuessed && !targetWord.includes(letter);

          return (
            <button
              key={letter}
              type="button"
              disabled={isGuessed}
              onClick={() => handleGuess(letter)}
              className={`w-7 h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                isCorrect
                  ? "bg-emerald-brand/30 border border-emerald-brand text-emerald-brand"
                  : isWrong
                  ? "bg-rose-500/20 border border-rose-500/40 text-rose-400 opacity-40 cursor-not-allowed"
                  : "bg-card border border-border-default text-slate-200 hover:border-mint-brand hover:text-white"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
