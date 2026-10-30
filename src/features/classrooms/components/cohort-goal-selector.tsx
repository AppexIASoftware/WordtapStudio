"use client";

import { Target } from "lucide-react";

interface CohortGoalSelectorProps {
  weeklyGoal: number;
  onSelectGoal: (goal: number) => void;
}

export function CohortGoalSelector({
  weeklyGoal,
  onSelectGoal,
}: CohortGoalSelectorProps) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border-default space-y-4 shadow-sm">
      <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-border-default pb-3">
        <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-mono text-[11px] font-bold">
          3
        </span>
        <Target className="w-4 h-4 text-amber-400" />
        <span>Meta Pedagógica Semanal</span>
      </h3>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-white">Palabras dominadas por semana / alumno</p>
          <p className="text-[11px] text-slate-muted">
            Los estudiantes verán esta meta en su barra de progreso diaria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[25, 50, 75, 100].map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => onSelectGoal(goal)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                weeklyGoal === goal
                  ? "bg-amber-400 text-canvas shadow-sm"
                  : "bg-canvas border border-border-default text-slate-300 hover:text-white"
              }`}
            >
              {goal} palabras
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
