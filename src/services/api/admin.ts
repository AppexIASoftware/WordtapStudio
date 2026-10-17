import { API_V1_URL, apiRequest } from "./client";
import { ApiCourse } from "./types";

/**
 * Consulta la lista administrativa global de cursos (cualquier autor y estado).
 * GET /api/v1/admin/courses
 */
export async function getAdminCoursesApi(): Promise<{
  data: ApiCourse[] | null;
  error: string | null;
}> {
  return apiRequest<ApiCourse[]>(`${API_V1_URL}/admin/courses`, {
    cache: "no-store",
  });
}
