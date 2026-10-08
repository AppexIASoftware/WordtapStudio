"use client";

import { useState, useCallback, Dispatch, SetStateAction } from "react";
import { Course, Lesson, LessonItem } from "../types";
import { saveLessonItemApi, deleteLessonItemApi } from "@/services/api";

export const createEmptyItem = (): LessonItem => ({
  id: `step-${Date.now()}`,
  en: "",
  es: "",
  ipa: "",
  pos: "",
  example: "",
  note: "",
  noteType: "bulb",
  itemType: "word",
});

export function useCardEditor(
  currentCourseId: string,
  currentLesson: Lesson | null,
  setCourses: Dispatch<SetStateAction<Record<string, Course>>>,
  triggerToast: (msg: string) => void
) {
  const [currentStepId, setCurrentStepId] = useState("");
  const [stepForm, setStepForm] = useState<LessonItem>(createEmptyItem);
  const [isSavingStep, setIsSavingStep] = useState(false);

  const handleStepSelect = useCallback((step: LessonItem) => {
    setCurrentStepId(step.id);
    setStepForm({ ...step });
  }, []);

  const resetStepForm = useCallback(() => {
    setCurrentStepId("");
    setStepForm(createEmptyItem());
  }, []);

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      triggerToast("Pronunciando: " + text);
    }
  };

  const handleSaveStep = async () => {
    if (!currentLesson) {
      triggerToast("Seleccioná una lección antes de guardar la tarjeta.");
      return;
    }
    if (!stepForm.en.trim() || !stepForm.es.trim()) {
      triggerToast("El término en inglés y la traducción en español son obligatorios.");
      return;
    }

    setIsSavingStep(true);
    try {
      const isNew = stepForm.id.startsWith("step-") || stepForm.id.startsWith("temp-");
      const orderIdx = currentLesson.items.findIndex((item) => item.id === stepForm.id);
      const sortOrder = orderIdx >= 0 ? orderIdx : currentLesson.items.length;

      const res = await saveLessonItemApi(currentLesson.id, {
        id: isNew ? undefined : stepForm.id,
        content_bank_item_id: stepForm.contentBankItemId || undefined,
        item_type: stepForm.itemType || "word",
        content_text: JSON.stringify(stepForm),
        sort_order: sortOrder,
        is_required: true,
      });
      if (res.error || !res.data) throw new Error(res.error || "La API no confirmó la tarjeta");
      const saved: LessonItem = { ...stepForm, id: res.data.id };

      setCourses((prev) => ({
        ...prev,
        [currentCourseId]: {
          ...prev[currentCourseId],
          lessons: prev[currentCourseId].lessons.map((lesson) => {
            if (lesson.id !== currentLesson.id) return lesson;
            const exists = lesson.items.some(
              (item) => item.id === stepForm.id || item.id === saved.id
            );
            const nextItems = exists
              ? lesson.items.map((item) =>
                  item.id === stepForm.id || item.id === saved.id ? saved : item
                )
              : [...lesson.items, saved];
            return { ...lesson, items: nextItems };
          }),
        },
      }));
      setStepForm(saved);
      setCurrentStepId(saved.id);
      triggerToast("Tarjeta guardada exitosamente");
    } catch (err) {
      triggerToast(
        `No se pudo guardar la tarjeta: ${err instanceof Error ? err.message : "error desconocido"}`
      );
    } finally {
      setIsSavingStep(false);
    }
  };

  const handleDeleteStep = async (id: string) => {
    if (!currentLesson) return;
    try {
      if (!id.startsWith("step-") && !id.startsWith("temp-")) {
        const res = await deleteLessonItemApi(currentLesson.id, id);
        if (res.error || !res.data)
          throw new Error(res.error || "La API no confirmó la eliminación de la tarjeta");
      }
      const remaining = currentLesson.items.filter((item) => item.id !== id);
      setCourses((prev) => ({
        ...prev,
        [currentCourseId]: {
          ...prev[currentCourseId],
          lessons: prev[currentCourseId].lessons.map((lesson) =>
            lesson.id === currentLesson.id ? { ...lesson, items: remaining } : lesson
          ),
        },
      }));
      if (remaining.length > 0) {
        handleStepSelect(remaining[0]);
      } else {
        resetStepForm();
      }
      triggerToast("Tarjeta eliminada");
    } catch (err) {
      triggerToast(
        `No se pudo eliminar la tarjeta: ${err instanceof Error ? err.message : "error desconocido"}`
      );
    }
  };

  const handleAddCard = async (
    stepData: Omit<LessonItem, "id">,
    contentBankItemId?: string
  ) => {
    if (!currentLesson) {
      triggerToast("Seleccioná una lección antes de añadir una tarjeta.");
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticStep: LessonItem = {
      id: tempId,
      contentBankItemId: contentBankItemId || null,
      ...stepData,
    };

    // 1. Inserción optimista inmediata (0ms percibidos en la UI)
    setCourses((prev) => ({
      ...prev,
      [currentCourseId]: {
        ...prev[currentCourseId],
        lessons: prev[currentCourseId].lessons.map((lesson) =>
          lesson.id === currentLesson.id
            ? { ...lesson, items: [...lesson.items, optimisticStep] }
            : lesson
        ),
      },
    }));
    handleStepSelect(optimisticStep);
    triggerToast(`Tarjeta "${stepData.en}" añadida`);

    // 2. Persistencia asíncrona en base de datos
    try {
      const cardPayload = {
        ...stepData,
        contentBankItemId: contentBankItemId || null,
      };
      const res = await saveLessonItemApi(currentLesson.id, {
        content_bank_item_id: contentBankItemId,
        item_type: stepData.itemType || "word",
        content_text: JSON.stringify(cardPayload),
        sort_order: (currentLesson.items.length || 0) + 1,
        is_required: true,
      });
      if (res.error || !res.data)
        throw new Error(res.error || "La API no confirmó la creación de la tarjeta");

      // 3. Conciliar ID temporal con ID persistido de la base de datos
      const realId = res.data.id;
      setCourses((prev) => ({
        ...prev,
        [currentCourseId]: {
          ...prev[currentCourseId],
          lessons: prev[currentCourseId].lessons.map((lesson) =>
            lesson.id === currentLesson.id
              ? {
                  ...lesson,
                  items: lesson.items.map((it) => (it.id === tempId ? { ...it, id: realId } : it)),
                }
              : lesson
          ),
        },
      }));
      setCurrentStepId((prev) => (prev === tempId ? realId : prev));
      setStepForm((prev) => (prev.id === tempId ? { ...prev, id: realId } : prev));
    } catch (err) {
      // Revertir en memoria si falla la API
      setCourses((prev) => ({
        ...prev,
        [currentCourseId]: {
          ...prev[currentCourseId],
          lessons: prev[currentCourseId].lessons.map((lesson) =>
            lesson.id === currentLesson.id
              ? { ...lesson, items: lesson.items.filter((it) => it.id !== tempId) }
              : lesson
          ),
        },
      }));
      triggerToast(
        `No se pudo añadir la tarjeta: ${err instanceof Error ? err.message : "error desconocido"}`
      );
    }
  };

  return {
    currentStepId,
    setCurrentStepId,
    stepForm,
    setStepForm,
    handleStepSelect,
    resetStepForm,
    speak,
    isSavingStep,
    handleSaveStep,
    handleDeleteStep,
    handleAddCard,
  };
}
