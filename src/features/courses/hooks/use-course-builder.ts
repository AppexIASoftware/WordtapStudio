"use client";

import { useState, useCallback } from "react";
import { Lesson } from "@/features/courses/types";
import { useAuth } from "@/features/auth/auth-context";
import { useBuilderModals } from "./use-builder-modals";
import { useBuilderSimulation } from "./use-builder-simulation";
import { useCardEditor } from "./use-card-editor";
import { useCourseCrud } from "./use-course-crud";
import { useBuilderLoader } from "./use-builder-loader";
import { useBuilderReviews } from "./use-builder-reviews";
import { useUrlMirror } from "@/hooks/use-url-params";

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
          handleStepSelect(requested || items[0]);
        } else {
          resetStepForm();
        }
      } else {
        setCurrentLessonId("");
        resetStepForm();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return {
    courses,
    currentCourseId,
    currentCourse,
    currentLessonId,
    currentLesson,
    isLoading,
    toastMessage,
    ...cards,
    ...sim,
    ...modals,
    handleSelectCourse,
    handleCourseCreated,
    handleLessonCreated,
    handleSelectLesson,
    handleSubmitReview,
    handleWithdrawReview,
    handleRefreshCourses: loadCoursesData,
    handleEditCourse,
    handleDeleteCourse,
    handleSaveLesson,
    handleDeleteLesson,
    handleSavePrice,
    triggerToast,
  };
}
