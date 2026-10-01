"use client";

import React, { useState, useMemo } from "react";
import {
  Download,
  FileText,
  Search,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  History,
  ShieldCheck,
} from "lucide-react";
import { AuditEvent, ContentReport, AuditCategory } from "../types";
import { MOCK_AUDIT_EVENTS, MOCK_CONTENT_REPORTS } from "../data/audit-data";
import { AuditInspectorModal } from "../components/audit-inspector-modal";

export function AuditView() {
  const [activeTab, setActiveTab] = useState<"logs" | "reports">("logs");
  const [selectedCat, setSelectedCat] = useState<AuditCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [events] = useState<AuditEvent[]>(MOCK_AUDIT_EVENTS);
  const [reports, setReports] = useState<ContentReport[]>(MOCK_CONTENT_REPORTS);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      if (selectedCat !== "all" && evt.cat !== selectedCat) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          evt.actor_name.toLowerCase().includes(q) ||
          evt.actor_email.toLowerCase().includes(q) ||
          evt.ip_address.includes(q) ||
          evt.badge.toLowerCase().includes(q) ||
          evt.summary.toLowerCase().includes(q) ||
          evt.entity_id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [events, selectedCat, searchQuery]);

  const handleResolveReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: "resolved" } : r))
    );
    triggerToast(`Reporte #${reportId} marcado como Resuelto`);
  };

  const handleDismissReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: "dismissed" } : r))
    );
    triggerToast(`Reporte #${reportId} descartado`);
  };

  const handleExportCsv = () => {
    triggerToast("Descarga iniciada: Bitácora de eventos en formato CSV");
  };

  const handleExportReportsJson = () => {
    triggerToast("Descarga iniciada: Reportes de estudiantes en formato JSON");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Toast flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl bg-card border border-purple-500/40 shadow-2xl flex items-center gap-2.5 text-xs text-purple-300 font-medium animate-in fade-in slide-in-from-bottom-2 backdrop-blur-md">
          <Sparkles className="w-4 h-4 flex-shrink-0 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Auditoría, Trazabilidad & Reportes de Calidad
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              ADR-20 • ADR-21 • ADR-22
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1 leading-relaxed">
            Bitácora inmutable de operaciones administrativas (
            <code className="text-purple-300 font-mono text-xs">audit_logs</code>) y mesa de
            resolución de incidencias reportadas por estudiantes (
            <code className="text-mint-brand font-mono text-xs">content_reports</code>).
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-card border border-border-default hover:border-purple-500/40 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download size={14} />
            <span>Exportar Logs CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportReportsJson}
            className="px-3.5 py-2 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FileText size={14} />
            <span>Exportar Reportes JSON</span>
          </button>
        </div>
      </div>

      {/* Executive KPI Ribbon (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1 shadow-card-soft">
          <span className="text-[10px] font-mono uppercase text-slate-subtle">
            Eventos Registrados Hoy
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">142</span>
            <span className="text-xs text-purple-400 font-mono">100% Inmutables</span>
          </div>
          <p className="text-[10px] text-slate-muted">Trazabilidad completa con IP</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-amber-500/30 space-y-1 shadow-card-soft">
          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
            Incidencias de Alumnos
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400 font-mono">3</span>
            <span className="text-xs text-slate-subtle font-mono">Pendientes</span>
          </div>
          <p className="text-[10px] text-slate-muted">2 en revisión • 1 resuelta hoy</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1 shadow-card-soft">
          <span className="text-[10px] font-mono uppercase text-slate-subtle">
            Acciones de Moderación
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-brand font-mono">28</span>
            <span className="text-xs text-emerald-brand font-mono">Aprobaciones</span>
          </div>
          <p className="text-[10px] text-slate-muted">Este mes en catálogo móvil</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1 shadow-card-soft">
          <span className="text-[10px] font-mono uppercase text-slate-subtle">
            IPs Distintas Auditadas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">6</span>
            <span className="text-xs text-mint-brand font-mono">Sesiones Seguras</span>
          </div>
          <p className="text-[10px] text-slate-muted">Cero intentos no autorizados</p>
        </div>
      </div>

      {/* Dual Navigation Tabs (ADR-21) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-default pb-3 gap-3">
        <div className="flex items-center gap-1 bg-card p-1 rounded-2xl border border-border-default text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === "logs"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            <History size={14} />
            <span>Bitácora de Eventos (Audit Logs)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-purple-500/30 text-purple-200">
              142
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === "reports"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            <AlertTriangle size={14} />
            <span>Reportes de Estudiantes (Content Reports)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 font-bold">
              3
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-subtle">
          <span className="w-2 h-2 rounded-full bg-emerald-brand animate-pulse" />
          <span>Audit Logging Activo</span>
        </div>
      </div>

      {/* SUB-TAB 1: AUDIT LOGS */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          {/* Filters & Search Toolbar */}
          <div className="p-4 rounded-2xl bg-card border border-border-default space-y-3 shadow-card-soft">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedCat("all")}
                  className={`px-3 py-1 rounded-xl cursor-pointer font-bold border transition-colors ${
                    selectedCat === "all"
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                      : "bg-canvas text-slate-muted hover:text-white border-border-default"
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCat("review")}
                  className={`px-3 py-1 rounded-xl cursor-pointer font-bold border transition-colors ${
                    selectedCat === "review"
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                      : "bg-canvas text-slate-muted hover:text-white border-border-default"
                  }`}
                >
                  Moderación
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCat("staff")}
                  className={`px-3 py-1 rounded-xl cursor-pointer font-bold border transition-colors ${
                    selectedCat === "staff"
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                      : "bg-canvas text-slate-muted hover:text-white border-border-default"
                  }`}
                >
                  Personal & Roles
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCat("admob")}
                  className={`px-3 py-1 rounded-xl cursor-pointer font-bold border transition-colors ${
                    selectedCat === "admob"
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                      : "bg-canvas text-slate-muted hover:text-white border-border-default"
                  }`}
                >
                  Monetización & AdMob
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCat("vault")}
                  className={`px-3 py-1 rounded-xl cursor-pointer font-bold border transition-colors ${
                    selectedCat === "vault"
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                      : "bg-canvas text-slate-muted hover:text-white border-border-default"
                  }`}
                >
                  Content Vault
                </button>
              </div>

              {/* Search Input */}
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Buscar por actor, email o IP..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-canvas border border-border-default rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <Search
                    size={13}
                    className="absolute left-2.5 top-2 text-slate-subtle"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Table */}
          <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-card-soft text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Timestamp (UTC)</th>
                    <th className="p-3.5">Actor (Usuario / Rol)</th>
                    <th className="p-3.5">IP de Origen</th>
                    <th className="p-3.5">Acción / Evento</th>
                    <th className="p-3.5">Entidad Afectada</th>
                    <th className="p-3.5">Resumen de la Operación</th>
                    <th className="p-3.5 text-right">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default font-medium">
                  {filteredEvents.map((evt) => (
                    <tr
                      key={evt.id}
                      className="hover:bg-card-hover/50 transition-colors"
                    >
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="font-mono text-white text-xs">
                          {evt.timestamp_utc.split(" ")[1] || "12:00:00"}
                        </div>
                        <div className="text-[10px] text-slate-subtle font-mono">
                          {evt.time_ago}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold font-mono text-[10px]">
                            {evt.actor_avatar}
                          </div>
                          <div>
                            <p className="font-bold text-white">
                              {evt.actor_name}{" "}
                              <span className="text-[9px] font-normal px-1 py-0.2 rounded bg-card text-slate-300 border border-border-default font-mono">
                                {evt.actor_role}
                              </span>
                            </p>
                            <p className="text-[10px] text-slate-subtle font-mono">
                              {evt.actor_email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 font-mono text-mint-brand text-[11px] whitespace-nowrap">
                        {evt.ip_address}
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                            evt.badgeColor === "emerald"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : evt.badgeColor === "amber"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              : evt.badgeColor === "purple"
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                              : "bg-teal-500/20 text-teal-400 border-teal-500/30"
                          }`}
                        >
                          {evt.badge}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-slate-200 text-xs">
                        {evt.entity_id}
                      </td>

                      <td
                        className="p-3.5 text-slate-300 text-xs max-w-xs truncate"
                        title={evt.summary}
                      >
                        {evt.summary}
                      </td>

                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(evt)}
                          className="px-3 py-1.5 rounded-lg bg-canvas border border-border-default hover:border-purple-500/40 text-purple-300 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <span>Inspeccionar</span>
                          <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: REPORTES DE ESTUDIANTES */}
      {activeTab === "reports" && (
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
                              onClick={() => handleResolveReport(rep.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer mr-1.5"
                            >
                              Resolver
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              triggerToast(`Abriendo ${rep.lesson_title} en Course Builder...`)
                            }
                            className="px-2.5 py-1 rounded-lg bg-canvas border border-border-default hover:border-emerald-brand text-xs font-semibold text-slate-200 transition-colors cursor-pointer mr-1.5"
                          >
                            Corregir
                          </button>
                          {isOpen && (
                            <button
                              type="button"
                              onClick={() => handleDismissReport(rep.id)}
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
      )}

      {/* Modal Inspector Híbrido ADR-22 */}
      <AuditInspectorModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onCopyNotice={() => triggerToast("¡Payload JSON copiado al portapapeles!")}
      />
    </div>
  );
}
