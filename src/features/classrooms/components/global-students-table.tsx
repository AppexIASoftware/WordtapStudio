"use client";

import { Search, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { GlobalStudent } from "@/features/classrooms/types";
import { ApiGlobalCourseOption } from "@/services/api";
import {
  GLOBAL_LEVEL_FILTER,
  GLOBAL_PLAN_FILTER,
  GLOBAL_STATUS_FILTER,
  GlobalLevelFilter,
  GlobalPlanFilter,
  GlobalStatusFilter,
} from "../hooks/use-global-students";

interface GlobalStudentsTableProps {
  students: GlobalStudent[];
  courses: ApiGlobalCourseOption[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  planFilter: GlobalPlanFilter;
  onPlanFilterChange: (plan: GlobalPlanFilter) => void;
  levelFilter: GlobalLevelFilter;
  onLevelFilterChange: (level: GlobalLevelFilter) => void;
  courseFilter: string;
  onCourseFilterChange: (courseId: string) => void;
  allowCoursePurchaseFilter?: boolean;
  showStatusColumn?: boolean;
  statusFilter?: GlobalStatusFilter;
  onStatusFilterChange?: (status: GlobalStatusFilter) => void;
  onSelectStudent?: (student: GlobalStudent) => void;
  isLoading?: boolean;
}

export function GlobalStudentsTable({
  students,
  courses,
  total,
  page,
  pageSize,
  onPageChange,
  searchQuery,
  onSearchChange,
  planFilter,
  onPlanFilterChange,
  levelFilter,
  onLevelFilterChange,
  courseFilter,
  onCourseFilterChange,
  allowCoursePurchaseFilter = false,
  showStatusColumn = false,
  statusFilter = GLOBAL_STATUS_FILTER.ALL,
  onStatusFilterChange,
  onSelectStudent,
  isLoading = false,
}: GlobalStudentsTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-card border border-border-default flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-subtle" />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-canvas border border-border-default rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-brand"
            />
          </div>

          <select
            aria-label="Filtrar por plan"
            value={planFilter}
            onChange={(e) => onPlanFilterChange(e.target.value as GlobalPlanFilter)}
            className="px-3 py-2 bg-canvas border border-border-default rounded-xl text-xs text-slate-200 outline-none focus:border-emerald-brand cursor-pointer"
          >
            <option value={GLOBAL_PLAN_FILTER.ALL}>Todos los planes</option>
            <option value={GLOBAL_PLAN_FILTER.SUBSCRIPTION}>Suscripción Activa</option>
            {allowCoursePurchaseFilter && (
              <option value={GLOBAL_PLAN_FILTER.COURSE}>Curso Comprado</option>
            )}
            <option value={GLOBAL_PLAN_FILTER.FREE}>Plan Gratuito</option>
          </select>

          <select
            aria-label="Filtrar por nivel"
            value={levelFilter}
            onChange={(e) => onLevelFilterChange(e.target.value as GlobalLevelFilter)}
            className="px-3 py-2 bg-canvas border border-border-default rounded-xl text-xs text-slate-200 outline-none focus:border-emerald-brand cursor-pointer"
          >
            <option value={GLOBAL_LEVEL_FILTER.ALL}>Todos los niveles</option>
            <option value={GLOBAL_LEVEL_FILTER.BEGINNER}>Beginner (A1)</option>
            <option value={GLOBAL_LEVEL_FILTER.INTERMEDIATE}>Intermediate (B1)</option>
            <option value={GLOBAL_LEVEL_FILTER.ADVANCED}>Advanced (C1)</option>
          </select>

          <select
            aria-label="Filtrar por curso"
            value={courseFilter}
            onChange={(e) => onCourseFilterChange(e.target.value)}
            className="px-3 py-2 bg-canvas border border-border-default rounded-xl text-xs text-slate-200 outline-none focus:border-emerald-brand cursor-pointer max-w-[200px]"
          >
            <option value="all">Todos los cursos</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          {showStatusColumn && onStatusFilterChange && (
            <select
              aria-label="Filtrar por estado"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as GlobalStatusFilter)}
              className="px-3 py-2 bg-canvas border border-border-default rounded-xl text-xs text-slate-200 outline-none focus:border-emerald-brand cursor-pointer"
            >
              <option value={GLOBAL_STATUS_FILTER.ALL}>Todos los estados</option>
              <option value={GLOBAL_STATUS_FILTER.ACTIVE}>Activos</option>
              <option value={GLOBAL_STATUS_FILTER.SUSPENDED}>Suspendidos</option>
            </select>
          )}
        </div>

        <span className="text-xs font-mono text-slate-subtle whitespace-nowrap">
          Total registrados: <strong className="text-white">{total} estudiantes</strong>
        </span>
      </div>

      <div className="bg-card border border-border-default rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Estudiante Global</th>
                  <th className="p-3.5">Curso Reciente</th>
                  <th className="p-3.5">Nivel CEFR</th>
                  <th className="p-3.5">Racha Actual</th>
                  <th className="p-3.5">Progreso</th>
                  <th className="p-3.5">Plan de Acceso</th>
                  {showStatusColumn && <th className="p-3.5">Estado</th>}
                  <th className="p-3.5 text-right">Última Sesión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default animate-pulse">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-border-default shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 rounded bg-border-default" />
                          <div className="h-2.5 w-36 rounded bg-card-hover" />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5"><div className="h-3 w-32 rounded bg-border-default" /></td>
                    <td className="p-3.5"><div className="h-5 w-20 rounded bg-card-hover" /></td>
                    <td className="p-3.5"><div className="h-3 w-14 rounded bg-border-default" /></td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-card-hover" />
                        <div className="h-3 w-8 rounded bg-border-default" />
                      </div>
                    </td>
                    <td className="p-3.5"><div className="h-5 w-24 rounded bg-card-hover" /></td>
                    {showStatusColumn && (
                      <td className="p-3.5"><div className="h-5 w-16 rounded bg-card-hover" /></td>
                    )}
                    <td className="p-3.5 text-right"><div className="h-3 w-16 rounded bg-border-default ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-card-hover flex items-center justify-center text-slate-400">
              <Globe className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-white">No se encontraron estudiantes globales</p>
            <p className="text-[11px] text-slate-muted">
              Intenta ajustar los filtros de plan, nivel, curso o búsqueda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Estudiante Global</th>
                  <th className="p-3.5">Curso Reciente</th>
                  <th className="p-3.5">Nivel CEFR</th>
                  <th className="p-3.5">Racha Actual</th>
                  <th className="p-3.5">Progreso</th>
                  <th className="p-3.5">Plan de Acceso</th>
                  {showStatusColumn && <th className="p-3.5">Estado</th>}
                  <th className="p-3.5 text-right">Última Sesión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {students.map((st) => (
                  <tr
                    key={st.id}
                    onClick={onSelectStudent ? () => onSelectStudent(st) : undefined}
                    className={`hover:bg-card-hover/40 transition-colors ${
                      onSelectStudent ? "cursor-pointer" : ""
                    }`}
                  >
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
                    {showStatusColumn && (
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                            (st.isActive ?? true)
                              ? "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          {(st.isActive ?? true) ? "Activo" : "Suspendido"}
                        </span>
                      </td>
                    )}
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

      {total > pageSize && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-card border border-border-default text-xs">
          <span className="text-slate-muted font-mono">
            Mostrando <strong className="text-white">{from}</strong>–
            <strong className="text-white">{to}</strong> de{" "}
            <strong className="text-white">{total}</strong> estudiantes
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand/40 text-slate-300 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
            <span className="px-2.5 font-mono text-slate-300">
              Página {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand/40 text-slate-300 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
