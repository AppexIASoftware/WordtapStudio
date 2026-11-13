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

export interface ApiGlobalStudentItem {
  id: string;
  name: string;
  email: string;
  learning_level: string;
  course_id: string;
  course_title: string;
  current_streak_days: number;
  progress_percent: number;
  access_tier: "free" | "course" | "subscription" | string;
  last_activity_date?: string | null;
}

export interface ApiGlobalCourseOption {
  id: string;
  title: string;
}

export interface ApiGlobalStudentsResponse {
  items: ApiGlobalStudentItem[];
  total: number;
  courses: ApiGlobalCourseOption[];
}

export async function getTeacherGlobalStudentsApi(params?: {
  q?: string;
  plan?: string;
  level?: string;
  course_id?: string;
  limit?: number;
  offset?: number;
}): Promise<{
  data: ApiGlobalStudentsResponse | null;
  error: string | null;
}> {
  const qs = new URLSearchParams();
  if (params?.q?.trim()) qs.set("q", params.q.trim());
  if (params?.plan && params.plan !== "all") qs.set("plan", params.plan);
  if (params?.level && params.level !== "all") qs.set("level", params.level);
  if (params?.course_id && params.course_id !== "all") qs.set("course_id", params.course_id);
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.offset) qs.set("offset", String(params.offset));
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiRequest<ApiGlobalStudentsResponse>(
    `${API_V1_URL}/teacher/global-students${query}`,
    { cache: "no-store" }
  );
}
