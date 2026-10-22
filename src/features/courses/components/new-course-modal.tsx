"use client";

import { useState } from "react";
import { Loader2, Crown, DollarSign, Gift, Sparkles, BookOpen, CheckCircle2 } from "lucide-react";
import { createCourseApi, ApiCourse, CreateCoursePayload } from "@/services/api";

interface NewCourseModalProps {
  isOpen: boolean;
  isAdmin?: boolean;
  onClose: () => void;
  onCreated: (course: ApiCourse) => void;
}

export function NewCourseModal({
  isOpen,
  isAdmin = false,
  onClose,
  onCreated,
}: NewCourseModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setNewLevel] = useState("A1");
  const [sourceLang, setSourceLang] = useState("es");
  const [targetLang, setTargetLang] = useState("en");
  const [accessTier, setAccessTier] = useState<"subscription" | "course" | "free">(
    isAdmin ? "subscription" : "free"
  );
  const [price, setPrice] = useState(19.99);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const teacherShare = (price * 0.7).toFixed(2);
  const platformShare = (price * 0.3).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    setIsSubmitting(true);
    setError(null);

    const payload: CreateCoursePayload = {
      title: cleanTitle,
      description: description.trim() || undefined,
      level,
      source_lang: sourceLang,
      target_lang: targetLang,
      access_tier: isAdmin ? (accessTier === "subscription" ? "subscription" : "free") : accessTier,
      price_cents: !isAdmin && accessTier === "course" ? Math.round(price * 100) : 0,
    };

    const res = await createCourseApi(payload);
    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    if (res.data) {
      onCreated(res.data);
      setTitle("");
      setDescription("");
      setNewLevel("A1");
      setAccessTier(isAdmin ? "subscription" : "free");
      setPrice(19.99);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card border border-border-default rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
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

        <form onSubmit={handleSubmit} className="space-y-3.5">
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
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>Incluido en Suscripción Pro Mensual</span>
                    </div>
                    <p className="leading-snug text-slate-300">
                      Desbloqueado automáticamente para todos los estudiantes con membresía Pro ($9.99/mes). Sin costo por curso.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
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

          {/* Botones de acción */}
          <div className="flex gap-2 pt-2 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-xs rounded-xl border border-border-default text-slate-muted hover:text-white cursor-pointer font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2 text-xs rounded-xl font-bold transition-colors disabled:opacity-50 cursor-pointer flex justify-center items-center gap-1 ${
                accessTier === "subscription"
                  ? "bg-amber-500 text-black hover:bg-amber-400"
                  : "bg-emerald-brand text-canvas hover:bg-mint-brand"
              }`}
            >
              {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>Crear Curso</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
