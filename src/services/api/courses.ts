import { API_V1_URL, apiRequest } from "./client";
import { ApiCourse, CreateCoursePayload, UpdateCoursePayload } from "./types";

// GET /api/v1/courses (public catalog)
export async function getPublicCoursesApi(): Promise<{
  data: ApiCourse[] | null;
  error: string | null;
}> {
  return apiRequest<ApiCourse[]>(`${API_V1_URL}/courses`, {
    cache: "no-store",
  });
}

// GET /api/v1/teacher/courses
export async function getTeacherCoursesApi(): Promise<{
  data: ApiCourse[] | null;
  error: string | null;
}> {
  return apiRequest<ApiCourse[]>(`${API_V1_URL}/teacher/courses`, {
    cache: "no-store",
  });
}

// POST /api/v1/courses
export async function createCourseApi(payload: CreateCoursePayload): Promise<{
  data: ApiCourse | null;
  error: string | null;
}> {
  return apiRequest<ApiCourse>(`${API_V1_URL}/courses`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// GET /api/v1/courses/:id
export async function getCourseDetailApi(id: string): Promise<{
  data: ApiCourse | null;
  error: string | null;
}> {
  return apiRequest<ApiCourse>(`${API_V1_URL}/courses/${id}`, {
    cache: "no-store",
  });
}

// PUT /api/v1/courses/:id
export async function updateCourseApi(
  id: string,
  payload: UpdateCoursePayload
): Promise<{
  data: ApiCourse | null;
  error: string | null;
}> {
  return apiRequest<ApiCourse>(`${API_V1_URL}/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// POST /api/v1/courses/:id/submit-review
export async function submitCourseReviewApi(id: string): Promise<{
  data: ApiCourse | null;
  error: string | null;
}> {
  return apiRequest<ApiCourse>(`${API_V1_URL}/courses/${id}/submit-review`, {
    method: "POST",
  });
}
