"use client";

import { Layers, Loader2 } from "lucide-react";
import { Lesson } from "@/features/courses/types";

interface ModeratorLessonsSidebarProps {
  lessons: Lesson[];
  selectedLessonId: string;
  isLoading: boolean;
  onSelectLessonId: (id: string) => void;
}

/** Panel lateral con la lista de unidades curriculares del curso auditado. */
export function ModeratorLessonsSidebar({
  lessons,
  selectedLessonId,
  isLoading,
  onSelectLessonId,
}: ModeratorLessonsSidebarProps) {
  return (
    <div className="w-72 lg:w-80 border-r border-border-default bg-canvas/60 flex flex-col flex-shrink-0">
      <div className="p-3.5 border-b border-border-default bg-card/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Unidades Curriculares
          </h4>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {lessons.length} unidades
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        {isLoading ? (
          <div className="p-8 text-center text-slate-muted flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            <span className="text-xs font-mono">Cargando lecciones...</span>
          </div>
        ) : lessons.length === 0 ? (
          <div className="p-6 text-center text-slate-muted text-xs">
            No hay lecciones registradas en este curso.
          </div>
        ) : (
          lessons.map((lesson, idx) => {
            const isSelected = lesson.id === selectedLessonId;
            return (
              <div
                key={lesson.id}
                onClick={() => onSelectLessonId(lesson.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? "bg-blue-500/15 border-blue-500/50 text-white shadow-sm"
                    : "bg-card border-border-default hover:border-slate-500 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-mint-brand font-bold">
                    Unidad #{idx + 1}
                  </span>
                  <span className="text-[10px] text-slate-muted font-mono">
                    {lesson.items?.length === 1 ? "1 ficha" : `${lesson.items?.length || 0} fichas`}
                  </span>
                </div>
                <h5 className="font-bold text-white text-xs mt-1 truncate">{lesson.title}</h5>
                {lesson.subtitle && (
                  <p className="text-[11px] text-slate-muted truncate mt-0.5">
                    {lesson.subtitle}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
