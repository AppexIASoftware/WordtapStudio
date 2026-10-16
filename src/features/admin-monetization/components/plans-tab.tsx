"use client";

import { DollarSign } from "lucide-react";
import { AdminMonetizationConfig, GatewayFilter } from "../types";
import { PlanTiersGrid } from "./plan-tiers-grid";
import { RevenueSplitBox } from "./revenue-split-box";
import { GatewaysSection } from "./gateways-section";

/** Sub-tab 1: planes, reparto de ingresos y mapeo de pasarelas. */
interface PlansTabProps {
  config: AdminMonetizationConfig;
  setConfig: (next: AdminMonetizationConfig) => void;
  selectedGateway: GatewayFilter;
  setSelectedGateway: (next: GatewayFilter) => void;
  onDeployRules: () => void;
}

export function PlansTab({ config, setConfig, selectedGateway, setSelectedGateway, onDeployRules }: PlansTabProps) {
  return (
    <div className="space-y-6">
      {/* Notice Bar */}
      <div className="p-4 rounded-2xl bg-canvas border border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-card-soft">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center font-bold">
            <DollarSign size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Configuración Canónica de Precios & Mapeo de Pasarelas</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-brand/20 text-emerald-brand font-bold">
                ADR-29 Dinámico
              </span>
            </h3>
            <p className="text-[11px] text-slate-muted">
              Edita tarifas base sin alterar manualmente la BD y sincroniza los SKUs con Stripe, Apple StoreKit y Google Play.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDeployRules}
          className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald flex-shrink-0"
        >
          Guardar y Desplegar Reglas
        </button>
      </div>
      <PlanTiersGrid config={config} setConfig={setConfig} />
      <RevenueSplitBox config={config} setConfig={setConfig} />
      <GatewaysSection
        config={config}
        setConfig={setConfig}
        selectedGateway={selectedGateway}
        setSelectedGateway={setSelectedGateway}
      />
    </div>
  );
}
