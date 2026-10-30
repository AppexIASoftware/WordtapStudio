"use client";

import { useMemo } from "react";
import { Sparkles, Check, Wand2 } from "lucide-react";
import { Course } from "@/features/courses/types";
import { CEFR_LEVEL, CefrLevel } from "@/features/classrooms/types";

const CEFR_LEVELS = [
  { code: CEFR_LEVEL.A1, full: "A1 Beginner", label: "Principiante" },
  { code: CEFR_LEVEL.A2, full: "A2 Elementary", label: "Elemental" },
  { code: CEFR_LEVEL.B1, full: "B1 Intermediate", label: "Intermedio" },
  { code: CEFR_LEVEL.B2, full: "B2 Upper Intermediate", label: "Avanzado" },
  { code: CEFR_LEVEL.C1, full: "C1 Advanced", label: "Dominio" },
] as const;

interface CohortLevelRecommenderProps {
  selectedCourses: Course[];
  currentLevel: string;
  onSelectLevel: (level: string) => void;
  isEditing?: boolean;
}

export function CohortLevelRecommender({
  selectedCourses,
  currentLevel,
  onSelectLevel,
  isEditing = true,
}: CohortLevelRecommenderProps) {
  // Calcular nivel recomendado según la distribución de cursos seleccionados
  const recommendedLevel = useMemo(() => {
    if (selectedCourses.length === 0) return CEFR_LEVEL.B1;

    const scores: Record<string, number> = {
      [CEFR_LEVEL.A1]: 1,
      [CEFR_LEVEL.A2]: 2,
      [CEFR_LEVEL.B1]: 3,
      [CEFR_LEVEL.B2]: 4,
      [CEFR_LEVEL.C1]: 5,
    };
    let totalScore = 0;
    let counted = 0;

    for (const c of selectedCourses) {
      const code = c.level.substring(0, 2).toUpperCase();
      if (scores[code]) {
        totalScore += scores[code];
        counted++;
      }
    }

    if (counted === 0) return CEFR_LEVEL.B1;
    const avg = Math.round(totalScore / counted);
    const target = CEFR_LEVELS[Math.min(Math.max(avg - 1, 0), CEFR_LEVELS.length - 1)];
    return target.code;
  }, [selectedCourses]);

  const isMatchingRecommendation =
    currentLevel.toUpperCase().startsWith(recommendedLevel);

  return (
    <div className="space-y-3 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-xs font-semibold text-slate-200">
          Nivel Pedagógico de Referencia (CEFR)
        </label>

        {selectedCourses.length > 0 && isEditing && (
          <div className="flex items-center gap-2">
            {!isMatchingRecommendation ? (
              <button
                type="button"
                onClick={() => onSelectLevel(recommendedLevel)}
                className="px-2.5 py-1 rounded-lg bg-emerald-brand/10 border border-emerald-brand/30 text-emerald-brand hover:bg-emerald-brand hover:text-canvas text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Wand2 className="w-3 h-3" />
                <span>Aplicar Sugerencia ({recommendedLevel})</span>
              </button>
            ) : (
              <span className="text-[10px] font-mono text-emerald-brand flex items-center gap-1 font-semibold">
                <Check className="w-3 h-3" />
                <span>Sincronizado con tus cursos</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Selector Visual de Niveles CEFR */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {CEFR_LEVELS.map((lvl) => {
          const isSelected =
            currentLevel === lvl.code ||
            currentLevel.toUpperCase().startsWith(lvl.code);
          const isRecommended = recommendedLevel === lvl.code;

          return (
            <button
              key={lvl.code}
              type="button"
              disabled={!isEditing}
              onClick={() => isEditing && onSelectLevel(lvl.code)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                !isEditing
                  ? "cursor-default"
                  : "cursor-pointer active:scale-98"
              } ${
                isSelected
                  ? "bg-emerald-brand/15 border-emerald-brand text-white shadow-sm ring-1 ring-emerald-brand/40"
                  : isEditing
                  ? "bg-canvas border-border-default text-slate-400 hover:border-slate-500"
                  : "bg-canvas/50 border-border-default/40 text-slate-500"
              }`}
            >
              {isRecommended && isEditing && (
                <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full bg-emerald-brand text-canvas font-mono font-bold text-[9px] shadow-sm flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Sugerido</span>
                </span>
              )}

              <div>
                <span
                  className={`text-sm font-mono font-bold ${
                    isSelected ? "text-emerald-brand" : "text-slate-300"
                  }`}
                >
                  {lvl.code}
                </span>
                <p className="text-[11px] font-semibold truncate text-white mt-0.5">
                  {lvl.label}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-border-default/50 flex items-center justify-between text-[10px] font-mono">
                <span className={isSelected ? "text-emerald-400" : "text-slate-500"}>
                  {isSelected ? "Activo" : "Seleccionar"}
                </span>
                {isSelected && <Check className="w-3 h-3 text-emerald-brand stroke-[2.5]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
