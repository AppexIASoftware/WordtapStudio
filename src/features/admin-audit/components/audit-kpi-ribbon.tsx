"use client";

import { ApiAuditSummary } from "@/services/api";

interface AuditKpiRibbonProps {
  summary: ApiAuditSummary;
}

/** Los 4 indicadores ejecutivos de la bitacora conectados a MySQL. */
export function AuditKpiRibbon({ summary }: AuditKpiRibbonProps) {
  const pendingCount = summary.open_reports + summary.reviewing_reports;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1 shadow-card-soft">
        <span className="text-[10px] font-mono uppercase text-slate-subtle">
          Eventos Registrados Hoy
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white font-mono">
            {summary.events_today}
          </span>
          <span className="text-xs text-purple-400 font-mono">100% Inmutables</span>
        </div>
        <p className="text-[10px] text-slate-muted">
          {summary.total_events} eventos históricos en bitácora
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-amber-500/30 space-y-1 shadow-card-soft">
        <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
          Incidencias de Alumnos
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-400 font-mono">
            {pendingCount}
          </span>
          <span className="text-xs text-slate-subtle font-mono">Pendientes</span>
        </div>
        <p className="text-[10px] text-slate-muted">
          {summary.reviewing_reports} en revisión • {summary.resolved_today_reports} resueltas hoy
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1 shadow-card-soft">
        <span className="text-[10px] font-mono uppercase text-slate-subtle">
          Acciones de Moderación
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-brand font-mono">
            {summary.approvals_this_month}
          </span>
          <span className="text-xs text-emerald-brand font-mono">Aprobaciones</span>
        </div>
        <p className="text-[10px] text-slate-muted">Este mes en catálogo móvil</p>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1 shadow-card-soft">
        <span className="text-[10px] font-mono uppercase text-slate-subtle">
          IPs Distintas Auditadas
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white font-mono">
            {summary.distinct_ips}
          </span>
          <span className="text-xs text-mint-brand font-mono">Sesiones Registradas</span>
        </div>
        <p className="text-[10px] text-slate-muted">Trazabilidad completa de origen</p>
      </div>
    </div>
  );
}
