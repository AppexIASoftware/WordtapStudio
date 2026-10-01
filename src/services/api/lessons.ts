import { API_V1_URL, apiRequest } from "./client";
import {
  ApiLesson,
  ApiLessonItem,
  CreateLessonPayload,
  UpdateLessonPayload,
  SaveLessonItemPayload,
} from "./types";

// GET /api/v1/courses/:course_id/lessons
export async function getCourseLessonsApi(courseId: string): Promise<{
  data: ApiLesson[] | null;
  error: string | null;
}> {
  return apiRequest<ApiLesson[]>(`${API_V1_URL}/courses/${courseId}/lessons`, {
    cache: "no-store",
  });
}

// POST /api/v1/courses/:course_id/lessons
export async function createLessonApi(
  courseId: string,
  payload: CreateLessonPayload
): Promise<{
  data: ApiLesson | null;
  error: string | null;
}> {
  return apiRequest<ApiLesson>(`${API_V1_URL}/courses/${courseId}/lessons`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// PUT /api/v1/lessons/:id
export async function updateLessonApi(
  lessonId: string,
  payload: UpdateLessonPayload
): Promise<{
  data: ApiLesson | null;
  error: string | null;
}> {
  return apiRequest<ApiLesson>(`${API_V1_URL}/lessons/${lessonId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// DELETE /api/v1/lessons/:id
export async function deleteLessonApi(lessonId: string): Promise<{
  data: { status: string; lesson_id: string } | null;
  error: string | null;
}> {
  return apiRequest<{ status: string; lesson_id: string }>(`${API_V1_URL}/lessons/${lessonId}`, {
    method: "DELETE",
  });
}

// POST /api/v1/lessons/:id/items
export async function saveLessonItemApi(
  lessonId: string,
  payload: SaveLessonItemPayload
): Promise<{
  data: ApiLessonItem | null;
  error: string | null;
}> {
  return apiRequest<ApiLessonItem>(`${API_V1_URL}/lessons/${lessonId}/items`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// DELETE /api/v1/lessons/:id/items/:item_id
export async function deleteLessonItemApi(
  lessonId: string,
  itemId: string
): Promise<{
  data: { status: string; item_id: string } | null;
  error: string | null;
}> {
  return apiRequest<{ status: string; item_id: string }>(
    `${API_V1_URL}/lessons/${lessonId}/items/${itemId}`,
    {
      method: "DELETE",
    }
  );
}
