"use client";

import { ApiCourse } from "@/services/api/types";

interface AudiencePickerProps {
  isPublishedStandalone: boolean;
  audienceScope: "all_students" | "selected_courses";
  assignedCourseIds: string[];
  courses: ApiCourse[];
  onTogglePublished: () => void;
  onAudienceScopeChange: (scope: "all_students" | "selected_courses") => void;
  onToggleCourse: (courseId: string) => void;
}

export function AudiencePicker({
  isPublishedStandalone,
  audienceScope,
  assignedCourseIds,
  courses,
  onTogglePublished,
  onAudienceScopeChange,
  onToggleCourse,
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
            Guarda la audiencia para una función futura. Esta configuración todavía no publica la actividad en la aplicación.
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

      {isPublishedStandalone && (
        <div className="pt-3 border-t border-border-default/60 space-y-3 animate-in fade-in duration-150">
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
                Disponible para todos los estudiantes inscritos en cualquiera de tus cursos y aulas.
              </span>
            </button>

            <button
              type="button"
              onClick={() => onAudienceScopeChange("selected_courses")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                audienceScope === "selected_courses"
                  ? "bg-emerald-brand/10 border-emerald-brand/50 text-white ring-1 ring-emerald-brand/30"
                  : "bg-canvas border-border-default text-slate-400 hover:text-white"
              }`}
            >
              <span className="text-xs font-bold block text-white">Alumnos de cursos específicos</span>
              <span className="text-[10px] text-slate-400 block mt-0.5 leading-snug">
                Restringido únicamente a los estudiantes inscritos en las aulas de los cursos elegidos.
              </span>
            </button>
          </div>

          {audienceScope === "selected_courses" && (
            <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-2 mt-2">
              <span className="text-[11px] font-semibold text-slate-300 block">
                Selecciona los cursos con acceso:
              </span>
              {courses.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic">No tienes cursos creados para vincular.</p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {courses.map((course) => {
                    const isChecked = assignedCourseIds.includes(course.id);
                    return (
                      <label
                        key={course.id}
                        className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleCourse(course.id)}
                          className="rounded border-border-default text-emerald-brand focus:ring-emerald-brand"
                        />
                        <span className="truncate">{course.title}</span>
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
