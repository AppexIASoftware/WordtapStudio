"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Crown, GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import { getAdminCoursesApi, updateCourseApi, ApiCourse } from "@/services/api";
import { Course } from "@/features/courses/types";
import { useUrlParam } from "@/hooks/use-url-params";
import { CourseCard } from "../components/catalog/course-card";
import { CatalogHeader } from "../components/catalog/catalog-header";
import { CatalogTabs } from "../components/catalog/catalog-tabs";
import { NewCourseModal } from "../components/new-course-modal";
import { PricingModal } from "../components/builder/pricing-modal";
import { ToastNotification } from "@/components/ui/toast-notification";

const CATALOG_TABS = ["platform", "teacher"] as const;
const STATUS_OPTIONS = ["", "published", "draft", "in_review"] as const;
const LEVEL_OPTIONS = ["", "A1", "A2", "B1", "B2", "C1"] as const;

export function AdminCoursesCatalogView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Enrutado reactivo respaldado por la URL (pestañas y filtros persistentes ante 'Atrás' / recarga)
  const [activeTab, setActiveTab] = useUrlParam<"platform" | "teacher">(
    "tab",
    CATALOG_TABS,
    "platform"
  );
  const [selectedStatus, setSelectedStatus] = useUrlParam<string>(
    "status",
    STATUS_OPTIONS,
    ""
  );
  const [selectedLevel, setSelectedLevel] = useUrlParam<string>(
    "level",
    LEVEL_OPTIONS,
    ""
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [editingPricingCourse, setEditingPricingCourse] = useState<ApiCourse | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Construccion del enlace de retorno exacto con los parametros activos
  const currentQueryString = searchParams?.toString();
  const currentCatalogUrl = currentQueryString
    ? `/admin/courses?${currentQueryString}`
    : "/admin/courses";

  // TanStack Query: Caché reactiva en memoria (0 ms de latencia al volver del editor)
  const { data: courses = [], isLoading } = useQuery<ApiCourse[]>({
    queryKey: ["admin", "courses"],
    queryFn: async () => {
      const res = await getAdminCoursesApi();
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
    staleTime: 1000 * 60 * 3, // 3 minutos de caché fresca
  });

  // Segmentación básica por plataforma vs docentes
  const platformCourses = useMemo(
    () => courses.filter((c) => c.owner_type !== "teacher"),
    [courses]
  );
  const teacherCourses = useMemo(
    () => courses.filter((c) => c.owner_type === "teacher"),
    [courses]
  );

  // Métricas globales para la cabecera
  const publishedCount = useMemo(
    () => courses.filter((c) => c.status === "published").length,
    [courses]
  );
  const platformPublishedCount = useMemo(
    () => platformCourses.filter((c) => c.status === "published").length,
    [platformCourses]
  );
  const teacherPublishedCount = useMemo(
    () => teacherCourses.filter((c) => c.status === "published").length,
    [teacherCourses]
  );
  const proCount = useMemo(
    () => courses.filter((c) => c.access_tier === "subscription").length,
    [courses]
  );
  const freeCount = useMemo(
    () =>
      courses.filter(
        (c) => c.access_tier === "free" || (!c.price_cents && c.access_tier !== "subscription")
      ).length,
    [courses]
  );

  // Conteos contextuales según la pestaña activa (para que los pills coincidan exactamente con las tarjetas)
  const currentTabCourses = activeTab === "platform" ? platformCourses : teacherCourses;
  const tabPublishedCount = useMemo(
    () => currentTabCourses.filter((c) => c.status === "published").length,
    [currentTabCourses]
  );
  const tabDraftCount = useMemo(
    () => currentTabCourses.filter((c) => c.status === "draft" || !c.status).length,
    [currentTabCourses]
  );
  const tabInReviewCount = useMemo(
    () => currentTabCourses.filter((c) => c.status === "in_review").length,
    [currentTabCourses]
  );

  // Cuántos publicados hay en la otra pestaña
  const otherTabPublishedCount =
    activeTab === "platform" ? teacherPublishedCount : platformPublishedCount;

  // Filtrado reactivo por Tab, Búsqueda, Estado y Nivel
  const filteredCourses = useMemo(() => {
    return currentTabCourses.filter((c) => {
      // Filtro por estado
      if (selectedStatus) {
        const courseStatus = c.status || "draft";
        if (courseStatus !== selectedStatus) return false;
      }
      // Filtro por nivel
      if (selectedLevel && c.level?.toUpperCase() !== selectedLevel.toUpperCase()) {
        return false;
      }
      // Filtro por texto
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchAuthor = c.author?.name?.toLowerCase().includes(q);
      const matchDesc = c.description?.toLowerCase().includes(q);
      return matchTitle || matchAuthor || matchDesc;
    });
  }, [currentTabCourses, selectedStatus, selectedLevel, searchQuery]);

  const handleCourseCreated = (newApiCourse: ApiCourse) => {
    triggerToast(`¡Curso "${newApiCourse.title}" creado con éxito!`);
    queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    // Redirigir de inmediato al editor de ese curso preservando origen
    router.push(`/admin/courses/${newApiCourse.id}?from=${encodeURIComponent(currentCatalogUrl)}`);
  };

  const handleTogglePublish = async (course: ApiCourse) => {
    const nextStatus = course.status === "published" ? "draft" : "published";
    const res = await updateCourseApi(course.id, { status: nextStatus });
    if (res.error) {
      triggerToast(`No se pudo actualizar el estado: ${res.error}`);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    triggerToast(
      nextStatus === "published"
        ? `¡Curso "${course.title}" publicado y activo en la app móvil!`
        : `Curso "${course.title}" movido a borrador.`
    );
  };

  const handleSavePrice = async (
    newPrice: number,
    tier?: "free" | "course" | "subscription"
  ) => {
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

    queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    triggerToast(
      finalTier === "subscription"
        ? "Curso incluido en Suscripción Pro Mensual"
        : "Tarifa actualizada con éxito"
    );
    setEditingPricingCourse(null);
  };

  // Adapter para PricingModal
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
        currency: "USD",
        author: editingPricingCourse.author?.name || "Wordtap Core",
        lessons: [],
      }
    : null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-canvas p-4 sm:p-6 lg:p-8 space-y-6">
      <ToastNotification message={toastMessage} variant="emerald" />

      {/* Cabecera, Métricas & Filtros de Estado */}
      <CatalogHeader
        totalCourses={courses.length}
        publishedCount={publishedCount}
        platformPublishedCount={platformPublishedCount}
        teacherPublishedCount={teacherPublishedCount}
        proCount={proCount}
        freeCount={freeCount}
        teacherCount={teacherCourses.length}
        tabTotal={currentTabCourses.length}
        tabPublishedCount={tabPublishedCount}
        tabDraftCount={tabDraftCount}
        tabInReviewCount={tabInReviewCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onOpenNewCourseModal={() => setShowNewCourseModal(true)}
      />

      {/* Tabs: Plataforma vs Docentes */}
      <CatalogTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        platformCount={platformCourses.length}
        teacherCount={teacherCourses.length}
      />

      {/* Aviso interactivo si hay publicados en la otra pestaña */}
      {selectedStatus === "published" && otherTabPublishedCount > 0 && (
        <div className="p-3 px-4 rounded-2xl bg-card border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Tenés <strong>{otherTabPublishedCount}</strong> curso{otherTabPublishedCount === 1 ? "" : "s"} publicado{otherTabPublishedCount === 1 ? "" : "s"} en la pestaña{" "}
              <strong className="text-white">
                {activeTab === "platform" ? "Cursos de Docentes" : "Cursos de Plataforma"}
              </strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "platform" ? "teacher" : "platform")}
            className="text-emerald-brand hover:underline font-bold cursor-pointer flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Ver en {activeTab === "platform" ? "Cursos de Docentes" : "Cursos de Plataforma"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Grilla de Cursos */}
      {isLoading && courses.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-muted">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-brand" />
          <span className="text-xs font-mono">Cargando catálogo oficial de Wordtap...</span>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="py-16 p-8 rounded-3xl bg-card border border-border-default flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto shadow-card-soft">
          <div className="w-14 h-14 rounded-2xl bg-emerald-brand/10 border border-emerald-brand/20 flex items-center justify-center text-emerald-brand shadow-inner">
            {activeTab === "platform" ? (
              <Crown className="w-7 h-7 text-amber-400" />
            ) : (
              <GraduationCap className="w-7 h-7 text-purple-400" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              {selectedStatus === "published"
                ? "No hay más cursos publicados en esta pestaña"
                : searchQuery || selectedLevel || selectedStatus
                ? "No se encontraron cursos con estos filtros"
                : activeTab === "platform"
                ? "Aún no hay cursos de plataforma creados"
                : "Aún no hay cursos de docentes enviados"}
            </h3>
            <p className="text-xs text-slate-muted leading-relaxed">
              {selectedStatus === "published"
                ? "Podés publicar cualquiera de los otros cursos borrador con el botón 'Publicar' para activarlo en la app móvil."
                : searchQuery || selectedLevel || selectedStatus
                ? "Probá limpiando los filtros de estado o nivel."
                : activeTab === "platform"
                ? "Comenzá creando el primer curso oficial del currículo de Wordtap."
                : "Los cursos creados por docentes independientes aparecerán aquí para tu supervisión."}
            </p>
          </div>
          {activeTab === "platform" && !selectedStatus && (
            <button
              type="button"
              onClick={() => setShowNewCourseModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer flex items-center gap-1.5 shadow-glow-emerald"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Crear Primer Curso Oficial</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCourses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              returnUrl={currentCatalogUrl}
              onEditPricing={(c) => setEditingPricingCourse(c)}
              onTogglePublish={handleTogglePublish}
            />
          ))}
        </div>
      )}

      {/* Modal para Crear Nuevo Curso */}
      <NewCourseModal
        isOpen={showNewCourseModal}
        isAdmin={true}
        onClose={() => setShowNewCourseModal(false)}
        onCreated={handleCourseCreated}
      />

      {/* Modal para Editar Tarifa Rápida */}
      {selectedCourseForModal && (
        <PricingModal
          isOpen={true}
          course={selectedCourseForModal}
          isAdmin={true}
          onClose={() => setEditingPricingCourse(null)}
          onSavePrice={handleSavePrice}
        />
      )}
    </div>
  );
}
