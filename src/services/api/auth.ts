import { API_V1_URL, apiRequest, getStoredAccessToken, setStoredTokens } from "./client";
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
  data: { user: BackendUser } | null;
  error: string | null;
}> {
  const token = getStoredAccessToken();
  if (!token) {
    return { data: null, error: "No access token found" };
  }

  return apiRequest<{ user: BackendUser }>(`${API_V1_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
