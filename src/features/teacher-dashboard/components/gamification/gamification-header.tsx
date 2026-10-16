"use client";

import { Plus, Sparkles, Gamepad2, Brain, CheckCircle2 } from "lucide-react";

interface GamificationHeaderProps {
  customGamesCount: number;
  onNewGame: () => void;
}

export function GamificationHeader({
  customGamesCount,
  onNewGame,
}: GamificationHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Motor de Juegos & Gamificación
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-mint-brand/20 text-mint-brand border border-mint-brand/40 font-mono">
              Gestión Pedagógica
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            Diseña actividades lúdicas personalizadas derivadas de modelos base, vincula vocabulario real de cursos o bóveda y calibra la repetición espaciada.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewGame}
          className="px-4 py-2.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-2 shadow-glow-emerald cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nueva Actividad</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-subtle">
              Plantillas Base
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Demo
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-white">12 Modelos</p>
          <span className="text-[11px] text-slate-muted block">Arquetipos oficiales</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-subtle flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-mint-brand" />
              Tus Actividades
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/30">
              Personalizadas
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-mint-brand">
            {customGamesCount} {customGamesCount === 1 ? "Creada" : "Creadas"}
          </p>
          <span className="text-[11px] text-slate-muted block">Listas para tus cursos</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-subtle">
              Habilitados en App
            </span>
            <Gamepad2 className="w-3.5 h-3.5 text-emerald-brand" />
          </div>
          <p className="text-xl font-bold font-mono text-emerald-brand">2 Activos</p>
          <span className="text-[11px] text-slate-muted block">WordMatch y Memory</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-subtle">
              Modelo de Repaso
            </span>
            <Brain className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <p className="text-xl font-bold font-mono text-amber-300">Repaso</p>
          <span className="text-[11px] text-slate-muted block">Calibración del motor activa</span>
        </div>
      </div>
    </div>
  );
}
