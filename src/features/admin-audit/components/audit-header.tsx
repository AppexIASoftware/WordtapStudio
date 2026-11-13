"use client";

import { Download, FileText } from "lucide-react";

interface AuditHeaderProps {
  onExportCsv: () => void;
  onExportReportsJson: () => void;
}

/** Banner de la seccion y botones de exportacion. */
export function AuditHeader({ onExportCsv, onExportReportsJson }: AuditHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Auditoría, Trazabilidad &amp; Reportes de Calidad
        </h1>
        <p className="text-sm text-slate-muted mt-1 leading-relaxed">
          Bitácora inmutable de operaciones administrativas y mesa de resolución de incidencias reportadas por estudiantes.
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
  );
}
