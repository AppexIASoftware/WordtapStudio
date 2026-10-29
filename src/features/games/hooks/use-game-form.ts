"use client";

import { useState, useEffect } from "react";
import { TeacherGameDTO, ApiCourse, ApiVaultCategory } from "@/services/api/types";
import { OWNER_TYPE } from "@/services/api/owner-type";
import { getTeacherCoursesApi, getTeacherCourseDetailApi } from "@/services/api/courses";
import { getOfficialVaultItemsApi, getVaultCategoriesApi } from "@/services/api/vault";

interface UseGameFormProps {
  initialGame?: TeacherGameDTO | null;
  defaultArchetype?: string;
  isGlobal?: boolean;
  onSave: (payload: {
    course_id?: string | null;
    category_id?: string | null;
    base_archetype: string;
    title: string;
    description?: string;
    level: string;
    access_tier?: "free" | "subscription";
    time_limit_seconds: number;
    allowed_mistakes: number;
    reward_xp: number;
    item_count: number;
    source_type: string;
    custom_words_json?: string;
    is_published_standalone?: boolean;
    audience_scope?: "all_students" | "selected_courses";
    assigned_course_ids?: string[];
  }) => Promise<void>;
  onCancel: () => void;
}

export function useGameForm({
  initialGame,
  defaultArchetype = "match",
  isGlobal = false,
  onSave,
  onCancel,
}: UseGameFormProps) {
  const [baseArchetype, setBaseArchetype] = useState(
    initialGame?.base_archetype || defaultArchetype
  );
  const [title, setTitle] = useState(initialGame?.title || "");
  const [description, setDescription] = useState(initialGame?.description || "");
  const [level, setLevel] = useState(initialGame?.level || "B1 Intermedio");
  const [accessTier, setAccessTier] = useState<"free" | "subscription">(
    initialGame?.access_tier || "free"
  );
  const [categoryId, setCategoryId] = useState<string>(initialGame?.category_id || "");
  const [categories, setCategories] = useState<ApiVaultCategory[]>([]);
  const [timeLimit, setTimeLimit] = useState(initialGame?.time_limit_seconds || 45);
  const [allowedMistakes, setAllowedMistakes] = useState(
    initialGame !== undefined && initialGame !== null ? initialGame.allowed_mistakes : 3
  );
  const [rewardXP, setRewardXP] = useState(initialGame?.reward_xp || 20);
  const [itemCount, setItemCount] = useState(initialGame?.item_count || 6);
  const [sourceType, setSourceType] = useState(
    initialGame?.source_type || (isGlobal ? "vault" : "course_lesson")
  );
  const [courseId, setCourseId] = useState<string | null>(initialGame?.course_id || null);
  const [isPublishedStandalone, setIsPublishedStandalone] = useState<boolean>(
    Boolean(initialGame?.is_published_standalone)
  );
  const [audienceScope, setAudienceScope] = useState<"all_students" | "selected_courses">(
    initialGame?.audience_scope || "all_students"
  );
  const [assignedCourseIds, setAssignedCourseIds] = useState<string[]>(
    initialGame?.assigned_course_ids || []
  );

  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [customWordsText, setCustomWordsText] = useState(
    initialGame?.custom_words_json || "[]"
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceMessage, setSourceMessage] = useState<string | null>(null);

  const isPlatformGame = initialGame?.owner_type === OWNER_TYPE.PLATFORM;

  useEffect(() => {
    if (initialGame?.base_archetype) {
      setBaseArchetype(initialGame.base_archetype);
    } else if (defaultArchetype) {
      setBaseArchetype(defaultArchetype);
    }
    if (initialGame?.access_tier) {
      setAccessTier(initialGame.access_tier);
    }
  }, [defaultArchetype, initialGame]);

  useEffect(() => {
    getVaultCategoriesApi().then((res) => {
      if (res.data) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await getTeacherCoursesApi();
        if (res.error) throw new Error(res.error);
        if (res.data) {
          setCourses(res.data);
          if (!courseId && !isPlatformGame && res.data.length > 0) {
            setCourseId(res.data[0].id);
          }
        }
      } catch {
        setSourceMessage("No se pudieron cargar tus cursos. Inténtalo de nuevo.");
      }
    }
    loadCourses();
  }, [courseId, isPlatformGame]);

  const handleAutoPopulateSource = async (type: "course_lesson" | "vault") => {
    setLoadingSources(true);
    setSourceType(type);
    setSourceMessage(null);
    try {
      if (type === "course_lesson" && courseId) {
        const result = await getTeacherCourseDetailApi(courseId);
        if (result.error) throw new Error(result.error);
        const selCourse = result.data;
        if (selCourse?.lessons && selCourse.lessons.length > 0) {
          const pairs: { term: string; translation: string }[] = [];
          for (const l of selCourse.lessons) {
            if (l.items) {
              for (const it of l.items) {
                if (it.vocabulary_item) {
                  pairs.push({ term: it.vocabulary_item.english, translation: it.vocabulary_item.spanish });
                } else if (it.phrase) {
                  pairs.push({ term: it.phrase.english, translation: it.phrase.spanish });
                } else if (it.content_bank_item) {
                  pairs.push({ term: it.content_bank_item.prompt_text, translation: it.content_bank_item.target_text });
                }
              }
            }
          }
          if (pairs.length > 0) {
            setCustomWordsText(JSON.stringify(pairs.slice(0, itemCount), null, 2));
            return;
          }
        }
      }

      if (type === "vault") {
        const vRes = await getOfficialVaultItemsApi({
          category_id: categoryId || undefined,
          cefr_level: level.slice(0, 2),
          limit: itemCount,
        });
        if (vRes.error) throw new Error(vRes.error);
        if (vRes.data?.items && vRes.data.items.length > 0) {
          const pairs = vRes.data.items.map((it) => ({
            term: it.target_text,
            translation: it.prompt_text,
          }));
          setCustomWordsText(JSON.stringify(pairs.slice(0, itemCount), null, 2));
          return;
        }
      }
      setCustomWordsText("[]");
      setSourceMessage(type === "course_lesson" && !courseId
        ? "Selecciona un curso para cargar su vocabulario."
        : "No se encontraron palabras para esta selección.");
    } catch {
      setSourceMessage("No se pudo cargar el vocabulario. Inténtalo de nuevo.");
    } finally {
      setLoadingSources(false);
    }
  };

  const getMockForSandbox = (): TeacherGameDTO => ({
    id: initialGame?.id || "preview-id",
    teacher_id: "preview-teacher",
    course_id: isPlatformGame ? null : courseId,
    course_title: isPlatformGame ? undefined : courses.find((c) => c.id === courseId)?.title,
    category_id: categoryId || null,
    category_name: categories.find((c) => c.id === categoryId)?.name,
    base_archetype: baseArchetype,
    title: title.trim() || "Prueba de Minijuego",
    description: description.trim() || undefined,
    level,
    access_tier: accessTier,
    time_limit_seconds: Number(timeLimit),
    allowed_mistakes: Number(allowedMistakes),
    reward_xp: Number(rewardXP),
    item_count: Number(itemCount),
    source_type: sourceType,
    custom_words_json: customWordsText,
    is_active: true,
    created_at: new Date().toISOString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("El título de la actividad es obligatorio");
      return;
    }

    let validWordsJson = customWordsText?.trim() || "[]";
    try {
      JSON.parse(validWordsJson);
    } catch {
      setError("El contenido seleccionado no es válido.");
      return;
    }

    const cleanDescription = description.trim();

    try {
      setSaving(true);
      setError(null);
      await onSave({
        course_id: sourceType === "course_lesson" && courseId && courseId.trim() !== "" ? courseId.trim() : null,
        category_id: categoryId && categoryId.trim() !== "" ? categoryId.trim() : null,
        base_archetype: baseArchetype,
        title: title.trim(),
        description: cleanDescription === "" ? "" : cleanDescription,
        level,
        access_tier: accessTier,
        time_limit_seconds: Number(timeLimit),
        allowed_mistakes: Number(allowedMistakes),
        reward_xp: Number(rewardXP),
        item_count: Number(itemCount),
        source_type: sourceType,
        custom_words_json: validWordsJson,
        is_published_standalone: isPublishedStandalone,
        audience_scope: audienceScope,
        assigned_course_ids: isPublishedStandalone && audienceScope === "selected_courses" ? assignedCourseIds : [],
      });
      onCancel();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar actividad");
    } finally {
      setSaving(false);
    }
  };

  const selectedCourseTitle = isPlatformGame ? undefined : courses.find((c) => c.id === courseId)?.title;
  const selectedCategoryName = categories.find((c) => c.id === categoryId)?.name;

  return {
    baseArchetype,
    setBaseArchetype,
    title,
    setTitle,
    description,
    setDescription,
    level,
    setLevel,
    accessTier,
    setAccessTier,
    categoryId,
    setCategoryId,
    categories,
    setCategories,
    selectedCategoryName,
    timeLimit,
    setTimeLimit,
    allowedMistakes,
    setAllowedMistakes,
    rewardXP,
    setRewardXP,
    itemCount,
    setItemCount,
    sourceType,
    courseId,
    setCourseId,
    isPublishedStandalone,
    setIsPublishedStandalone,
    audienceScope,
    setAudienceScope,
    assignedCourseIds,
    setAssignedCourseIds,
    courses,
    loadingSources,
    sourceMessage,
    customWordsText,
    setCustomWordsText,
    saving,
    error,
    selectedCourseTitle,
    handleAutoPopulateSource,
    getMockForSandbox,
    handleSubmit,
  };
}
