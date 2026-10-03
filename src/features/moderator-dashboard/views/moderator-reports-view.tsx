"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
} from "lucide-react";
import { CONTENT_REPORTS_DATA } from "../data/mock-moderator-data";
import { ContentReport } from "../types";
import { ToastNotification } from "@/components/ui/toast-notification";

export function ModeratorReportsView() {
  const [reports, setReports] = useState<ContentReport[]>(CONTENT_REPORTS_DATA);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResolve = (id: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "resolved", resolvedBy: "Lic. Elena Ramos" } : r
      )
    );
    triggerToast(`Reporte ${id} marcado como Resuelto con éxito`);
  };

  const handleDismiss = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "dismissed" } : r))
    );
    triggerToast(`Reporte ${id} descartado`);
  };

  const filteredReports = reports.filter((rep) => {
    if (statusFilter !== "all" && rep.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        rep.reporterName.toLowerCase().includes(q) ||
        rep.description.toLowerCase().includes(q) ||
        rep.itemAffected.toLowerCase().includes(q) ||
        rep.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getReasonBadge = (reason: string, badgeColor: ContentReport["badgeColor"]) => {
    const colorClasses =
      badgeColor === "rose"
        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
        : badgeColor === "amber"
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : badgeColor === "purple"
        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
        : "bg-blue-500/10 text-blue-400 border-blue-500/20";

    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${colorClasses}`}>
        {reason}
      </span>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Toast flotante */}
      <ToastNotification message={toastMessage} variant="blue" />

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Incidencias Reportadas por Estudiantes en la App Móvil
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ADR-21 Triaje
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            Reportes generados desde el botón de retroalimentación de la app WordTap. Resuelve dudas o corrige palabras erróneas directamente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-card border border-border-default text-xs font-mono text-slate-300">
            Pendientes:{" "}
            <strong className="text-amber-400">
              {reports.filter((r) => r.status === "open").length}
            </strong>
          </span>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-4 rounded-2xl bg-card border border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: "all", label: "Todos", count: reports.length },
            {
              id: "open",
              label: "Abiertos (Pendientes)",
              count: reports.filter((r) => r.status === "open").length,
            },
            {
              id: "reviewing",
              label: "En Revisión",
              count: reports.filter((r) => r.status === "reviewing").length,
            },
            {
              id: "resolved",
              label: "Resueltos",
              count: reports.filter((r) => r.status === "resolved").length,
            },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
                statusFilter === f.id
                  ? "bg-canvas text-blue-300 font-bold border border-blue-500/40 shadow-sm"
                  : "bg-card border border-border-default text-slate-muted hover:text-white"
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-subtle" />
          <input
            type="text"
            placeholder="Buscar por alumno o palabra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-canvas rounded-xl border border-border-default text-xs text-white placeholder-slate-500 focus:border-blue-400 outline-none"
          />
        </div>
      </div>

      {/* Tabla de Reportes (Content Reports Table) */}
      <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-sm text-xs">
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
              {filteredReports.map((rep) => (
                <tr key={rep.id} className="hover:bg-card-hover/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-amber-400">{rep.id}</td>
                  <td className="p-3.5">
                    <p className="font-bold text-white">{rep.reporterName}</p>
                    <p className="text-[10px] text-slate-subtle font-mono">{rep.reporterEmail}</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-semibold text-slate-200">{rep.lessonTitle}</p>
                    <p className="text-[10px] text-mint-brand font-mono">{rep.itemAffected}</p>
                  </td>
                  <td className="p-3.5">{getReasonBadge(rep.reason, rep.badgeColor)}</td>
                  <td className="p-3.5 text-slate-300 text-xs max-w-xs leading-relaxed">
                    {rep.description}
                  </td>
                  <td className="p-3.5 font-mono text-slate-subtle whitespace-nowrap">
                    {rep.date}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    {rep.status === "open" ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold text-[10px]">
                        Abierto (Pendiente)
                      </span>
                    ) : rep.status === "reviewing" ? (
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold text-[10px]">
                        En Revisión
                      </span>
                    ) : rep.status === "resolved" ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-brand/20 text-emerald-brand font-mono font-bold text-[10px]">
                        Resuelto ✓
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
                        Descartado
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    {rep.status !== "resolved" && (
                      <button
                        type="button"
                        onClick={() => handleResolve(rep.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer mr-1"
                      >
                        Resolver
                      </button>
                    )}
                    <Link
                      href="/moderator/vault"
                      className="px-2.5 py-1 rounded-lg bg-canvas border border-border-default hover:border-blue-400 text-xs font-semibold text-slate-200 transition-colors inline-block mr-1"
                    >
                      Corregir
                    </Link>
                    {rep.status === "open" && (
                      <button
                        type="button"
                        onClick={() => handleDismiss(rep.id)}
                        className="text-xs text-slate-500 hover:text-rose-400 cursor-pointer"
                      >
                        Descartar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
