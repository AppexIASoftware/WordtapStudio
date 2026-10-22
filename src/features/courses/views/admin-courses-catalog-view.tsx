"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, BookOpen, Crown, GraduationCap, RefreshCw } from "lucide-react";
import { getAdminCoursesApi, updateCourseApi, ApiCourse } from "@/services/api";
import { Course } from "@/features/courses/types";
import { CourseCard } from "../components/catalog/course-card";
import { CatalogHeader } from "../components/catalog/catalog-header";
import { CatalogTabs } from "../components/catalog/catalog-tabs";
import { NewCourseModal } from "../components/new-course-modal";
import { PricingModal } from "../components/builder/pricing-modal";
import { ToastNotification } from "@/components/ui/toast-notification";

export function AdminCoursesCatalogView() {
  const router = useRouter();
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"platform" | "teacher">("platform");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [editingPricingCourse, setEditingPricingCourse] = useState<ApiCourse | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAdminCoursesApi();
      if (res.data) {
        setCourses(res.data);
      }
    } catch {
      triggerToast("No se pudo cargar la lista administrativa de cursos.");
    } finally {
      setIsLoading(false);
    }
  }, [triggerToast]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Contadores para métricas
  const platformCourses = useMemo(
    () => courses.filter((c) => c.owner_type !== "teacher"),
    [courses]
  );
  const teacherCourses = useMemo(
    () => courses.filter((c) => c.owner_type === "teacher"),
    [courses]
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

  // Filtrado reactivo por Tab, Búsqueda y Nivel
  const currentTabCourses = activeTab === "platform" ? platformCourses : teacherCourses;
  const filteredCourses = useMemo(() => {
    return currentTabCourses.filter((c) => {
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
  }, [currentTabCourses, selectedLevel, searchQuery]);

  const handleCourseCreated = (newApiCourse: ApiCourse) => {
    triggerToast(`¡Curso "${newApiCourse.title}" creado con éxito!`);
    loadCourses();
    // Redirigir de inmediato al editor de ese curso
    router.push(`/admin/courses/${newApiCourse.id}`);
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

    setCourses((prev) =>
      prev.map((c) =>
        c.id === editingPricingCourse.id
          ? { ...c, access_tier: finalTier, price_cents: priceCents }
          : c
      )
    );
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

      {/* Cabecera & Métricas */}
      <CatalogHeader
        totalCourses={courses.length}
        proCount={proCount}
        freeCount={freeCount}
        teacherCount={teacherCourses.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
        onOpenNewCourseModal={() => setShowNewCourseModal(true)}
      />

      {/* Tabs: Plataforma vs Docentes */}
      <CatalogTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        platformCount={platformCourses.length}
        teacherCount={teacherCourses.length}
      />

      {/* Grilla de Cursos */}
      {isLoading ? (
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
              {searchQuery || selectedLevel
                ? "No se encontraron cursos con estos filtros"
                : activeTab === "platform"
                ? "Aún no hay cursos de plataforma creados"
                : "Aún no hay cursos de docentes enviados"}
            </h3>
            <p className="text-xs text-slate-muted leading-relaxed">
              {searchQuery || selectedLevel
                ? "Probá limpiando el buscador o cambiando el nivel seleccionado."
                : activeTab === "platform"
                ? "Comenzá creando el primer curso oficial del currículo de Wordtap."
                : "Los cursos creados por docentes independientes aparecerán aquí para tu supervisión."}
            </p>
          </div>
          {activeTab === "platform" && (
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
              onEditPricing={(c) => setEditingPricingCourse(c)}
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
