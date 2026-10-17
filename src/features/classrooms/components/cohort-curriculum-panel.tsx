"use client";

import React from "react";
import { Pencil, Save, Sparkles } from "lucide-react";
import { Course } from "@/features/courses/types";
import { TeacherGameDTO } from "@/services/api/types";
import { CohortCurriculumMap } from "./cohort-curriculum-map";

interface CohortCurriculumPanelProps {
  selectedCourses: Course[];
  selectedGameTypes: string[];
  weeklyGoal: number;
  selectedLessonIds: string[];
  customGames: TeacherGameDTO[];
  isExisting: boolean;
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onBackToGeneral: () => void;
  onEnableEdit: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

/** Panel con el mapa curricular de estaciones y la barra de acciones de la ruta. */
export function CohortCurriculumPanel({
  selectedCourses,
  selectedGameTypes,
  weeklyGoal,
  selectedLessonIds,
  customGames,
  isExisting,
  isEditing,
  isSubmitting,
  onCancel,
  onBackToGeneral,
  onEnableEdit,
  onSubmit,
}: CohortCurriculumPanelProps) {
  return (
    <div className="space-y-6">
      <CohortCurriculumMap
        selectedCourses={selectedCourses}
        selectedGameTypes={selectedGameTypes}
        weeklyGoal={weeklyGoal}
        selectedLessonIds={selectedLessonIds}
        customGames={customGames}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border-default shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-card border border-border-default text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Volver a Aulas
          </button>
          <button
            type="button"
            onClick={onBackToGeneral}
            className="px-4 py-2 rounded-xl bg-canvas border border-border-default hover:border-slate-500 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            ← Volver a Configuración General
          </button>
        </div>

        {isExisting && !isEditing ? (
          <button
            type="button"
            onClick={onEnableEdit}
            className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-canvas font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Habilitar Edición</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
          >
            {isExisting ? (
              <Save className="w-3.5 h-3.5" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>
              {isSubmitting
                ? "Guardando..."
                : isExisting
                ? "Guardar Cambios"
                : "Crear y Publicar Aula"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
