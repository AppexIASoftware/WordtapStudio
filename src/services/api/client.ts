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
    setCookie(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (token) return token;
  const match = document.cookie.match(new RegExp(`(?:^|; )${REFRESH_TOKEN_KEY}=([^;]*)`));
  if (match) {
    const val = decodeURIComponent(match[1]);
    localStorage.setItem(REFRESH_TOKEN_KEY, val);
    return val;
  }
  return null;
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
  deleteCookie(REFRESH_TOKEN_KEY);
  deleteCookie(ROLE_KEY);
}

function resolveDevCredentials(url?: string): { role: string; email: string } {
  const storedRole = getStoredRole();
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const target = `${url || ""} ${path}`;

  if (storedRole === "admin" || target.includes("/admin")) {
    return { role: "admin", email: "admin@wordtap.app" };
  }
  if (storedRole === "moderator" || target.includes("/moderator")) {
    return { role: "moderator", email: "elena.ramos@wordtap.app" };
  }
  return { role: "instructor", email: "mateo.silva@wordtap.app" };
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
      const refreshToken = getStoredRefreshToken();
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_V1_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            if (refreshData.access_token) {
              token = refreshData.access_token;
              setStoredTokens(refreshData.access_token, refreshData.refresh_token);
            }
          }
        } catch {
          // Fallback
        }
      }

      if (!token) {
        try {
          const creds = resolveDevCredentials(url);
          const devRes = await fetch(`${API_V1_URL}/auth/dev-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(creds),
          });
          if (devRes.ok) {
            const devData = await devRes.json();
            if (devData.access_token) {
              token = devData.access_token;
              setStoredTokens(devData.access_token, devData.refresh_token);
              setStoredRole(creds.role);
            }
          }
        } catch {
          // Fallback silencioso
        }
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
        let renewedToken: string | null = null;

        const refreshToken = getStoredRefreshToken();
        if (refreshToken) {
          try {
            const refreshRes = await fetch(`${API_V1_URL}/auth/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh_token: refreshToken }),
            });
            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              if (refreshData.access_token) {
                renewedToken = refreshData.access_token;
                setStoredTokens(refreshData.access_token, refreshData.refresh_token);
              }
            }
          } catch {
            // Fallback silencioso
          }
        }

        if (!renewedToken) {
          try {
            const creds = resolveDevCredentials(url);
            const devRes = await fetch(`${API_V1_URL}/auth/dev-login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(creds),
            });
            if (devRes.ok) {
              const devData = await devRes.json();
              if (devData.access_token) {
                renewedToken = devData.access_token;
                setStoredTokens(devData.access_token, devData.refresh_token);
                setStoredRole(creds.role);
              }
            }
          } catch {
            // Fallback
          }
        }

        if (renewedToken) {
          headers.set("Authorization", `Bearer ${renewedToken}`);
          const retryRes = await fetch(url, { ...options, headers });
          if (retryRes.ok) {
            if (retryRes.status === 204) {
              return { data: null, error: null };
            }
            const retryData: T = await retryRes.json();
            return { data: retryData, error: null };
          }
        }

        clearStoredTokens();
      }
      const body = await res.json().catch(() => ({}));

      // Diagnostics only: any technical detail the API may still emit is
      // logged locally and never concatenated into the message shown to the user.
      if (body.details) {
        console.error(`[api] ${res.status} ${url}:`, body.details);
      }

      let errorMsg = body.message;
      if (!errorMsg && body.reason) {
        errorMsg = `Cuenta docente suspendida. Motivo: ${body.reason}`;
      }
      if (!errorMsg && Array.isArray(body.errors)) {
        const messages = body.errors
          .map((item: unknown) =>
            typeof item === "string"
              ? item
              : item && typeof item === "object" && "message" in item
                ? String((item as { message: unknown }).message)
                : ""
          )
          .filter((text: string) => text.length > 0);
        if (messages.length > 0) {
          errorMsg = messages.join(" ");
        }
      }
      if (!errorMsg) {
        // The raw HTTP status text is infrastructure detail: it is logged
        // locally and never shown to the user.
        console.error(`[api] ${res.status} ${url}: ${res.statusText}`);
        errorMsg = body.error || "No se pudo completar la operación.";
      }
      return { data: null, error: errorMsg };
    }

    if (res.status === 204) {
      return { data: null, error: null };
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
