import { API_V1_URL, apiRequest } from "./client";

function unwrapResponse<T>(res: {
  data: T | { data: T } | null;
  error: string | null;
}): { data: T | null; error: string | null } {
  if (
    res.data &&
    typeof res.data === "object" &&
    "data" in res.data &&
    !Array.isArray(res.data)
  ) {
    return { data: (res.data as { data: T }).data, error: res.error };
  }
  return res as { data: T | null; error: string | null };
}

export interface BroadcastAnnouncementPayload {
  title: string;
  body: string;
  action_url?: string;
  type?: "system" | "promotion";
  target_role?: string;
  target_cefr_level?: string;
}

export interface BroadcastAnnouncementResult {
  recipients_count: number;
  devices_count: number;
}

export interface NotificationStatsResult {
  active_devices_count: number;
}

export interface BroadcastClassroomPayload {
  title: string;
  message: string;
  action_type?: string;
  action_payload?: string;
}

export interface BroadcastClassroomResult {
  classroom_id: string;
  recipients_count: number;
  devices_count: number;
}

export interface DispatchVaultWordPayload {
  target_audience: "all" | "cefr" | "classroom";
  target_classroom_id?: string;
  target_cefr_level?: string;
}

export interface DispatchVaultWordResult {
  word: string;
  translation: string;
  recipients_count: number;
  devices_count: number;
}

// POST /api/v1/admin/announcements
export async function broadcastAnnouncementApi(
  payload: BroadcastAnnouncementPayload
): Promise<{ data: BroadcastAnnouncementResult | null; error: string | null }> {
  const res = await apiRequest<BroadcastAnnouncementResult>(
    `${API_V1_URL}/admin/announcements`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  return unwrapResponse(res);
}

// GET /api/v1/admin/notifications/stats
export async function getNotificationStatsApi(): Promise<{
  data: NotificationStatsResult | null;
  error: string | null;
}> {
  const res = await apiRequest<NotificationStatsResult>(
    `${API_V1_URL}/admin/notifications/stats`,
    {
      cache: "no-store",
    }
  );
  return unwrapResponse(res);
}

// POST /api/v1/teacher/classrooms/:id/broadcast
export async function broadcastToClassroomApi(
  classroomId: string,
  payload: BroadcastClassroomPayload
): Promise<{ data: BroadcastClassroomResult | null; error: string | null }> {
  const res = await apiRequest<BroadcastClassroomResult>(
    `${API_V1_URL}/teacher/classrooms/${classroomId}/broadcast`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  return unwrapResponse(res);
}

// POST /api/v1/vault/items/:id/dispatch
export async function dispatchVaultWordApi(
  itemId: string,
  payload: DispatchVaultWordPayload
): Promise<{ data: DispatchVaultWordResult | null; error: string | null }> {
  const res = await apiRequest<DispatchVaultWordResult>(
    `${API_V1_URL}/vault/items/${itemId}/dispatch`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  return unwrapResponse(res);
}
