"use client";

import { ArrowLeft, Sparkles, Pencil, Save } from "lucide-react";

interface CohortWorkspaceHeaderProps {
  name: string;
  code?: string;
  isExisting: boolean;
  isEditing: boolean;
  activeTab: "general" | "curriculum";
  selectedCourseCount: number;
  selectedActivityCount: number;
  isSubmitting: boolean;
  onCancel: () => void;
  onEnableEdit: () => void;
  onCancelEdit: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onTabChange: (tab: "general" | "curriculum") => void;
}

export function CohortWorkspaceHeader({
  name,
  code,
  isExisting,
  isEditing,
  activeTab,
  selectedCourseCount,
  selectedActivityCount,
  isSubmitting,
  onCancel,
  onEnableEdit,
  onCancelEdit,
  onSubmit,
  onTabChange,
}: CohortWorkspaceHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Barra de Navegación del Workspace */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl bg-card border border-border-default hover:border-emerald-brand text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Volver a la lista de aulas"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>
                {isExisting
                  ? isEditing
                    ? `Editar Aula: ${name}`
                    : `Detalle de Aula: ${name}`
                  : "Configuración de Nueva Cohorte Pedagógica"}
              </span>
              {code && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
                  {code}
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-muted">
              {isExisting
                ? isEditing
                  ? "Ajusta los cursos vinculados, mecánicas de juego interactivas y metas semanales."
                  : "Visualiza el plan curricular completo, lecciones estructuradas y actividades interactivas."
                : "Define los cursos temáticos, mecánicas interactivas y metas de aprendizaje para tu aula privada."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isExisting && !isEditing ? (
            <>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl bg-card border border-border-default text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={onEnableEdit}
                className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-canvas font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Habilitar Edición</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={isExisting ? onCancelEdit : onCancel}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Cancelar
              </button>
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
            </>
          )}
        </div>
      </div>

      {/* Navegación por Pestañas del Workspace */}
      <div className="flex items-center gap-2 border-b border-border-default pb-3">
        <button
          type="button"
          onClick={() => onTabChange("general")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "general"
              ? "bg-emerald-brand text-canvas shadow-sm"
              : "bg-card border border-border-default text-slate-400 hover:text-white"
          }`}
        >
          <span>1. Configuración General & Cursos</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20">
            {selectedCourseCount} cursos
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("curriculum")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "curriculum"
              ? "bg-emerald-brand text-canvas shadow-sm"
              : "bg-card border border-border-default text-slate-400 hover:text-white"
          }`}
        >
          <span>2. Mapa de Progresión Pedagógica</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/30">
            {selectedActivityCount} actividades
          </span>
        </button>
      </div>
    </div>
  );
}
