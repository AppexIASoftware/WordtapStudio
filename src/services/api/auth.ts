import {
  API_V1_URL,
  apiRequest,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens,
} from "./client";
import { AuthResponse, BackendUser } from "./types";

export async function loginWithGoogleApi(idToken: string): Promise<{
  data: AuthResponse | null;
  error: string | null;
}> {
  const result = await apiRequest<AuthResponse>(`${API_V1_URL}/auth/google`, {
    method: "POST",
    body: JSON.stringify({ id_token: idToken }),
  });

  if (result.data) {
    setStoredTokens(result.data.access_token, result.data.refresh_token);
  }
  return result;
}

export async function getMeApi(): Promise<{
  data: { user: BackendUser; access_token?: string; expires_in?: number } | null;
  error: string | null;
}> {
  const token = getStoredAccessToken();
  if (!token) {
    return { data: null, error: "No access token found" };
  }

  const result = await apiRequest<{
    user: BackendUser;
    access_token?: string;
    expires_in?: number;
  }>(`${API_V1_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (result.data?.access_token) {
    setStoredTokens(result.data.access_token);
  }

  return result;
}

export async function devLoginApi(
  role: string,
  email?: string
): Promise<{
  data: AuthResponse | null;
  error: string | null;
}> {
  const result = await apiRequest<AuthResponse>(`${API_V1_URL}/auth/dev-login`, {
    method: "POST",
    body: JSON.stringify({ role, email }),
  });

  if (result.data) {
    setStoredTokens(result.data.access_token, result.data.refresh_token);
  }
  return result;
}

export async function logoutApi(refreshTokenOverride?: string | null): Promise<void> {
  const refreshToken = (refreshTokenOverride ?? getStoredRefreshToken())?.trim();
  if (!refreshToken) return;

  try {
    await fetch(`${API_V1_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      keepalive: true,
    });
  } catch {
    // Los errores de red al revocar la sesión no deben impedir el cierre local.
  }
}
