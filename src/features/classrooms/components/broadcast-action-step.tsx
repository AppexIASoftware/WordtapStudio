"use client";

import { BookOpen, Layers, Loader2 } from "lucide-react";
import { CourseOption, LessonOption } from "../hooks/use-classroom-courses";

interface BroadcastActionStepProps {
  actionType: "open_classroom" | "open_content";
  courses: CourseOption[];
  lessons: LessonOption[];
  selectedCourseId: string;
  selectedLessonId: string;
  onSelectCourseId: (id: string) => void;
  onSelectLessonId: (id: string) => void;
  selectedCourse?: CourseOption | null;
  selectedLesson?: LessonOption | null;
  isLoadingLessons: boolean;
}

export function BroadcastActionStep({
  actionType,
  courses,
  lessons,
  selectedCourseId,
  selectedLessonId,
  onSelectCourseId,
  onSelectLessonId,
  selectedCourse,
  selectedLesson,
  isLoadingLessons,
}: BroadcastActionStepProps) {
  if (actionType !== "open_content") {
    return (
      <div className="p-3.5 rounded-2xl bg-canvas/50 border border-border-default text-center">
        <p className="text-xs text-slate-300">El aviso abrirá directamente la pantalla del aula.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3.5 rounded-2xl bg-canvas/50 border border-border-default animate-in fade-in">
      {/* 1. Selección de Curso (Obligatorio) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-300">
          Curso Destino <span className="text-emerald-brand">*</span>
        </label>
        <select
          value={selectedCourseId}
          onChange={(e) => onSelectCourseId(e.target.value)}
          className="w-full bg-canvas border border-border-default focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none transition-all cursor-pointer font-medium"
          required
        >
          <option value="">-- Elige el curso vinculado al aula --</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Selección de Lección (Opcional en Cascada) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-300">
            Lección Específica <span className="text-slate-muted font-normal">(Opcional)</span>
          </label>
          {isLoadingLessons && (
            <span className="text-[10px] text-emerald-brand flex items-center gap-1 font-mono">
              <Loader2 className="w-3 h-3 animate-spin" /> Cargando lecciones...
            </span>
          )}
        </div>

        <select
          value={selectedLessonId}
          onChange={(e) => onSelectLessonId(e.target.value)}
          disabled={!selectedCourseId || isLoadingLessons}
          className="w-full bg-canvas border border-border-default focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none transition-all cursor-pointer disabled:opacity-50"
        >
          <option value="">Todo el curso (Portada y temario completo)</option>
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.title}
            </option>
          ))}
        </select>
      </div>

      {/* Tarjeta de Confirmación de Destino */}
      {selectedLesson ? (
        <div className="p-3 rounded-xl bg-card border border-emerald-brand/30 flex items-center justify-between text-xs animate-in fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-brand flex-shrink-0" />
            <div>
              <p className="font-semibold text-white">{selectedLesson.title}</p>
              <p className="text-[10.5px] text-slate-muted">Curso: {selectedCourse?.title}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/20 font-semibold">
            Destino: Lección directa
          </span>
        </div>
      ) : selectedCourse ? (
        <div className="p-3 rounded-xl bg-card border border-border-default flex items-center justify-between text-xs animate-in fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-brand flex-shrink-0" />
            <div>
              <p className="font-semibold text-white">{selectedCourse.title}</p>
              <p className="text-[10.5px] text-slate-muted">Se abrirá el temario completo</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-canvas text-slate-300 border border-border-default font-semibold">
            Destino: Portada del curso
          </span>
        </div>
      ) : null}
    </div>
  );
}
