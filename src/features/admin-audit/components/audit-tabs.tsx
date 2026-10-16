"use client";

import { AlertTriangle, History } from "lucide-react";
import { AuditTab } from "../types";

interface AuditTabsProps {
  activeTab: AuditTab;
  onTabChange: (tab: AuditTab) => void;
}

/** Selector entre la bitacora de eventos y los reportes. */
export function AuditTabs({ activeTab, onTabChange }: AuditTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-default pb-3 gap-3">
      <div className="flex items-center gap-1 bg-card p-1 rounded-2xl border border-border-default text-xs font-medium">
        <button
          type="button"
          onClick={() => onTabChange("logs")}
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
          onClick={() => onTabChange("reports")}
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
  );
}
