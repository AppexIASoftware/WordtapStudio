import { API_V1_URL, apiRequest } from "./client";

export const STAFF_ROLE_VALUE = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  INSTRUCTOR: "instructor",
} as const;

export type StaffRoleValue = (typeof STAFF_ROLE_VALUE)[keyof typeof STAFF_ROLE_VALUE];

export interface ApiStaffUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  role: StaffRoleValue;
  access_tier: string;
  is_active: boolean;
  created_at: string;
}

export interface ProvisionStaffPayload {
  email: string;
  name?: string;
  role: StaffRoleValue;
}

export interface ProvisionStaffResponse {
  user: ApiStaffUser;
  created: boolean;
}

/**
 * Lista todos los usuarios con rol de staff (admin, moderator, instructor).
 * GET /api/v1/admin/staff
 */
export async function listStaffApi(): Promise<{
  data: { staff: ApiStaffUser[] } | null;
  error: string | null;
}> {
  return apiRequest<{ staff: ApiStaffUser[] }>(`${API_V1_URL}/admin/staff`, {
    cache: "no-store",
  });
}

/**
 * Crea o promueve un usuario de staff (incluyendo nuevos administradores).
 * POST /api/v1/admin/staff
 */
export async function provisionStaffApi(payload: ProvisionStaffPayload): Promise<{
  data: ProvisionStaffResponse | null;
  error: string | null;
}> {
  return apiRequest<ProvisionStaffResponse>(`${API_V1_URL}/admin/staff`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Activa o suspende el acceso de un miembro del staff.
 * PATCH /api/v1/admin/staff/:id/status
 */
export async function updateStaffStatusApi(
  userId: string,
  isActive: boolean
): Promise<{
  data: { user: ApiStaffUser } | null;
  error: string | null;
}> {
  return apiRequest<{ user: ApiStaffUser }>(
    `${API_V1_URL}/admin/staff/${encodeURIComponent(userId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ is_active: isActive }),
    }
  );
}

/**
 * Elimina un miembro del staff del sistema.
 * DELETE /api/v1/admin/staff/:id
 */
export async function deleteStaffApi(userId: string): Promise<{
  data: { deleted: boolean } | null;
  error: string | null;
}> {
  return apiRequest<{ deleted: boolean }>(
    `${API_V1_URL}/admin/staff/${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    }
  );
}
