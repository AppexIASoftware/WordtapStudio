import { API_V1_URL, apiRequest } from "./client";

export interface PublicSettings {
  contact_email: string;
  company_name: string;
  support_url: string;
}

export interface PlatformSettingItem {
  key: string;
  value: string;
  description?: string | null;
  updated_at: string;
}

// GET /api/v1/public-settings
export async function getPublicSettingsApi(): Promise<{
  data: PublicSettings | null;
  error: string | null;
}> {
  return apiRequest<PublicSettings>(`${API_V1_URL}/public-settings`, {
    cache: "no-store",
  });
}

// GET /api/v1/admin/settings
export async function getAllSettingsApi(): Promise<{
  data: PlatformSettingItem[] | null;
  error: string | null;
}> {
  return apiRequest<PlatformSettingItem[]>(`${API_V1_URL}/admin/settings`, {
    cache: "no-store",
  });
}

// PUT /api/v1/admin/settings
export async function updateSettingApi(
  key: string,
  value: string
): Promise<{
  data: { status: string; key: string; value: string } | null;
  error: string | null;
}> {
  return apiRequest<{ status: string; key: string; value: string }>(
    `${API_V1_URL}/admin/settings`,
    {
      method: "PUT",
      body: JSON.stringify({ key, value }),
    }
  );
}
