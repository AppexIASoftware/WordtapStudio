"use client";

import { useState } from "react";
import Link from "next/link";
import { HEATMAP_TERMS } from "../data/mock-teacher-data";
import { HeatmapItem } from "../types";
import { ChevronRight, X, Sparkles, AlertCircle } from "lucide-react";

export function TeacherDifficultyHeatmap() {
  const [selectedTerm, setSelectedTerm] = useState<HeatmapItem | null>(null);

  return (
    <div className="p-6 rounded-2xl bg-card border border-border-default space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Heatmap de Dificultad en Puzzles & Juegos</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-dark/60 text-emerald-brand border border-emerald-brand/30 font-bold">
              Algoritmo SRS
            </span>
          </h3>
          <p className="text-xs text-slate-muted mt-0.5">
            Términos con mayor tasa de error en &apos;WordMatch&apos; y &apos;WordMemory&apos;. Haz clic en cualquier término para generar un refuerzo.
          </p>
        </div>
        <Link
          href="/teacher/vault"
          className="text-xs font-semibold text-emerald-brand hover:text-mint-brand transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Ver todo el vocabulario</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Cuadrícula de tarjetas de términos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {HEATMAP_TERMS.map((item) => {
          const isCritical = item.status === "critical";
          const isWarning = item.status === "warning";

          const borderClass = isCritical
            ? "border-rose-500/30 hover:border-rose-500"
            : isWarning
            ? "border-amber-500/30 hover:border-amber-500"
            : "border-border-default hover:border-border-subtle";

          const textClass = isCritical
            ? "group-hover:text-rose-400"
            : isWarning
            ? "group-hover:text-amber-400"
            : "group-hover:text-emerald-400";

          const badgeClass = isCritical
            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
            : isWarning
            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
            : "bg-card text-slate-muted border-border-default";

          const progressBg = isCritical
            ? "bg-rose-500"
            : isWarning
            ? "bg-amber-500"
            : "bg-emerald-brand";

          return (
            <div
              key={item.term}
              onClick={() => setSelectedTerm(item)}
              className={`p-3.5 rounded-xl bg-canvas border ${borderClass} transition-all cursor-pointer group`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold text-white ${textClass} transition-colors`}>
                  {item.term}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${badgeClass}`}
                >
                  {item.errorRate}% Fallos
                </span>
              </div>
              <p className="text-xs text-slate-muted mt-1">
                {item.phonetics} • {item.grammarType}
              </p>
              <div className="mt-2.5 h-1.5 w-full bg-card rounded-full overflow-hidden">
                <div
                  className={`h-full ${progressBg} rounded-full`}
                  style={{ width: `${item.errorRate}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Detalle de Tropiezo en Heatmap */}
      {selectedTerm && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border-default rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedTerm(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-canvas border border-border-default text-slate-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {selectedTerm.errorRate}% Tasa de Error
                </span>
                <span className="text-xs text-slate-subtle font-mono">Algoritmo SM-2</span>
              </div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>{selectedTerm.term}</span>
                <span className="text-xs font-mono text-mint-brand">{selectedTerm.phonetics}</span>
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {selectedTerm.translation}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-canvas border border-border-default space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <AlertCircle className="w-4 h-4" />
                <span>Patrón de Confusión Detectado</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedTerm.note}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-muted">
              <div className="flex justify-between">
                <span>Tipo gramatical:</span>
                <strong className="text-white">{selectedTerm.grammarType}</strong>
              </div>
              <div className="flex justify-between">
                <span>Intervalo recomendado SRS:</span>
                <strong className="text-emerald-brand font-mono">1 día (Repaso Urgente)</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setSelectedTerm(null)}
                className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 text-xs font-semibold hover:text-white"
              >
                Cerrar
              </button>
              <Link
                href="/teacher/builder"
                className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas text-xs font-bold hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generar Refuerzo en Creador</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

