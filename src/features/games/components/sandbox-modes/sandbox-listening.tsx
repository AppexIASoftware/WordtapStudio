"use client";

import { useState, useMemo, useEffect } from "react";
import { useSpeak } from "@/hooks/use-speak";
import { SandboxEngineProps } from "./sandbox-types";
import { Volume2, VolumeX, Sparkles } from "lucide-react";

export function SandboxListening({
  wordPairs,
  onCorrect,
  onMistake,
  onWin,
}: SandboxEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentPair = wordPairs[currentIndex] || wordPairs[0];

  const playAudio = useSpeak({
    rate: 0.85,
    onStart: () => setIsPlayingAudio(true),
    onEnd: () => setIsPlayingAudio(false),
  });

  // Reproducir automáticamente al cambiar de palabra
  useEffect(() => {
    if (currentPair) {
      playAudio(currentPair.term);
    }
  }, [currentIndex, currentPair, playAudio]);

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
        <span>Desafío Auditivo: Pregunta {currentIndex + 1} de {wordPairs.length}</span>
        <span className="text-mint-brand flex items-center gap-1 font-mono text-[10px]">
          <Sparkles className="w-3 h-3" /> Audio Pronunciation
        </span>
      </div>

      <div className="py-4">
        <button
          type="button"
          onClick={() => playAudio(currentPair.term)}
          className={`w-20 h-20 mx-auto rounded-3xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-lg ${
            isPlayingAudio
              ? "bg-mint-brand text-canvas ring-4 ring-mint-brand/30 scale-105"
              : "bg-emerald-brand text-canvas hover:bg-mint-brand shadow-glow-emerald"
          }`}
          title="Escuchar pronunciación"
        >
          {isPlayingAudio ? (
            <Volume2 className="w-8 h-8 animate-bounce" />
          ) : (
            <Volume2 className="w-8 h-8" />
          )}
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">
            {isPlayingAudio ? "Sonando..." : "Escuchar"}
          </span>
        </button>
        <p className="text-[11px] text-slate-muted mt-2">
          Haz clic para volver a escuchar el audio en inglés
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        {options.map((opt) => (
          <button
            key={opt.translation}
            type="button"
            onClick={() => handleSelect(opt.translation)}
            className="p-3 rounded-xl bg-card border border-border-default hover:border-mint-brand text-slate-200 hover:text-white font-bold text-xs transition-colors cursor-pointer"
          >
            {opt.translation}
          </button>
        ))}
      </div>
    </div>
  );
}
