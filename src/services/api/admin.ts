import { API_V1_URL, apiRequest } from "./client";
import { ApiCourse } from "./types";
import type { OwnerType } from "./owner-type";

export interface AdminCoursesFilter {
  status?: ApiCourse["status"];
  ownerType?: OwnerType;
}

/**
 * Consulta la lista administrativa global de cursos (cualquier autor y estado).
 * GET /api/v1/admin/courses
 * Con status y ownerType la API devuelve solo los cursos que coinciden con los filtros.
 */
export async function getAdminCoursesApi(filter: AdminCoursesFilter = {}): Promise<{
  data: ApiCourse[] | null;
  error: string | null;
}> {
  return apiRequest<ApiCourse[]>(`${API_V1_URL}/admin/courses${buildQuery(filter)}`, {
    cache: "no-store",
  });
}

function buildQuery(filter: AdminCoursesFilter): string {
  const params = new URLSearchParams();
  if (filter.status) params.set("status", filter.status);
  if (filter.ownerType) params.set("owner_type", filter.ownerType);
  const query = params.toString();
  return query ? `?${query}` : "";
}
