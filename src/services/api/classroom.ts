import { API_V1_URL, apiRequest } from "./client";
import { CreateClassroomPayload, UpdateClassroomPayload, JoinClassroomPayload } from "./types";
import { Classroom, StumbleItem } from "@/features/teacher-dashboard/types";

function unwrapResponse<T>(res: { data: T | { data: T } | null; error: string | null }): { data: T | null; error: string | null } {
  if (res.data && typeof res.data === "object" && "data" in res.data && !Array.isArray(res.data)) {
    return { data: (res.data as { data: T }).data, error: res.error };
  }
  return res as { data: T | null; error: string | null };
}

// GET /api/v1/teacher/classrooms
export async function getTeacherClassroomsApi(): Promise<{
  data: Classroom[] | null;
  error: string | null;
}> {
  const res = await apiRequest<Classroom[]>(`${API_V1_URL}/teacher/classrooms`, {
    cache: "no-store",
  });
  return unwrapResponse(res);
}

// POST /api/v1/teacher/classrooms
export async function createClassroomApi(payload: CreateClassroomPayload): Promise<{
  data: Classroom | null;
  error: string | null;
}> {
  const res = await apiRequest<Classroom>(`${API_V1_URL}/teacher/classrooms`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return unwrapResponse(res);
}

// PUT /api/v1/teacher/classrooms/:id
export async function updateClassroomApi(
  id: string,
  payload: UpdateClassroomPayload
): Promise<{
  data: Classroom | null;
  error: string | null;
}> {
  const res = await apiRequest<Classroom>(`${API_V1_URL}/teacher/classrooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return unwrapResponse(res);
}

// GET /api/v1/teacher/classrooms/:id/stumbles
export async function getClassroomStumblesApi(id: string): Promise<{
  data: StumbleItem[] | null;
  error: string | null;
}> {
  const res = await apiRequest<StumbleItem[]>(`${API_V1_URL}/teacher/classrooms/${id}/stumbles`, {
    cache: "no-store",
  });
  return unwrapResponse(res);
}

// POST /api/v1/classrooms/join
export async function joinClassroomApi(payload: JoinClassroomPayload): Promise<{
  data: unknown | null;
  error: string | null;
}> {
  const res = await apiRequest<unknown>(`${API_V1_URL}/classrooms/join`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return unwrapResponse(res);
}
