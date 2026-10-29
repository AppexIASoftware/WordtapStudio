"use client";

import { Dispatch, SetStateAction } from "react";
import { Course } from "@/features/courses/types";
import {
  submitCourseReviewApi,
  withdrawCourseReviewApi,
  saveSyncedReview,
  removeSyncedReview,
} from "@/services/api";

interface UseBuilderReviewsProps {
  currentCourseId: string;
  currentCourse: Course | null;
  user: { name?: string; email?: string } | null;
  setCourses: Dispatch<SetStateAction<Record<string, Course>>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  triggerToast: (msg: string) => void;
}

/** Hook que gestiona las solicitudes de aprobacion y retiro de revisiones para cursos. */
export function useBuilderReviews({
  currentCourseId,
  currentCourse,
  user,
  setCourses,
  setIsLoading,
  triggerToast,
}: UseBuilderReviewsProps) {
  const handleSubmitReview = async (changeSummary?: string) => {
    if (!currentCourse) return;
    const isResubmission = currentCourse.reviewStatus === "changes_requested";
    const defaultSummary = isResubmission
      ? "Correcciones aplicadas según las observaciones pedagógicas del revisor."
      : `Solicitud de revisión para publicación oficial del curso: ${currentCourse.title}`;
    const summary = changeSummary?.trim() || defaultSummary;

    const teacherName = user?.name || currentCourse.author || "Prof. Mateo Silva";
    const teacherEmail = user?.email || "docente@wordtap.app";
    const teacherInitials =
      teacherName
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() || "")
        .join("") || "MS";

    const res = await submitCourseReviewApi(currentCourseId, {
      change_summary: summary,
    });
    if (res.error || !res.data) {
      triggerToast(res.error || "No se pudo enviar el curso a revisión.");
      return;
    }

    setCourses((prev) => ({
      ...prev,
      [currentCourseId]: {
        ...prev[currentCourseId],
        status: res.data?.status || "in_review",
        reviewStatus: "pending",
        feedbackNotes: undefined,
      },
    }));

    triggerToast(
      isResubmission
        ? `¡Correcciones de "${currentCourse.title}" re-enviadas a revisión con éxito!`
        : `¡Curso "${currentCourse.title}" enviado a revisión con éxito!`
    );
  };

  const handleWithdrawReview = async () => {
    if (!currentCourse) return;
    setIsLoading(true);
    const result = await withdrawCourseReviewApi(currentCourseId);
    if (result.error || !result.data) {
      setIsLoading(false);
      triggerToast(result.error || "No se pudo retirar la solicitud.");
      return;
    }
    setCourses((prev) => ({
      ...prev,
      [currentCourseId]: {
        ...prev[currentCourseId],
        status: "draft",
        reviewStatus: undefined,
        feedbackNotes: undefined,
      },
    }));
    setIsLoading(false);
    triggerToast(
      `Solicitud retirada. El curso "${currentCourse.title}" volvió a borrador para edición.`
    );
  };

  return {
    handleSubmitReview,
    handleWithdrawReview,
  };
}
