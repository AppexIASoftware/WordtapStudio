"use client";

import type { Classroom } from "@/features/classrooms/types";

interface AudiencePickerProps {
  isPublishedStandalone: boolean;
  audienceScope: "all_students" | "selected_courses" | "selected_classrooms";
  assignedClassroomIds: string[];
  classrooms: Classroom[];
  loading: boolean;
  loadError: boolean;
  onTogglePublished: () => void;
  onAudienceScopeChange: (scope: "all_students" | "selected_classrooms") => void;
  onToggleClassroom: (classroomId: string) => void;
}

export function AudiencePicker({
  isPublishedStandalone,
  audienceScope,
  assignedClassroomIds,
  classrooms,
  loading,
  loadError,
  onTogglePublished,
  onAudienceScopeChange,
  onToggleClassroom,
}: AudiencePickerProps) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border-default space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>5. Configuración de audiencia</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                isPublishedStandalone
                  ? "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/30"
                  : "bg-canvas text-slate-400 border-border-default"
              }`}
            >
              {isPublishedStandalone ? "Audiencia configurada" : "Sin configurar"}
            </span>
          </h3>
          <p className="text-[11px] text-slate-muted mt-0.5">
            Elige qué estudiantes pueden acceder a esta actividad.
          </p>
        </div>

        <button
          type="button"
          onClick={onTogglePublished}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer self-start sm:self-auto ${
            isPublishedStandalone
              ? "bg-emerald-brand text-canvas border-emerald-brand shadow-sm font-bold"
              : "bg-canvas text-slate-300 border-border-default hover:border-slate-500"
          }`}
        >
          {isPublishedStandalone ? "✓ Configuración activada" : "Configurar audiencia"}
        </button>
      </div>

      {(isPublishedStandalone || audienceScope === "selected_courses") && (
        <div className="pt-3 border-t border-border-default/60 space-y-3 animate-in fade-in duration-150">
          {audienceScope === "selected_courses" && <p className="text-xs text-amber-300">Esta actividad tiene una audiencia anterior por cursos. Elige una nueva audiencia para guardar los cambios.</p>}
          <label className="text-xs font-semibold text-slate-200 block">
            Audiencia de alumnos autorizada:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onAudienceScopeChange("all_students")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                audienceScope === "all_students"
                  ? "bg-emerald-brand/10 border-emerald-brand/50 text-white ring-1 ring-emerald-brand/30"
                  : "bg-canvas border-border-default text-slate-400 hover:text-white"
              }`}
            >
              <span className="text-xs font-bold block text-white">Todos mis alumnos</span>
              <span className="text-[10px] text-slate-400 block mt-0.5 leading-snug">
                Disponible para los estudiantes inscritos en tus aulas.
              </span>
            </button>

            <button
              type="button"
              onClick={() => onAudienceScopeChange("selected_classrooms")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                audienceScope === "selected_classrooms"
                  ? "bg-emerald-brand/10 border-emerald-brand/50 text-white ring-1 ring-emerald-brand/30"
                  : "bg-canvas border-border-default text-slate-400 hover:text-white"
              }`}
            >
              <span className="text-xs font-bold block text-white">Alumnos de aulas específicas</span>
              <span className="text-[10px] text-slate-400 block mt-0.5 leading-snug">
                Disponible solo para estudiantes inscritos en las aulas elegidas.
              </span>
            </button>
          </div>

          {audienceScope === "selected_classrooms" && (
            <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-2 mt-2">
              <span className="text-[11px] font-semibold text-slate-300 block">
                Selecciona las aulas con acceso:
              </span>
              {loading ? (
                <div aria-label="Cargando aulas" className="space-y-2 animate-pulse"><div className="h-5 rounded bg-slate-700" /><div className="h-5 rounded bg-slate-700" /></div>
              ) : loadError ? (
                <p className="text-[11px] text-amber-300">No se pudieron cargar tus aulas. Vuelve a abrir esta pantalla para intentarlo de nuevo.</p>
              ) : classrooms.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic">No tienes aulas creadas para seleccionar.</p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {classrooms.map((classroom) => {
                    const isChecked = assignedClassroomIds.includes(classroom.id);
                    return (
                      <label
                        key={classroom.id}
                        className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleClassroom(classroom.id)}
                          className="rounded border-border-default text-emerald-brand focus:ring-emerald-brand"
                        />
                        <span className="truncate">{classroom.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
