"use client";

import { Search, UserCheck } from "lucide-react";
import { ClassroomStudent } from "@/features/classrooms/types";

interface CohortStudentTableProps {
  students: ClassroomStudent[];
  totalStudents: number;
  stats: {
    sub: number;
    trial: number;
    free: number;
    scholar: number;
  };
  classroomName: string;
  isDemo?: boolean;
  filter: "all" | "subscription" | "trial" | "free" | "stumbled";
  onFilterChange: (filter: "all" | "subscription" | "trial" | "free" | "stumbled") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CohortStudentTable({
  students,
  totalStudents,
  stats,
  classroomName,
  isDemo = false,
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: CohortStudentTableProps) {
  const filterTabs = [
    { id: "all", label: "Todos", count: totalStudents },
    { id: "subscription", label: "Suscripción Activa", count: stats.sub },
    { id: "trial", label: "En Prueba", count: stats.trial },
    { id: "free", label: "Plan Gratuito", count: stats.free },
    { id: "stumbled", label: "Rezagados (<75%)", count: students.filter((s) => parseInt(s.accuracy) < 75).length },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span>Estudiantes en el Aula: &apos;{classroomName}&apos;</span>
          {isDemo && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Demo
            </span>
          )}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          {filterTabs.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onFilterChange(f.id)}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === f.id
                  ? "bg-canvas text-emerald-brand font-bold border border-emerald-brand/40 shadow-sm"
                  : "bg-card border border-border-default text-slate-muted hover:text-white"
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border-default rounded-2xl overflow-hidden shadow-sm">
        <div className="p-3.5 border-b border-border-default bg-card-hover/40 flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-subtle" />
            <input
              type="text"
              placeholder="Buscar estudiante por nombre o correo..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-canvas rounded-xl border border-border-default text-xs text-white placeholder-slate-500 focus:border-emerald-brand outline-none"
            />
          </div>
          <span className="text-xs font-mono text-slate-subtle">
            Mostrando {students.length} estudiantes
          </span>
        </div>

        {students.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-card-hover flex items-center justify-center text-slate-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-white">No se encontraron estudiantes</p>
            <p className="text-[11px] text-slate-muted">
              Comparte el código de invitación del aula para que tus alumnos se matriculen.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Estudiante</th>
                  <th className="p-3.5">Nivel CEFR</th>
                  <th className="p-3.5">Racha & Palabras</th>
                  <th className="p-3.5">Precisión Minijuegos</th>
                  <th className="p-3.5">Plan de Acceso</th>
                  <th className="p-3.5 text-right">Última Actividad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-card-hover/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-brand/20 text-emerald-brand flex items-center justify-center font-bold text-xs font-mono">
                          {st.initials}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{st.name}</p>
                          <p className="text-[10px] text-slate-subtle">{st.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-canvas border border-border-default text-slate-200">
                        {st.level}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <span className="font-semibold text-white">{st.streak}</span> •{" "}
                      <span className="text-slate-subtle">{st.words} palabras</span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-canvas rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              parseInt(st.accuracy) >= 80 ? "bg-emerald-brand" : "bg-amber-400"
                            }`}
                            style={{ width: st.accuracy }}
                          />
                        </div>
                        <span className="font-mono font-bold text-[11px] text-white">
                          {st.accuracy}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                          st.payStatus === "subscription" || st.payStatus === "course_purchased"
                            ? "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/20"
                            : st.payStatus === "trial"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        }`}
                      >
                        {st.payLabel}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-muted text-[11px] font-mono text-right">
                      {st.lastActive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
