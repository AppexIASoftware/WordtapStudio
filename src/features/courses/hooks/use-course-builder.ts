"use client";

import { useState, useCallback, useRef } from "react";
import { Lesson, LessonItem } from "@/features/courses/types";
import { useAuth } from "@/features/auth/auth-context";
import { useBuilderModals } from "./use-builder-modals";
import { useBuilderSimulation } from "./use-builder-simulation";
import { useCardEditor } from "./use-card-editor";
import { useCourseCrud } from "./use-course-crud";
import { useBuilderLoader } from "./use-builder-loader";
import { useBuilderReviews } from "./use-builder-reviews";
import { useUrlMirror } from "@/hooks/use-url-params";
import { updateCourseApi, getSyncedReviews, saveSyncedReview } from "@/services/api";

/**
 * Hook orquestador principal del editor y constructor de cursos (Course Builder).
 * Conecta estado de sesion, navegacion en URL, leccion activa y sub-hooks modulares.
 */
export function useCourseBuilder(
  initialCourseId?: string,
  options?: { scope?: "teacher" | "admin" }
) {
  const { user } = useAuth();
  const [currentLessonId, setCurrentLessonId] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const handleStepSelectRef = useRef<(step: LessonItem) => void>(() => {});
  const resetStepFormRef = useRef<() => void>(() => {});

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const syncSelectedLesson = useCallback(
    (lesson: Lesson | null, requestedStepId?: string) => {
      if (lesson) {
        setCurrentLessonId(lesson.id);
        const items = lesson.items ?? [];
        const requested = requestedStepId
          ? items.find((item) => item.id === requestedStepId)
          : undefined;
        if (requested || items.length > 0) {
          handleStepSelectRef.current(requested || items[0]);
        } else {
          resetStepFormRef.current();
        }
      } else {
        setCurrentLessonId("");
        resetStepFormRef.current();
      }
    },
    []
  );

  const {
    courses,
    setCourses,
    isLoading,
    setIsLoading,
    currentCourseId,
    setCurrentCourseId,
    handleSelectCourse,
    loadCoursesData,
  } = useBuilderLoader({
    initialCourseId,
    userName: user?.name,
    scope: options?.scope,
    syncSelectedLesson,
    triggerToast,
  });

  const currentCourse = courses[currentCourseId] || Object.values(courses)[0] || null;
  const currentLesson: Lesson | null =
    currentCourse?.lessons?.find((l) => l.id === currentLessonId) ||
    currentCourse?.lessons?.[0] ||
    null;

  const modals = useBuilderModals(currentCourse?.lessons);
  const sim = useBuilderSimulation(setCurrentLessonId, triggerToast);
  const cards = useCardEditor(currentCourseId, currentLesson, setCourses, triggerToast);
  handleStepSelectRef.current = cards.handleStepSelect;
  resetStepFormRef.current = cards.resetStepForm;
  const { handleStepSelect, resetStepForm } = cards;

  // Reflejo reactivo en URL de la leccion, tarjeta y pestana activa
  useUrlMirror({
    courseId: currentCourseId,
    lessonId: currentLessonId,
    stepId: cards.currentStepId,
    canvasTab: sim.activeCanvasTab === "cards" ? "" : sim.activeCanvasTab,
  });

  const handleSelectLesson = (lesson: Lesson) => {
    syncSelectedLesson(lesson);
    triggerToast(`Lección activa: ${lesson.title}`);
  };

  const {
    handleCourseCreated,
    handleEditCourse,
    handleDeleteCourse,
    handleSaveLesson,
    handleDeleteLesson,
    handleLessonCreated,
    handleSavePrice,
  } = useCourseCrud({
    currentCourseId,
    currentLessonId,
    courses,
    setCourses,
    setCurrentCourseId,
    syncSelectedLesson,
    triggerToast,
    userName: user?.name,
  });

  const { handleSubmitReview, handleWithdrawReview } = useBuilderReviews({
    currentCourseId,
    currentCourse,
    user,
    setCourses,
    setIsLoading,
    triggerToast,
  });

  const isAdmin = options?.scope === "admin";

  const handleAdminPublish = async () => {
    if (!currentCourseId || !currentCourse) return;
    try {
      const synced = getSyncedReviews();
      const activePr = synced.find(
        (r) => r.courseId === currentCourseId || r.originalId === currentCourseId
      );
      if (activePr) {
        saveSyncedReview({
          ...activePr,
          status: "approved",
          statusLabel: "Aprobado",
        });
      }

      const res = await updateCourseApi(currentCourseId, {
        status: "published",
      });
      if (res.error) throw new Error(res.error);

      setCourses((prev) => ({
        ...prev,
        [currentCourseId]: {
          ...prev[currentCourseId],
          status: "published",
          reviewStatus: "approved",
        },
      }));
      triggerToast(`¡"${currentCourse.title}" publicado y activo en el catálogo oficial!`);
    } catch (err: unknown) {
      triggerToast(err instanceof Error ? err.message : "Error al publicar curso");
    }
  };

  return {
    courses,
    currentCourseId,
    currentCourse,
    currentLessonId,
    currentLesson,
    isLoading,
    toastMessage,
    isAdmin,
    scope: options?.scope || "teacher",
    ...cards,
    ...sim,
    ...modals,
    handleSelectCourse,
    handleCourseCreated,
    handleLessonCreated,
    handleSelectLesson,
    handleSubmitReview,
    handleWithdrawReview,
    handleAdminPublish,
    handleRefreshCourses: loadCoursesData,
    handleEditCourse,
    handleDeleteCourse,
    handleSaveLesson,
    handleDeleteLesson,
    handleSavePrice,
    triggerToast,
  };
}
