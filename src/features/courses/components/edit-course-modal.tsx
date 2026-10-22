"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2, Edit3, Crown, Gift, DollarSign, Sparkles, CheckCircle2, BookOpen } from "lucide-react";
import { Course } from "@/features/courses/types";

interface EditCourseModalProps {
  isOpen: boolean;
  course: Course;
  isAdmin?: boolean;
  onClose: () => void;
  onSave: (updated: {
    title: string;
    description?: string;
    level: string;
    price: number;
    tier?: "free" | "course" | "subscription";
    sourceLang?: string;
    targetLang?: string;
  }) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function EditCourseModal({
  isOpen,
  course,
  isAdmin = false,
  onClose,
  onSave,
  onDelete,
}: EditCourseModalProps) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description || "");
  const [level, setLevel] = useState(course.level || "A1");
  const [sourceLang, setSourceLang] = useState(course.sourceLang || "es");
  const [targetLang, setTargetLang] = useState(course.targetLang || "en");
  const [accessTier, setAccessTier] = useState<"subscription" | "course" | "free">(
    course.tier === "subscription" ? "subscription" : course.tier === "course" ? "course" : "free"
  );
  const [price, setPrice] = useState(course.price || 19.99);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(course.title);
    setDescription(course.description || "");
    setLevel(course.level || "A1");
    setSourceLang(course.sourceLang || "es");
    setTargetLang(course.targetLang || "en");
    setAccessTier(
      course.tier === "subscription" ? "subscription" : course.tier === "course" ? "course" : "free"
    );
    setPrice(course.price || 19.99);
    setError(null);
  }, [course]);

  if (!isOpen) return null;

  const teacherShare = (price * 0.7).toFixed(2);
  const platformShare = (price * 0.3).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const finalTier = isAdmin
        ? accessTier === "subscription"
          ? "subscription"
          : "free"
        : accessTier;
      const finalPrice = finalTier === "subscription" || finalTier === "free" ? 0 : price;

      await onSave({
        title: cleanTitle,
        description: description.trim() || undefined,
        level,
        sourceLang,
        targetLang,
        price: finalPrice,
        tier: finalTier,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al actualizar curso");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm(`¿Eliminar definitivamente el curso "${course.title}"?`)) {
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      await onDelete();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar curso");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card border border-border-default rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-emerald-brand/10 text-emerald-brand">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Editar Datos del Curso</h3>
              <p className="text-[10px] text-slate-muted">Actualiza título, enfoque pedagógico y acceso</p>
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

          {/* Modelo de Acceso y Monetización */}
          <div className="space-y-2 pt-1 border-t border-border-default">
            <label className="text-[11px] font-mono text-slate-subtle block">
              Modelo de Acceso &amp; Tarifa
            </label>

            {isAdmin ? (
              /* ADMIN: Solo Suscripción Pro o Prueba Gratis */
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccessTier("subscription")}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      accessTier === "subscription"
                        ? "bg-amber-500/15 border-amber-500/50 text-white ring-1 ring-amber-500/30"
                        : "bg-canvas border-border-default text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Crown className="w-4 h-4 text-amber-400" />
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                        Pro
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <span className="text-xs font-bold block leading-tight text-white">
                        Suscripción Pro
                      </span>
                      <span className="text-[10px] text-amber-200/80 mt-0.5 block">
                        $9.99/mes Stripe
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccessTier("free")}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      accessTier === "free"
                        ? "bg-emerald-brand/15 border-emerald-brand/50 text-white ring-1 ring-emerald-brand/30"
                        : "bg-canvas border-border-default text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Gift className="w-4 h-4 text-emerald-400" />
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-brand/20 text-emerald-brand">
                        Libre
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <span className="text-xs font-bold block leading-tight text-white">
                        Prueba Gratis
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        $0.00 (AdMob/Vidas)
                      </span>
                    </div>
                  </button>
                </div>

                {accessTier === "subscription" ? (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Incluido en Suscripción Pro Mensual</span>
                    </div>
                    <p className="leading-snug text-slate-300">
                      Desbloqueado automáticamente para todos los estudiantes con membresía Pro ($9.99/mes).
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Contenido de Libre Acceso</span>
                    </div>
                    <p className="leading-snug text-slate-300">
                      Cualquier estudiante registrado puede acceder a este curso gratuitamente.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* DOCENTE: Venta individual o Gratuito */
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccessTier("course")}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      accessTier === "course"
                        ? "bg-emerald-brand/15 border-emerald-brand/50 text-white ring-1 ring-emerald-brand/30"
                        : "bg-canvas border-border-default text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <DollarSign className="w-4 h-4 text-emerald-brand" />
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-brand/20 text-emerald-brand">
                        Venta
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <span className="text-xs font-bold block leading-tight text-white">
                        Venta Individual
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Pago único</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccessTier("free")}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      accessTier === "free"
                        ? "bg-emerald-brand/15 border-emerald-brand/50 text-white ring-1 ring-emerald-brand/30"
                        : "bg-canvas border-border-default text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Gift className="w-4 h-4 text-slate-300" />
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-500/20 text-slate-300">
                        $0
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <span className="text-xs font-bold block leading-tight text-white">
                        Gratuito
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Con vidas/admob</span>
                    </div>
                  </button>
                </div>

                {accessTier === "course" && (
                  <div className="space-y-2 p-3 rounded-xl bg-canvas border border-border-default">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono text-slate-subtle block">
                        Precio de Venta (USD)
                      </label>
                      <span className="text-[10px] font-mono text-emerald-brand font-bold">
                        Split 70/30
                      </span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0.99"
                      value={price}
                      onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-card border border-border-default text-white font-mono focus:outline-none focus:border-emerald-brand"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                      <span>Regalía Docente: <strong className="text-emerald-brand font-mono">${teacherShare}</strong></span>
                      <span>Plataforma: <strong className="text-slate-300 font-mono">${platformShare}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botones de acción: Eliminar a la izquierda, Guardar a la derecha */}
          <div className="flex items-center justify-between pt-3 border-t border-border-default">
            {onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isSubmitting}
                className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
                disabled={isSubmitting}
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
    </div>
  );
}
