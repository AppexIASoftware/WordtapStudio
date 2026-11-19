"use client";

import { useState, useEffect } from "react";
import { Classroom } from "@/features/classrooms/types";
import { getCourseLessonsApi, getTeacherCoursesApi } from "@/services/api";
import { COURSES_DATA } from "@/features/courses/data/mock-courses";

export interface CourseOption {
  id: string;
  title: string;
}

export interface LessonOption {
  id: string;
  title: string;
  sort_order?: number;
}

export function useClassroomCourses(classroom: Classroom | null) {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [lessons, setLessons] = useState<LessonOption[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);

  // 1. Fetch only published courses approved by administration
  useEffect(() => {
    if (!classroom) return;
    let isMounted = true;

    async function loadPublishedCourses() {
      const courseMap = new Map<string, string>();
      let foundApiCourses = false;

      // Query teacher courses from WordtapAPI
      try {
        const res = await getTeacherCoursesApi();
        if (isMounted && res.data && res.data.length > 0) {
          foundApiCourses = true;
          // Strict filter: only courses in 'published' status
          for (const c of res.data) {
            if (c.status === "published") {
              courseMap.set(c.id, c.title);
            }
          }
        }
      } catch {
        // Local fallback on network failure
      }

      // Fallback to mock data if API returned no courses (demo/offline)
      if (!foundApiCourses && courseMap.size === 0) {
        // In mock environment, include only courses marked as 'published'
        for (const c of Object.values(COURSES_DATA)) {
          if (c.status === "published" && !courseMap.has(c.id)) {
            courseMap.set(c.id, c.title);
          }
        }
      }

      if (isMounted) {
        const list: CourseOption[] = Array.from(courseMap.entries()).map(([id, title]) => ({
          id,
          title,
        }));
        setCourses(list);

        // Preselect classroom course if published
        const isClassroomCoursePublished = classroom?.courseId && courseMap.has(classroom.courseId);
        const initialCourse = isClassroomCoursePublished
          ? classroom.courseId
          : list[0]?.id || "";
        setSelectedCourseId(initialCourse);
      }
    }

    void loadPublishedCourses();
    return () => {
      isMounted = false;
    };
  }, [classroom]);

  // 2. Cascading fetch of published lessons when course selection changes
  const [prevCourseId, setPrevCourseId] = useState(selectedCourseId);
  if (prevCourseId !== selectedCourseId) {
    setPrevCourseId(selectedCourseId);
    setSelectedLessonId("");
    if (!selectedCourseId) {
      setLessons([]);
    }
  }

  useEffect(() => {
    if (!selectedCourseId) return;

    let isMounted = true;

    async function loadLessons() {
      setIsLoadingLessons(true);
      try {
        const res = await getCourseLessonsApi(selectedCourseId);
        if (isMounted && res.data && res.data.length > 0) {
          // Strict filter: only published lessons
          const publishedLessons = res.data.filter((l) => l.status === "published");
          setLessons(
            publishedLessons.map((l) => ({
              id: l.id,
              title: l.title,
              sort_order: l.sort_order,
            }))
          );
          setIsLoadingLessons(false);
          return;
        }
      } catch {
        // Fallback local
      }

      // Fallback a lecciones mock de COURSES_DATA
      const mockCourse =
        COURSES_DATA[selectedCourseId] ||
        Object.values(COURSES_DATA).find(
          (c) =>
            c.id === selectedCourseId ||
            c.title.toLowerCase().includes(classroom?.courseTitle?.toLowerCase() || "")
        );

      if (isMounted && mockCourse?.lessons) {
        // Solo lecciones publicadas
        const publishedMockLessons = mockCourse.lessons.filter(
          (l) => l.isPublished || ("status" in l && (l as unknown as { status: string }).status === "published")
        );
        setLessons(
          publishedMockLessons.map((l, idx) => ({
            id: l.id,
            title: l.title,
            sort_order: idx + 1,
          }))
        );
      } else if (isMounted) {
        setLessons([]);
      }
      if (isMounted) setIsLoadingLessons(false);
    }

    void loadLessons();
    return () => {
      isMounted = false;
    };
  }, [selectedCourseId, classroom]);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || null;
  const selectedLesson = lessons.find((l) => l.id === selectedLessonId) || null;

  return {
    courses,
    lessons,
    selectedCourseId,
    selectedLessonId,
    setSelectedCourseId,
    setSelectedLessonId,
    selectedCourse,
    selectedLesson,
    isLoadingLessons,
  };
}
