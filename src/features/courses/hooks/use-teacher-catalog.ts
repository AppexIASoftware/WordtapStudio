"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTeacherCoursesApi,
  getTeacherCourseReviewsApi,
  updateCourseApi,
  deleteCourseApi,
  ApiCourse,
} from "@/services/api";
import { Course } from "@/features/courses/types";
import { useUrlParam } from "@/hooks/use-url-params";

const STATUS_OPTIONS = ["", "published", "draft", "in_review"] as const;
const LEVEL_OPTIONS = ["", "A1", "A2", "B1", "B2", "C1"] as const;

export function useTeacherCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [selectedStatus, setSelectedStatus] = useUrlParam<string>("status", STATUS_OPTIONS, "");
  const [selectedLevel, setSelectedLevel] = useUrlParam<string>("level", LEVEL_OPTIONS, "");
  const [searchQuery, setSearchQuery] = useState("");

  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [editingPricingCourse, setEditingPricingCourse] = useState<ApiCourse | null>(null);
  const [editingDetailsCourse, setEditingDetailsCourse] = useState<ApiCourse | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const currentQueryString = searchParams?.toString();
  const currentCatalogUrl = currentQueryString ? `/teacher/courses?${currentQueryString}` : "/teacher/courses";

  const { data: courses = [], isLoading } = useQuery<ApiCourse[]>({
    queryKey: ["teacher", "courses"],
    queryFn: async () => {
      const [coursesRes, reviewsRes] = await Promise.all([
        getTeacherCoursesApi(),
        getTeacherCourseReviewsApi(),
      ]);
      if (coursesRes.error) throw new Error(coursesRes.error);
      const rawCourses = coursesRes.data || [];
      const reviews = reviewsRes.data || [];

      return rawCourses.map((c) => {
        const rev = reviews.find((r) => r.course_id === c.id);
        const reviewStatus = rev?.status;
        const effectiveStatus =
          c.status === "published" || reviewStatus === "approved"
            ? "published"
            : reviewStatus === "pending" || c.status === "in_review"
            ? "in_review"
            : "draft";

        return {
          ...c,
          status: effectiveStatus,
          reviewStatus,
        } as ApiCourse & { reviewStatus?: string };
      });
    },
    staleTime: 1000 * 60 * 3,
  });

  const totalCount = courses.length;
  const publishedCount = useMemo(
    () => courses.filter((c) => c.status === "published").length,
    [courses]
  );
  const inReviewCount = useMemo(
    () =>
      courses.filter(
        (c) =>
          c.status === "in_review" ||
          (c as { reviewStatus?: string }).reviewStatus === "pending"
      ).length,
    [courses]
  );
  const draftCount = useMemo(
    () =>
      courses.filter(
        (c) =>
          c.status !== "published" &&
          c.status !== "in_review" &&
          (c as { reviewStatus?: string }).reviewStatus !== "pending"
      ).length,
    [courses]
  );

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const courseStatus =
        c.status === "published"
          ? "published"
          : c.status === "in_review" || (c as { reviewStatus?: string }).reviewStatus === "pending"
          ? "in_review"
          : "draft";

      if (selectedStatus && courseStatus !== selectedStatus) return false;
      if (selectedLevel && c.level?.toUpperCase() !== selectedLevel.toUpperCase()) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    });
  }, [courses, selectedStatus, selectedLevel, searchQuery]);

  const handleCourseCreated = (newApiCourse: ApiCourse) => {
    triggerToast(`¡Curso "${newApiCourse.title}" creado con éxito!`);
    queryClient.invalidateQueries({ queryKey: ["teacher", "courses"] });
    router.push(`/teacher/builder?courseId=${newApiCourse.id}&from=/teacher/courses`);
  };

  const handleSavePrice = async (newPrice: number, tier?: "free" | "course" | "subscription") => {
    if (!editingPricingCourse) return;
    const finalTier = tier || (newPrice > 0 ? "course" : "free");
    const priceCents = finalTier === "subscription" ? 0 : Math.round(newPrice * 100);
    const res = await updateCourseApi(editingPricingCourse.id, {
      access_tier: finalTier,
      price_cents: priceCents,
    });
    if (res.error) {
      triggerToast(`Error al actualizar tarifa: ${res.error}`);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["teacher", "courses"] });
    triggerToast(
      finalTier === "subscription"
        ? "Curso incluido en Suscripción Pro Mensual"
        : "Tarifa actualizada con éxito"
    );
    setEditingPricingCourse(null);
  };

  const handleSaveCourseDetails = async (updated: {
    title: string;
    description?: string;
    level: string;
    categoryId?: string | null;
    price: number;
    tier?: "free" | "course" | "subscription";
    sourceLang?: string;
    targetLang?: string;
  }) => {
    if (!editingDetailsCourse) throw new Error("No hay un curso seleccionado para actualizar.");
    const finalTier = updated.tier || (updated.price > 0 ? "course" : "free");
    const priceCents =
      finalTier === "subscription" || finalTier === "free" ? 0 : Math.round(updated.price * 100);
    const res = await updateCourseApi(editingDetailsCourse.id, {
      title: updated.title,
      description: updated.description,
      level: updated.level,
      category_id: updated.categoryId,
      access_tier: finalTier,
      price_cents: priceCents,
      source_lang: updated.sourceLang,
      target_lang: updated.targetLang,
    });
    if (res.error || !res.data) {
      throw new Error(res.error || "La API no confirmó la actualización del curso");
    }
    queryClient.invalidateQueries({ queryKey: ["teacher", "courses"] });
    triggerToast(`¡Curso "${updated.title}" actualizado con éxito!`);
    setEditingDetailsCourse(null);
  };

  const handleDeleteCourse = async () => {
    if (!editingDetailsCourse) throw new Error("No hay un curso seleccionado para eliminar.");
    const res = await deleteCourseApi(editingDetailsCourse.id);
    if (res.error || !res.data) {
      throw new Error(res.error || "La API no confirmó la eliminación del curso");
    }
    queryClient.invalidateQueries({ queryKey: ["teacher", "courses"] });
    triggerToast(`Curso "${editingDetailsCourse.title}" eliminado`);
    setEditingDetailsCourse(null);
  };

  const selectedCourseForModal: Course | null = editingPricingCourse
    ? {
        id: editingPricingCourse.id,
        title: editingPricingCourse.title,
        level: editingPricingCourse.level,
        tier:
          editingPricingCourse.access_tier === "subscription"
            ? "subscription"
            : editingPricingCourse.access_tier === "course"
            ? "course"
            : "free",
        price: (editingPricingCourse.price_cents ?? 0) / 100,
        currency: "PEN",
        author: editingPricingCourse.author?.name || "Docente",
        lessons: [],
      }
    : null;

  return {
    selectedStatus,
    setSelectedStatus,
    selectedLevel,
    setSelectedLevel,
    searchQuery,
    setSearchQuery,
    showNewCourseModal,
    setShowNewCourseModal,
    editingDetailsCourse,
    setEditingDetailsCourse,
    editingPricingCourse,
    setEditingPricingCourse,
    toastMessage,
    currentCatalogUrl,
    courses,
    isLoading,
    totalCount,
    publishedCount,
    inReviewCount,
    draftCount,
    filteredCourses,
    selectedCourseForModal,
    handleCourseCreated,
    handleSavePrice,
    handleSaveCourseDetails,
    handleDeleteCourse,
  };
}
