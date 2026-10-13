"use client";

import { Gamepad2, Check } from "lucide-react";
import { GameModeItem } from "../../types";
import { GAMES_DATA } from "../../data/mock-teacher-data";

interface CohortGamePickerProps {
  selectedGameTypes: string[];
  onToggleGame: (type: string) => void;
}

export function CohortGamePicker({
  selectedGameTypes,
  onToggleGame,
}: CohortGamePickerProps) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border-default space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-border-default pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-mint-brand/20 text-mint-brand flex items-center justify-center font-mono text-[11px] font-bold">
            3
          </span>
          <Gamepad2 className="w-4 h-4 text-mint-brand" />
          <span>Mecánicas y Minijuegos ({selectedGameTypes.length}/{GAMES_DATA.length} activos)</span>
        </h3>
        <span className="text-[11px] text-slate-muted">Selecciona las dinámicas de práctica interactiva</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {GAMES_DATA.map((g: GameModeItem) => {
          const isSelected = selectedGameTypes.includes(g.type);
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onToggleGame(g.type)}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-24 ${
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
  );
}
