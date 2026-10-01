export type AuditCategory = "all" | "review" | "staff" | "admob" | "vault" | "payment";

export interface FieldDiff {
  field: string;
  oldVal: string;
  newVal: string;
}

export interface AuditEvent {
  id: string;
  cat: "review" | "staff" | "admob" | "vault" | "payment";
  badge: string;
  badgeColor: "emerald" | "amber" | "purple" | "teal";
  actor_name: string;
  actor_email: string;
  actor_role: string;
  actor_avatar: string;
  ip_address: string;
  timestamp_utc: string;
  time_ago: string;
  entity_type: string;
  entity_id: string;
  summary: string;
  field_diffs: FieldDiff[];
  payload: Record<string, unknown>;
}

export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";

export interface ContentReport {
  id: string;
  reporter_name: string;
  reporter_email: string;
  lesson_id: string;
  lesson_title: string;
  item_affected?: string;
  reason: string;
  badgeColor: "rose" | "amber" | "purple";
  description: string;
  date: string;
  status: ReportStatus;
}
