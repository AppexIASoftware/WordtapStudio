"use client";

import { useState } from "react";
import { SandboxEngineProps } from "./sandbox-types";
import { Sparkles, Check } from "lucide-react";

interface CrosswordClue {
  id: number;
  direction: "H" | "V";
  word: string;
  clue: string;
}

const CLUES: CrosswordClue[] = [
  { id: 1, direction: "H", word: "FLUENCY", clue: "Capacidad de expresarse con fluidez y naturalidad" },
  { id: 2, direction: "V", word: "MASTERY", clue: "Dominio supremo o destreza en un idioma" },
  { id: 3, direction: "H", word: "PATIENCE", clue: "Virtud necesaria para aprender sin frustración" },
];

export function SandboxCrossword({
  onCorrect,
  onMistake,
  onWin,
}: SandboxEngineProps) {
  const [solvedIds, setSolvedIds] = useState<number[]>([]);
  const [selectedClue, setSelectedClue] = useState<CrosswordClue>(CLUES[0]);
  const [inputVal, setInputVal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim().toUpperCase() === selectedClue.word) {
      const nextSolved = [...solvedIds, selectedClue.id];
      setSolvedIds(nextSolved);
      setInputVal("");
      onCorrect(25);

      if (nextSolved.length === CLUES.length) {
        onWin();
      } else {
        const nextClue = CLUES.find((c) => !nextSolved.includes(c.id));
        if (nextClue) setSelectedClue(nextClue);
      }
    } else {
      onMistake();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center text-slate-muted text-[11px] font-semibold px-1">
        <span>Crucigrama Temático ({solvedIds.length}/{CLUES.length} resueltas)</span>
        <span className="text-mint-brand font-mono text-[10px] flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Pistas Cruzadas
        </span>
      </div>

      {/* Selector de pistas */}
      <div className="space-y-2">
        {CLUES.map((clue) => {
          const isSolved = solvedIds.includes(clue.id);
          const isSelected = selectedClue.id === clue.id;

          return (
            <button
              key={clue.id}
              type="button"
              onClick={() => {
                setSelectedClue(clue);
                setInputVal("");
              }}
              className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between text-xs transition-all cursor-pointer ${
                isSolved
                  ? "bg-emerald-brand/10 border-emerald-brand/40 text-emerald-brand"
                  : isSelected
                  ? "bg-mint-brand/20 border-mint-brand text-white shadow-sm"
                  : "bg-card border-border-default text-slate-300 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-canvas font-mono font-bold text-[10px] flex items-center justify-center">
                  {clue.id}{clue.direction}
                </span>
                <span className="line-clamp-1">{clue.clue}</span>
              </div>
              {isSolved && <Check className="w-4 h-4 text-emerald-brand shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Input de respuesta para la pista seleccionada */}
      <form onSubmit={handleSubmit} className="p-4 bg-canvas/80 rounded-2xl border border-border-default/60 space-y-3">
        <div className="flex justify-between items-center text-[11px]">
          <span className="font-bold text-mint-brand font-mono">
            Pista #{selectedClue.id} ({selectedClue.direction === "H" ? "Horizontal" : "Vertical"}):
          </span>
          <span className="text-slate-muted font-mono">{selectedClue.word.length} letras</span>
        </div>
        <p className="text-xs text-white text-left">&quot;{selectedClue.clue}&quot;</p>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value.toUpperCase())}
            placeholder={`Escribe ${selectedClue.word.length} letras...`}
            maxLength={selectedClue.word.length}
            disabled={solvedIds.includes(selectedClue.id)}
            className="w-full px-3 py-2 rounded-xl bg-card border border-border-default text-white font-mono uppercase text-xs focus:outline-none focus:border-mint-brand"
          />
          <button
            type="submit"
            disabled={solvedIds.includes(selectedClue.id) || !inputVal.trim()}
            className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer disabled:opacity-40"
          >
            Validar
          </button>
        </div>
      </form>
    </div>
  );
}
