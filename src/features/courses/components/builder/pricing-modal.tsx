"use client";

import { useState } from "react";
import { DollarSign, Crown, Gift, Sparkles, CheckCircle2 } from "lucide-react";
import { Course } from "@/features/courses/types";

interface PricingModalProps {
  isOpen: boolean;
  course: Course;
  isAdmin?: boolean;
  onClose: () => void;
  onSavePrice: (newPrice: number, tier?: "free" | "course" | "subscription") => void;
}

export function PricingModal({
  isOpen,
  course,
  isAdmin = false,
  onClose,
  onSavePrice,
}: PricingModalProps) {
  const [selectedTier, setSelectedTier] = useState<"subscription" | "free" | "course">(
    course.tier === "subscription"
      ? "subscription"
      : course.tier === "course"
      ? "course"
      : "free"
  );
  const [price, setPrice] = useState(course.price || 19.99);

  if (!isOpen) return null;

  const teacherShare = (price * 0.7).toFixed(2);
  const platformShare = (price * 0.3).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdmin) {
      if (selectedTier === "subscription") {
        onSavePrice(0, "subscription");
      } else {
        onSavePrice(0, "free");
      }
    } else {
      if (selectedTier === "course") {
        onSavePrice(price, "course");
      } else {
        onSavePrice(0, "free");
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            {selectedTier === "subscription" ? (
              <Crown className="w-4 h-4 text-amber-400" />
            ) : selectedTier === "course" ? (
              <DollarSign className="w-4 h-4 text-emerald-brand" />
            ) : (
              <Gift className="w-4 h-4 text-emerald-400" />
            )}
            <span>
              {isAdmin ? "Modelo de Acceso del Curso (Admin)" : "Configurar Tarifa Docente"}
            </span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-muted hover:text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-1">
            <span className="text-[10px] font-mono text-slate-subtle uppercase">Curso seleccionado:</span>
            <p className="font-bold text-white text-xs">{course.title}</p>
          </div>

          {/* MODO ADMINISTRADOR: Solo Suscripción Pro o Prueba Gratis */}
          {isAdmin ? (
            <div className="space-y-3">
              <label className="text-[11px] font-mono text-slate-subtle block">
                Selecciona la modalidad del curso en la plataforma:
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Opción 1: Suscripción Pro */}
                <button
                  type="button"
                  onClick={() => setSelectedTier("subscription")}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedTier === "subscription"
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

                {/* Opción 2: Prueba Gratis */}
                <button
                  type="button"
                  onClick={() => setSelectedTier("free")}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedTier === "free"
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

              {selectedTier === "subscription" ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Cubierto por Suscripción Mensual</span>
                  </div>
                  <p className="leading-snug text-slate-300">
                    Desbloqueado para todos los estudiantes con membresía mensual activa ($9.99/mes calibrada en Marketplace). No requiere cobro individual.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Contenido de Libre Acceso</span>
                  </div>
                  <p className="leading-snug text-slate-300">
                    Cualquier estudiante registrado puede acceder a este curso gratuitamente para conocer la plataforma Wordtap.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* MODO DOCENTE: Venta individual o Gratuito */
            <div className="space-y-3">
              {course.tier === "subscription" ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                  <span className="font-bold block">Asignado a Suscripción Pro</span>
                  <p className="text-[11px] text-amber-200/80 mt-1">
                    Este curso forma parte de la membresía Pro gestionada por la Administración.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-200">
                      Precio de Venta Standalone (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-border-default rounded-xl text-white font-mono text-sm focus:border-emerald-brand outline-none"
                      placeholder="0.00 para acceso libre"
                    />
                    <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-1 text-slate-300">
                      <div className="flex justify-between">
                        <span>Regalía Docente (70%):</span>
                        <strong className="text-emerald-brand font-mono">${teacherShare} USD</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>WordTap Plataforma (30%):</span>
                        <strong className="text-slate-400 font-mono">${platformShare} USD</strong>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-colors ${
                selectedTier === "subscription"
                  ? "bg-amber-500 text-black hover:bg-amber-400"
                  : "bg-emerald-brand text-canvas hover:bg-mint-brand shadow-glow-emerald"
              }`}
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
