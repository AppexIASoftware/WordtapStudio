export interface ApiHealthResponse {
  status: string;
  database: string;
  uptime?: string;
  timestamp?: string;
}

export interface BackendUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  role: string;
  access_tier: string;
  preferred_language: string;
  learning_level: string;
  timezone: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: BackendUser;
}

export interface ApiCourse {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  access_tier: string;
  level: string;
  status: "draft" | "in_review" | "published" | "archived";
  sort_order: number;
  cover_image_url?: string | null;
  source_lang: string;
  target_lang: string;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  lessons?: unknown[];
}

export interface CreateCoursePayload {
  title: string;
  description?: string;
  level?: string;
  access_tier?: string;
  source_lang?: string;
  target_lang?: string;
  cover_image_url?: string;
}

export interface UpdateCoursePayload {
  title?: string;
  description?: string;
  level?: string;
  access_tier?: string;
  cover_image_url?: string;
}

export interface ApiLessonItem {
  id: string;
  lesson_id: string;
  item_type: "word" | "phrase" | "grammar" | "tip" | "exercise";
  content_text?: string | null;
  sort_order: number;
  is_required: boolean;
}

export interface ApiLesson {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  description?: string | null;
  access_tier: string;
  status: "draft" | "in_review" | "published" | "archived";
  sort_order: number;
  estimated_minutes?: number | null;
  created_at: string;
  updated_at: string;
  items?: ApiLessonItem[];
}

export interface CreateLessonPayload {
  title: string;
  description?: string;
  estimated_minutes?: number;
  sort_order?: number;
}

export interface UpdateLessonPayload {
  title?: string;
  description?: string;
  estimated_minutes?: number;
  sort_order?: number;
}

export interface SaveLessonItemPayload {
  id?: string;
  item_type?: "word" | "phrase" | "grammar" | "tip" | "exercise";
  content_text?: string;
  sort_order?: number;
  is_required?: boolean;
}
