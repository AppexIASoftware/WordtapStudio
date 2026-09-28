// Cliente HTTP tipado para WordtapAPI (Go Echo v5)

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim();

if (!RAW_API_URL && typeof window !== "undefined") {
  console.error("Missing required environment variable: NEXT_PUBLIC_API_URL in .env");
}

export const API_HOST = RAW_API_URL ? RAW_API_URL.replace(/\/api\/(services\/)?v1\/?$/, "") : "";
export const API_V1_URL = API_HOST ? `${API_HOST}/api/v1` : "";
export const API_SERVICES_V1_URL = API_HOST ? `${API_HOST}/api/services/v1` : "";

const TOKEN_KEY = "wordtap_studio_access_token";
const REFRESH_TOKEN_KEY = "wordtap_studio_refresh_token";

export interface ApiHealthResponse {
  status: string;
  database: string;
  uptime?: string;
  timestamp?: string;
}

export interface BackendUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  access_tier: string;
  preferred_language: string;
  learning_level: string;
  timezone: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: BackendUser;
}

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredTokens(accessToken: string, refreshToken?: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearStoredTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  if (!url) {
    return { data: null, error: "NEXT_PUBLIC_API_URL no configurado en .env" };
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        clearStoredTokens();
      }
      const body = await res.json().catch(() => ({}));
      const errorMsg = body.error || body.details || `HTTP ${res.status}: ${res.statusText}`;
      return { data: null, error: errorMsg };
    }

    const data: T = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error de red";
    return { data: null, error: message };
  }
}

export async function checkApiHealth(): Promise<{
  connected: boolean;
  data?: ApiHealthResponse;
  error?: string;
}> {
  if (!API_SERVICES_V1_URL) {
    return { connected: false, error: "NEXT_PUBLIC_API_URL no configurado" };
  }

  const { data, error } = await apiRequest<ApiHealthResponse>(`${API_SERVICES_V1_URL}/health`, {
    cache: "no-store",
  });
  return { connected: !!data, data: data || undefined, error: error || undefined };
}

// POST /api/v1/auth/google
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

// GET /api/v1/users/me con Bearer JWT
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

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return apiRequest<T>(`${API_SERVICES_V1_URL}${cleanEndpoint}`, options);
}
