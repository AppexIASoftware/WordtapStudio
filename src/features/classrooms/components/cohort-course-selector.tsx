"use client";

import { useState } from "react";
import { BookOpen, Check, ChevronDown, ChevronUp, Layers, CheckSquare, Square } from "lucide-react";
import { Course } from "@/features/teacher-dashboard/types";

interface CohortCourseSelectorProps {
  availableCourses: Course[];
  selectedCourseIds: string[];
  selectedLessonIds: string[];
  onToggleCourse: (courseId: string) => void;
  onToggleLesson: (lessonId: string, courseId: string) => void;
  onToggleAllLessonsForCourse: (courseId: string) => void;
}

export function CohortCourseSelector({
  availableCourses,
  selectedCourseIds,
  selectedLessonIds,
  onToggleCourse,
  onToggleLesson,
  onToggleAllLessonsForCourse,
}: CohortCourseSelectorProps) {
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const toggleExpand = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    setExpandedCourseId((prev) => (prev === courseId ? null : courseId));
  };

  const totalActiveLessons = availableCourses
    .filter((c) => selectedCourseIds.includes(c.id))
    .flatMap((c) => c.lessons || [])
    .filter((l) => selectedLessonIds.includes(l.id)).length;

  const totalActiveWords = availableCourses
    .filter((c) => selectedCourseIds.includes(c.id))
    .flatMap((c) => c.lessons || [])
    .filter((l) => selectedLessonIds.includes(l.id))
    .reduce((acc, l) => acc + (l.items?.length || 0), 0);

  return (
    <div className="p-6 rounded-2xl bg-card border border-border-default space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-default pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-brand/20 text-emerald-brand flex items-center justify-center font-mono text-[11px] font-bold">
              2
            </span>
            <BookOpen className="w-4 h-4 text-emerald-brand" />
            <span>Cursos y Lecciones Seleccionadas</span>
          </h3>
          <p className="text-[11px] text-slate-muted mt-0.5">
            Activa cursos temáticos y personaliza qué lecciones formarán el plan de estudio.
          </p>
        </div>

        {/* Resumen en Vivo de Contenido Activo */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/30">
            {selectedCourseIds.length} cursos
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/20 text-slate-300 border border-border-default">
            {totalActiveLessons} lecciones
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {totalActiveWords} palabras
          </span>
        </div>
      </div>

      {selectedCourseIds.length === 0 && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
          <span>⚠️ Selecciona al menos un curso temático para estructurar la cohorte y generar su mapa pedagógico.</span>
        </div>
      )}

      {availableCourses.length === 0 ? (
        <div className="p-8 text-center bg-canvas/40 border border-dashed border-border-default rounded-xl space-y-2">
          <Layers className="w-8 h-8 mx-auto text-slate-500" />
          <p className="text-xs font-semibold text-white">No hay cursos disponibles</p>
          <p className="text-[11px] text-slate-muted">Crea cursos desde el Constructor de Cursos para asignarlos a tus cohortes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {availableCourses.map((c) => {
            const isSelected = selectedCourseIds.includes(c.id);
            const isExpanded = expandedCourseId === c.id;
            const courseLessons = c.lessons || [];
            const activeLessonsInCourse = courseLessons.filter((l) =>
              selectedLessonIds.includes(l.id)
            ).length;
            const totalWordsInCourse = courseLessons.reduce(
              (acc, l) => acc + (l.items?.length || 0),
              0
            );

            return (
              <div
                key={c.id}
                className={`rounded-xl border transition-all ${
                  isSelected
                    ? "bg-emerald-brand/5 border-emerald-brand/40 shadow-sm"
                    : "bg-canvas border-border-default hover:border-slate-500"
                }`}
              >
                {/* Cabecera del Curso */}
                <div
                  onClick={() => onToggleCourse(c.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    {/* Checkbox de Activación del Curso */}
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center transition-colors mt-0.5 sm:mt-0 ${
                        isSelected ? "bg-emerald-brand text-canvas" : "border border-slate-600 bg-card"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/20 text-emerald-brand border border-emerald-brand/20">
                          {c.level}
                        </span>
                        {c.isDemo && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Demo
                          </span>
                        )}
                        <h4 className="font-bold text-xs text-white">{c.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-subtle mt-0.5">
                        {activeLessonsInCourse}/{courseLessons.length} lecciones activas • {totalWordsInCourse} palabras • {c.tier === "free" ? "Gratuito" : "Premium"}
                      </p>
                    </div>
                  </div>

                  {/* Acciones de Expansión de Lecciones */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(e, c.id)}
                      className="px-2.5 py-1 rounded-lg bg-card border border-border-default text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>{isExpanded ? "Ocultar Lecciones" : `Configurar Lecciones (${courseLessons.length})`}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3 text-emerald-brand" /> : <ChevronDown className="w-3 h-3 text-emerald-brand" />}
                    </button>
                  </div>
                </div>

                {/* Bandeja Expandida de Lecciones y Palabras Seleccionables */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border-default/60 pt-3 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-muted text-[11px] font-semibold">
                        Selecciona las lecciones que recorrerán los alumnos:
                      </span>
                      {isSelected && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleAllLessonsForCourse(c.id);
                          }}
                          className="text-[11px] text-emerald-brand hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {activeLessonsInCourse === courseLessons.length ? (
                            <>
                              <Square className="w-3 h-3" />
                              <span>Deseleccionar todas</span>
                            </>
                          ) : (
                            <>
                              <CheckSquare className="w-3 h-3" />
                              <span>Seleccionar todas</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {courseLessons.map((l, lIdx) => {
                        const isLessonActive = selectedLessonIds.includes(l.id);
                        const lessonWords = l.items || [];

                        return (
                          <div
                            key={l.id || lIdx}
                            onClick={() => {
                              if (!isSelected) {
                                onToggleCourse(c.id);
                              }
                              onToggleLesson(l.id, c.id);
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all space-y-1.5 ${
                              isLessonActive && isSelected
                                ? "bg-emerald-brand/10 border-emerald-brand/40 text-white"
                                : "bg-card border-border-default text-slate-400 opacity-70 hover:opacity-100"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-200">
                                L{lIdx + 1}: {l.title}
                              </span>
                              <div
                                className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                                  isLessonActive && isSelected
                                    ? "bg-emerald-brand text-canvas"
                                    : "border border-slate-600"
                                }`}
                              >
                                {isLessonActive && isSelected && (
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                )}
                              </div>
                            </div>

                            <p className="text-[10px] text-slate-muted">
                              {l.duration || "15 min"} • {lessonWords.length} palabras clave
                            </p>

                            {/* Pastillas de Palabras Creadas en la Lección */}
                            {lessonWords.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {lessonWords.slice(0, 4).map((it, iIdx) => (
                                  <span
                                    key={it.id || iIdx}
                                    className="px-1.5 py-0.2 rounded bg-black/30 border border-border-default/60 text-slate-300 font-mono text-[9px]"
                                  >
                                    {it.en}
                                  </span>
                                ))}
                                {lessonWords.length > 4 && (
                                  <span className="text-[9px] text-slate-muted self-center">
                                    +{lessonWords.length - 4} más
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
