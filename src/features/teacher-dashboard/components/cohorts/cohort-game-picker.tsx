"use client";

import { Gamepad2, Check, Sparkles } from "lucide-react";
import { GameModeItem } from "../../types";
import { GAMES_DATA } from "../../data/mock-teacher-data";
import { TeacherGameDTO } from "@/services/api/types";

interface CohortGamePickerProps {
  selectedGameTypes: string[];
  onToggleGame: (type: string) => void;
  customGames?: TeacherGameDTO[];
  isReadOnly?: boolean;
}

export function CohortGamePicker({
  selectedGameTypes,
  onToggleGame,
  customGames = [],
  isReadOnly = false,
}: CohortGamePickerProps) {
  const totalOptions = GAMES_DATA.length + customGames.length;

  return (
    <div className="p-6 rounded-2xl bg-card border border-border-default space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-border-default pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-mint-brand/20 text-mint-brand flex items-center justify-center font-mono text-[11px] font-bold">
            3
          </span>
          <Gamepad2 className="w-4 h-4 text-mint-brand" />
          <span>
            Mecánicas y Minijuegos ({selectedGameTypes.length}/{totalOptions} activos)
          </span>
        </h3>
        <span className="text-[11px] text-slate-muted">
          Selecciona las dinámicas de práctica interactiva para el aula
        </span>
      </div>

      {customGames.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-mint-brand uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Tus Actividades Personalizadas ({customGames.length})
            </span>
            <span className="text-[10px] text-slate-muted">
              Retos de autor calibrados en Gamificación
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {customGames.map((cg) => {
              const gameKey = `custom_${cg.id}`;
              const isSelected = selectedGameTypes.includes(gameKey) || selectedGameTypes.includes(cg.id);

              return (
                <button
                  key={cg.id}
                  type="button"
                  disabled={isReadOnly}
                  onClick={() => !isReadOnly && onToggleGame(gameKey)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${
                    isReadOnly ? "cursor-default" : "cursor-pointer"
                  } ${
                    isSelected
                      ? "bg-mint-brand/15 border-mint-brand text-white shadow-sm ring-1 ring-mint-brand/30"
                      : "bg-canvas border-border-default text-slate-400 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] font-mono font-bold text-mint-brand uppercase">
                      {cg.base_archetype}
                    </span>
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                        isSelected ? "bg-mint-brand text-canvas" : "border border-slate-600"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-xs truncate text-white">{cg.title}</p>
                    <p className="text-[10px] text-slate-subtle truncate">
                      {cg.time_limit_seconds}s • +{cg.reward_xp} XP
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-canvas border border-dashed border-border-default/80 flex items-center justify-between text-xs text-slate-muted">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-mint-brand shrink-0" />
            <span>
              Aún no tienes actividades personalizadas. Puedes crearlas en <strong>Juegos & Gamificación</strong> para asignarlas a esta cohorte.
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Dinámicas Base Oficiales ({GAMES_DATA.length})
          </span>
          <span className="text-[10px] text-slate-muted">
            Generadas automáticamente con las palabras de tus lecciones
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {GAMES_DATA.map((g: GameModeItem) => {
            const isSelected = selectedGameTypes.includes(g.type);
            return (
              <button
                key={g.id}
                type="button"
                disabled={isReadOnly}
                onClick={() => !isReadOnly && onToggleGame(g.type)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${
                  isReadOnly ? "cursor-default" : "cursor-pointer"
                } ${
                  isSelected
                    ? "bg-mint-brand/10 border-mint-brand/40 text-white shadow-sm"
                    : "bg-canvas border-border-default text-slate-400 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono font-bold text-mint-brand">
                    Nivel {g.level}
                  </span>
                  <div
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                      isSelected ? "bg-mint-brand text-canvas" : "border border-slate-600"
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-xs truncate">{g.title.split("(")[0]}</p>
                  <p className="text-[10px] text-slate-subtle truncate">
                    {g.timeLimit}s • +{g.points}pts
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
