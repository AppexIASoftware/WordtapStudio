"use client";

import { Sparkles, Star, Flame, ArrowUp, ArrowDown, Trash2, Edit3, Plus } from "lucide-react";
import { StationNode } from "./cohort-pedagogical-path";

interface CohortStationDetailProps {
  station: StationNode;
  totalStations: number;
  weeklyGoal: number;
  gameNames: Record<string, string>;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canDelete: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<StationNode>) => void;
  onAddAfter?: () => void;
}

export function CohortStationDetail({
  station,
  totalStations,
  weeklyGoal,
  gameNames,
  canMoveUp,
  canMoveDown,
  canDelete,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
  onAddAfter,
}: CohortStationDetailProps) {
  const isMilestone = station.type === "milestone";

  return (
    <div className="lg:col-span-6 xl:col-span-6 bg-card rounded-2xl border border-border-default p-6 space-y-5 shadow-sm sticky top-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-default pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-emerald-brand tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Estación {station.order} de {totalStations}</span>
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">
            Inspector Pedagógico de Estación
          </h3>
        </div>

        {/* Acciones de Posicionamiento y Borrado */}
        <div className="flex items-center gap-1.5">
          {/* Control Segmentado Subir / Bajar */}
          <div className="flex items-center bg-canvas rounded-xl border border-border-default p-0.5 shadow-xs">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Mover estación hacia arriba"
            >
              <ArrowUp className="w-4 h-4 text-emerald-brand" />
            </button>
            <div className="w-px h-4 bg-border-default" />
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Mover estación hacia abajo"
            >
              <ArrowDown className="w-4 h-4 text-emerald-brand" />
            </button>
          </div>

          {/* Botón Quitar */}
          {canDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer transition-colors shadow-xs"
              title="Eliminar esta parada"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Editor de la Estación */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-emerald-brand" />
            <span>Título Personalizado de la Estación</span>
          </label>
          <input
            type="text"
            value={station.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3.5 py-2 bg-canvas border border-border-default rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-brand"
            disabled={isMilestone}
          />
        </div>

        {!isMilestone && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tipo de Actividad
              </label>
              <select
                value={station.type}
                onChange={(e) => {
                  const newType = e.target.value as StationNode["type"];
                  const catMap: Record<string, string> = {
                    lesson: "Lección Teórica",
                    game: "Minijuego de Práctica",
                    speed: "Refuerzo Adaptativo",
                  };
                  onUpdate({
                    type: newType,
                    category: catMap[newType] || "Actividad Pedagógica",
                  });
                }}
                className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-xs text-slate-200 outline-none focus:border-emerald-brand"
              >
                <option value="lesson">Lección Teórica</option>
                <option value="game">Minijuego Práctico</option>
                <option value="speed">Refuerzo Adaptativo</option>
              </select>
            </div>

            {station.type === "game" && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mecánica de Juego
                </label>
                <select
                  value={station.gameKey || "memory"}
                  onChange={(e) =>
                    onUpdate({
                      gameKey: e.target.value,
                      title: gameNames[e.target.value] || station.title,
                    })
                  }
                  className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-xs text-slate-200 outline-none focus:border-emerald-brand"
                >
                  {Object.entries(gameNames).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Parámetros de Recompensa y Duración */}
        <div className="p-4 rounded-xl bg-canvas border border-border-default space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="text-slate-muted">Tiempo estimado:</span>
            <strong className="text-white font-mono">{station.duration}</strong>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-border-default/60 pt-2 text-xs">
            <span className="text-slate-muted">Recompensa en Experiencia:</span>
            <div className="flex items-center gap-1.5">
              {[15, 25, 50, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onUpdate({ xp: val })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    station.xp === val
                      ? "bg-amber-400 text-canvas shadow-sm"
                      : "bg-card border border-border-default text-slate-400 hover:text-white"
                  }`}
                >
                  +{val} XP
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ficha de Impacto Pedagógico */}
        <div className="p-4 rounded-xl bg-emerald-brand/5 border border-emerald-brand/20 space-y-1.5">
          <div className="font-semibold text-emerald-brand flex items-center gap-1.5 text-xs">
            <Flame className="w-4 h-4" />
            <span>Impacto en la Telemetría de la Cohorte:</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-xs">
            {station.type === "lesson"
              ? "Los estudiantes asimilan términos clave con pronunciación nativa antes de ser evaluados."
              : station.type === "game"
              ? "El estudiante practica la evocación bajo presión. Cada error alimenta el panel de Tropiezos del docente."
              : station.type === "speed"
              ? "Algoritmo de repaso espaciado: reitera las palabras que generaron vacilación previa."
              : `Cierre del módulo: valida que cada alumno haya dominado al menos ${weeklyGoal} palabras para su insignia semanal.`}
          </p>
        </div>

        {/* Botón Destacado: Insertar Parada Siguiente */}
        {onAddAfter && !isMilestone && (
          <button
            type="button"
            onClick={onAddAfter}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500 text-emerald-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs group"
          >
            <Plus className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Insertar Parada Después de Esta</span>
          </button>
        )}
      </div>
    </div>
  );
}
