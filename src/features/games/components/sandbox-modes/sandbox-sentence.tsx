"use client";

import { useState, useMemo, useEffect } from "react";
import { SandboxEngineProps } from "./sandbox-types";
import { RotateCcw, Delete, Sparkles } from "lucide-react";

const SAMPLE_SENTENCES = [
  { target: "She showed great resilience in adversity", translation: "Mostró gran resiliencia en la adversidad" },
  { target: "Practice brings flawless fluency over time", translation: "La práctica trae fluidez impecable con el tiempo" },
  { target: "Patience leads to true linguistic mastery", translation: "La paciencia conduce al verdadero dominio lingüístico" },
  { target: "Every small achievement builds your confidence", translation: "Cada pequeño logro construye tu confianza" },
];

export function SandboxSentence({
  onCorrect,
  onMistake,
  onWin,
}: SandboxEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSentence = SAMPLE_SENTENCES[currentIndex] || SAMPLE_SENTENCES[0];

  const targetTokens = useMemo(() => {
    return currentSentence.target.split(" ");
  }, [currentSentence]);

  const shuffledTokens = useMemo(() => {
    return targetTokens
      .map((word, idx) => ({ id: `${word}-${idx}`, word }))
      .sort(() => 0.5 - Math.random());
  }, [targetTokens]);

  const [selectedTokens, setSelectedTokens] = useState<{ id: string; word: string }[]>([]);
  const [mistakeFlash, setMistakeFlash] = useState(false);

  useEffect(() => {
    setSelectedTokens([]);
  }, [currentIndex]);

  const availableTokens = useMemo(() => {
    const selectedIds = new Set(selectedTokens.map((t) => t.id));
    return shuffledTokens.filter((t) => !selectedIds.has(t.id));
  }, [shuffledTokens, selectedTokens]);

  const handleTokenClick = (token: { id: string; word: string }) => {
    const nextSelected = [...selectedTokens, token];
    setSelectedTokens(nextSelected);

    if (nextSelected.length === targetTokens.length) {
      const assembled = nextSelected.map((t) => t.word).join(" ");
      if (assembled === currentSentence.target) {
        onCorrect(25);
        if (currentIndex + 1 >= SAMPLE_SENTENCES.length) {
          onWin();
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      } else {
        setMistakeFlash(true);
        setTimeout(() => {
          setMistakeFlash(false);
          setSelectedTokens([]);
          onMistake();
        }, 700);
      }
    }
  };

  const handleRemoveLast = () => {
    setSelectedTokens((prev) => prev.slice(0, prev.length - 1));
  };

  const handleReset = () => {
    setSelectedTokens([]);
  };

  return (
    <div className="w-full space-y-4 text-center">
      <div className="flex justify-between items-center text-slate-muted text-[11px] font-semibold px-1">
        <span>Sentence Builder: Oración {currentIndex + 1} de {SAMPLE_SENTENCES.length}</span>
        <span className="text-mint-brand flex items-center gap-1 font-mono text-[10px]">
          <Sparkles className="w-3 h-3" /> Sintaxis Gramatical
        </span>
      </div>

      <p className="text-xs text-amber-300 font-medium">
        Traduce construyendo: &quot;{currentSentence.translation}&quot;
      </p>

      {/* Área de oración construida */}
      <div className="p-4 bg-canvas/80 rounded-2xl border border-border-default/60 min-h-[64px] flex flex-wrap items-center justify-center gap-2">
        {selectedTokens.length === 0 ? (
          <span className="text-xs text-slate-500 italic">
            Haz clic en los bloques inferiores en el orden correcto
          </span>
        ) : (
          selectedTokens.map((tok, idx) => (
            <span
              key={idx}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-all ${
                mistakeFlash
                  ? "bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse"
                  : "bg-mint-brand/20 border-mint-brand text-white shadow-sm"
              }`}
            >
              {tok.word}
            </span>
          ))
        )}
      </div>

      {/* Bloques de palabras disponibles */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        {availableTokens.map((tok) => (
          <button
            key={tok.id}
            type="button"
            onClick={() => handleTokenClick(tok)}
            className="px-3.5 py-2 rounded-xl bg-card border border-border-default hover:border-mint-brand text-slate-200 hover:text-white font-semibold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
          >
            {tok.word}
          </button>
        ))}
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleRemoveLast}
          disabled={selectedTokens.length === 0}
          className="px-3 py-1.5 rounded-lg bg-card border border-border-default hover:border-slate-500 text-[11px] text-slate-300 flex items-center gap-1 cursor-pointer disabled:opacity-40"
        >
          <Delete className="w-3.5 h-3.5" />
          <span>Borrar Última</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={selectedTokens.length === 0}
          className="px-3 py-1.5 rounded-lg bg-card border border-border-default hover:border-slate-500 text-[11px] text-slate-300 flex items-center gap-1 cursor-pointer disabled:opacity-40"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar</span>
        </button>
      </div>
    </div>
  );
}
