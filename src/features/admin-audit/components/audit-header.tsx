"use client";

import { Download, FileText } from "lucide-react";

interface AuditHeaderProps {
  onExportCsv: () => void;
  onExportReportsJson: () => void;
}

/** Banner de la seccion y botones de exportacion. */
export function AuditHeader({ onExportCsv, onExportReportsJson }: AuditHeaderProps) {
  return (
    <>
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
            onClick={onExportCsv}
            className="px-3.5 py-2 rounded-xl bg-card border border-border-default hover:border-purple-500/40 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download size={14} />
            <span>Exportar Logs CSV</span>
          </button>
          <button
            type="button"
            onClick={onExportReportsJson}
            className="px-3.5 py-2 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FileText size={14} />
            <span>Exportar Reportes JSON</span>
          </button>
        </div>
      </div>
    </>
  );
}
