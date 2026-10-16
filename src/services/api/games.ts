import { API_V1_URL, apiRequest } from "./client";
import {
  TeacherGameDTO,
  CreateTeacherGamePayload,
  UpdateTeacherGamePayload,
} from "./types";

function unwrapResponse<T>(res: {
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

// GET /api/v1/teacher/games
export async function getTeacherGamesApi(): Promise<{
  data: TeacherGameDTO[] | null;
  error: string | null;
}> {
  const res = await apiRequest<TeacherGameDTO[]>(`${API_V1_URL}/teacher/games`, {
    cache: "no-store",
  });
  return unwrapResponse(res);
}

// GET /api/v1/teacher/games/:id
export async function getTeacherGameDetailApi(
  id: string
): Promise<{
  data: TeacherGameDTO | null;
  error: string | null;
}> {
  const res = await apiRequest<TeacherGameDTO>(
    `${API_V1_URL}/teacher/games/${id}`,
    {
      cache: "no-store",
    }
  );
  return unwrapResponse(res);
}

// POST /api/v1/teacher/games
export async function createTeacherGameApi(
  payload: CreateTeacherGamePayload
): Promise<{
  data: TeacherGameDTO | null;
  error: string | null;
}> {
  const res = await apiRequest<TeacherGameDTO>(`${API_V1_URL}/teacher/games`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return unwrapResponse(res);
}

// PUT /api/v1/teacher/games/:id
export async function updateTeacherGameApi(
  id: string,
  payload: UpdateTeacherGamePayload
): Promise<{
  data: TeacherGameDTO | null;
  error: string | null;
}> {
  const res = await apiRequest<TeacherGameDTO>(
    `${API_V1_URL}/teacher/games/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
  return unwrapResponse(res);
}

// DELETE /api/v1/teacher/games/:id
export async function deleteTeacherGameApi(
  id: string
): Promise<{
  data: unknown | null;
  error: string | null;
}> {
  const res = await apiRequest<unknown>(`${API_V1_URL}/teacher/games/${id}`, {
    method: "DELETE",
  });
  return unwrapResponse(res);
}
