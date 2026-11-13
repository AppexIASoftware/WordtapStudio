"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { ContentReport } from "../types";
import { REPORT_TRIAGE_ACTION, type ReportTriageAction } from "./report-triage-modal";

export type ContentReportItem = ContentReport & { course_id?: string };

interface ContentReportsTableProps {
  reports: ContentReportItem[];
  onRequestTriage: (report: ContentReportItem, action: ReportTriageAction) => void;
  onToast: (message: string) => void;
}

/** Reportes de estudiantes con su triaje. */
export function ContentReportsTable({ reports, onRequestTriage, onToast }: ContentReportsTableProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1 shadow-card-soft">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-400" />
          <span>Incidencias Reportadas por Estudiantes en la App Móvil</span>
        </h3>
        <p className="text-xs text-slate-muted">
          Reportes generados desde el botón de retroalimentación de la app WordTap. Resuelve
          dudas o corrige palabras erróneas directamente.
        </p>
      </div>

      <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-card-soft text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3.5">ID Reporte</th>
                <th className="p-3.5">Alumno Reportante</th>
                <th className="p-3.5">Lección / Minijuego Afectado</th>
                <th className="p-3.5">Motivo del Reporte</th>
                <th className="p-3.5">Descripción de la Falla</th>
                <th className="p-3.5">Fecha</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right">Triaje / Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default font-medium">
              {reports.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-muted">
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-brand/70" />
                      <p className="font-semibold text-white">Sin incidencias pendientes</p>
                      <p className="text-[11px]">
                        No hay reportes de estudiantes registrados en este momento.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {reports.map((rep) => {
                const isResolved = rep.status === "resolved";
                const isReviewing = rep.status === "reviewing";
                const isOpen = rep.status === "open";

                return (
                  <tr
                    key={rep.id}
                    className="hover:bg-card-hover/50 transition-colors"
                  >
                    <td className="p-3.5 font-mono font-bold text-amber-400">
                      {rep.id}
                    </td>

                    <td className="p-3.5">
                      <p className="font-bold text-white">{rep.reporter_name}</p>
                      <p className="text-[10px] text-slate-subtle font-mono">
                        {rep.reporter_email}
                      </p>
                    </td>

                    <td className="p-3.5">
                      <p className="font-semibold text-slate-200">
                        {rep.lesson_title}
                      </p>
                      {rep.item_affected && (
                        <p className="text-[10px] text-mint-brand font-mono">
                          {rep.item_affected}
                        </p>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          rep.badgeColor === "rose"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : rep.badgeColor === "amber"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        }`}
                      >
                        {rep.reason}
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-300 text-xs max-w-xs leading-relaxed">
                      {rep.description}
                    </td>

                    <td className="p-3.5 font-mono text-slate-subtle whitespace-nowrap">
                      {rep.date}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      {isOpen && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold text-[10px]">
                          Abierto (Pendiente)
                        </span>
                      )}
                      {isReviewing && (
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold text-[10px]">
                          En Revisión
                        </span>
                      )}
                      {isResolved && (
                        <span className="px-2 py-0.5 rounded bg-emerald-brand/20 text-emerald-brand font-mono font-bold text-[10px]">
                          Resuelto
                        </span>
                      )}
                      {rep.status === "dismissed" && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
                          Descartado
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      {!isResolved && (
                        <button
                          type="button"
                          onClick={() => onRequestTriage(rep, REPORT_TRIAGE_ACTION.RESOLVED)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer mr-1.5"
                        >
                          Resolver
                        </button>
                      )}
                      {rep.course_id ? (
                        <Link
                          href={`/moderator/courses?courseId=${rep.course_id}&from=/admin/audit?tab=reports`}
                          className="inline-block px-2.5 py-1 rounded-lg bg-canvas border border-border-default hover:border-emerald-brand text-xs font-semibold text-slate-200 transition-colors mr-1.5"
                        >
                          Corregir
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            onToast(`Este reporte no tiene un curso asociado para abrir en el visor.`)
                          }
                          className="px-2.5 py-1 rounded-lg bg-canvas border border-border-default hover:border-emerald-brand text-xs font-semibold text-slate-200 transition-colors cursor-pointer mr-1.5"
                        >
                          Corregir
                        </button>
                      )}
                      {isOpen && (
                        <button
                          type="button"
                          onClick={() => onRequestTriage(rep, REPORT_TRIAGE_ACTION.DISMISSED)}
                          className="text-xs text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          Descartar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
