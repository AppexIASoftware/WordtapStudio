"use client";

import { useEffect } from "react";
import { Crown, Gift, Sparkles, CheckCircle2, DollarSign, AlertCircle, AlertTriangle } from "lucide-react";

export type CourseAccessTier = "subscription" | "course" | "free";

export const MIN_TEACHER_COURSE_PRICE = 20.00;

interface PricingTierFieldsProps {
  isAdmin: boolean;
  accessTier: CourseAccessTier;
  onAccessTierChange: (tier: CourseAccessTier) => void;
  price: number;
  onPriceChange: (price: number) => void;
}

export function PricingTierFields({
  isAdmin,
  accessTier,
  onAccessTierChange,
  price,
  onPriceChange,
}: PricingTierFieldsProps) {
  useEffect(() => {
    if (!isAdmin && accessTier !== "course") {
      onAccessTierChange("course");
    }
  }, [isAdmin, accessTier, onAccessTierChange]);

  const teacherShare = (price * 0.7).toFixed(2);
  const platformShare = (price * 0.3).toFixed(2);
  const isBelowMin = !isAdmin && price < MIN_TEACHER_COURSE_PRICE;

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-mono text-slate-subtle block">
        Modelo de Acceso &amp; Tarifa
      </label>

      {isAdmin ? (
        /* ADMIN: Solo Suscripción Pro o Prueba Gratis */
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onAccessTierChange("subscription")}
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
              onClick={() => onAccessTierChange("free")}
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
        /* DOCENTE: Venta Individual Directa y Split 70/30 */
        <div className="space-y-2.5">
          <div className="p-3.5 rounded-2xl bg-canvas border border-border-default space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-emerald-brand/10 text-emerald-brand">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block leading-tight">
                    Venta Individual
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Pago único por curso completo
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-brand font-bold px-2 py-0.5 rounded-full bg-emerald-brand/10 border border-emerald-brand/20">
                Split 70/30
              </span>
            </div>

            {/* Badge/Aviso institucional de tarifa mínima fijada por la administración */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
              <span className="font-medium">
                Tarifa mínima fijada por la administración: S/ 20.00 PEN
              </span>
            </div>

            {/* Input de Precio */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-slate-subtle block">
                  Precio de Venta (PEN)
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  Mín. S/ 20.00
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                  S/
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="20.00"
                  value={price}
                  onChange={(e) => onPriceChange(parseFloat(e.target.value) || 0)}
                  className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-card border font-mono text-white focus:outline-none transition-colors ${
                    isBelowMin
                      ? "border-amber-500/60 focus:border-amber-500"
                      : "border-border-default focus:border-emerald-brand"
                  }`}
                  placeholder="20.00"
                />
              </div>

              {/* Mensaje de advertencia si price < 20.00 */}
              {isBelowMin && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-xl border border-amber-500/20">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                  <span>La tarifa mínima fijada por la administración es de S/ 20.00 PEN. Por favor indica un precio igual o superior.</span>
                </div>
              )}
            </div>

            {/* Desglose en vivo de Split 70/30 en Soles */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-default text-[10px]">
              <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <span className="text-slate-400 block text-[10px]">Regalía Docente (70%)</span>
                <strong className="text-emerald-brand font-mono text-xs">S/ {teacherShare} PEN</strong>
              </div>
              <div className="p-2 rounded-xl bg-canvas border border-border-default">
                <span className="text-slate-400 block text-[10px]">Plataforma Wordtap (30%)</span>
                <strong className="text-slate-300 font-mono text-xs">S/ {platformShare} PEN</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
