"use client";

import { useMemo, useState } from "react";
import { Search, AlertCircle } from "lucide-react";
import { ToastNotification } from "@/components/ui/toast-notification";
import { useAdminAudit } from "@/features/admin-audit/hooks/use-admin-audit";
import {
  ContentReportsTable,
  type ContentReportItem,
} from "@/features/admin-audit/components/content-reports-table";
import {
  ReportTriageModal,
  type ReportTriageAction,
} from "@/features/admin-audit/components/report-triage-modal";
import { AuditPagination } from "@/features/admin-audit/components/audit-pagination";
import { AuditTableSkeleton } from "@/features/admin-audit/components/audit-skeleton";

const REPORT_STATUS_FILTER = {
  ALL: "all",
  OPEN: "open",
  REVIEWING: "reviewing",
  RESOLVED: "resolved",
} as const;

type ReportStatusFilter =
  (typeof REPORT_STATUS_FILTER)[keyof typeof REPORT_STATUS_FILTER];

export function ModeratorReportsView() {
  const [statusFilter, setStatusFilter] = useState<ReportStatusFilter>(
    REPORT_STATUS_FILTER.ALL
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [triageTarget, setTriageTarget] = useState<{
    report: ContentReportItem;
    action: ReportTriageAction;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const {
    summary,
    reports,
    reportsPage,
    setReportsPage,
    reportsTotal,
    pageSize,
    isInitialLoading,
    isTableLoading,
    error,
    decideReport,
  } = useAdminAudit("reports", "all", searchQuery);

  const filteredReports = useMemo(() => {
    if (statusFilter === REPORT_STATUS_FILTER.ALL) return reports;
    return reports.filter((r) => r.status === statusFilter);
  }, [reports, statusFilter]);

  const handleConfirmTriage = async (
    reportId: string,
    action: ReportTriageAction
  ) => {
    const res = await decideReport(reportId, action);
    if (res.ok) {
      setTriageTarget(null);
      triggerToast(
        action === "resolved"
          ? "Reporte marcado como Resuelto"
          : "Reporte descartado correctamente"
      );
    }
    return res;
  };

  const pendingCount = summary.open_reports + summary.reviewing_reports;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      <ToastNotification message={toastMessage} variant="blue" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Incidencias Reportadas por Estudiantes
          </h1>
          <p className="text-sm text-slate-muted mt-1">
            Reportes enviados desde la aplicación móvil. Triaje y resolución sobre contenido real.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-card border border-border-default text-xs font-mono text-slate-light self-start sm:self-auto">
          Pendientes:{" "}
          <strong className="text-amber-brand">{pendingCount}</strong>
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: REPORT_STATUS_FILTER.ALL, label: "Todos", count: summary.total_reports },
            { id: REPORT_STATUS_FILTER.OPEN, label: "Abiertos", count: summary.open_reports },
            { id: REPORT_STATUS_FILTER.REVIEWING, label: "En Revisión", count: summary.reviewing_reports },
            { id: REPORT_STATUS_FILTER.RESOLVED, label: "Resueltos", count: summary.resolved_today_reports },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
                statusFilter === f.id
                  ? "bg-canvas text-blue-400 font-bold border border-blue-500/40 shadow-sm"
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
            placeholder="Buscar por alumno, curso o motivo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-canvas rounded-xl border border-border-default text-xs text-white placeholder-slate-500 focus:border-blue-400 outline-none"
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isInitialLoading || isTableLoading ? (
        <AuditTableSkeleton />
      ) : (
        <>
          <ContentReportsTable
            reports={filteredReports}
            onRequestTriage={(report, action) =>
              setTriageTarget({ report, action })
            }
            onToast={triggerToast}
          />

          <AuditPagination
            page={reportsPage}
            total={reportsTotal}
            pageSize={pageSize}
            onPageChange={setReportsPage}
          />
        </>
      )}

      <ReportTriageModal
        report={triageTarget?.report ?? null}
        action={triageTarget?.action ?? null}
        onClose={() => setTriageTarget(null)}
        onConfirm={handleConfirmTriage}
      />
    </div>
  );
}
