"use client";

import { Course } from "@/features/courses/types";
import { CohortLevelRecommender } from "./cohort-level-recommender";

interface CohortIdentityCardProps {
  name: string;
  isEditing: boolean;
  onNameChange: (name: string) => void;
  description: string;
  onDescriptionChange: (desc: string) => void;
  level: string;
  onSelectLevel: (level: string) => void;
  selectedCourses: Course[];
}

/** Tarjeta con el nombre, nivel y descripcion pedagógica de la cohorte. */
export function CohortIdentityCard({
  name,
  isEditing,
  onNameChange,
  description,
  onDescriptionChange,
  level,
  onSelectLevel,
  selectedCourses,
}: CohortIdentityCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border-default space-y-4 shadow-sm">
      <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-border-default pb-3">
        <span className="w-5 h-5 rounded-full bg-emerald-brand/20 text-emerald-brand flex items-center justify-center font-mono text-[11px] font-bold">1</span>
        <span>Identidad & Nivel de la Cohorte</span>
      </h3>

      <div>
        <label className="block text-xs font-semibold text-slate-200 mb-1">
          Nombre del Aula / Grupo
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => isEditing && onNameChange(e.target.value)}
          readOnly={!isEditing}
          placeholder="Ej: Inglés B1 - Cohorte Intensiva Mañana"
          className={`w-full px-3.5 py-2.5 bg-canvas border rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-colors ${
            !isEditing
              ? "border-border-default/60 opacity-80 cursor-default"
              : "border-border-default focus:border-emerald-brand"
          }`}
          required
        />
      </div>

      <CohortLevelRecommender
        selectedCourses={selectedCourses}
        currentLevel={level}
        onSelectLevel={onSelectLevel}
      />

      <div>
        <label className="block text-xs font-semibold text-slate-200 mb-1">
          Instrucciones u Objetivos para los Alumnos (Opcional)
        </label>
        <textarea
          value={description}
          onChange={(e) => isEditing && onDescriptionChange(e.target.value)}
          readOnly={!isEditing}
          rows={2}
          placeholder="Ej: Esta aula cubre lecciones de conversación y preparación para exámenes de fin de curso."
          className={`w-full px-3.5 py-2 bg-canvas border rounded-xl text-xs text-white placeholder-slate-500 outline-none resize-none transition-colors ${
            !isEditing
              ? "border-border-default/60 opacity-80 cursor-default"
              : "border-border-default focus:border-emerald-brand"
          }`}
        />
      </div>
    </div>
  );
}
