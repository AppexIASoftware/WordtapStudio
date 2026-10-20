"use client";

import { Plus, Sparkles, Gamepad2, Brain, CheckCircle2, Users, BookOpen, Globe2 } from "lucide-react";

interface GamificationHeaderProps {
  customGamesCount: number;
  onNewGame?: () => void;
  /** Modo de la vista: el docente gestiona sus actividades, el admin supervisa el catálogo completo. */
  scope?: "teacher" | "admin";
  /** Docentes autores con al menos una actividad. Solo se usa en modo supervisión. */
  teachersCount?: number;
  /** Cursos que tienen actividades asociadas. Solo se usa en modo supervisión. */
  coursesCount?: number;
  /** Actividades habilitadas en la app. Solo se usa en modo supervisión. */
  activeGamesCount?: number;
  /**
   * Juegos globales de la plataforma, ajenos a cualquier docente.
   * Solo se usa en modo supervisión y la tarjeta se muestra cuando se entrega.
   */
  globalGamesCount?: number;
}

export function GamificationHeader({
  customGamesCount,
  onNewGame,
  scope = "teacher",
  teachersCount = 0,
  coursesCount = 0,
  activeGamesCount = 0,
  globalGamesCount,
}: GamificationHeaderProps) {
  const isAdmin = scope === "admin";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {isAdmin ? "Catálogo de Minijuegos" : "Motor de Juegos & Gamificación"}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-mint-brand/20 text-mint-brand border border-mint-brand/40 font-mono">
              {isAdmin ? "Supervisión de Contenido" : "Gestión Pedagógica"}
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            {isAdmin
              ? "Revisa las dinámicas lúdicas que los docentes crearon sobre cursos, bóveda de contenidos y vocabulario propio, y pruébalas en el simulador antes de habilitarlas en el aula."
              : "Diseña actividades lúdicas personalizadas derivadas de modelos base, vincula vocabulario real de cursos o bóveda y calibra la repetición espaciada."}
          </p>
        </div>

        {!isAdmin && onNewGame && (
          <button
            type="button"
            onClick={onNewGame}
            className="px-4 py-2.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-2 shadow-glow-emerald cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nueva Actividad</span>
          </button>
        )}
      </div>

      {isAdmin ? (
        <div
          className={`grid grid-cols-2 gap-3 ${
            globalGamesCount === undefined ? "sm:grid-cols-4" : "sm:grid-cols-3 lg:grid-cols-5"
          }`}
        >
          {globalGamesCount !== undefined && (
            <div className="p-4 rounded-2xl bg-card border border-mint-brand/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-subtle">
                  Juegos Globales
                </span>
                <Globe2 className="w-3.5 h-3.5 text-mint-brand" />
              </div>
              <p className="text-xl font-bold font-mono text-mint-brand">{globalGamesCount}</p>
              <span className="text-[11px] text-slate-muted block">De la plataforma</span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-subtle">
                Actividades Totales
              </span>
              <Gamepad2 className="w-3.5 h-3.5 text-mint-brand" />
            </div>
            <p className="text-xl font-bold font-mono text-white">{customGamesCount}</p>
            <span className="text-[11px] text-slate-muted block">
              {globalGamesCount === undefined ? "De todos los docentes" : "Juegos globales y de docentes"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-subtle">
                Docentes Creadores
              </span>
              <Users className="w-3.5 h-3.5 text-mint-brand" />
            </div>
            <p className="text-xl font-bold font-mono text-white">{teachersCount}</p>
            <span className="text-[11px] text-slate-muted block">Con actividades creadas</span>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-subtle">
                Cursos Vinculados
              </span>
              <BookOpen className="w-3.5 h-3.5 text-mint-brand" />
            </div>
            <p className="text-xl font-bold font-mono text-white">{coursesCount}</p>
            <span className="text-[11px] text-slate-muted block">Con actividades asociadas</span>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-subtle">
                Habilitadas en App
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-brand" />
            </div>
            <p className="text-xl font-bold font-mono text-emerald-brand">{activeGamesCount}</p>
            <span className="text-[11px] text-slate-muted block">Listas para el aula</span>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
