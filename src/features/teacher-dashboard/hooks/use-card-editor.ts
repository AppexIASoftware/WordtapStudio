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

    try {
      const isNew = stepForm.id.startsWith("step-");
      const orderIdx = currentLesson.items.findIndex((item) => item.id === stepForm.id);
      const sortOrder = orderIdx >= 0 ? orderIdx : currentLesson.items.length;

      const res = await saveLessonItemApi(currentLesson.id, {
        id: isNew ? undefined : stepForm.id,
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
    }
  };

  const handleDeleteStep = async (id: string) => {
    if (!currentLesson) return;
    try {
      if (!id.startsWith("step-")) {
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

  const handleAddCard = async (stepData: Omit<LessonItem, "id">) => {
    if (!currentLesson) {
      triggerToast("Seleccioná una lección antes de añadir una tarjeta.");
      return;
    }
    try {
      const res = await saveLessonItemApi(currentLesson.id, {
        item_type: stepData.itemType || "word",
        content_text: JSON.stringify(stepData),
        sort_order: (currentLesson.items.length || 0) + 1,
        is_required: true,
      });
      if (res.error || !res.data)
        throw new Error(res.error || "La API no confirmó la creación de la tarjeta");
      const newStep: LessonItem = { id: res.data.id, ...stepData };
      setCourses((prev) => ({
        ...prev,
        [currentCourseId]: {
          ...prev[currentCourseId],
          lessons: prev[currentCourseId].lessons.map((lesson) =>
            lesson.id === currentLesson.id ? { ...lesson, items: [...lesson.items, newStep] } : lesson
          ),
        },
      }));
      handleStepSelect(newStep);
      triggerToast(`Tarjeta "${stepData.en}" añadida`);
    } catch (err) {
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
    handleSaveStep,
    handleDeleteStep,
    handleAddCard,
  };
}
