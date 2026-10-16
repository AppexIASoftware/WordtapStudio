"use client";

import { useState, useMemo, useEffect } from "react";
import { SandboxEngineProps } from "./sandbox-types";
import { RotateCcw, Delete } from "lucide-react";

interface LetterTile {
  id: string;
  char: string;
}

export function SandboxScramble({
  wordPairs,
  onCorrect,
  onMistake,
  onWin,
}: SandboxEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPair = wordPairs[currentIndex] || wordPairs[0];

  // Letras del término en mayúsculas
  const targetWord = (currentPair?.term || "").toUpperCase().replace(/[^A-Z]/g, "");

  // Crear pool de fichas de letras barajadas
  const letterPool = useMemo<LetterTile[]>(() => {
    return targetWord
      .split("")
      .map((char, idx) => ({ id: `${char}-${idx}`, char }))
      .sort(() => 0.5 - Math.random());
  }, [targetWord]);

  const [selectedTiles, setSelectedTiles] = useState<LetterTile[]>([]);
  const [mistakeFlash, setMistakeFlash] = useState(false);

  useEffect(() => {
    setSelectedTiles([]);
  }, [currentIndex]);

  const availableTiles = useMemo(() => {
    const selectedIds = new Set(selectedTiles.map((t) => t.id));
    return letterPool.filter((t) => !selectedIds.has(t.id));
  }, [letterPool, selectedTiles]);

  const handleTileClick = (tile: LetterTile) => {
    const nextSelected = [...selectedTiles, tile];
    setSelectedTiles(nextSelected);

    // Si completó la longitud esperada
    if (nextSelected.length === targetWord.length) {
      const formedWord = nextSelected.map((t) => t.char).join("");
      if (formedWord === targetWord) {
        onCorrect(20);
        if (currentIndex + 1 >= wordPairs.length) {
          onWin();
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      } else {
        setMistakeFlash(true);
        setTimeout(() => {
          setMistakeFlash(false);
          setSelectedTiles([]);
          onMistake();
        }, 700);
      }
    }
  };

  const handleRemoveLast = () => {
    setSelectedTiles((prev) => prev.slice(0, prev.length - 1));
  };

  const handleReset = () => {
    setSelectedTiles([]);
  };

  if (!currentPair) return null;

  return (
    <div className="w-full space-y-4 text-center">
      <div className="flex justify-between items-center text-slate-muted text-[11px] font-semibold px-1">
        <span>Anagrama {currentIndex + 1} de {wordPairs.length}</span>
        <span className="text-amber-300 font-mono text-[10px]">
          Pista: {currentPair.translation}
        </span>
      </div>

      {/* Ranuras de la palabra armada */}
      <div className="py-2">
        <div className="flex flex-wrap items-center justify-center gap-1.5 min-h-[48px]">
          {Array.from({ length: targetWord.length }).map((_, idx) => {
            const tile = selectedTiles[idx];
            return (
              <div
                key={idx}
                className={`w-9 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-base transition-all border ${
                  tile
                    ? mistakeFlash
                      ? "bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse"
                      : "bg-mint-brand/20 border-mint-brand text-white shadow-sm"
                    : "bg-canvas border-dashed border-slate-700 text-transparent"
                }`}
              >
                {tile ? tile.char : "_"}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pool de letras barajadas */}
      <div className="space-y-2">
        <span className="text-[10px] text-slate-muted uppercase font-mono block">
          Toca las letras en el orden correcto
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {availableTiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              onClick={() => handleTileClick(tile)}
              className="w-10 h-10 rounded-xl bg-card border border-border-default hover:border-mint-brand text-slate-200 hover:text-white font-mono font-bold text-sm transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {tile.char}
            </button>
          ))}
        </div>
      </div>

      {/* Acciones de edición */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleRemoveLast}
          disabled={selectedTiles.length === 0}
          className="px-3 py-1.5 rounded-lg bg-card border border-border-default hover:border-slate-500 text-[11px] text-slate-300 flex items-center gap-1 cursor-pointer disabled:opacity-40"
        >
          <Delete className="w-3.5 h-3.5" />
          <span>Borrar Letra</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={selectedTiles.length === 0}
          className="px-3 py-1.5 rounded-lg bg-card border border-border-default hover:border-slate-500 text-[11px] text-slate-300 flex items-center gap-1 cursor-pointer disabled:opacity-40"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar</span>
        </button>
      </div>
    </div>
  );
}
