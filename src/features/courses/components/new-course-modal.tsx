"use client";

import { useState, useEffect } from "react";
import { Loader2, BookOpen } from "lucide-react";
import { createCourseApi, getVaultCategoriesApi, ApiCourse, ApiVaultCategory, CreateCoursePayload } from "@/services/api";
import { NewCategoryModal } from "@/features/vault/components/new-category-modal";
import { CategoryCombobox } from "@/features/vault/components/category-combobox";
import { PricingTierFields, CourseAccessTier, MIN_TEACHER_COURSE_PRICE } from "./pricing-tier-fields";

interface NewCourseModalProps {
  isOpen: boolean;
  isAdmin?: boolean;
  canCreateCategory?: boolean;
  onClose: () => void;
  onCreated: (course: ApiCourse) => void;
}

export function NewCourseModal({
  isOpen,
  isAdmin = false,
  canCreateCategory = false,
  onClose,
  onCreated,
}: NewCourseModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setNewLevel] = useState("A1");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<ApiVaultCategory[]>([]);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [newCategoryInitialName, setNewCategoryInitialName] = useState("");
  const [sourceLang, setSourceLang] = useState("es");
  const [targetLang, setTargetLang] = useState("en");
  const [accessTier, setAccessTier] = useState<CourseAccessTier>(
    isAdmin ? "subscription" : "course"
  );
  const [price, setPrice] = useState(20.00);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      getVaultCategoriesApi().then((res) => {
        if (res.data) setCategories(res.data);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    if (!isAdmin && price < MIN_TEACHER_COURSE_PRICE) {
      setError(`La tarifa mínima fijada por la administración es S/ ${MIN_TEACHER_COURSE_PRICE.toFixed(2)} PEN.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload: CreateCoursePayload = {
      title: cleanTitle,
      description: description.trim() || undefined,
      level,
      category_id: categoryId || undefined,
      source_lang: sourceLang,
      target_lang: targetLang,
      access_tier: isAdmin ? (accessTier === "subscription" ? "subscription" : "free") : "course",
      price_cents: isAdmin ? 0 : Math.round(price * 100),
    };

    const res = await createCourseApi(payload);
    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    if (res.data) {
      const category = categories.find((item) => item.id === res.data!.category_id);
      onCreated({ ...res.data, category: res.data.category ?? category });
      setTitle("");
      setDescription("");
      setNewLevel("A1");
      setCategoryId("");
      setAccessTier(isAdmin ? "subscription" : "course");
      setPrice(20.00);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card border border-border-default rounded-3xl p-5 max-w-4xl w-full space-y-3 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border-default pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-emerald-brand/10 text-emerald-brand">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Crear Nuevo Curso</h3>
              <p className="text-[10px] text-slate-muted">
                {isAdmin ? "Catálogo Oficial de la Plataforma" : "Portal de Creación Docente"}
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

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="md:grid md:grid-cols-2 md:gap-5 items-start">
            {/* Columna izquierda */}
            <div className="space-y-2.5">
              {/* Título */}
              <div>
                <label className="text-[11px] font-mono text-slate-subtle block mb-1">
                  Título del Curso *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Inglés Técnico para Devs"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default text-white focus:outline-none focus:border-emerald-brand"
                />
              </div>

              {/* Categoría Temática del Curso (Combobox con buscador y quick-create) */}
              <div>
                <label className="text-[11px] font-mono text-slate-subtle block mb-1">
                  Categoría Temática
                </label>
                <CategoryCombobox
                  value={categoryId}
                  categories={categories}
                  onChange={setCategoryId}
                  onCreateNew={canCreateCategory ? (name) => {
                    setNewCategoryInitialName(name || "");
                    setIsNewCategoryModalOpen(true);
                  } : undefined}
                />
              </div>

              {/* Nivel e Idiomas en 2 columnas pequeñas */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-mono text-slate-subtle block mb-1">
                    Nivel Pedagógico (CEFR)
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setNewLevel(e.target.value)}
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

              {/* Descripción / Enfoque pedagógico (textarea compacto de 2-3 filas) */}
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
            </div>

            {/* Columna derecha: Bloque de Modelo de Acceso & Tarifa */}
            <div className="mt-3 md:mt-0">
              <PricingTierFields
                isAdmin={isAdmin}
                accessTier={accessTier}
                onAccessTierChange={setAccessTier}
                price={price}
                onPriceChange={setPrice}
              />
            </div>
          </div>

          {/* Pie de modal: Botones Cancelar y Crear Curso en barra inferior compacta */}
          <div className="flex justify-end gap-2.5 pt-2.5 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs rounded-xl border border-border-default text-slate-muted hover:text-white cursor-pointer font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!isAdmin && price < MIN_TEACHER_COURSE_PRICE)}
              className={`px-5 py-2 text-xs rounded-xl font-bold transition-colors disabled:opacity-50 cursor-pointer flex justify-center items-center gap-1.5 ${
                accessTier === "subscription"
                  ? "bg-amber-500 text-black hover:bg-amber-400"
                  : "bg-emerald-brand text-canvas hover:bg-mint-brand"
              }`}
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Crear Curso</span>
            </button>
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
