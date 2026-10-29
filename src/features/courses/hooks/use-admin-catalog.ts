"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminCoursesApi, updateCourseApi, deleteCourseApi, ApiCourse } from "@/services/api";
import { Course } from "@/features/courses/types";
import { useUrlParam } from "@/hooks/use-url-params";

const CATALOG_TABS = ["platform", "teacher"] as const;
const STATUS_OPTIONS = ["", "published", "draft", "in_review"] as const;
const LEVEL_OPTIONS = ["", "A1", "A2", "B1", "B2", "C1"] as const;

export function useAdminCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useUrlParam<"platform" | "teacher">("tab", CATALOG_TABS, "platform");
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
  const currentCatalogUrl = currentQueryString ? `/admin/courses?${currentQueryString}` : "/admin/courses";
  const { data: courses = [], isLoading } = useQuery<ApiCourse[]>({
    queryKey: ["admin", "courses"],
    queryFn: async () => {
      const res = await getAdminCoursesApi();
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
    staleTime: 1000 * 60 * 3,
  });
  const platformCourses = useMemo(() => courses.filter((c) => c.owner_type !== "teacher"), [courses]);
  const teacherCourses = useMemo(() => courses.filter((c) => c.owner_type === "teacher"), [courses]);
  const currentTabCourses = activeTab === "platform" ? platformCourses : teacherCourses;
  const publishedCount = useMemo(() => courses.filter((c) => c.status === "published").length, [courses]);
  const platformPublishedCount = useMemo(() => platformCourses.filter((c) => c.status === "published").length, [platformCourses]);
  const teacherPublishedCount = useMemo(() => teacherCourses.filter((c) => c.status === "published").length, [teacherCourses]);
  const proCount = useMemo(() => courses.filter((c) => c.access_tier === "subscription").length, [courses]);
  const freeCount = useMemo(() => courses.filter((c) => c.access_tier === "free" || (!c.price_cents && c.access_tier !== "subscription")).length, [courses]);
  const tabPublishedCount = useMemo(() => currentTabCourses.filter((c) => c.status === "published").length, [currentTabCourses]);
  const tabDraftCount = useMemo(() => currentTabCourses.filter((c) => c.status === "draft" || !c.status).length, [currentTabCourses]);
  const tabInReviewCount = useMemo(() => currentTabCourses.filter((c) => c.status === "in_review").length, [currentTabCourses]);
  const otherTabPublishedCount = activeTab === "platform" ? teacherPublishedCount : platformPublishedCount;
  const filteredCourses = useMemo(() => currentTabCourses.filter((c) => {
    if (selectedStatus && (c.status || "draft") !== selectedStatus) return false;
    if (selectedLevel && c.level?.toUpperCase() !== selectedLevel.toUpperCase()) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.author?.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
  }), [currentTabCourses, selectedStatus, selectedLevel, searchQuery]);

  const handleCourseCreated = (newApiCourse: ApiCourse) => {
    triggerToast(`¡Curso "${newApiCourse.title}" creado con éxito!`);
    queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    router.push(`/admin/courses/${newApiCourse.id}?from=${encodeURIComponent(currentCatalogUrl)}`);
  };
  const handleTogglePublish = async (course: ApiCourse) => {
    const nextStatus = course.status === "published" ? "draft" : "published";
    const res = await updateCourseApi(course.id, { status: nextStatus });
    if (res.error) { triggerToast(`No se pudo actualizar el estado: ${res.error}`); return; }
    queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    triggerToast(nextStatus === "published" ? `¡Curso "${course.title}" publicado y activo en la app móvil!` : `Curso "${course.title}" movido a borrador.`);
  };
  const handleSavePrice = async (newPrice: number, tier?: "free" | "course" | "subscription") => {
    if (!editingPricingCourse) return;
    const finalTier = tier || (newPrice > 0 ? "course" : "free");
    const priceCents = finalTier === "subscription" ? 0 : Math.round(newPrice * 100);
    const res = await updateCourseApi(editingPricingCourse.id, { access_tier: finalTier, price_cents: priceCents });
    if (res.error) { triggerToast(`Error al actualizar tarifa: ${res.error}`); return; }
    queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    triggerToast(finalTier === "subscription" ? "Curso incluido en Suscripción Pro Mensual" : "Tarifa actualizada con éxito");
    setEditingPricingCourse(null);
  };
  const handleSaveCourseDetails = async (updated: {
    title: string; description?: string; level: string; categoryId?: string | null; price: number;
    tier?: "free" | "course" | "subscription"; sourceLang?: string; targetLang?: string;
  }) => {
    if (!editingDetailsCourse) throw new Error("No hay un curso seleccionado para actualizar.");
    const finalTier = updated.tier || (updated.price > 0 ? "course" : "free");
    const priceCents = finalTier === "subscription" || finalTier === "free" ? 0 : Math.round(updated.price * 100);
    const res = await updateCourseApi(editingDetailsCourse.id, {
      title: updated.title, description: updated.description, level: updated.level, category_id: updated.categoryId,
      access_tier: finalTier, price_cents: priceCents, source_lang: updated.sourceLang, target_lang: updated.targetLang,
    });
    if (res.error || !res.data) throw new Error(res.error || "La API no confirmó la actualización del curso");
    queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    triggerToast(`¡Curso "${updated.title}" actualizado con éxito!`);
    setEditingDetailsCourse(null);
  };
  const handleDeleteCourse = async () => {
    if (!editingDetailsCourse) throw new Error("No hay un curso seleccionado para eliminar.");
    const res = await deleteCourseApi(editingDetailsCourse.id);
    if (res.error || !res.data) throw new Error(res.error || "La API no confirmó la eliminación del curso");
    queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    triggerToast(`Curso "${editingDetailsCourse.title}" eliminado`);
    setEditingDetailsCourse(null);
  };
  const selectedCourseForModal: Course | null = editingPricingCourse ? {
    id: editingPricingCourse.id, title: editingPricingCourse.title, level: editingPricingCourse.level,
    tier: editingPricingCourse.access_tier === "subscription" ? "subscription" : editingPricingCourse.access_tier === "course" ? "course" : "free",
    price: (editingPricingCourse.price_cents ?? 0) / 100, currency: "PEN",
    author: editingPricingCourse.author?.name || "Wordtap Core", lessons: [],
  } : null;

  return {
    activeTab, setActiveTab, selectedStatus, setSelectedStatus, selectedLevel, setSelectedLevel, searchQuery, setSearchQuery,
    showNewCourseModal, setShowNewCourseModal, editingDetailsCourse, setEditingDetailsCourse, setEditingPricingCourse,
    toastMessage, currentCatalogUrl, courses, isLoading, platformCourses, teacherCourses, currentTabCourses,
    publishedCount, platformPublishedCount, teacherPublishedCount, proCount, freeCount, tabPublishedCount, tabDraftCount,
    tabInReviewCount, otherTabPublishedCount, filteredCourses, selectedCourseForModal,
    handleCourseCreated, handleTogglePublish, handleSavePrice, handleSaveCourseDetails, handleDeleteCourse,
  };
}
