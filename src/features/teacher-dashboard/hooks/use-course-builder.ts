"use client";

import { useState, useEffect, useCallback } from "react";
import { Course, Lesson } from "../types";
import {
  getTeacherCoursesApi,
  getTeacherCourseReviewsApi,
  submitCourseReviewApi,
  withdrawCourseReviewApi,
  getCourseLessonsApi,
  saveLessonItemApi,
  updateCourseApi,
  deleteCourseApi,
  updateLessonApi,
  deleteLessonApi,
  createLessonApi,
  ApiCourse,
  saveSyncedReview,
  removeSyncedReview,
  getSyncedReviews,
  subscribeSyncedReviews,
} from "@/services/api";
import { useAuth } from "@/features/auth/auth-context";
import { mapApiLessonToLesson } from "../utils/course-mapper";
import { COURSES_DATA } from "../data/mock-courses";
import { useBuilderModals } from "./use-builder-modals";
import { useBuilderSimulation } from "./use-builder-simulation";
import { useCardEditor } from "./use-card-editor";

export function useCourseBuilder() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Record<string, Course>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentCourseId, setCurrentCourseId] = useState("");
  const currentCourse = courses[currentCourseId] || Object.values(courses)[0] || null;

  const [currentLessonId, setCurrentLessonId] = useState("");
  const currentLesson: Lesson | null =
    currentCourse?.lessons?.find((l) => l.id === currentLessonId) ||
    currentCourse?.lessons?.[0] ||
    null;

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const modals = useBuilderModals(currentCourse?.lessons);
  const sim = useBuilderSimulation(setCurrentLessonId, triggerToast);
  const cards = useCardEditor(currentCourseId, currentLesson, setCourses, triggerToast);

  const { handleStepSelect, resetStepForm } = cards;

  const syncSelectedLesson = useCallback(
    (lesson: Lesson | null) => {
      if (lesson) {
        setCurrentLessonId(lesson.id);
        if (lesson.items && lesson.items.length > 0) {
          handleStepSelect(lesson.items[0]);
        } else {
          resetStepForm();
        }
      } else {
        setCurrentLessonId("");
        resetStepForm();
      }
    },
    [handleStepSelect, resetStepForm]
  );

  const loadCoursesData = useCallback(async () => {
    setIsLoading(true);
    const [res, reviewsRes] = await Promise.all([
      getTeacherCoursesApi(),
      getTeacherCourseReviewsApi(),
    ]);
    const syncedReviews = getSyncedReviews();

    if (res.data && res.data.length > 0) {
      const mapped: Record<string, Course> = {};
      for (const c of res.data) {
        const courseLessons: Lesson[] = (c.lessons && c.lessons.length > 0)
          ? c.lessons.map(mapApiLessonToLesson)
          : [];

        const apiRev = reviewsRes.data?.find((r) => r.course_id === c.id);
        const syncRev = syncedReviews.find((r) => r.courseId === c.id || r.originalId === c.id);

        const revStatus = apiRev?.status || syncRev?.status;
        const feedback = apiRev?.feedback_notes || syncRev?.feedback;
        const reviewer = apiRev?.reviewer_admin_id ? `Admin (${apiRev.reviewer_admin_id.slice(0, 6)})` : syncRev?.reviewer;

        mapped[c.id] = {
          id: c.id,
          title: c.title,
          level: c.level,
          tier: c.status === "draft" ? "draft" : c.access_tier === "course" ? "course" : "free",
          price: typeof c.price_cents === "number" ? c.price_cents / 100 : 19.99,
          currency: "USD",
          author: c.author?.name || user?.name || "Prof. Mateo Silva",
          status: c.status,
          reviewStatus: (revStatus as any) || (c.status === "in_review" ? "pending" : undefined),
          feedbackNotes: feedback || undefined,
          reviewerName: reviewer || undefined,
          lessons: courseLessons,
        };
      }

      setCourses(mapped);
      setCurrentCourseId((prev) => {
        if (prev && mapped[prev]) return prev;
        const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const reqId = urlParams?.get("courseId");
        const nextId = reqId && mapped[reqId] ? reqId : res.data![0].id;
        const activeLessons = mapped[nextId]?.lessons;
        syncSelectedLesson(activeLessons?.[0] || null);
        return nextId;
      });
      setIsLoading(false);
    } else {
      const fallback: Record<string, Course> = {};
      for (const [key, val] of Object.entries(COURSES_DATA)) {
        const syncRev = syncedReviews.find((r) => r.courseId === key || r.originalId === key);
        fallback[key] = {
          ...val,
          reviewStatus: (syncRev?.status as any) || (val.status === "in_review" ? "pending" : undefined),
          feedbackNotes: syncRev?.feedback,
          reviewerName: syncRev?.reviewer,
        };
      }
      setCourses(fallback);
      setCurrentCourseId((prev) => {
        if (prev && fallback[prev]) return prev;
        const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const reqId = urlParams?.get("courseId");
        const nextId = reqId && fallback[reqId] ? reqId : Object.keys(fallback)[0] || "";
        const activeLessons = fallback[nextId]?.lessons;
        syncSelectedLesson(activeLessons?.[0] || null);
        return nextId;
      });
      setIsLoading(false);
    }
  }, [user, syncSelectedLesson]);

  useEffect(() => {
    loadCoursesData();
    const unsub = subscribeSyncedReviews(() => {
      loadCoursesData();
    });
    return unsub;
  }, [loadCoursesData]);

  const handleSelectCourse = (id: string) => {
    setCurrentCourseId(id);
    const target = courses[id];
    if (target) {
      if ((!target.lessons || target.lessons.length === 0) && id) {
        getCourseLessonsApi(id).then((lessonsRes) => {
          if (lessonsRes.data && lessonsRes.data.length > 0) {
            const loadedLessons = lessonsRes.data.map(mapApiLessonToLesson);
            setCourses((prev) => ({
              ...prev,
              [id]: { ...prev[id], lessons: loadedLessons },
            }));
            syncSelectedLesson(loadedLessons[0] || null);
          }
        });
      }
      syncSelectedLesson(target.lessons?.[0] || null);
      triggerToast(`Curso activo: ${target.title}`);
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    syncSelectedLesson(lesson);
    triggerToast(`Lección activa: ${lesson.title}`);
  };

  const handleCourseCreated = async (newApiCourse: ApiCourse) => {
    let creationWarning: string | null = null;
    let createdLesson: Lesson | null = null;
    const lessonRes = await createLessonApi(newApiCourse.id, {
      title: "1. Lección Inicial",
      description: "Introducción al curso",
      sort_order: 1,
    });
    if (lessonRes.data) {
      const initialCard = {
        en: "learn",
        es: "aprender",
        ipa: "/lɜːrn/",
        pos: "Verbo",
        example: '"I learn English"',
        note: "Verbo esencial",
        noteType: "bulb" as const,
        itemType: "word" as const,
      };
      const itemRes = await saveLessonItemApi(lessonRes.data.id, {
        item_type: "word",
        content_text: JSON.stringify(initialCard),
        sort_order: 1,
        is_required: true,
      });
      createdLesson = {
        id: lessonRes.data.id,
        title: lessonRes.data.title,
        subtitle: lessonRes.data.description || "Introducción al curso",
        duration: `${lessonRes.data.estimated_minutes || 10} min`,
        tier: "Draft",
        isPublished: false,
        intro: "Bienvenido a este curso interactivo.",
        sectionTitle: "Vocabulario esencial",
        items: itemRes.data ? [{ id: itemRes.data.id, ...initialCard }] : [],
      };
      if (!itemRes.data)
        creationWarning = `La lección se creó, pero no se pudo guardar su tarjeta inicial: ${
          itemRes.error || "respuesta vacía de la API"
        }`;
    } else {
      creationWarning = `El curso se creó, pero no se pudo crear su lección inicial: ${
        lessonRes.error || "respuesta vacía de la API"
      }`;
    }

    const createdCourse: Course = {
      id: newApiCourse.id,
      title: newApiCourse.title,
      level: newApiCourse.level,
      tier: "draft",
      price: typeof newApiCourse.price_cents === "number" ? newApiCourse.price_cents / 100 : 19.99,
      currency: "USD",
      author: "Docente",
      lessons: createdLesson ? [createdLesson] : [],
    };

    setCourses((prev) => ({ [newApiCourse.id]: createdCourse, ...prev }));
    setCurrentCourseId(newApiCourse.id);
    syncSelectedLesson(createdLesson);
    triggerToast(creationWarning || `¡Curso "${newApiCourse.title}" creado con éxito!`);
  };

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

  const handleSubmitReview = async (changeSummary?: string) => {
    if (!currentCourse) return;
    const isResubmission = currentCourse.reviewStatus === "changes_requested";
    const defaultSummary = isResubmission
      ? "Correcciones aplicadas según las observaciones pedagógicas del revisor."
      : `Solicitud de revisión para publicación oficial del curso: ${currentCourse.title}`;
    const summary = changeSummary?.trim() || defaultSummary;

    const teacherName = user?.name || currentCourse.author || "Prof. Mateo Silva";
    const teacherEmail = user?.email || "docente@wordtap.app";
    const teacherInitials = teacherName.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("") || "MS";

    const res = await submitCourseReviewApi(currentCourseId, {
      change_summary: summary,
    });
    const prId = `PR-${currentCourseId.replace(/^course-/, "").slice(0, 6).toUpperCase() || "NEW"}`;

    saveSyncedReview({
      id: prId,
      originalId: currentCourseId,
      courseId: currentCourseId,
      title: currentCourse.title,
      author: teacherName,
      authorEmail: teacherEmail,
      authorAvatar: teacherInitials,
      submittedAt: new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      waitHours: "0.1h",
      changesCount: `${currentCourse.lessons?.length || 1} lecciones`,
      status: "open",
      statusLabel: "En Revisión",
      summary: summary,
      reviewer: "Pendiente de Asignación",
    });

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
    await withdrawCourseReviewApi(currentCourseId);
    removeSyncedReview(currentCourseId);
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
    triggerToast(`Solicitud retirada. El curso "${currentCourse.title}" volvió a borrador para edición.`);
  };

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
