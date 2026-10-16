"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Smartphone, CheckCircle2 } from "lucide-react";
import { Course } from "@/features/courses/types";

interface ModeratorCoursesHeaderProps {
  returnUrl: string;
  queryCourseId: string | null;
  currentCourse: Course;
  courseList: { id: string; title: string; status?: string }[];
  selectedCourseId: string;
  onSelectCourseId: (id: string) => void;
  hasCurrentLesson: boolean;
  onOpenPlaytest: () => void;
}

/** Barra superior de navegacion y control de auditoria de cursos. */
export function ModeratorCoursesHeader({
  returnUrl,
  queryCourseId,
  currentCourse,
  courseList,
  selectedCourseId,
  onSelectCourseId,
  hasCurrentLesson,
  onOpenPlaytest,
}: ModeratorCoursesHeaderProps) {
  return (
    <div className="h-14 border-b border-border-default bg-card px-4 md:px-6 flex items-center justify-between flex-shrink-0 gap-3">
      <div className="flex items-center gap-2.5 overflow-x-auto min-w-0">
        <Link
          href={returnUrl}
          className="p-1.5 rounded-xl bg-canvas border border-border-default hover:border-blue-400 text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
          title="Volver a la cola de revisiones y solicitudes"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        {queryCourseId ? (
          <div className="flex items-center gap-2 max-w-[260px] md:max-w-sm truncate">
            <span className="text-xs font-mono text-slate-muted uppercase tracking-wider flex-shrink-0 hidden sm:inline">
              Curso:
            </span>
            <span className="text-xs font-bold text-white bg-canvas px-3 py-1.5 rounded-xl border border-border-default truncate">
              {currentCourse.title}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-300 font-bold flex-shrink-0">
              {(currentCourse.status as string) === "in_review" || (currentCourse.status as string) === "pending"
                ? "• En Revisión"
                : (currentCourse.status as string) === "changes_requested"
                ? "• Correcciones"
                : "• Auditoría"}
            </span>
          </div>
        ) : (
          <>
            <span className="text-xs font-mono text-slate-muted uppercase tracking-wider flex-shrink-0 hidden sm:inline">
              Curso:
            </span>

            <select
              value={selectedCourseId}
              onChange={(e) => onSelectCourseId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default text-xs font-semibold text-white focus:border-blue-500 outline-none cursor-pointer truncate max-w-[220px] md:max-w-xs"
            >
              {courseList.map((c) => (
                <option key={c.id} value={c.id} className="bg-canvas text-white">
                  {c.title}{" "}
                  {c.status === "in_review" || c.status === "pending"
                    ? "• [En Revisión]"
                    : c.status === "changes_requested"
                    ? "• [Correcciones Pedidas]"
                    : ""}
                </option>
              ))}
            </select>
          </>
        )}

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold flex-shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Auditoría Solo Lectura</span>
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-slate-muted hidden md:inline truncate">
          Docente: <strong className="text-slate-200">{currentCourse.author}</strong>
        </span>

        {hasCurrentLesson && (
          <button
            type="button"
            onClick={onOpenPlaytest}
            className="px-3 py-1.5 rounded-xl bg-card border border-emerald-brand/50 hover:border-emerald-brand text-emerald-brand hover:bg-emerald-brand/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Abrir Simulador Móvil React Native en Drawer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Playtest Móvil</span>
          </button>
        )}

        <Link
          href={returnUrl}
          className="px-3.5 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Emitir Dictamen</span>
        </Link>
      </div>
    </div>
  );
}
