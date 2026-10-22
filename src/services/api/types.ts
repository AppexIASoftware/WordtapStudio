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
  price_cents?: number;
  level: string;
  status: "draft" | "in_review" | "published" | "archived";
  sort_order: number;
  cover_image_url?: string | null;
  source_lang: string;
  target_lang: string;
  created_by?: string | null;
  owner_type?: "platform" | "teacher";
  author?: BackendUser | null;
  created_at: string;
  updated_at: string;
  lessons?: ApiLesson[];
}

export interface CreateCoursePayload {
  title: string;
  description?: string;
  level?: string;
  access_tier?: string;
  price_cents?: number;
  source_lang?: string;
  target_lang?: string;
  cover_image_url?: string;
}

export interface UpdateCoursePayload {
  title?: string;
  description?: string;
  level?: string;
  access_tier?: string;
  price_cents?: number;
  source_lang?: string;
  target_lang?: string;
  status?: "draft" | "in_review" | "published" | "archived" | string;
  cover_image_url?: string;
  change_summary?: string;
}

export interface ApiCourseReviewRequest {
  id: string;
  course_id: string;
  instructor_id: string;
  reviewer_admin_id?: string | null;
  status: "pending" | "changes_requested" | "approved" | "rejected";
  feedback_notes?: string | null;
  diff_summary?: string;
  change_summary?: string | null;
  submitted_at: string;
  reviewed_at?: string | null;
  course?: ApiCourse;
  instructor?: BackendUser;
}

export interface SubmitCourseReviewPayload {
  change_summary?: string;
}

export interface ReviewDecisionPayload {
  status: "approved" | "changes_requested" | "rejected";
  feedback_notes?: string;
}

export interface ApiVocabularyItem {
  id: string;
  spanish: string;
  english: string;
  pronunciation?: string | null;
  part_of_speech?: string | null;
  definition?: string | null;
  example_sentence?: string | null;
  audio_url?: string | null;
}

export interface ApiPhrase {
  id: string;
  spanish: string;
  english: string;
  audio_url?: string | null;
  explanation?: string | null;
}

export interface ApiLessonItem {
  id: string;
  lesson_id: string;
  vocabulary_item_id?: string | null;
  phrase_id?: string | null;
  content_bank_item_id?: string | null;
  item_type: "word" | "phrase" | "grammar" | "tip" | "exercise";
  content_text?: string | null;
  sort_order: number;
  is_required: boolean;
  vocabulary_item?: ApiVocabularyItem | null;
  phrase?: ApiPhrase | null;
  content_bank_item?: ApiVaultItem | null;
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
  content_bank_item_id?: string;
  item_type?: "word" | "phrase" | "grammar" | "tip" | "exercise";
  content_text?: string;
  sort_order?: number;
  is_required?: boolean;
}

export interface ApiVaultType {
  slug: string;
  display_name: string;
  color_theme: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ApiVaultItem {
  id: string;
  bank_type: string;
  category_id?: string | null;
  source_lang: string;
  target_lang: string;
  prompt_text: string;
  target_text: string;
  ipa?: string | null;
  cefr_level: string;
  difficulty: number;
  audio_url?: string | null;
  explanation?: string | null;
  metadata: string;
  status: "draft" | "published" | "archived";
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  bank_type_ref?: ApiVaultType | null;
}

export interface VaultItemsResponse {
  items: ApiVaultItem[];
  total: number;
}

export interface CreateVaultItemPayload {
  bank_type: string;
  prompt_text: string;
  target_text: string;
  ipa?: string;
  cefr_level?: string;
  difficulty?: number;
  audio_url?: string;
  explanation?: string;
  metadata?: string;
}

export interface UpdateVaultItemPayload {
  bank_type?: string;
  prompt_text?: string;
  target_text?: string;
  ipa?: string;
  cefr_level?: string;
  difficulty?: number;
  audio_url?: string;
  explanation?: string;
  metadata?: string;
}

export interface CreateClassroomPayload {
  name: string;
  level?: string;
  course_id?: string;
  course_ids?: string[];
  game_ids?: string[];
  weekly_goal_words?: number;
  description?: string;
}

export interface UpdateClassroomPayload {
  name: string;
  level?: string;
  course_id?: string;
  course_ids?: string[];
  game_ids?: string[];
  weekly_goal_words?: number;
  description?: string;
}

export interface JoinClassroomPayload {
  code: string;
}

export interface TeacherGameDTO {
  id: string;
  teacher_id: string;
  /** Nombre del docente autor. Solo lo entrega el catálogo administrativo. */
  teacher_name?: string;
  /** Correo del docente autor. Solo lo entrega el catálogo administrativo. */
  teacher_email?: string;
  course_id?: string | null;
  course_title?: string;
  base_archetype: string;
  title: string;
  description?: string | null;
  level: string;
  time_limit_seconds: number;
  allowed_mistakes: number;
  reward_xp: number;
  item_count: number;
  source_type: string;
  source_id?: string | null;
  custom_words_json?: string | null;
  is_active: boolean;
  /** Cantidad de lecciones que tienen esta actividad vinculada. */
  usage_count?: number;
  /** Platform-owned games are visible to every teacher and cannot be edited by them. */
  owner_type?: "platform" | "teacher";
  /**
   * True when the game belongs to the platform instead of a teacher.
   * Global games have no author nor course and the administrative catalog
   * reports this flag on every item it returns.
   */
  is_global?: boolean;
  created_at: string;
}

export interface CreateTeacherGamePayload {
  course_id?: string | null;
  base_archetype: string;
  title: string;
  description?: string;
  level?: string;
  time_limit_seconds?: number;
  allowed_mistakes?: number;
  reward_xp?: number;
  item_count?: number;
  source_type?: string;
  source_id?: string | null;
  custom_words_json?: string | null;
}

export interface UpdateTeacherGamePayload {
  course_id?: string | null;
  base_archetype?: string;
  title?: string;
  description?: string;
  level?: string;
  time_limit_seconds?: number;
  allowed_mistakes?: number;
  reward_xp?: number;
  item_count?: number;
  source_type?: string;
  source_id?: string | null;
  custom_words_json?: string | null;
}

export interface LessonGameDTO {
  id: string;
  game_id: string;
  title: string;
  description?: string | null;
  base_archetype: string;
  level: string;
  reward_xp: number;
  time_limit_seconds: number;
  allowed_mistakes: number;
  item_count: number;
  /** Cantidad de lecciones que tienen esta actividad vinculada. */
  usage_count?: number;
  /** Aviso del backend cuando el nivel de la actividad no coincide con el del curso. */
  level_warning?: string;
  owner_type?: "platform" | "teacher";
  is_global: boolean;
  is_active: boolean;
  is_required: boolean;
  sort_order: number;
}

export interface LinkLessonGamePayload {
  game_id: string;
  sort_order?: number;
  is_required?: boolean;
}

export interface UpdateLessonGamePayload {
  sort_order?: number;
  is_required?: boolean;
}

