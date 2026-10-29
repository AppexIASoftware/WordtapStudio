import { API_V1_URL, apiRequest } from "./client";
import {
  LessonGameDTO,
  LinkLessonGamePayload,
  UpdateLessonGamePayload,
  CreateTeacherGamePayload,
  UpdateTeacherGamePayload,
  TeacherGameDTO,
} from "./types";

function unwrapData<T>(res: {
  data: T | { data: T } | null;
  error: string | null;
}): { data: T | null; error: string | null } {
  if (
    res.data &&
    typeof res.data === "object" &&
    "data" in res.data &&
    !Array.isArray(res.data)
  ) {
    return { data: (res.data as { data: T }).data, error: res.error };
  }
  return res as { data: T | null; error: string | null };
}

export async function createLessonGameApi(
  lessonId: string,
  payload: CreateTeacherGamePayload
): Promise<{ data: TeacherGameDTO | null; error: string | null }> {
  const res = await apiRequest<TeacherGameDTO>(
    `${API_V1_URL}/lessons/${lessonId}/games/create`,
    { method: "POST", body: JSON.stringify(payload) }
  );
  return unwrapData(res);
}

export async function updateLessonGameActivityApi(
  lessonId: string,
  gameId: string,
  payload: UpdateTeacherGamePayload
): Promise<{ data: TeacherGameDTO | null; error: string | null }> {
  const res = await apiRequest<TeacherGameDTO>(
    `${API_V1_URL}/lessons/${lessonId}/games/${gameId}`,
    { method: "PUT", body: JSON.stringify(payload) }
  );
  return unwrapData(res);
}

// GET /api/v1/lessons/:id/games
export async function getLessonGamesApi(lessonId: string): Promise<{
  data: LessonGameDTO[] | null;
  error: string | null;
}> {
  const res = await apiRequest<LessonGameDTO[]>(
    `${API_V1_URL}/lessons/${lessonId}/games`,
    { cache: "no-store" }
  );
  return unwrapData(res);
}

// POST /api/v1/lessons/:id/games
export async function linkLessonGameApi(
  lessonId: string,
  payload: LinkLessonGamePayload
): Promise<{ data: LessonGameDTO | null; error: string | null }> {
  const res = await apiRequest<LessonGameDTO>(
    `${API_V1_URL}/lessons/${lessonId}/games`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  return unwrapData(res);
}

// PATCH /api/v1/lessons/:id/games/:game_id
export async function updateLessonGameApi(
  lessonId: string,
  gameId: string,
  payload: UpdateLessonGamePayload
): Promise<{ data: LessonGameDTO | null; error: string | null }> {
  const res = await apiRequest<LessonGameDTO>(
    `${API_V1_URL}/lessons/${lessonId}/games/${gameId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
  return unwrapData(res);
}

// DELETE /api/v1/lessons/:id/games/:game_id
export async function unlinkLessonGameApi(
  lessonId: string,
  gameId: string
): Promise<{ data: null; error: string | null }> {
  return apiRequest<null>(
    `${API_V1_URL}/lessons/${lessonId}/games/${gameId}`,
    { method: "DELETE" }
  );
}
