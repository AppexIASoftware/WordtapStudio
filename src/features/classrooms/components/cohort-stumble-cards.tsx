"use client";

import Link from "next/link";
import { AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";
import { StumbleItem } from "@/features/teacher-dashboard/types";

interface CohortStumbleCardsProps {
  stumbles: StumbleItem[];
  studentsCount: number;
  isDemo?: boolean;
  onOpenReinforcementDrawer: () => void;
}

export function CohortStumbleCards({
  stumbles,
  studentsCount,
  isDemo = false,
  onOpenReinforcementDrawer,
}: CohortStumbleCardsProps) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-amber-500/30 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Diagnóstico Pedagógico del Aula: Términos Críticos</span>
              {isDemo && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Demo
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-muted">
              Palabras y estructuras donde los {studentsCount} alumnos presentan más del 40% de fallos en minijuegos.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenReinforcementDrawer}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generar Sesión de Refuerzo</span>
        </button>
      </div>

      {stumbles.length === 0 ? (
        <div className="p-4 rounded-xl bg-canvas border border-border-default flex items-center gap-2.5 text-xs text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-brand flex-shrink-0" />
          <span>Excelente desempeño: No se registran tropiezos críticos (precisión promedio superior al 60%).</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          {stumbles.map((st) => (
            <div
              key={st.term}
              className="p-3 rounded-xl bg-canvas border border-border-default space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{st.term}</span>
                <span className="text-rose-400 font-bold text-[10px]">{st.failRate} Fallos</span>
              </div>
              <p className="text-[10px] text-slate-muted">{st.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
