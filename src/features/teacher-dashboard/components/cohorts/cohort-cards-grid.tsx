"use client";

import { Copy, Share2, Users, Eye } from "lucide-react";
import { Classroom } from "../../types";

interface CohortCardsGridProps {
  classrooms: Classroom[];
  selectedClassId: string;
  onSelectClassroom: (id: string) => void;
  onCopyCode: (code: string) => void;
  onShareWhatsApp: (name: string, code: string) => void;
  onOpenClassroomDetail: (classroom: Classroom) => void;
}

export function CohortCardsGrid({
  classrooms,
  selectedClassId,
  onSelectClassroom,
  onCopyCode,
  onShareWhatsApp,
  onOpenClassroomDetail,
}: CohortCardsGridProps) {
  if (classrooms.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-card border border-border-default text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center">
          <Users className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">No tienes aulas activas</h4>
        <p className="text-xs text-slate-muted max-w-sm mx-auto">
          Crea tu primera cohorte privada para invitar a tus estudiantes mediante un código único de acceso.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {classrooms.map((cls) => {
        const isSelected = cls.id === selectedClassId;
        return (
          <div
            key={cls.id}
            onClick={() => onSelectClassroom(cls.id)}
            className={`p-5 rounded-2xl bg-card shadow-sm space-y-4 relative cursor-pointer transition-all ${
              isSelected
                ? "border-2 border-emerald-brand/50 ring-1 ring-emerald-brand/30"
                : "border border-border-default hover:border-emerald-brand/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    cls.level.includes("B1")
                      ? "bg-emerald-brand/20 text-emerald-brand border-emerald-brand/30"
                      : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  }`}
                >
                  {cls.level}
                </span>
                {cls.isDemo && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Demo
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-subtle font-mono">{cls.created}</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{cls.name}</h3>
              <p className="text-xs text-slate-muted mt-0.5">
                {cls.studentsCount} estudiantes matriculados
              </p>
            </div>

            {/* Código de Invitación con Copiar & Compartir */}
            <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-subtle font-mono">Código de Invitación:</span>
                <strong className="font-mono text-mint-brand text-xs tracking-wider">
                  {cls.code}
                </strong>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyCode(cls.code);
                  }}
                  className="w-full py-1.5 rounded-lg bg-card border border-border-default hover:border-emerald-brand text-slate-200 hover:text-white text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copiar Código</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShareWhatsApp(cls.name, cls.code);
                  }}
                  className="w-full py-1.5 rounded-lg bg-emerald-brand/10 border border-emerald-brand/30 text-emerald-brand hover:bg-emerald-brand/20 text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3 h-3" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Estado de acceso de los alumnos */}
            <div className="pt-2 border-t border-border-default flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-muted">Planes de Alumnos:</span>
              <div className="flex items-center gap-2">
                <span className="text-emerald-brand font-bold">{cls.stats.sub} Activo</span>
                <span className="text-amber-400">{cls.stats.trial} Prueba</span>
                <span className="text-slate-500">{cls.stats.free} Básico</span>
              </div>
            </div>

            {/* Curso Vinculado y Navegación Rápida */}
            <div className="pt-2 border-t border-border-default/80 flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-1.5 text-slate-300 truncate min-w-0">
                <span className="text-[10px] font-mono text-slate-muted uppercase flex-shrink-0">
                  {cls.assignedCourses && cls.assignedCourses.length > 1
                    ? `Cursos (${cls.assignedCourses.length}):`
                    : "Curso:"}
                </span>
                <span className="font-bold text-white text-xs truncate">
                  {cls.courseTitle}
                  {cls.assignedCourses && cls.assignedCourses.length > 1 && (
                    <span className="text-emerald-brand font-mono text-[10px] ml-1">
                      +{cls.assignedCourses.length - 1} más
                    </span>
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectClassroom(cls.id);
                  onOpenClassroomDetail(cls);
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-brand/10 border border-emerald-brand/30 text-emerald-brand hover:bg-emerald-brand hover:text-canvas text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                title="Ver detalle del aula y configuración pedagógica"
              >
                <span>Ver Detalle de Aula</span>
                <Eye className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
