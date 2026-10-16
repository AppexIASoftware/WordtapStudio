"use client";

import { Save, CreditCard, Tv, Wallet } from "lucide-react";
import { MonetizationTab } from "../types";

/** Banner de la sección y barra de sub-tabs. */
interface MonetizationHeaderProps {
  activeTab: MonetizationTab;
  onTabChange: (tab: MonetizationTab) => void;
  onDeployRules: () => void;
}

export function MonetizationHeader({ activeTab, onTabChange, onDeployRules }: MonetizationHeaderProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Monetización, Planes & Publicidad
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
              ADR-01 • ADR-05 • ADR-07
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1 leading-relaxed">
            Control dinámico de los 4 tiers de acceso, calibración remota de Google AdMob y liquidación de regalías docentes.
          </p>
        </div>

        <button
          type="button"
          onClick={onDeployRules}
          className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald flex items-center gap-1.5 self-start md:self-auto"
        >
          <Save size={14} />
          <span>Guardar y Desplegar Reglas</span>
        </button>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-default pb-3 gap-3">
        <div className="flex items-center gap-1 bg-card p-1 rounded-2xl border border-border-default text-xs font-medium">
          <button
            type="button"
            onClick={() => onTabChange("plans")}
            className={`px-3.5 py-1.5 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "plans"
                ? "bg-emerald-brand text-canvas shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            <CreditCard size={13} />
            <span>Planes & Paywalls (Admin)</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("admob")}
            className={`px-3.5 py-1.5 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "admob"
                ? "bg-emerald-brand text-canvas shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            <Tv size={13} />
            <span>Publicidad Dinámica AdMob (Admin)</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("teacher")}
            className={`px-3.5 py-1.5 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "teacher"
                ? "bg-emerald-brand text-canvas shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            <Wallet size={13} />
            <span>Mis Ganancias & Stripe (Docente)</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-subtle font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-brand animate-pulse" />
          <span>Sincronización en la nube activa</span>
        </div>
      </div>
    </>
  );
}
