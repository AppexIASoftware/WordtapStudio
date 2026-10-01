import { API_V1_URL, apiRequest } from "./client";
import { ApiHealthResponse } from "./types";

export async function checkApiHealth(): Promise<{
  connected: boolean;
  data?: ApiHealthResponse;
  error?: string;
}> {
  if (!API_V1_URL) {
    return { connected: false, error: "NEXT_PUBLIC_API_URL no configurado" };
  }

  const { data, error } = await apiRequest<ApiHealthResponse>(`${API_V1_URL}/health`, {
    cache: "no-store",
  });
  return { connected: !!data, data: data || undefined, error: error || undefined };
}
