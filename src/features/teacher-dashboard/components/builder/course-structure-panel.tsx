"use client";

import { Plus, AlertTriangle, Database, FileEdit } from "lucide-react";
import { Course, Lesson, LessonItem } from "../../types";

interface CourseStructurePanelProps {
  currentCourse: Course;
  currentLessonId: string;
  linkedClassroom?: {
    name: string;
    stumble: Array<{ term: string; failRate: string }>;
  };
  onSelectLesson: (lesson: Lesson) => void;
  onOpenAddLessonModal: () => void;
  onOpenVaultDrawer: () => void;
  onOpenAddStepModal: () => void;
}

export function CourseStructurePanel({
  currentCourse,
  currentLessonId,
  linkedClassroom,
  onSelectLesson,
  onOpenAddLessonModal,
  onOpenVaultDrawer,
  onOpenAddStepModal,
}: CourseStructurePanelProps) {
  return (
    <div className="col-span-12 lg:col-span-4 xl:col-span-3 border-r border-border-default bg-card/40 flex flex-col overflow-y-auto">
      <div className="p-3.5 border-b border-border-default flex items-center justify-between bg-card-hover/40 flex-shrink-0">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-muted font-mono">
            Estructura del Curso
          </span>
          <p className="text-[10px] text-slate-subtle">
            {currentCourse.lessons.length} lección
            {currentCourse.lessons.length === 1 ? "" : "es"} programadas
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddLessonModal}
          className="px-2.5 py-1 rounded-lg bg-canvas border border-border-default hover:border-emerald-brand text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3 h-3 stroke-[2.5]" />
          <span>Lección</span>
        </button>
      </div>

      {/* Alerta de Tropiezos del Aula Vinculada */}
      {linkedClassroom?.stumble?.[0] && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1 flex-shrink-0">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Alerta de Aula Vinculada (Stumble List)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            Alumnos del <strong>Aula {linkedClassroom.name}</strong> tienen{" "}
            {linkedClassroom.stumble[0].failRate} de fallos en{" "}
            <em>&apos;{linkedClassroom.stumble[0].term}&apos;</em>. Refuerza esta lección.
          </p>
        </div>
      )}

      {/* Árbol dinámico de lecciones */}
      <div className="p-3 space-y-2 flex-1 overflow-y-auto">
        {currentCourse.lessons.map((lesson) => {
          const isSelected = lesson.id === currentLessonId;
          return (
            <div
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-card border-emerald-brand text-white shadow-sm ring-1 ring-emerald-brand/30"
                  : "bg-canvas border-border-default text-slate-300 hover:border-border-subtle"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{lesson.title}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    isSelected
                      ? "bg-emerald-brand/20 text-emerald-brand"
                      : "bg-card text-slate-subtle"
                  }`}
                >
                  {lesson.duration}
                </span>
              </div>
              <p className="text-[10px] text-slate-subtle mt-1 truncate">
                {lesson.subtitle}
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-muted">
                <span>{lesson.items.length} tarjetas</span>
                <span className="text-emerald-brand">{lesson.tier}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Acciones inferiores de la estructura */}
      <div className="p-3 border-t border-border-default bg-card/60 space-y-2 flex-shrink-0">
        <button
          type="button"
          onClick={onOpenVaultDrawer}
          className="w-full py-2.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Database className="w-3.5 h-3.5" />
          <span>+ Importar desde Content Vault</span>
        </button>
        <button
          type="button"
          onClick={onOpenAddStepModal}
          className="w-full py-2 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand/40 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>Redactar Tarjeta Manual</span>
        </button>
      </div>
    </div>
  );
}
