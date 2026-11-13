import { API_V1_URL, apiRequest } from "./client";

export interface DashboardUserStats {
  total_users: number;
  students: number;
  instructors: number;
  moderators: number;
  admins: number;
  free_students: number;
  course_students: number;
  subscription_students: number;
}

export interface DashboardCatalogStats {
  total_courses: number;
  published_courses: number;
  in_review_courses: number;
  draft_courses: number;
  pending_teacher_apps: number;
  approved_teacher_apps: number;
  total_vault_items: number;
  total_games: number;
  total_classrooms: number;
}

export interface DashboardEventItem {
  id: string;
  action: string;
  summary: string;
  actor: string;
  created_at: string;
}

export interface AdminDashboardData {
  users: DashboardUserStats;
  catalog: DashboardCatalogStats;
  recent_events: DashboardEventItem[];
  generated_at: string;
}

export async function getAdminDashboardApi(): Promise<{
  data: AdminDashboardData | null;
  error: string | null;
}> {
  return apiRequest<AdminDashboardData>(`${API_V1_URL}/admin/dashboard`, {
    cache: "no-store",
  });
}

export type TeacherDashboardPeriod = "today" | "7d" | "30d" | "year";

export interface TeacherDashboardData {
  period: TeacherDashboardPeriod;
  active_students: number;
  avg_streak_days: number;
  total_students: number;
  retention_percent: number;
  vault_items: number;
  vault_banks: number;
  revenue_cents: number;
  paid_orders: number;
  active_subscriptions: number;
  generated_at: string;
}

export async function getTeacherDashboardApi(
  period: TeacherDashboardPeriod = "7d"
): Promise<{
  data: TeacherDashboardData | null;
  error: string | null;
}> {
  return apiRequest<TeacherDashboardData>(
    `${API_V1_URL}/teacher/dashboard?period=${encodeURIComponent(period)}`,
    { cache: "no-store" }
  );
}
