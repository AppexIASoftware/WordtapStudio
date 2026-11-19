"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getTeacherGlobalStudentsApi,
  ApiGlobalCourseOption,
  ApiGlobalStudentItem,
} from "@/services/api";
import { GlobalStudent } from "../types";

export const GLOBAL_PLAN_FILTER = {
  ALL: "all",
  SUBSCRIPTION: "subscription",
  COURSE: "course",
  FREE: "free",
} as const;

export type GlobalPlanFilter =
  (typeof GLOBAL_PLAN_FILTER)[keyof typeof GLOBAL_PLAN_FILTER];

export const GLOBAL_LEVEL_FILTER = {
  ALL: "all",
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export type GlobalLevelFilter =
  (typeof GLOBAL_LEVEL_FILTER)[keyof typeof GLOBAL_LEVEL_FILTER];

export const GLOBAL_STATUS_FILTER = {
  ALL: "all",
  ACTIVE: "active",
  SUSPENDED: "suspended",
} as const;

export type GlobalStatusFilter =
  (typeof GLOBAL_STATUS_FILTER)[keyof typeof GLOBAL_STATUS_FILTER];

const PLAN_LABELS: Record<string, string> = {
  subscription: "Suscripción Activa",
  course: "Curso Comprado",
  free: "Plan Gratuito",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "A1 Beginner",
  intermediate: "B1 Intermediate",
  advanced: "C1 Advanced",
};

function formatLastActivity(isoDate?: string | null): string {
  if (!isoDate) return "Sin actividad";
  const ts = Date.parse(isoDate);
  if (!ts) return "Reciente";
  const days = Math.floor((Date.now() - ts) / 86400000);
  if (days <= 0) return "Hoy";
  if (days === 1) return "Ayer";
  return `Hace ${days} días`;
}

function mapGlobalStudent(row: ApiGlobalStudentItem): GlobalStudent {
  const planKey = row.access_tier || "free";
  const levelKey = (row.learning_level || "beginner").toLowerCase();
  const initials =
    row.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || "")
      .join("") || "AL";

  const payStatus: GlobalStudent["payStatus"] =
    planKey === "subscription"
      ? "subscription"
      : planKey === "course"
      ? "course_purchased"
      : "free";
  const lastAct = formatLastActivity(row.last_activity_date);

  return {
    id: row.id,
    initials,
    avatarColor: "blue",
    name: row.name,
    email: row.email,
    course: row.course_title || "Catálogo General",
    cefr: LEVEL_LABELS[levelKey] || row.learning_level || "Beginner",
    streak: `${row.current_streak_days ?? 0} días`,
    progress: row.progress_percent ?? 0,
    payStatus,
    payLabel: PLAN_LABELS[planKey] || "Plan Gratuito",
    isActive: row.is_active ?? true,
    registeredAt: lastAct,
    lastActive: lastAct,
  };
}

export const GLOBAL_STUDENTS_PAGE_SIZE = 20;

export function useGlobalStudents(enabled: boolean) {
  const [students, setStudents] = useState<GlobalStudent[]>([]);
  const [courses, setCourses] = useState<ApiGlobalCourseOption[]>([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<GlobalPlanFilter>(GLOBAL_PLAN_FILTER.ALL);
  const [levelFilter, setLevelFilter] = useState<GlobalLevelFilter>(GLOBAL_LEVEL_FILTER.ALL);
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<GlobalStatusFilter>(GLOBAL_STATUS_FILTER.ALL);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterKey = `${searchQuery}\0${planFilter}\0${levelFilter}\0${courseFilter}\0${statusFilter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const loadStudents = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    const res = await getTeacherGlobalStudentsApi({
      q: searchQuery,
      plan: planFilter,
      level: levelFilter,
      course_id: courseFilter,
      status: statusFilter,
      limit: GLOBAL_STUDENTS_PAGE_SIZE,
      offset: (page - 1) * GLOBAL_STUDENTS_PAGE_SIZE,
    });
    if (res.error) {
      setError(res.error);
    } else if (res.data) {
      setStudents((res.data.items ?? []).map(mapGlobalStudent));
      setTotal(res.data.total ?? 0);
      if (res.data.courses) setCourses(res.data.courses);
    }
    setIsLoading(false);
  }, [enabled, searchQuery, planFilter, levelFilter, courseFilter, statusFilter, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadStudents();
    }, 120);
    return () => clearTimeout(timer);
  }, [loadStudents]);

  return {
    students,
    courses,
    total,
    page,
    setPage,
    pageSize: GLOBAL_STUDENTS_PAGE_SIZE,
    searchQuery,
    setSearchQuery,
    planFilter,
    setPlanFilter,
    levelFilter,
    setLevelFilter,
    courseFilter,
    setCourseFilter,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    refresh: loadStudents,
  };
}
