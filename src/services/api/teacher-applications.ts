import { API_V1_URL, apiRequest } from "./client";

export interface ApiTeacherApplication {
  id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  bio?: string | null;
  specialty?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string | null;
  };
}

export interface TeacherApplicationStatusResponse {
  status: "none" | "pending" | "approved" | "rejected" | "suspended";
  application_id?: string;
  bio?: string | null;
  specialty?: string | null;
  rejection_reason?: string | null;
  created_at?: string | null;
}

export interface ListApplicationsResponse {
  applications: ApiTeacherApplication[];
  total: number;
  limit: number;
  offset: number;
}

// POST /api/v1/teacher-applications
export async function applyTeacherApi(payload: {
  bio?: string;
  specialty?: string;
}): Promise<{
  data: ApiTeacherApplication | null;
  error: string | null;
}> {
  return apiRequest<ApiTeacherApplication>(`${API_V1_URL}/teacher-applications`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// GET /api/v1/teacher-applications/my-status
export async function getMyApplicationStatusApi(): Promise<{
  data: TeacherApplicationStatusResponse | null;
  error: string | null;
}> {
  return apiRequest<TeacherApplicationStatusResponse>(
    `${API_V1_URL}/teacher-applications/my-status`,
    {
      cache: "no-store",
    }
  );
}

// GET /api/v1/admin/teacher-applications
export async function listTeacherApplicationsApi(
  status?: string,
  limit = 20,
  offset = 0
): Promise<{
  data: ListApplicationsResponse | null;
  error: string | null;
}> {
  const query = new URLSearchParams();
  if (status) query.set("status", status);
  query.set("limit", limit.toString());
  query.set("offset", offset.toString());

  return apiRequest<ListApplicationsResponse>(
    `${API_V1_URL}/admin/teacher-applications?${query.toString()}`,
    {
      cache: "no-store",
    }
  );
}

// POST /api/v1/admin/teacher-applications/:id/approve
export async function approveTeacherApplicationApi(appId: string): Promise<{
  data: ApiTeacherApplication | null;
  error: string | null;
}> {
  return apiRequest<ApiTeacherApplication>(
    `${API_V1_URL}/admin/teacher-applications/${appId}/approve`,
    {
      method: "POST",
    }
  );
}

// POST /api/v1/admin/teacher-applications/:id/reject
export async function rejectTeacherApplicationApi(
  appId: string,
  reason?: string
): Promise<{
  data: ApiTeacherApplication | null;
  error: string | null;
}> {
  return apiRequest<ApiTeacherApplication>(
    `${API_V1_URL}/admin/teacher-applications/${appId}/reject`,
    {
      method: "POST",
      body: JSON.stringify({ reason: reason || "" }),
    }
  );
}

// POST /api/v1/admin/teacher-applications/:id/suspend
export async function suspendTeacherApplicationApi(
  appId: string,
  reason?: string
): Promise<{
  data: ApiTeacherApplication | null;
  error: string | null;
}> {
  return apiRequest<ApiTeacherApplication>(
    `${API_V1_URL}/admin/teacher-applications/${appId}/suspend`,
    {
      method: "POST",
      body: JSON.stringify({ reason: reason || "" }),
    }
  );
}

// POST /api/v1/admin/teacher-applications/:id/reactivate
export async function reactivateTeacherApplicationApi(appId: string): Promise<{
  data: ApiTeacherApplication | null;
  error: string | null;
}> {
  return apiRequest<ApiTeacherApplication>(
    `${API_V1_URL}/admin/teacher-applications/${appId}/reactivate`,
    {
      method: "POST",
    }
  );
}

// DELETE /api/v1/admin/teacher-applications/:id
export async function deleteTeacherApplicationApi(appId: string): Promise<{
  data: { message: string } | null;
  error: string | null;
}> {
  return apiRequest<{ message: string }>(
    `${API_V1_URL}/admin/teacher-applications/${appId}`,
    {
      method: "DELETE",
    }
  );
}
