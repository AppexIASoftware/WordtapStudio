"use client";

import { useState, useMemo } from "react";
import { AuditEvent, ContentReport, AuditCategory, AuditTab } from "../types";
import { MOCK_AUDIT_EVENTS, MOCK_CONTENT_REPORTS } from "../data/audit-data";
import { AuditInspectorModal } from "../components/audit-inspector-modal";
import { ToastNotification } from "@/components/ui/toast-notification";
import { useUrlParam } from "@/hooks/use-url-params";
import { AuditHeader } from "../components/audit-header";
import { AuditKpiRibbon } from "../components/audit-kpi-ribbon";
import { AuditTabs } from "../components/audit-tabs";
import { AuditLogsFilters } from "../components/audit-logs-filters";
import { AuditLogsTable } from "../components/audit-logs-table";
import { ContentReportsTable } from "../components/content-reports-table";

const AUDIT_TABS = ["logs", "reports"] as const;

export function AuditView() {
  // La pestaña activa vive en la URL para que la vista sea compartible.
  const [activeTab, setActiveTab] = useUrlParam<AuditTab>(
    "tab",
    AUDIT_TABS,
    "logs"
  );
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
      <ToastNotification message={toastMessage} variant="purple" />

      <AuditHeader
        onExportCsv={handleExportCsv}
        onExportReportsJson={handleExportReportsJson}
      />

      <AuditKpiRibbon />

      <AuditTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* SUB-TAB 1: AUDIT LOGS */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <AuditLogsFilters
            selectedCat={selectedCat}
            onCategoryChange={setSelectedCat}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <AuditLogsTable events={filteredEvents} onSelectEvent={setSelectedEvent} />
        </div>
      )}

      {/* SUB-TAB 2: REPORTES DE ESTUDIANTES */}
      {activeTab === "reports" && (
        <ContentReportsTable
          reports={reports}
          onResolveReport={handleResolveReport}
          onDismissReport={handleDismissReport}
          onToast={triggerToast}
        />
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
