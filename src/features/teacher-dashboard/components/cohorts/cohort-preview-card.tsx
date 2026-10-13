"use client";

import { Sparkles, Copy, Share2 } from "lucide-react";

interface CohortPreviewCardProps {
  name: string;
  level: string;
  simulatedCode: string;
  selectedCourseCount: number;
  selectedGameCount: number;
  totalGamesCount: number;
  weeklyGoal: number;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
}

export function CohortPreviewCard({
  name,
  level,
  simulatedCode,
  selectedCourseCount,
  selectedGameCount,
  totalGamesCount,
  weeklyGoal,
  isSubmitting,
  onSubmit,
  onCancel,
}: CohortPreviewCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-emerald-brand/40 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-border-default pb-3">
        <span className="text-[10px] font-mono font-bold uppercase text-emerald-brand tracking-wider">
          Vista Previa del Aula
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-brand animate-pulse" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/30">
            {level}
          </span>
          <span className="text-[10px] text-slate-subtle font-mono">Creada Hoy</span>
        </div>

        <div>
          <h3 className="text-base font-bold text-white leading-tight">
            {name.trim() || "Nombre de tu Nueva Aula"}
          </h3>
          <p className="text-xs text-slate-muted mt-1">
            0 estudiantes matriculados inicialmente
          </p>
        </div>

        {/* Código de Invitación Generado */}
        <div className="p-3.5 rounded-xl bg-canvas border border-border-default space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-subtle font-mono">Código de Invitación:</span>
            <strong className="font-mono text-mint-brand text-xs tracking-wider">
              {simulatedCode}
            </strong>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
            <div className="py-1.5 rounded-lg bg-card border border-border-default text-slate-300 text-center flex items-center justify-center gap-1 opacity-80">
              <Copy className="w-3 h-3" />
              <span>Copiar Código</span>
            </div>
            <div className="py-1.5 rounded-lg bg-emerald-brand/10 border border-emerald-brand/30 text-emerald-brand text-center flex items-center justify-center gap-1 opacity-80">
              <Share2 className="w-3 h-3" />
              <span>WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Resumen del Plan Asignado */}
        <div className="pt-2 border-t border-border-default space-y-2 text-[11px]">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-muted">Cursos Vinculados:</span>
            <strong className="text-white font-mono">{selectedCourseCount} Cursos</strong>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-muted">Minijuegos Activos:</span>
            <strong className="text-mint-brand font-mono">
              {selectedGameCount} de {totalGamesCount}
            </strong>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-muted">Meta Semanal:</span>
            <strong className="text-amber-400 font-mono">{weeklyGoal} palabras / sem</strong>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-emerald-brand hover:bg-mint-brand text-canvas font-bold text-xs flex items-center justify-center gap-2 shadow-glow-emerald transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isSubmitting ? "Guardando..." : "Confirmar y Crear Aula"}</span>
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
