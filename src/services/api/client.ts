const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim();

if (!RAW_API_URL && typeof window !== "undefined") {
  console.error("Missing required environment variable: NEXT_PUBLIC_API_URL in .env");
}

export const API_HOST = RAW_API_URL ? RAW_API_URL.replace(/\/api\/v1\/?$/, "") : "";
export const API_V1_URL = API_HOST ? `${API_HOST}/api/v1` : (RAW_API_URL || "http://localhost:8080/api/v1");

const TOKEN_KEY = "wordtap_studio_access_token";
const REFRESH_TOKEN_KEY = "wordtap_studio_refresh_token";
const ROLE_KEY = "wordtap_studio_role";

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_KEY}=([^;]*)`));
  if (match) {
    const val = decodeURIComponent(match[1]);
    localStorage.setItem(TOKEN_KEY, val);
    return val;
  }
  return null;
}

export function setStoredTokens(accessToken: string, refreshToken?: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  setCookie(TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function getStoredRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ROLE_KEY);
}

export function setStoredRole(role: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROLE_KEY, role);
  setCookie(ROLE_KEY, role);
}

export function clearStoredTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  deleteCookie(TOKEN_KEY);
  deleteCookie(ROLE_KEY);
}

export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  if (!url) {
    return { data: null, error: "NEXT_PUBLIC_API_URL no configurado en .env" };
  }

  try {
    const headers = new Headers(options?.headers);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }
    let token = getStoredAccessToken();
    if (!token && typeof window !== "undefined") {
      try {
        const devRes = await fetch(`${API_V1_URL}/auth/dev-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "instructor" }),
        });
        if (devRes.ok) {
          const devData = await devRes.json();
          if (devData.access_token) {
            token = devData.access_token;
            setStoredTokens(devData.access_token, devData.refresh_token);
            setStoredRole("instructor");
          }
        }
      } catch {
        // Fallback silencioso
      }
    }

    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      if (res.status === 401 && typeof window !== "undefined") {
        try {
          const devRes = await fetch(`${API_V1_URL}/auth/dev-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: "instructor" }),
          });
          if (devRes.ok) {
            const devData = await devRes.json();
            if (devData.access_token) {
              setStoredTokens(devData.access_token, devData.refresh_token);
              setStoredRole("instructor");
              headers.set("Authorization", `Bearer ${devData.access_token}`);
              const retryRes = await fetch(url, { ...options, headers });
              if (retryRes.ok) {
                const retryData: T = await retryRes.json();
                return { data: retryData, error: null };
              }
            }
          }
        } catch {
          // Fallback
        }
        clearStoredTokens();
      }
      const body = await res.json().catch(() => ({}));
      let errorMsg = body.message;
      if (!errorMsg && body.reason) {
        errorMsg = `Cuenta docente suspendida. Motivo: ${body.reason}`;
      }
      if (!errorMsg) {
        errorMsg = body.error || body.details || `HTTP ${res.status}: ${res.statusText}`;
      }
      return { data: null, error: errorMsg };
    }

    const data: T = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error de red";
    return { data: null, error: message };
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return apiRequest<T>(`${API_V1_URL}${cleanEndpoint}`, options);
}
