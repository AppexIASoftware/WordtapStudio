"use client";

import React, { useState, useMemo } from "react";
import { BookOpen, Layers, Pencil, Save, Sparkles } from "lucide-react";
import { Course } from "@/features/courses/types";
import { CourseJourneyTab } from "@/features/courses/components/builder/journey/course-journey-tab";

interface CohortCurriculumPanelProps {
  selectedCourses: Course[];
  selectedLessonIds: string[];
  weeklyGoal: number;
  isExisting: boolean;
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onBackToGeneral: () => void;
  onEnableEdit: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

/** Panel que visualiza la Ruta del Estudiante real para los cursos y lecciones asignadas al aula. */
export function CohortCurriculumPanel({
  selectedCourses,
  selectedLessonIds,
  weeklyGoal,
  isExisting,
  isEditing,
  isSubmitting,
  onCancel,
  onBackToGeneral,
  onEnableEdit,
  onSubmit,
}: CohortCurriculumPanelProps) {
  const [activeCourseIdx, setActiveCourseIdx] = useState(0);

  const activeCourse = selectedCourses[activeCourseIdx] || selectedCourses[0] || null;

  // Filtrar el curso para mostrar únicamente las lecciones seleccionadas para esta cohorte
  const filteredCourse = useMemo(() => {
    if (!activeCourse) return null;
    const lessons = (activeCourse.lessons || []).filter((l) =>
      selectedLessonIds.includes(l.id)
    );
    return {
      ...activeCourse,
      lessons: lessons.length > 0 ? lessons : activeCourse.lessons,
    };
  }, [activeCourse, selectedLessonIds]);

  const handleSpeak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      window.speechSynthesis.speak(u);
    }
  };

  if (!filteredCourse || selectedCourses.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-card border border-border-default text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">Ruta de Aprendizaje No Disponible</h4>
        <p className="text-xs text-slate-muted max-w-md mx-auto">
          Selecciona al menos un curso temático en la pestaña anterior para visualizar la ruta didáctica real de la cohorte.
        </p>
        <button
          type="button"
          onClick={onBackToGeneral}
          className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer"
        >
          ← Ir a Seleccionar Cursos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selector de Cursos si hay más de 1 curso asignado al aula */}
      {selectedCourses.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-card rounded-2xl border border-border-default">
          <span className="text-[11px] font-mono text-slate-subtle px-2 font-bold uppercase">
            Cursos del Aula:
          </span>
          {selectedCourses.map((c, idx) => {
            const isSelected = activeCourseIdx === idx;
            return (
              <button
                key={c.id || idx}
                type="button"
                onClick={() => setActiveCourseIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-canvas"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{c.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Mapa de Ruta Real Unificado */}
      <CourseJourneyTab
        key={filteredCourse.id}
        course={filteredCourse}
        onSelectLesson={() => {}}
        onNavigateToCards={onBackToGeneral}
        onNavigateToGames={onBackToGeneral}
        onSpeak={handleSpeak}
      />
    </div>
  );
}
