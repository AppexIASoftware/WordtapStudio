import { apiRequest, API_V1_URL } from "./client";

export interface ApiAuditActor {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiAuditLog {
  id: string;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  changes: string;
  ip_address: string | null;
  created_at: string;
  actor_user?: ApiAuditActor | null;
}

export interface ApiAuditSummary {
  events_today: number;
  open_reports: number;
  reviewing_reports: number;
  resolved_today_reports: number;
  approvals_this_month: number;
  distinct_ips: number;
  total_events: number;
  total_reports: number;
}

export interface ApiAuditLogsResponse {
  summary: ApiAuditSummary;
  items: ApiAuditLog[];
  total: number;
}

export interface ApiContentReport {
  id: string;
  reporter_user_id: string | null;
  lesson_id: string | null;
  game_question_id: string | null;
  reason: string;
  description: string | null;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  reporter_user?: ApiAuditActor | null;
  lesson?: {
    id: string;
    course_id: string;
    title: string;
  } | null;
  game_question?: {
    id: string;
    prompt: string;
  } | null;
}

export interface ApiContentReportsResponse {
  items: ApiContentReport[];
  total: number;
}

export async function getAdminAuditLogsApi(params?: {
  cat?: string;
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: ApiAuditLogsResponse | null; error: string | null }> {
  const qs = new URLSearchParams();
  if (params?.cat && params.cat !== "all") qs.set("cat", params.cat);
  if (params?.q?.trim()) qs.set("q", params.q.trim());
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.offset) qs.set("offset", String(params.offset));
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiRequest<ApiAuditLogsResponse>(`${API_V1_URL}/admin/audit-logs${query}`, {
    cache: "no-store",
  });
}

export async function getAdminContentReportsApi(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: ApiContentReportsResponse | null; error: string | null }> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.offset) qs.set("offset", String(params.offset));
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiRequest<ApiContentReportsResponse>(`${API_V1_URL}/admin/content-reports${query}`, {
    cache: "no-store",
  });
}

export async function decideContentReportApi(
  reportId: string,
  status: "reviewing" | "resolved" | "dismissed"
): Promise<{ data: ApiContentReport | null; error: string | null }> {
  return apiRequest<ApiContentReport>(
    `${API_V1_URL}/admin/content-reports/${reportId}/decision`,
    {
      method: "POST",
      body: JSON.stringify({ status }),
    }
  );
}
