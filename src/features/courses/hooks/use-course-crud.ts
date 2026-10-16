"use client";

import { Dispatch, SetStateAction } from "react";
import { Course, Lesson } from "@/features/courses/types";;
import {
  updateCourseApi,
  deleteCourseApi,
  updateLessonApi,
  deleteLessonApi,
} from "@/services/api";

interface UseCourseCrudProps {
  currentCourseId: string;
  currentLessonId: string;
  courses: Record<string, Course>;
  setCourses: Dispatch<SetStateAction<Record<string, Course>>>;
  setCurrentCourseId: Dispatch<SetStateAction<string>>;
  syncSelectedLesson: (lesson: Lesson | null) => void;
  triggerToast: (msg: string) => void;
}

export function useCourseCrud({
  currentCourseId,
  currentLessonId,
  courses,
  setCourses,
  setCurrentCourseId,
  syncSelectedLesson,
  triggerToast,
}: UseCourseCrudProps) {
  const handleEditCourse = async (updated: { title: string; level: string; price: number }) => {
    const res = await updateCourseApi(currentCourseId, {
      title: updated.title,
      level: updated.level,
      access_tier: updated.price > 0 ? "course" : "free",
      price_cents: Math.round(updated.price * 100),
    });
    if (res.error || !res.data)
      throw new Error(res.error || "La API no confirmó la actualización del curso");
    setCourses((prev) => ({
      ...prev,
      [currentCourseId]: {
        ...prev[currentCourseId],
        title: res.data!.title,
        level: res.data!.level,
        price: (res.data!.price_cents ?? 0) / 100,
        tier: res.data!.access_tier === "course" ? "course" : "free",
        status: res.data!.status,
      },
    }));
    triggerToast(
      res.data?.status === "in_review"
        ? "Curso actualizado y enviado a revisión"
        : "Curso actualizado con éxito"
    );
  };

  const handleDeleteCourse = async () => {
    const res = await deleteCourseApi(currentCourseId);
    if (res.error || !res.data)
      throw new Error(res.error || "La API no confirmó la eliminación del curso");

    const nextCourses = { ...courses };
    delete nextCourses[currentCourseId];
    setCourses(nextCourses);

    const remainingKeys = Object.keys(nextCourses);
    const nextId = remainingKeys[0] || "";
    setCurrentCourseId(nextId);
    const nextLesson = nextCourses[nextId]?.lessons[0] || null;
    syncSelectedLesson(nextLesson);
    triggerToast("Curso eliminado correctamente");
  };

  const handleSaveLesson = async (
    lessonId: string,
    title: string,
    subtitle: string,
    duration: string
  ) => {
    const minutes = parseInt(duration.replace(/\D/g, ""), 10) || 15;
    const res = await updateLessonApi(lessonId, {
      title,
      description: subtitle,
      estimated_minutes: minutes,
    });
    if (res.error || !res.data)
      throw new Error(res.error || "La API no confirmó la actualización de la lección");
    setCourses((prev) => ({
      ...prev,
      [currentCourseId]: {
        ...prev[currentCourseId],
        lessons: prev[currentCourseId].lessons.map((lesson) =>
          lesson.id === lessonId
            ? {
                ...lesson,
                title: res.data!.title,
                subtitle: res.data!.description || "",
                duration: `${res.data!.estimated_minutes || minutes} min`,
              }
            : lesson
        ),
      },
    }));
    triggerToast("Lección actualizada con éxito");
  };

  const handleDeleteLesson = async (lessonId: string) => {
    const course = courses[currentCourseId];
    if (!course) return;
    if (course.lessons.length <= 1) {
      throw new Error("El curso debe conservar al menos una lección.");
    }

    const res = await deleteLessonApi(lessonId);
    if (res.error || !res.data)
      throw new Error(res.error || "La API no confirmó la eliminación de la lección");

    const remainingLessons = course.lessons.filter((l) => l.id !== lessonId);
    setCourses((prev) => ({
      ...prev,
      [currentCourseId]: {
        ...course,
        lessons: remainingLessons,
      },
    }));

    if (currentLessonId === lessonId) {
      syncSelectedLesson(remainingLessons[0] || null);
    }
    triggerToast("Lección eliminada correctamente");
  };

  const handleLessonCreated = (newLesson: Lesson) => {
    setCourses((prev) => {
      const updated = { ...prev };
      const course = { ...updated[currentCourseId] };
      if (!course) return prev;
      course.lessons = [...course.lessons, newLesson];
      updated[currentCourseId] = course;
      return updated;
    });
    syncSelectedLesson(newLesson);
    triggerToast(`¡Lección "${newLesson.title}" creada con éxito!`);
  };

  const handleSavePrice = async (newPrice: number) => {
    const res = await updateCourseApi(currentCourseId, {
      access_tier: newPrice > 0 ? "course" : "free",
      price_cents: Math.round(newPrice * 100),
    });
    if (res.error || !res.data)
      throw new Error(res.error || "La API no confirmó el cambio de precio");
    setCourses((prev) => ({
      ...prev,
      [currentCourseId]: {
        ...prev[currentCourseId],
        price: newPrice,
        tier: newPrice > 0 ? "course" : "free",
      },
    }));
    triggerToast(`Precio actualizado a $${newPrice.toFixed(2)} USD`);
  };

  return {
    handleEditCourse,
    handleDeleteCourse,
    handleSaveLesson,
    handleDeleteLesson,
    handleLessonCreated,
    handleSavePrice,
  };
}
