"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAdminAuditLogsApi,
  getAdminContentReportsApi,
  decideContentReportApi,
  ApiAuditLog,
  ApiAuditSummary,
  ApiContentReport,
} from "@/services/api";
import { AuditCategory, AuditEvent, AuditTab, ContentReport, FieldDiff } from "../types";

const EMPTY_SUMMARY: ApiAuditSummary = {
  events_today: 0,
  open_reports: 0,
  reviewing_reports: 0,
  resolved_today_reports: 0,
  approvals_this_month: 0,
  distinct_ips: 0,
  total_events: 0,
  total_reports: 0,
};

function formatRelativeTime(isoDate: string): string {
  const ts = Date.parse(isoDate);
  if (!ts) return "Reciente";
  const mins = Math.max(1, Math.floor((Date.now() - ts) / 60000));
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  return `Hace ${Math.floor(hours / 24)} d`;
}

function inferCategory(action: string, entityType: string): AuditEvent["cat"] {
  const a = action.toUpperCase();
  const e = entityType.toLowerCase();
  if (a.includes("STAFF") || a.includes("ROLE") || e === "user" || e === "staff" || e === "admin_role") return "staff";
  if (a.includes("ADMOB") || a.includes("SETTING") || e === "ad_config" || e === "platform_setting") return "admob";
  if (a.includes("VAULT") || e === "vault_item" || e === "content_bank") return "vault";
  return "review";
}

function inferBadgeColor(action: string): AuditEvent["badgeColor"] {
  const a = action.toUpperCase();
  if (a.includes("APPROVE") || a.includes("RESOLVE") || a.includes("PUBLISH")) return "emerald";
  if (a.includes("SUSPEND") || a.includes("CHANGES") || a.includes("ADMOB")) return "amber";
  if (a.includes("VAULT")) return "teal";
  return "purple";
}

function mapAuditLog(row: ApiAuditLog): AuditEvent {
  let parsed: Record<string, unknown> = {};
  try {
    parsed = row.changes ? JSON.parse(row.changes) : {};
  } catch {
    parsed = { raw: row.changes };
  }

  const actorName = row.actor_user?.name || "Sistema";
  const actorEmail = row.actor_user?.email || "sistema@wordtap.app";
  const actorRole = row.actor_user?.role || "admin";
  const initials = actorName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("") || "WT";

  const fieldDiffs: FieldDiff[] = Object.entries(parsed)
    .filter(([k]) => k !== "summary")
    .map(([field, val]) => ({
      field,
      oldVal: "-",
      newVal: typeof val === "string" ? val : JSON.stringify(val),
    }));

  const summary =
    typeof parsed.summary === "string" && parsed.summary.trim()
      ? parsed.summary
      : `${row.action} sobre ${row.entity_type}`;

  return {
    id: row.id,
    cat: inferCategory(row.action, row.entity_type),
    badge: row.action,
    badgeColor: inferBadgeColor(row.action),
    actor_name: actorName,
    actor_email: actorEmail,
    actor_role: actorRole,
    actor_avatar: initials,
    ip_address: row.ip_address || "0.0.0.0",
    timestamp_utc: row.created_at,
    time_ago: formatRelativeTime(row.created_at),
    entity_type: row.entity_type,
    entity_id: row.entity_id || "-",
    summary,
    field_diffs: fieldDiffs,
    payload: parsed,
  };
}

function mapContentReport(row: ApiContentReport): ContentReport & { course_id?: string } {
  const reasonLower = row.reason.toLowerCase();
  const badgeColor: ContentReport["badgeColor"] = reasonLower.includes("pronunci") || reasonLower.includes("audio")
    ? "rose"
    : reasonLower.includes("traduc")
    ? "amber"
    : "purple";

  return {
    id: row.id,
    reporter_name: row.reporter_user?.name || "Estudiante",
    reporter_email: row.reporter_user?.email || "alumno@wordtap.app",
    lesson_id: row.lesson_id || "",
    lesson_title: row.lesson?.title || "Lección general",
    course_id: row.lesson?.course_id,
    item_affected: row.game_question?.prompt ? `Pregunta: ${row.game_question.prompt}` : undefined,
    reason: row.reason,
    badgeColor,
    description: row.description || "Sin descripción adicional.",
    date: formatRelativeTime(row.created_at),
    status: row.status,
  };
}

function triggerFileDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const AUDIT_PAGE_SIZE = 20;

export function useAdminAudit(
  activeTab: AuditTab,
  category: AuditCategory,
  searchQuery: string
) {
  const [summary, setSummary] = useState<ApiAuditSummary>(EMPTY_SUMMARY);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [reports, setReports] = useState<(ContentReport & { course_id?: string })[]>([]);
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotal, setLogsTotal] = useState(0);
  const [reportsPage, setReportsPage] = useState(1);
  const [reportsTotal, setReportsTotal] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLogsPage(1);
  }, [category, searchQuery]);

  const loadData = useCallback(async (forceAll = false) => {
    setIsTableLoading(true);
    setError(null);

    if (activeTab === "logs" || forceAll) {
      const logsRes = await getAdminAuditLogsApi({
        cat: category,
        q: searchQuery,
        limit: AUDIT_PAGE_SIZE,
        offset: (logsPage - 1) * AUDIT_PAGE_SIZE,
      });
      if (logsRes.error) {
        setError(logsRes.error);
      } else if (logsRes.data) {
        setSummary(logsRes.data.summary);
        setEvents((logsRes.data.items ?? []).map(mapAuditLog));
        setLogsTotal(logsRes.data.total ?? 0);
      }
    }

    if (activeTab === "reports" || forceAll) {
      const reportsRes = await getAdminContentReportsApi({
        limit: AUDIT_PAGE_SIZE,
        offset: (reportsPage - 1) * AUDIT_PAGE_SIZE,
      });
      if (reportsRes.error && activeTab === "reports") {
        setError(reportsRes.error);
      } else if (reportsRes.data) {
        setReports((reportsRes.data.items ?? []).map(mapContentReport));
        setReportsTotal(reportsRes.data.total ?? 0);
      }
    }

    setIsInitialLoading(false);
    setIsTableLoading(false);
  }, [activeTab, category, searchQuery, logsPage, reportsPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData(false);
    }, 120);
    return () => clearTimeout(timer);
  }, [loadData]);

  const decideReport = async (
    reportId: string,
    status: "reviewing" | "resolved" | "dismissed"
  ): Promise<{ ok: boolean; error?: string }> => {
    const res = await decideContentReportApi(reportId, status);
    if (res.error || !res.data) {
      return { ok: false, error: res.error || "No se pudo actualizar el reporte." };
    }
    await loadData(true);
    return { ok: true };
  };

  const downloadCsv = () => {
    const headers = ["id", "timestamp_utc", "actor_name", "actor_email", "ip_address", "action", "entity_type", "entity_id", "summary"];
    const rows = events.map((e) =>
      [e.id, e.timestamp_utc, e.actor_name, e.actor_email, e.ip_address, e.badge, e.entity_type, e.entity_id, e.summary]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    triggerFileDownload("wordtap-audit-logs.csv", [headers.join(","), ...rows].join("\n"), "text/csv;charset=utf-8;");
  };

  const downloadReportsJson = () => {
    triggerFileDownload("wordtap-content-reports.json", JSON.stringify(reports, null, 2), "application/json;charset=utf-8;");
  };

  return {
    summary,
    events,
    reports,
    logsPage,
    setLogsPage,
    logsTotal,
    reportsPage,
    setReportsPage,
    reportsTotal,
    pageSize: AUDIT_PAGE_SIZE,
    isInitialLoading,
    isTableLoading,
    error,
    refresh: () => loadData(true),
    decideReport,
    downloadCsv,
    downloadReportsJson,
  };
}
