"use client";

import { Crown, Gift, Sparkles, CheckCircle2, DollarSign } from "lucide-react";

export type CourseAccessTier = "subscription" | "course" | "free";

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
  const teacherShare = (price * 0.7).toFixed(2);
  const platformShare = (price * 0.3).toFixed(2);

  return (
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
        /* DOCENTE: Venta individual o Gratuito */
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onAccessTierChange("course")}
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
              onClick={() => onAccessTierChange("free")}
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
                onChange={(e) => onPriceChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-card border border-border-default text-white font-mono focus:outline-none focus:border-emerald-brand"
              />
              <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                <span>
                  Regalía Docente:{" "}
                  <strong className="text-emerald-brand font-mono">${teacherShare}</strong>
                </span>
                <span>
                  Plataforma:{" "}
                  <strong className="text-slate-300 font-mono">${platformShare}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
