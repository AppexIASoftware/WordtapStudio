"use client";

import { useState } from "react";
import { DollarSign, Crown, CheckCircle2, Sparkles } from "lucide-react";
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
  const [isSubscription, setIsSubscription] = useState(course.tier === "subscription");
  const [price, setPrice] = useState(course.price || 19.99);

  if (!isOpen) return null;

  const teacherShare = (price * 0.7).toFixed(2);
  const platformShare = (price * 0.3).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubscription) {
      onSavePrice(0, "subscription");
    } else {
      onSavePrice(price, price > 0 ? "course" : "free");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            {isSubscription ? (
              <Crown className="w-4 h-4 text-amber-400" />
            ) : (
              <DollarSign className="w-4 h-4 text-emerald-brand" />
            )}
            <span>Configurar Monetización y Tarifa</span>
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

          {/* Opción Exclusiva para Administradores: Suscripción Pro */}
          {isAdmin ? (
            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                isSubscription
                  ? "bg-amber-500/10 border-amber-500/40 shadow-sm"
                  : "bg-canvas border-border-default"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`p-1.5 rounded-xl ${
                      isSubscription ? "bg-amber-500/20 text-amber-400" : "bg-card text-slate-400"
                    }`}
                  >
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <span>Suscripción Pro Mensual</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Admin Only
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-300 mt-0.5 block leading-tight">
                      Requiere que el estudiante tenga membresía mensual activa ($9.99/mes calibrada en Marketplace).
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-2">
                  <input
                    type="checkbox"
                    checked={isSubscription}
                    onChange={(e) => setIsSubscription(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 border border-border-default"></div>
                </label>
              </div>

              {isSubscription && (
                <div className="mt-3 pt-3 border-t border-amber-500/20 text-[11px] text-amber-200/90 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    El curso queda desbloqueado para suscriptores Pro activos. No requiere pago individual y los cobros mensuales se gestionan en Marketplace &amp; Stripe.
                  </p>
                </div>
              )}
            </div>
          ) : course.tier === "subscription" ? (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
              <Crown className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Incluido en Suscripción Pro Mensual</span>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  Este curso fue asignado a la membresía Pro por la Administración. Solo el equipo de administración puede alterar esta tarifa.
                </p>
              </div>
            </div>
          ) : null}

          {/* Venta individual o Gratuito (cuando no es suscripción) */}
          {!isSubscription ? (
            <div className="space-y-2">
              <label className="block font-semibold text-slate-200">
                Precio de Venta Individual (USD)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-border-default rounded-xl text-white font-mono text-sm focus:border-emerald-brand outline-none"
                  placeholder="0.00 para acceso libre"
                />
              </div>

              {price > 0 ? (
                <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span>Regalía Docente (70%):</span>
                    <strong className="text-emerald-brand font-mono">${teacherShare} USD</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>WordTap Plataforma (30%):</span>
                    <strong className="text-slate-400 font-mono">${platformShare} USD</strong>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Curso gratuito: acceso libre para todos los estudiantes (financiado por vidas y anuncios).</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-canvas border border-border-default text-center text-slate-400 text-xs">
              Tarifa cubierta por membresía mensual recurrente (<strong className="text-white">$9.99/mes</strong>).
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
                isSubscription
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
