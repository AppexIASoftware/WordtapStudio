import Link from "next/link";
import { COURSE_PIPELINE } from "../data/mock-teacher-data";
import { Layers, Plus } from "lucide-react";

interface TeacherPipelineProps {
  onNewCourse?: () => void;
}

export function TeacherPipeline({ onNewCourse }: TeacherPipelineProps) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border-default space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white">Pipeline de Cursos</h4>
        <span className="text-[10px] font-mono text-emerald-brand font-semibold">
          Catálogo Activo
        </span>
      </div>

      <div className="space-y-2.5">
        {COURSE_PIPELINE.map((course) => {
          const isAmber = course.badgeVariant === "amber";
          const href = isAmber ? "/teacher/approvals" : "/teacher/builder";

          return (
            <Link
              key={course.id}
              href={href}
              className={`p-3 rounded-xl bg-canvas border flex items-center justify-between cursor-pointer transition-colors block ${
                isAmber
                  ? "border-amber-500/30 hover:border-amber-500"
                  : "border-border-default hover:border-emerald-brand/40"
              }`}
            >
              <div>
                <p
                  className={`text-xs font-semibold ${
                    isAmber ? "text-amber-200" : "text-slate-200"
                  }`}
                >
                  {course.title}
                </p>
                <p className="text-[10px] text-slate-subtle">{course.subtitle}</p>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  isAmber
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-emerald-brand/20 text-emerald-brand border-emerald-brand/30"
                }`}
              >
                {course.badge}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <Link
          href="/teacher/builder"
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-brand to-mint-brand text-canvas font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-emerald hover:opacity-95 transition-opacity cursor-pointer text-center"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Abrir Creador</span>
        </Link>
        <button
          type="button"
          onClick={onNewCourse}
          className="w-full py-2.5 px-3 rounded-xl bg-card border border-emerald-brand/40 text-emerald-brand font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-brand/10 transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Nuevo Curso</span>
        </button>
      </div>
    </div>
  );
}

