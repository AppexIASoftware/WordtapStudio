"use client";

import Link from "next/link";
import { Plus, DollarSign, Download, Smartphone, CheckCircle2 } from "lucide-react";
import { Course } from "../../types";

interface BuilderHeaderProps {
  courses: Record<string, Course>;
  currentCourseId: string;
  currentCourse: Course;
  linkedClassroomName?: string;
  totalLinkedStudents?: number;
  onSelectCourse: (courseId: string) => void;
  onOpenNewCourseModal: () => void;
  onOpenPricingModal: () => void;
  onOpenExportModal: () => void;
  onOpenPlaytestDrawer: () => void;
  onSubmitReview: () => void;
}

export function BuilderHeader({
  courses,
  currentCourseId,
  currentCourse,
  linkedClassroomName,
  totalLinkedStudents = 0,
  onSelectCourse,
  onOpenNewCourseModal,
  onOpenPricingModal,
  onOpenExportModal,
  onOpenPlaytestDrawer,
  onSubmitReview,
}: BuilderHeaderProps) {
  return (
    <div className="h-14 border-b border-border-default bg-card px-4 md:px-6 flex items-center justify-between flex-shrink-0 gap-3">
      <div className="flex items-center gap-2.5 overflow-x-auto">
        <span className="text-xs font-mono text-slate-muted uppercase tracking-wider flex-shrink-0">
          Curso Activo:
        </span>
        <select
          value={currentCourseId}
          onChange={(e) => onSelectCourse(e.target.value)}
          className="bg-canvas border border-border-default rounded-xl px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-brand cursor-pointer flex-shrink-0"
        >
          {Object.values(courses).map((c) => (
            <option key={c.id} value={c.id}>
              {c.title} ({c.level})
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onOpenNewCourseModal}
          className="px-2.5 py-1.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1 cursor-pointer shadow-sm flex-shrink-0"
          title="Crear un nuevo curso dentro de tu cuota de autor"
        >
          <Plus className="w-3 h-3 stroke-[2.5]" />
          <span>+ Nuevo Curso</span>
        </button>

        {/* Indicador de aula vinculada */}
        <Link
          href="/teacher/students"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono text-[11px] font-bold cursor-pointer hover:bg-purple-500/20 transition-all flex-shrink-0"
          title="Aula asociada a este curso. Haz clic para ir a Alumnos & Aulas."
        >
          <span>🏫</span>
          <span>
            {linkedClassroomName
              ? `Aula: ${linkedClassroomName} (${totalLinkedStudents} alumnos)`
              : "Sin aula asignada (Catálogo General)"}
          </span>
        </Link>

        <span className="hidden xl:inline text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-brand/10 text-emerald-brand font-bold border border-emerald-brand/20 flex-shrink-0">
          100% Nativo Interactivo (ADR-04)
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onOpenPricingModal}
          className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Configurar precio standalone del curso y split 70/30 (ADR-05)"
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-brand" />
          <span>Precio:</span>
          <span className="text-emerald-brand font-mono font-bold">
            ${currentCourse.price.toFixed(2)} {currentCourse.currency}
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenExportModal}
          className="hidden md:flex px-3 py-1.5 rounded-xl bg-canvas border border-border-default hover:border-border-subtle text-xs font-medium text-slate-300 transition-colors items-center gap-1.5 cursor-pointer"
          title="Exportar copia de seguridad del curso"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar</span>
        </button>

        <button
          type="button"
          onClick={onOpenPlaytestDrawer}
          className="px-3 py-1.5 rounded-xl bg-card border border-emerald-brand/50 hover:border-emerald-brand text-emerald-brand hover:bg-emerald-brand/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          title="Abrir Simulador de Playtest Móvil en drawer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Simulador Móvil</span>
        </button>

        <button
          type="button"
          onClick={onSubmitReview}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Enviar a Revisión</span>
        </button>
      </div>
    </div>
  );
}
