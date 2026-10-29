"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2, Edit3, BookOpen } from "lucide-react";
import { Course } from "@/features/courses/types";
import { getVaultCategoriesApi, ApiVaultCategory } from "@/services/api";
import { PricingTierFields, CourseAccessTier } from "./pricing-tier-fields";
import { NewCategoryModal } from "@/features/vault/components/new-category-modal";
import { CategoryCombobox } from "@/features/vault/components/category-combobox";

interface EditCourseModalProps {
  isOpen: boolean;
  course: Course;
  isAdmin?: boolean;
  canCreateCategory?: boolean;
  onClose: () => void;
  onSave: (updated: {
    title: string;
    description?: string;
    level: string;
    categoryId?: string | null;
    price: number;
    tier?: CourseAccessTier;
    sourceLang?: string;
    targetLang?: string;
  }) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function EditCourseModal({
  isOpen,
  course,
  isAdmin = false,
  canCreateCategory = false,
  onClose,
  onSave,
  onDelete,
}: EditCourseModalProps) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description || "");
  const [level, setLevel] = useState(course.level || "A1");
  const [categoryId, setCategoryId] = useState(course.categoryId || "");
  const [categories, setCategories] = useState<ApiVaultCategory[]>([]);
  const [categoryLoadError, setCategoryLoadError] = useState<string | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [sourceLang, setSourceLang] = useState(course.sourceLang || "es");
  const [targetLang, setTargetLang] = useState(course.targetLang || "en");
  const [accessTier, setAccessTier] = useState<CourseAccessTier>(
    course.tier === "subscription" ? "subscription" : course.tier === "course" ? "course" : "free"
  );
  const [price, setPrice] = useState(course.price || 19.99);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [newCategoryInitialName, setNewCategoryInitialName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setCategoriesLoading(true);
    setCategories([]);
    setCategoryLoadError(null);
    getVaultCategoriesApi().then((res) => {
      if (!active) return;
      if (res.error || !res.data) setCategoryLoadError("No se pudieron cargar las categorías. Cerrá y volvé a intentar.");
      else setCategories(res.data);
    }).catch(() => {
      if (active) setCategoryLoadError("No se pudieron cargar las categorías. Cerrá y volvé a intentar.");
    }).finally(() => {
      if (active) setCategoriesLoading(false);
    });
    return () => { active = false; };
  }, [isOpen]);

  useEffect(() => {
    setTitle(course.title);
    setDescription(course.description || "");
    setLevel(course.level || "A1");
    setCategoryId(course.categoryId || "");
    setSourceLang(course.sourceLang || "es");
    setTargetLang(course.targetLang || "en");
    setAccessTier(
      course.tier === "subscription" ? "subscription" : course.tier === "course" ? "course" : "free"
    );
    setPrice(course.price || 19.99);
    setError(null);
  }, [course.id, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || categoryLoadError || categoriesLoading) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        title: cleanTitle,
        description: description.trim() || undefined,
        level,
        categoryId: categoryId || null,
        price: !isAdmin && accessTier === "course" ? price : 0,
        tier: isAdmin ? (accessTier === "subscription" ? "subscription" : "free") : accessTier,
        sourceLang,
        targetLang,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al actualizar el curso");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer."
      )
    )
      return;

    setIsDeleting(true);
    try {
      await onDelete();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar el curso");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card border border-border-default rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-brand/10 text-emerald-brand">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Editar Configuración del Curso</span>
                {isAdmin && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Admin
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-muted">
                Ajusta los metadatos, categoría y modelo de acceso
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-muted hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Título */}
          <div>
            <label className="text-[11px] font-mono text-slate-subtle block mb-1">
              Título del Curso *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default text-white focus:outline-none focus:border-emerald-brand"
            />
          </div>

          {/* Descripción / Enfoque pedagógico */}
          <div>
            <label className="text-[11px] font-mono text-slate-subtle block mb-1">
              Descripción &amp; Objetivo Pedagógico
            </label>
            <textarea
              rows={2}
              placeholder="Breve resumen de las competencias que desarrollará el estudiante..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default text-white focus:outline-none focus:border-emerald-brand resize-none"
            />
          </div>

          {/* Categoría Temática del Curso (Combobox con buscador y quick-create) */}
          <div>
            <label className="text-[11px] font-mono text-slate-subtle block mb-1">
              Categoría Temática
            </label>
            {categoryLoadError && <p className="text-xs text-rose-400 mb-1.5" role="alert">{categoryLoadError}</p>}
            <CategoryCombobox
              value={categoryId}
              disabled={categoriesLoading || Boolean(categoryLoadError)}
              categories={categories}
              onChange={setCategoryId}
              onCreateNew={canCreateCategory ? (name) => {
                setNewCategoryInitialName(name || "");
                setIsNewCategoryModalOpen(true);
              } : undefined}
            />
          </div>

          {/* Nivel e Idiomas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-subtle block mb-1">
                Nivel Pedagógico (CEFR)
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default text-white focus:outline-none focus:border-emerald-brand"
              >
                <option value="A1">A1 - Principiante</option>
                <option value="A2">A2 - Elemental</option>
                <option value="B1">B1 - Intermedio</option>
                <option value="B2">B2 - Intermedio Alto</option>
                <option value="C1">C1 - Avanzado</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-subtle block mb-1">
                Par de Idiomas
              </label>
              <select
                value={`${targetLang}_${sourceLang}`}
                onChange={(e) => {
                  const [t, s] = e.target.value.split("_");
                  setTargetLang(t);
                  setSourceLang(s);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default text-white focus:outline-none focus:border-emerald-brand"
              >
                <option value="en_es">Inglés (para hispanohablantes)</option>
                <option value="pt_es">Portugués (para hispanohablantes)</option>
                <option value="fr_es">Francés (para hispanohablantes)</option>
                <option value="es_en">Español (para angloparlantes)</option>
              </select>
            </div>
          </div>

          {/* Modelo de Acceso y Monetización (Modularizado) */}
          <PricingTierFields
            isAdmin={isAdmin}
            accessTier={accessTier}
            onAccessTierChange={setAccessTier}
            price={price}
            onPriceChange={setPrice}
          />

          {/* Botones de acción */}
          <div className="flex items-center justify-between pt-3 border-t border-border-default">
            {onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isSubmitting}
                className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Eliminar Curso</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs rounded-xl border border-border-default text-slate-muted hover:text-white cursor-pointer font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || categoriesLoading || Boolean(categoryLoadError)}
                className={`px-4 py-2 text-xs rounded-xl font-bold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5 ${
                  accessTier === "subscription"
                    ? "bg-amber-500 text-black hover:bg-amber-400"
                    : "bg-emerald-brand text-canvas hover:bg-mint-brand shadow-glow-emerald"
                }`}
              >
                {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal para Crear Nueva Categoría Temática al instante */}
      <NewCategoryModal
        isOpen={isNewCategoryModalOpen}
        initialName={newCategoryInitialName}
        onClose={() => setIsNewCategoryModalOpen(false)}
        onCreated={(newCat) => {
          setCategories((prev) => [...prev, newCat]);
          setCategoryId(newCat.id);
        }}
      />
    </div>
  );
}
