"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Classroom, Course } from "../types";
import { MOCK_COURSES_LIST } from "../data/mock-teacher-data";
import { getTeacherCoursesApi } from "@/services/api/courses";
import { mapApiLessonToLesson } from "../utils/course-mapper";

interface UseCohortFormProps {
  initialClassroom?: Classroom | null;
  initialMode?: "create" | "view";
}

export function useCohortForm({
  initialClassroom,
  initialMode = "create",
}: UseCohortFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isExisting = Boolean(initialClassroom);
  const [isEditing, setIsEditing] = useState<boolean>(initialMode !== "view");
  const [name, setName] = useState(initialClassroom?.name || "");
  const [level, setLevel] = useState(initialClassroom?.level || "B1 Intermediate");
  const [description, setDescription] = useState("");
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>(() => {
    if (initialClassroom?.assignedCourses && initialClassroom.assignedCourses.length > 0) {
      return initialClassroom.assignedCourses;
    }
    return initialClassroom?.courseId ? [initialClassroom.courseId] : [];
  });
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [selectedGameTypes, setSelectedGameTypes] = useState<string[]>(() => {
    if (initialClassroom?.activeGames && initialClassroom.activeGames.length > 0) {
      return initialClassroom.activeGames;
    }
    return [
      "match",
      "memory",
      "listening",
      "multiple_choice",
      "speed_translation",
      "word_scramble",
    ];
  });
  const [weeklyGoal, setWeeklyGoal] = useState(initialClassroom?.weeklyGoalWords || 50);
  const [activeTab, setActiveTab] = useState<"general" | "curriculum">(
    searchParams.get("tab") === "curriculum" ? "curriculum" : "general"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialClassroom) {
      setName(initialClassroom.name || "");
      setLevel(initialClassroom.level || "B1 Intermediate");
      const assigned =
        initialClassroom.assignedCourses && initialClassroom.assignedCourses.length > 0
          ? initialClassroom.assignedCourses
          : initialClassroom.courseId
          ? [initialClassroom.courseId]
          : [];
      setSelectedCourseIds(assigned);
      if (initialClassroom.activeGames && initialClassroom.activeGames.length > 0) {
        setSelectedGameTypes(initialClassroom.activeGames);
      }
      setWeeklyGoal(initialClassroom.weeklyGoalWords || 50);
      setIsEditing(initialMode !== "view");
    }
  }, [initialClassroom, initialMode]);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || searchParams.get("step");
    if (tabFromUrl === "curriculum") {
      setActiveTab("curriculum");
    } else if (tabFromUrl === "general") {
      setActiveTab("general");
    }
  }, [searchParams]);

  const resetScroll = () => {
    if (typeof window === "undefined") return;
    const performReset = () => {
      const topEl = document.getElementById("cohort-workspace-top");
      if (topEl) {
        topEl.scrollIntoView({ behavior: "instant", block: "start" });
      }
      const mainEl = document.querySelector("main");
      if (mainEl) {
        mainEl.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    };

    performReset();
    requestAnimationFrame(performReset);
    setTimeout(performReset, 50);
  };

  const handleTabChange = (tab: "general" | "curriculum") => {
    setActiveTab(tab);
    resetScroll();
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    resetScroll();
  }, [activeTab]);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await getTeacherCoursesApi();
        if (res.data && res.data.length > 0) {
          const mapped: Course[] = res.data.map((c) => ({
            id: c.id,
            title: c.title,
            level: c.level,
            tier: c.access_tier === "free" ? "free" : "course",
            price: (c.price_cents || 0) / 100,
            currency: "USD",
            author: c.author?.name || "Docente",
            status: c.status,
            isDemo: false,
            lessons: (c.lessons || []).map((l) => mapApiLessonToLesson(l)),
          }));
          setAvailableCourses(mapped);
          if (!initialClassroom) {
            setSelectedCourseIds([mapped[0].id]);
            setSelectedLessonIds(mapped[0]?.lessons?.map((l) => l.id) || []);
          } else {
            const assigned =
              initialClassroom.assignedCourses && initialClassroom.assignedCourses.length > 0
                ? initialClassroom.assignedCourses
                : initialClassroom.courseId
                ? [initialClassroom.courseId]
                : [mapped[0].id];
            const assignedObjs = mapped.filter((c) => assigned.includes(c.id));
            const allLessons = assignedObjs.flatMap((c) => c.lessons?.map((l) => l.id) || []);
            setSelectedLessonIds(allLessons);
          }
        } else {
          const demoCourses = MOCK_COURSES_LIST.map((c) => ({ ...c, isDemo: true }));
          setAvailableCourses(demoCourses);
          if (!initialClassroom) {
            setSelectedCourseIds([demoCourses[0].id]);
            setSelectedLessonIds(demoCourses[0]?.lessons?.map((l) => l.id) || []);
          } else {
            const assigned =
              initialClassroom.assignedCourses && initialClassroom.assignedCourses.length > 0
                ? initialClassroom.assignedCourses
                : initialClassroom.courseId
                ? [initialClassroom.courseId]
                : [demoCourses[0].id];
            const assignedObjs = demoCourses.filter((c) => assigned.includes(c.id));
            const allLessons = assignedObjs.flatMap((c) => c.lessons?.map((l) => l.id) || []);
            setSelectedLessonIds(allLessons);
          }
        }
      } catch {
        const demoCourses = MOCK_COURSES_LIST.map((c) => ({ ...c, isDemo: true }));
        setAvailableCourses(demoCourses);
        if (!initialClassroom) {
          setSelectedCourseIds([demoCourses[0].id]);
          setSelectedLessonIds(demoCourses[0]?.lessons?.map((l) => l.id) || []);
        }
      }
    }
    loadCourses();
  }, [initialClassroom]);

  const toggleCourse = (id: string) => {
    if (!isEditing) return;
    const course = availableCourses.find((c) => c.id === id);
    const courseLessonIds = course?.lessons?.map((l) => l.id) || [];

    setSelectedCourseIds((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        setSelectedLessonIds((prevLessons) =>
          prevLessons.filter((lId) => !courseLessonIds.includes(lId))
        );
        return prev.filter((c) => c !== id);
      } else {
        setSelectedLessonIds((prevLessons) => [
          ...prevLessons,
          ...courseLessonIds.filter((lId) => !prevLessons.includes(lId)),
        ]);
        return [...prev, id];
      }
    });
  };

  const toggleLesson = (lessonId: string, courseId: string) => {
    if (!isEditing) return;
    if (!selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds((prev) => [...prev, courseId]);
    }
    setSelectedLessonIds((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const toggleAllLessonsForCourse = (courseId: string) => {
    if (!isEditing) return;
    const course = availableCourses.find((c) => c.id === courseId);
    const courseLessonIds = course?.lessons?.map((l) => l.id) || [];
    const allActive = courseLessonIds.every((id) => selectedLessonIds.includes(id));

    if (allActive) {
      setSelectedLessonIds((prev) => prev.filter((id) => !courseLessonIds.includes(id)));
    } else {
      setSelectedLessonIds((prev) => [
        ...prev,
        ...courseLessonIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const toggleGame = (type: string) => {
    if (!isEditing) return;
    setSelectedGameTypes((prev) =>
      prev.includes(type) ? prev.filter((g) => g !== type) : [...prev, type]
    );
  };

  const handleCancelEdit = () => {
    if (initialClassroom) {
      setName(initialClassroom.name);
      setLevel(initialClassroom.level);
      setWeeklyGoal(initialClassroom.weeklyGoalWords || 50);
      const assigned =
        initialClassroom.assignedCourses && initialClassroom.assignedCourses.length > 0
          ? initialClassroom.assignedCourses
          : initialClassroom.courseId
          ? [initialClassroom.courseId]
          : [];
      setSelectedCourseIds(assigned);
      if (initialClassroom.activeGames) {
        setSelectedGameTypes(initialClassroom.activeGames);
      }
    }
    setIsEditing(false);
  };

  const levelPrefix = level.substring(0, 2).toUpperCase();
  const simulatedCode = initialClassroom?.code || `WT-${levelPrefix}-9420`;
  const primaryCourse =
    availableCourses.find((c) => c.id === selectedCourseIds[0]) || availableCourses[0];

  return {
    isExisting,
    isEditing,
    setIsEditing,
    name,
    setName,
    level,
    setLevel,
    description,
    setDescription,
    availableCourses,
    selectedCourseIds,
    selectedLessonIds,
    selectedGameTypes,
    weeklyGoal,
    setWeeklyGoal,
    activeTab,
    isSubmitting,
    setIsSubmitting,
    toggleCourse,
    toggleLesson,
    toggleAllLessonsForCourse,
    toggleGame,
    handleCancelEdit,
    handleTabChange,
    levelPrefix,
    simulatedCode,
    primaryCourse,
  };
}
