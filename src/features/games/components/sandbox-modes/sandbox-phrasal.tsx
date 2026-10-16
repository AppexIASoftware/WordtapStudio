"use client";

import { useState } from "react";
import { SandboxEngineProps } from "./sandbox-types";
import { ArrowRight, Sparkles } from "lucide-react";

const PHRASAL_ITEMS = [
  { meaning: "Despegar (avión) o quitarse prenda", verb: "Take", particle: "off" },
  { meaning: "Levantarse de la cama por la mañana", verb: "Get", particle: "up" },
  { meaning: "Rendirse o abandonar una meta", verb: "Give", particle: "up" },
  { meaning: "Continuar a pesar de la dificultad", verb: "Keep", particle: "on" },
  { meaning: "Enterarse o descubrir un hecho", verb: "Find", particle: "out" },
];

const VERB_OPTIONS = ["Take", "Get", "Give", "Keep", "Find"];
const PARTICLE_OPTIONS = ["off", "up", "on", "out", "away"];

export function SandboxPhrasal({
  onCorrect,
  onMistake,
  onWin,
}: SandboxEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = PHRASAL_ITEMS[currentIndex] || PHRASAL_ITEMS[0];

  const [selectedVerb, setSelectedVerb] = useState<string | null>(null);
  const [selectedParticle, setSelectedParticle] = useState<string | null>(null);
  const [mistakeFlash, setMistakeFlash] = useState(false);

  const verifyAnswer = (v: string, p: string) => {
    if (v === current.verb && p === current.particle) {
      onCorrect(20);
      setSelectedVerb(null);
      setSelectedParticle(null);
      if (currentIndex + 1 >= PHRASAL_ITEMS.length) {
        onWin();
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    } else {
      setMistakeFlash(true);
      setTimeout(() => {
        setMistakeFlash(false);
        setSelectedVerb(null);
        setSelectedParticle(null);
        onMistake();
      }, 700);
    }
  };

  const handleVerbClick = (v: string) => {
    setSelectedVerb(v);
    if (selectedParticle) {
      verifyAnswer(v, selectedParticle);
    }
  };

  const handleParticleClick = (p: string) => {
    setSelectedParticle(p);
    if (selectedVerb) {
      verifyAnswer(selectedVerb, p);
    }
  };

  return (
    <div className="w-full space-y-4 text-center">
      <div className="flex justify-between items-center text-slate-muted text-[11px] font-semibold px-1">
        <span>Phrasal Verbs: Reto {currentIndex + 1} de {PHRASAL_ITEMS.length}</span>
        <span className="text-amber-300 font-mono text-[10px] flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Verbo + Partícula
        </span>
      </div>

      <div className="p-4 bg-canvas/80 rounded-2xl border border-border-default/60 space-y-1">
        <span className="text-[10px] text-slate-muted uppercase font-mono">Significado Pedagógico</span>
        <p className="text-sm font-bold text-white">&quot;{current.meaning}&quot;</p>
      </div>

      {/* Visor de combinación */}
      <div className="flex items-center justify-center gap-2 font-mono text-sm font-bold">
        <div
          className={`px-4 py-2 rounded-xl border ${
            selectedVerb
              ? mistakeFlash
                ? "bg-rose-500/20 border-rose-500 text-rose-300"
                : "bg-mint-brand/20 border-mint-brand text-white"
              : "bg-card border-dashed border-slate-700 text-slate-500"
          }`}
        >
          {selectedVerb || "Verbo Base"}
        </div>
        <ArrowRight className="w-4 h-4 text-slate-500" />
        <div
          className={`px-4 py-2 rounded-xl border ${
            selectedParticle
              ? mistakeFlash
                ? "bg-rose-500/20 border-rose-500 text-rose-300"
                : "bg-mint-brand/20 border-mint-brand text-white"
              : "bg-card border-dashed border-slate-700 text-slate-500"
          }`}
        >
          {selectedParticle || "Partícula"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-muted font-mono block text-left">Paso 1: Elige Verbo</span>
          {VERB_OPTIONS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => handleVerbClick(v)}
              className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all border cursor-pointer ${
                selectedVerb === v
                  ? "bg-mint-brand/20 border-mint-brand text-white"
                  : "bg-card border-border-default text-slate-300 hover:border-slate-500"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-muted font-mono block text-left">Paso 2: Elige Partícula</span>
          {PARTICLE_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleParticleClick(p)}
              className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all border cursor-pointer ${
                selectedParticle === p
                  ? "bg-mint-brand/20 border-mint-brand text-white"
                  : "bg-card border-border-default text-slate-300 hover:border-slate-500"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
