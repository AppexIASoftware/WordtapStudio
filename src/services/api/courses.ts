import { API_V1_URL, apiRequest } from "./client";
import {
  ApiCourse,
  ApiCourseReviewRequest,
  CreateCoursePayload,
  ReviewDecisionPayload,
  SubmitCourseReviewPayload,
  UpdateCoursePayload,
} from "./types";

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
export async function getCourseDetailApi(
  id: string,
  options?: { audit?: boolean }
): Promise<{
  data: ApiCourse | null;
  error: string | null;
}> {
  const query = options?.audit ? "?audit=1" : "";
  return apiRequest<ApiCourse>(`${API_V1_URL}/courses/${id}${query}`, {
    cache: "no-store",
  });
}

// GET /api/v1/teacher/courses/:id (private teacher-owned course detail)
export async function getTeacherCourseDetailApi(id: string): Promise<{
  data: ApiCourse | null;
  error: string | null;
}> {
  return apiRequest<ApiCourse>(`${API_V1_URL}/teacher/courses/${id}`, {
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
export async function submitCourseReviewApi(
  id: string,
  payload?: SubmitCourseReviewPayload
): Promise<{
  data: ApiCourse | null;
  error: string | null;
}> {
  return apiRequest<ApiCourse>(`${API_V1_URL}/courses/${id}/submit-review`, {
    method: "POST",
    body: payload ? JSON.stringify(payload) : undefined,
  });
}

// POST /api/v1/courses/:id/withdraw-review
export async function withdrawCourseReviewApi(
  id: string
): Promise<{
  data: ApiCourseReviewRequest | null;
  error: string | null;
}> {
  return apiRequest<ApiCourseReviewRequest>(
    `${API_V1_URL}/courses/${id}/withdraw-review`,
    {
      method: "POST",
    }
  );
}

// GET /api/v1/teacher/course-reviews
export async function getTeacherCourseReviewsApi(): Promise<{
  data: ApiCourseReviewRequest[] | null;
  error: string | null;
}> {
  return apiRequest<ApiCourseReviewRequest[]>(
    `${API_V1_URL}/teacher/course-reviews`,
    {
      cache: "no-store",
    }
  );
}

// GET /api/v1/admin/course-reviews
export async function getAdminCourseReviewsApi(): Promise<{
  data: ApiCourseReviewRequest[] | null;
  error: string | null;
}> {
  return apiRequest<ApiCourseReviewRequest[]>(
    `${API_V1_URL}/admin/course-reviews`,
    {
      cache: "no-store",
    }
  );
}

export async function getAdminCourseReviewHistoryApi(): Promise<{
  data: ApiCourseReviewRequest[] | null;
  error: string | null;
}> {
  return apiRequest<ApiCourseReviewRequest[]>(
    `${API_V1_URL}/admin/course-reviews/history`,
    { cache: "no-store" }
  );
}

// POST /api/v1/admin/course-reviews/:id/decision
export async function decideCourseReviewApi(
  id: string,
  payload: ReviewDecisionPayload
): Promise<{
  data: ApiCourseReviewRequest | null;
  error: string | null;
}> {
  return apiRequest<ApiCourseReviewRequest>(
    `${API_V1_URL}/admin/course-reviews/${id}/decision`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

// POST /api/v1/admin/courses/:id/suspend-review
export async function suspendCourseReviewApi(
  courseId: string,
  changeSummary?: string
): Promise<{
  data: { status: string; request: ApiCourseReviewRequest } | null;
  error: string | null;
}> {
  return apiRequest<{ status: string; request: ApiCourseReviewRequest }>(
    `${API_V1_URL}/admin/courses/${courseId}/suspend-review`,
    {
      method: "POST",
      body: JSON.stringify({ change_summary: changeSummary?.trim() || undefined }),
    }
  );
}

// DELETE /api/v1/courses/:id
export async function deleteCourseApi(id: string): Promise<{
  data: { status: string; course_id: string } | null;
  error: string | null;
}> {
  return apiRequest<{ status: string; course_id: string }>(`${API_V1_URL}/courses/${id}`, {
    method: "DELETE",
  });
}
