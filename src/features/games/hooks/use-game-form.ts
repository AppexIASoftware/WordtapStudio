"use client";

import { useState, useEffect } from "react";
import { TeacherGameDTO, ApiCourse } from "@/services/api/types";
import { getTeacherCoursesApi } from "@/services/api/courses";
import { getOfficialVaultItemsApi } from "@/services/api/vault";

interface UseGameFormProps {
  initialGame?: TeacherGameDTO | null;
  defaultArchetype?: string;
  onSave: (payload: {
    course_id?: string | null;
    base_archetype: string;
    title: string;
    description?: string;
    level: string;
    time_limit_seconds: number;
    allowed_mistakes: number;
    reward_xp: number;
    item_count: number;
    source_type: string;
    custom_words_json?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

const DEFAULT_VOCAB = [
  { term: "Fluency", translation: "Fluidez" },
  { term: "Achievement", translation: "Logro" },
  { term: "Mastery", translation: "Dominio" },
  { term: "Challenge", translation: "Desafío" },
  { term: "Accuracy", translation: "Precisión" },
  { term: "Resilience", translation: "Resiliencia" },
];

export function useGameForm({
  initialGame,
  defaultArchetype = "match",
  onSave,
  onCancel,
}: UseGameFormProps) {
  const [baseArchetype, setBaseArchetype] = useState(
    initialGame?.base_archetype || defaultArchetype
  );
  const [title, setTitle] = useState(initialGame?.title || "");
  const [description, setDescription] = useState(initialGame?.description || "");
  const [level, setLevel] = useState(initialGame?.level || "B1 Intermedio");
  const [timeLimit, setTimeLimit] = useState(initialGame?.time_limit_seconds || 45);
  const [allowedMistakes, setAllowedMistakes] = useState(
    initialGame !== undefined && initialGame !== null ? initialGame.allowed_mistakes : 3
  );
  const [rewardXP, setRewardXP] = useState(initialGame?.reward_xp || 20);
  const [itemCount, setItemCount] = useState(initialGame?.item_count || 6);
  const [sourceType, setSourceType] = useState(initialGame?.source_type || "course_lesson");
  const [courseId, setCourseId] = useState<string | null>(initialGame?.course_id || null);

  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [customWordsText, setCustomWordsText] = useState(
    initialGame?.custom_words_json || JSON.stringify(DEFAULT_VOCAB, null, 2)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPlatformGame = initialGame?.owner_type === "platform";

  useEffect(() => {
    if (initialGame?.base_archetype) {
      setBaseArchetype(initialGame.base_archetype);
    } else if (defaultArchetype) {
      setBaseArchetype(defaultArchetype);
    }
  }, [defaultArchetype, initialGame]);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await getTeacherCoursesApi();
        if (res.data) {
          setCourses(res.data);
          if (!courseId && !isPlatformGame && res.data.length > 0) {
            setCourseId(res.data[0].id);
          }
        }
      } catch {
        // Silencioso
      }
    }
    loadCourses();
  }, [courseId, isPlatformGame]);

  const handleAutoPopulateSource = async (type: "course_lesson" | "vault") => {
    setLoadingSources(true);
    setSourceType(type);
    try {
      if (type === "course_lesson" && courseId) {
        const selCourse = courses.find((c) => c.id === courseId);
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
        const vRes = await getOfficialVaultItemsApi({ limit: itemCount });
        if (vRes.data?.items && vRes.data.items.length > 0) {
          const pairs = vRes.data.items.map((it) => ({
            term: it.prompt_text,
            translation: it.target_text,
          }));
          setCustomWordsText(JSON.stringify(pairs.slice(0, itemCount), null, 2));
          return;
        }
      }
    } catch {
      // Ignorar
    } finally {
      setLoadingSources(false);
    }
  };

  const getMockForSandbox = (): TeacherGameDTO => ({
    id: initialGame?.id || "preview-id",
    teacher_id: "preview-teacher",
    course_id: isPlatformGame ? null : courseId,
    course_title: isPlatformGame ? undefined : courses.find((c) => c.id === courseId)?.title,
    base_archetype: baseArchetype,
    title: title.trim() || "Prueba de Minijuego",
    description: description.trim() || undefined,
    level,
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
      validWordsJson = JSON.stringify(DEFAULT_VOCAB);
    }

    const cleanDescription = description.trim();

    try {
      setSaving(true);
      setError(null);
      await onSave({
        course_id: sourceType === "course_lesson" && courseId && courseId.trim() !== "" ? courseId.trim() : null,
        base_archetype: baseArchetype,
        title: title.trim(),
        description: cleanDescription === "" ? "" : cleanDescription,
        level,
        time_limit_seconds: Number(timeLimit),
        allowed_mistakes: Number(allowedMistakes),
        reward_xp: Number(rewardXP),
        item_count: Number(itemCount),
        source_type: sourceType,
        custom_words_json: validWordsJson,
      });
      onCancel();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar actividad");
    } finally {
      setSaving(false);
    }
  };

  const selectedCourseTitle = isPlatformGame ? undefined : courses.find((c) => c.id === courseId)?.title;

  return {
    baseArchetype,
    setBaseArchetype,
    title,
    setTitle,
    description,
    setDescription,
    level,
    setLevel,
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
    courses,
    loadingSources,
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
