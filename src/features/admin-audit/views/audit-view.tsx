"use client";

import { useState } from "react";
import { AuditEvent, AuditCategory, AuditTab } from "../types";
import { useAdminAudit } from "../hooks/use-admin-audit";
import { AuditInspectorModal } from "../components/audit-inspector-modal";
import { ToastNotification } from "@/components/ui/toast-notification";
import { useUrlParam } from "@/hooks/use-url-params";
import { AuditHeader } from "../components/audit-header";
import { AuditKpiRibbon } from "../components/audit-kpi-ribbon";
import { AuditTabs } from "../components/audit-tabs";
import { AuditLogsFilters } from "../components/audit-logs-filters";
import { AuditLogsTable } from "../components/audit-logs-table";
import { AuditPagination } from "../components/audit-pagination";
import { AuditSkeleton, AuditTableSkeleton } from "../components/audit-skeleton";
import {
  ContentReportsTable,
  type ContentReportItem,
} from "../components/content-reports-table";
import {
  ReportTriageModal,
  type ReportTriageAction,
} from "../components/report-triage-modal";

const AUDIT_TABS = ["logs", "reports"] as const;
const AUDIT_CATEGORIES = ["all", "review", "staff", "admob", "vault"] as const;

export function AuditView() {
  const [activeTab, setActiveTab] = useUrlParam<AuditTab>(
    "tab",
    AUDIT_TABS,
    "logs"
  );
  const [selectedCat, setSelectedCat] = useUrlParam<AuditCategory>(
    "cat",
    AUDIT_CATEGORIES,
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
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
    events,
    reports,
    logsPage,
    setLogsPage,
    logsTotal,
    reportsPage,
    setReportsPage,
    reportsTotal,
    pageSize,
    isInitialLoading,
    isTableLoading,
    error,
    decideReport,
    downloadCsv,
    downloadReportsJson,
  } = useAdminAudit(activeTab, selectedCat, searchQuery);

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

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <ToastNotification message={toastMessage} variant="purple" />

      <AuditHeader
        onExportCsv={() => {
          downloadCsv();
          triggerToast("Descarga iniciada: Bitácora de eventos en formato CSV");
        }}
        onExportReportsJson={() => {
          downloadReportsJson();
          triggerToast("Descarga iniciada: Reportes de estudiantes en formato JSON");
        }}
      />

      {isInitialLoading ? (
        <AuditSkeleton />
      ) : (
        <>
          <AuditKpiRibbon summary={summary} />

          <AuditTabs
            activeTab={activeTab}
            onTabChange={(tab) =>
              setActiveTab(tab, { clear: tab === "reports" ? ["cat"] : undefined })
            }
            totalEvents={summary.total_events}
            pendingReports={summary.open_reports + summary.reviewing_reports}
          />

          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs"
            >
              {error}
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-4">
              <AuditLogsFilters
                selectedCat={selectedCat}
                onCategoryChange={setSelectedCat}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              {isTableLoading ? (
                <AuditTableSkeleton />
              ) : (
                <>
                  <AuditLogsTable events={events} onSelectEvent={setSelectedEvent} />
                  <AuditPagination
                    page={logsPage}
                    pageSize={pageSize}
                    total={logsTotal}
                    onPageChange={setLogsPage}
                  />
                </>
              )}
            </div>
          )}

          {activeTab === "reports" &&
            (isTableLoading ? (
              <AuditTableSkeleton />
            ) : (
              <div className="space-y-4">
                <ContentReportsTable
                  reports={reports}
                  onRequestTriage={(report, action) =>
                    setTriageTarget({ report, action })
                  }
                  onToast={triggerToast}
                />
                <AuditPagination
                  page={reportsPage}
                  pageSize={pageSize}
                  total={reportsTotal}
                  onPageChange={setReportsPage}
                />
              </div>
            ))}
        </>
      )}

      <AuditInspectorModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onCopyNotice={() => triggerToast("¡Payload JSON copiado al portapapeles!")}
      />

      <ReportTriageModal
        report={triageTarget?.report ?? null}
        action={triageTarget?.action ?? null}
        onClose={() => setTriageTarget(null)}
        onConfirm={handleConfirmTriage}
      />
    </div>
  );
}
