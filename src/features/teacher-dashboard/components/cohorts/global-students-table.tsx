"use client";

import { Search, Globe } from "lucide-react";
import { GlobalStudent } from "../../types";

interface GlobalStudentsTableProps {
  students: GlobalStudent[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function GlobalStudentsTable({
  students,
  searchQuery,
  onSearchChange,
}: GlobalStudentsTableProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-card border border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-subtle" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o curso del catálogo..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-canvas border border-border-default rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-brand"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-subtle">
            Total telemetría activa: <strong>1,428 estudiantes</strong>
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Demo
          </span>
        </div>
      </div>

      <div className="bg-card border border-border-default rounded-2xl overflow-hidden shadow-sm">
        {students.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-card-hover flex items-center justify-center text-slate-400">
              <Globe className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-white">No se encontraron estudiantes globales</p>
            <p className="text-[11px] text-slate-muted">
              Intenta ajustar los términos de búsqueda o limpiar el filtro.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Estudiante Global</th>
                  <th className="p-3.5">Curso Inscrito</th>
                  <th className="p-3.5">Nivel CEFR</th>
                  <th className="p-3.5">Racha Actual</th>
                  <th className="p-3.5">Progreso</th>
                  <th className="p-3.5">Plan de Acceso</th>
                  <th className="p-3.5 text-right">Última Sesión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-card-hover/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs font-mono">
                          {st.initials}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{st.name}</p>
                          <p className="text-[10px] text-slate-subtle">{st.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-200">{st.course}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-canvas border border-border-default text-slate-200">
                        {st.cefr}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-emerald-brand">{st.streak}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-canvas rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-brand rounded-full"
                            style={{ width: `${st.progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-white">{st.progress}%</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/20">
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
