"use client";

import { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react";
import { Course, Lesson } from "@/features/courses/types";
import {
  getTeacherCoursesApi,
  getTeacherCourseReviewsApi,
  getCourseLessonsApi,
  getSyncedReviews,
  subscribeSyncedReviews,
} from "@/services/api";
import { mapApiLessonToLesson } from "../utils/course-mapper";
import { COURSES_DATA } from "../data/mock-courses";

interface UseBuilderLoaderProps {
  initialCourseId?: string;
  userName?: string;
  syncSelectedLesson: (lesson: Lesson | null, requestedStepId?: string) => void;
  triggerToast: (msg: string) => void;
}

/** Hook que gestiona la carga de cursos, sincronizacion de resenas y seleccion de curso activo. */
export function useBuilderLoader({
  initialCourseId,
  userName,
  syncSelectedLesson,
  triggerToast,
}: UseBuilderLoaderProps) {
  const [courses, setCourses] = useState<Record<string, Course>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentCourseId, setCurrentCourseId] = useState(initialCourseId || "");

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
        const courseLessons: Lesson[] =
          c.lessons && c.lessons.length > 0
            ? c.lessons.map(mapApiLessonToLesson)
            : [];

        const apiRev = reviewsRes.data?.find((r) => r.course_id === c.id);
        const syncRev = syncedReviews.find(
          (r) => r.courseId === c.id || r.originalId === c.id
        );

        const revStatus = apiRev?.status || syncRev?.status;
        const feedback = apiRev?.feedback_notes || syncRev?.feedback;
        const reviewer = apiRev?.reviewer_admin_id
          ? `Admin (${apiRev.reviewer_admin_id.slice(0, 6)})`
          : syncRev?.reviewer;

        mapped[c.id] = {
          id: c.id,
          title: c.title,
          level: c.level,
          tier:
            c.status === "draft"
              ? "draft"
              : c.access_tier === "course"
              ? "course"
              : "free",
          price:
            typeof c.price_cents === "number" ? c.price_cents / 100 : 19.99,
          currency: "USD",
          author: c.author?.name || userName || "Prof. Mateo Silva",
          status: c.status,
          reviewStatus:
            (revStatus as any) || (c.status === "in_review" ? "pending" : undefined),
          feedbackNotes: feedback || undefined,
          reviewerName: reviewer || undefined,
          lessons: courseLessons,
        };
      }

      setCourses(mapped);
      setCurrentCourseId((prev) => {
        if (prev && mapped[prev]) return prev;
        const urlParams =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search)
            : null;
        const reqId = initialCourseId || urlParams?.get("courseId");
        const nextId = reqId && mapped[reqId] ? reqId : res.data![0].id;
        const activeLessons = mapped[nextId]?.lessons ?? [];
        const reqLesson = activeLessons.find(
          (lesson) => lesson.id === urlParams?.get("lessonId")
        );
        syncSelectedLesson(
          reqLesson || activeLessons[0] || null,
          urlParams?.get("stepId") ?? undefined
        );
        return nextId;
      });
      setIsLoading(false);
    } else {
      const fallback: Record<string, Course> = {};
      for (const [key, val] of Object.entries(COURSES_DATA)) {
        const syncRev = syncedReviews.find(
          (r) => r.courseId === key || r.originalId === key
        );
        fallback[key] = {
          ...val,
          reviewStatus:
            (syncRev?.status as any) ||
            (val.status === "in_review" ? "pending" : undefined),
          feedbackNotes: syncRev?.feedback,
          reviewerName: syncRev?.reviewer,
        };
      }
      setCourses(fallback);
      setCurrentCourseId((prev) => {
        if (prev && fallback[prev]) return prev;
        const urlParams =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search)
            : null;
        const reqId = initialCourseId || urlParams?.get("courseId");
        const nextId =
          reqId && fallback[reqId] ? reqId : Object.keys(fallback)[0] || "";
        const activeLessons = fallback[nextId]?.lessons ?? [];
        const reqLesson = activeLessons.find(
          (lesson) => lesson.id === urlParams?.get("lessonId")
        );
        syncSelectedLesson(
          reqLesson || activeLessons[0] || null,
          urlParams?.get("stepId") ?? undefined
        );
        return nextId;
      });
      setIsLoading(false);
    }
  }, [userName, initialCourseId, syncSelectedLesson]);

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

  useEffect(() => {
    if (initialCourseId && courses[initialCourseId] && initialCourseId !== currentCourseId) {
      handleSelectCourse(initialCourseId);
    }
  }, [initialCourseId, courses, currentCourseId]);

  return {
    courses,
    setCourses,
    isLoading,
    setIsLoading,
    currentCourseId,
    setCurrentCourseId,
    handleSelectCourse,
    loadCoursesData,
  };
}
