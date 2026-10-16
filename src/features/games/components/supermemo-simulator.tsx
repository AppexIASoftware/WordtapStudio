"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";

interface SupermemoSimulatorProps {
  onSaveConfig?: (ef: number, q: number, reps: number) => void;
}

export function SupermemoSimulator({ onSaveConfig }: SupermemoSimulatorProps) {
  const [easeFactor, setEaseFactor] = useState(2.5);
  const [quality, setQuality] = useState(4);
  const [repetitions, setRepetitions] = useState(3);
  const [savedNotice, setSavedNotice] = useState(false);

  // Cálculo didáctico de la fórmula SuperMemo SM-2
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const newEaseFactor = Math.max(
    1.3,
    parseFloat(
      (
        easeFactor +
        (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
      ).toFixed(2)
    )
  );

  // Cálculo de intervalo en días I(n)
  let calculatedInterval = 1;
  if (repetitions === 1) {
    calculatedInterval = 1;
  } else if (repetitions === 2) {
    calculatedInterval = 6;
  } else {
    calculatedInterval = Math.round(6 * Math.pow(newEaseFactor, repetitions - 2));
  }

  const handleSave = () => {
    if (onSaveConfig) {
      onSaveConfig(easeFactor, quality, repetitions);
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="p-6 rounded-2xl bg-card border border-border-default space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-default pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-brand" />
            <span>Calibrador Pedagógico de Repaso</span>
          </h3>
          <p className="text-xs text-slate-muted mt-0.5">
            Simula cómo los fallos y aciertos en los minijuegos recalculan los intervalos de repaso de vocabulario.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer"
        >
          {savedNotice ? "¡Parámetros Guardados!" : "Guardar Calibración"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-4 text-xs">
          {/* Slider 1: Ease Factor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-semibold">
                Factor de Facilidad Inicial (Ease Factor - EF):
              </span>
              <span className="font-mono font-bold text-emerald-brand text-sm">
                {easeFactor.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="1.3"
              max="3.0"
              step="0.1"
              value={easeFactor}
              onChange={(e) => setEaseFactor(parseFloat(e.target.value))}
              className="w-full accent-emerald-brand cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-subtle font-mono">
              <span>1.3 (Muy Difícil)</span>
              <span>2.5 (Estándar recomendado)</span>
              <span>3.0 (Muy Fácil)</span>
            </div>
          </div>

          {/* Slider 2: Response Quality */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-semibold">
                Calidad de Respuesta en el Minijuego (Calificación 0 a 5):
              </span>
              <span className="font-mono font-bold text-mint-brand text-sm">
                {quality} -{" "}
                {quality === 5
                  ? "Perfecto inmediato"
                  : quality === 4
                  ? "Respuesta Correcta Rápida"
                  : quality === 3
                  ? "Con esfuerzo"
                  : quality === 2
                  ? "Duda severa"
                  : quality === 1
                  ? "Respuesta incorrecta"
                  : "Olvido total"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full accent-mint-brand cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-subtle font-mono">
              <span>0: Olvido total</span>
              <span>3: Con esfuerzo</span>
              <span>5: Perfecto inmediato</span>
            </div>
          </div>

          {/* Slider 3: Repetitions */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-semibold">
                Número de Repetición Exitosa (n):
              </span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {repetitions}ª repetición
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={repetitions}
              onChange={(e) => setRepetitions(parseInt(e.target.value))}
              className="w-full accent-amber-300 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-subtle font-mono">
              <span>1ª vez (1 día)</span>
              <span>2ª vez (6 días)</span>
              <span>10ª vez (&gt;180 días)</span>
            </div>
          </div>
        </div>

        {/* Tarjeta de Resultados (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-canvas border border-border-default space-y-3.5 text-xs">
          <h4 className="font-bold text-white flex items-center justify-between">
            <span>Intervalo Resultante</span>
            <span className="text-[10px] font-mono text-emerald-brand font-bold">
              Modelo de Repaso
            </span>
          </h4>

          <div className="space-y-2 pt-1 border-t border-border-default">
            <div className="flex justify-between items-baseline">
              <span className="text-slate-muted">Próximo intervalo de repaso:</span>
              <span className="text-lg font-black font-mono text-emerald-brand">
                {calculatedInterval} {calculatedInterval === 1 ? "día" : "días"}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-slate-muted">Nuevo Factor de Facilidad:</span>
              <span className="font-mono font-bold text-white text-sm">
                {newEaseFactor.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-slate-muted">Impacto de la calificación:</span>
              <span
                className={`font-mono text-[11px] font-bold ${
                  quality >= 3 ? "text-emerald-brand" : "text-rose-400"
                }`}
              >
                {quality >= 3 ? "Intervalo Expandido" : "Refuerzo Prioritario"}
              </span>
            </div>
          </div>

          <div className="p-3 bg-card rounded-xl border border-border-default text-[11px] text-slate-300 space-y-1">
            <p className="font-semibold text-white">Comportamiento pedagógico:</p>
            <p className="text-[10px] text-slate-muted leading-relaxed">
              Si el alumno responde con rapidez y precisión en el minijuego (calidad 4 o 5), la palabra espaciará su intervalo. Si comete fallos recurrentes, se programa un refuerzo para la siguiente sesión de práctica.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
