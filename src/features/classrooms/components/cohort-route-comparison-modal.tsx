"use client";

import { X, BookOpen, Zap, Check, ArrowRight } from "lucide-react";

interface CohortRouteComparisonModalProps {
  isOpen: boolean;
  activeMode: "lessons" | "challenges";
  onSelectMode: (mode: "lessons" | "challenges") => void;
  onClose: () => void;
}

export function CohortRouteComparisonModal({
  isOpen,
  activeMode,
  onSelectMode,
  onClose,
}: CohortRouteComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-card border border-border-default rounded-2xl shadow-xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-border-default pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Comparativa de Rutas Pedagógicas</span>
            </h3>
            <p className="text-xs text-slate-muted mt-0.5">
              Elige la estructura que mejor se adapte al ritmo y objetivos de tu cohorte.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-canvas transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tarjeta Ruta Curricular */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
              activeMode === "lessons"
                ? "bg-emerald-brand/10 border-emerald-brand/50 shadow-sm"
                : "bg-canvas border-border-default hover:border-slate-600"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Ruta por Lecciones</h4>
                    <span className="text-[10px] text-emerald-400 font-mono">Modo Curricular</span>
                  </div>
                </div>
                {activeMode === "lessons" && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/30">
                    Activa
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300">
                Estructura secuencial 1:1. Cada lección introduce conceptos teóricos y se fija de inmediato con un minijuego específico.
              </p>

              <div className="space-y-2 pt-2 border-t border-border-default/60 text-[11px]">
                <div className="flex items-start gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-brand shrink-0 mt-0.5" />
                  <span><strong>Estructura:</strong> Lección teórica (15 min) + minijuego de fijación (60 seg).</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-brand shrink-0 mt-0.5" />
                  <span><strong>Ritmo:</strong> Progresión formal guiada clase por clase.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-brand shrink-0 mt-0.5" />
                  <span><strong>Ideal para:</strong> Seguir temario curricular y tareas semanales estructuradas.</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectMode("lessons");
                onClose();
              }}
              className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === "lessons"
                  ? "bg-emerald-brand text-canvas"
                  : "bg-card border border-border-default text-white hover:bg-emerald-brand hover:text-canvas"
              }`}
            >
              <span>{activeMode === "lessons" ? "Seleccionada" : "Usar Ruta Curricular"}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Tarjeta Ruta Gamificada */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
              activeMode === "challenges"
                ? "bg-amber-400/10 border-amber-400/50 shadow-sm"
                : "bg-canvas border-border-default hover:border-slate-600"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Ruta por Desafíos</h4>
                    <span className="text-[10px] text-amber-300 font-mono">Modo Gamificado</span>
                  </div>
                </div>
                {activeMode === "challenges" && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Activa
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300">
                Pista ágil de alta intensidad. Descompone todo el vocabulario en ráfagas de juego rápido y repetición adaptativa.
              </p>

              <div className="space-y-2 pt-2 border-t border-border-default/60 text-[11px]">
                <div className="flex items-start gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Estructura:</strong> Batería de micro-retos (45-90 seg) con fonética, reflejos y quiz.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Ritmo:</strong> Práctica autónoma dinámica con refuerzo de tropiezos.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Ideal para:</strong> Activación previa a evaluaciones y memorización acelerada.</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectMode("challenges");
                onClose();
              }}
              className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === "challenges"
                  ? "bg-amber-400 text-canvas"
                  : "bg-card border border-border-default text-white hover:bg-amber-400 hover:text-canvas"
              }`}
            >
              <span>{activeMode === "challenges" ? "Seleccionada" : "Usar Ruta Gamificada"}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
