import { API_V1_URL, apiRequest } from "./client";
import {
  ApiVaultType,
  ApiVaultCategory,
  ApiVaultItem,
  VaultItemsResponse,
  CreateVaultItemPayload,
  UpdateVaultItemPayload,
} from "./types";

export interface VaultQueryFilters {
  bank_type?: string;
  category?: string;
  category_id?: string;
  cefr_level?: string;
  difficulty?: number | string;
  q?: string;
  limit?: number;
  offset?: number;
}

function buildQueryString(filters?: VaultQueryFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.bank_type && filters.bank_type !== "all") params.append("bank_type", filters.bank_type);
  if (filters.category && filters.category !== "all") params.append("category", filters.category);
  if (filters.category_id && filters.category_id !== "all") params.append("category_id", filters.category_id);
  if (filters.cefr_level && filters.cefr_level !== "all") params.append("cefr_level", filters.cefr_level);
  if (filters.difficulty && filters.difficulty !== "all") params.append("difficulty", String(filters.difficulty));
  if (filters.q?.trim()) params.append("q", filters.q.trim());
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.offset) params.append("offset", String(filters.offset));
  const query = params.toString();
  return query ? `?${query}` : "";
}

// 1. Tipos de bancos (catálogo)
export async function getVaultTypesApi(): Promise<{
  data: ApiVaultType[] | null;
  error: string | null;
}> {
  return apiRequest<ApiVaultType[]>(`${API_V1_URL}/vault/types`, {
    cache: "no-store",
  });
}

// 1.1 Categorías semánticas de contenido
export async function getVaultCategoriesApi(): Promise<{
  data: ApiVaultCategory[] | null;
  error: string | null;
}> {
  return apiRequest<ApiVaultCategory[]>(`${API_V1_URL}/vault/categories`, {
    cache: "no-store",
  });
}

export async function createVaultCategoryApi(payload: {
  name: string;
  description?: string;
}): Promise<{
  data: ApiVaultCategory | null;
  error: string | null;
}> {
  return apiRequest<ApiVaultCategory>(`${API_V1_URL}/vault/categories`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// 2. Banco Oficial Wordtap
export async function getOfficialVaultItemsApi(filters?: VaultQueryFilters): Promise<{
  data: VaultItemsResponse | null;
  error: string | null;
}> {
  return apiRequest<VaultItemsResponse>(`${API_V1_URL}/vault/items${buildQueryString(filters)}`, {
    cache: "no-store",
  });
}

export async function createOfficialVaultItemApi(payload: CreateVaultItemPayload): Promise<{
  data: ApiVaultItem | null;
  error: string | null;
}> {
  return apiRequest<ApiVaultItem>(`${API_V1_URL}/vault/items`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateOfficialVaultItemApi(
  id: string,
  payload: UpdateVaultItemPayload
): Promise<{
  data: ApiVaultItem | null;
  error: string | null;
}> {
  return apiRequest<ApiVaultItem>(`${API_V1_URL}/vault/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteOfficialVaultItemApi(id: string): Promise<{
  data: { deleted: boolean; id: string } | null;
  error: string | null;
}> {
  return apiRequest<{ deleted: boolean; id: string }>(`${API_V1_URL}/vault/items/${id}`, {
    method: "DELETE",
  });
}

// 3. Biblioteca Privada del Docente
export async function getTeacherPrivateVaultApi(filters?: VaultQueryFilters): Promise<{
  data: VaultItemsResponse | null;
  error: string | null;
}> {
  return apiRequest<VaultItemsResponse>(
    `${API_V1_URL}/teacher/vault/items${buildQueryString(filters)}`,
    { cache: "no-store" }
  );
}

export async function createTeacherPrivateVaultApi(payload: CreateVaultItemPayload): Promise<{
  data: ApiVaultItem | null;
  error: string | null;
}> {
  return apiRequest<ApiVaultItem>(`${API_V1_URL}/teacher/vault/items`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTeacherPrivateVaultApi(
  id: string,
  payload: UpdateVaultItemPayload
): Promise<{
  data: ApiVaultItem | null;
  error: string | null;
}> {
  return apiRequest<ApiVaultItem>(`${API_V1_URL}/teacher/vault/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteTeacherPrivateVaultApi(id: string): Promise<{
  data: { deleted: boolean; id: string } | null;
  error: string | null;
}> {
  return apiRequest<{ deleted: boolean; id: string }>(`${API_V1_URL}/teacher/vault/items/${id}`, {
    method: "DELETE",
  });
}
