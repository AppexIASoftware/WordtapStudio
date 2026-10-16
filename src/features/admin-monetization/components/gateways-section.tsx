"use client";

import { Play, CreditCard } from "lucide-react";
import { AdminMonetizationConfig, GatewayFilter } from "../types";

/** Mapeo de precios canónicos a los identificadores de cada pasarela. */
interface GatewaysSectionProps {
  config: AdminMonetizationConfig;
  setConfig: (next: AdminMonetizationConfig) => void;
  selectedGateway: GatewayFilter;
  setSelectedGateway: (next: GatewayFilter) => void;
}

export function GatewaysSection({ config, setConfig, selectedGateway, setSelectedGateway }: GatewaysSectionProps) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border-default shadow-card-soft space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-default pb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard size={16} className="text-emerald-brand" />
            <span>Mapeo Técnico de Pasarelas de Pago & Identificadores de Tienda (ADR-29)</span>
          </h3>
          <p className="text-xs text-slate-muted mt-0.5">
            Vinculación entre el precio base canónico (${config.subPrice.toFixed(2)} USD) y los identificadores de producto en cada pasarela.
          </p>
        </div>

        {/* Selector de Pasarelas */}
        <div className="flex items-center gap-1 bg-canvas p-1 rounded-xl border border-border-default text-xs font-mono">
          <button
            type="button"
            onClick={() => setSelectedGateway("stripe")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedGateway === "stripe"
                ? "bg-emerald-brand text-canvas"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Stripe
          </button>
          <button
            type="button"
            onClick={() => setSelectedGateway("apple")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedGateway === "apple"
                ? "bg-emerald-brand text-canvas"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Apple IAP
          </button>
          <button
            type="button"
            onClick={() => setSelectedGateway("google")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedGateway === "google"
                ? "bg-emerald-brand text-canvas"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Google Play
          </button>
          <button
            type="button"
            onClick={() => setSelectedGateway("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedGateway === "all"
                ? "bg-emerald-brand text-canvas"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Ver Todas
          </button>
        </div>
      </div>

      {/* Grid de Cards de Pasarelas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Stripe */}
        {(selectedGateway === "all" || selectedGateway === "stripe") && (
          <div className="p-4 rounded-2xl bg-canvas border border-border-default space-y-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold font-mono text-xs">
                  S
                </span>
                <strong className="text-white text-xs font-bold">Stripe Payments</strong>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/30">
                Webhook Live
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <label className="block text-[9px] text-slate-subtle mb-0.5 uppercase">
                  Price ID Mensual (Stripe):
                </label>
                <input
                  type="text"
                  value={config.gateways.stripe.subPriceId}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      gateways: {
                        ...config.gateways,
                        stripe: {
                          ...config.gateways.stripe,
                          subPriceId: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full bg-card border border-border-default rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 focus:border-emerald-brand focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-subtle mb-0.5 uppercase">
                  SetupIntent Trial:
                </label>
                <input
                  type="text"
                  value={config.gateways.stripe.trialHoldId}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      gateways: {
                        ...config.gateways,
                        stripe: {
                          ...config.gateways.stripe,
                          trialHoldId: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full bg-card border border-border-default rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 focus:border-emerald-brand focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border-default text-[10px] space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Tarifa Pasarela:</span>
                <span className="text-slate-200 font-mono">2.9% + $0.30 USD</span>
              </div>
              <div className="flex justify-between">
                <span>Destino:</span>
                <span className="text-white font-mono">Web Checkout & API</span>
              </div>
            </div>
          </div>
        )}

        {/* Apple StoreKit */}
        {(selectedGateway === "all" || selectedGateway === "apple") && (
          <div className="p-4 rounded-2xl bg-canvas border border-border-default space-y-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono text-xs">
                  
                </span>
                <strong className="text-white text-xs font-bold">Apple StoreKit 2 (iOS)</strong>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                App Store Connect
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <label className="block text-[9px] text-slate-subtle mb-0.5 uppercase">
                  Product ID Suscripción:
                </label>
                <input
                  type="text"
                  value={config.gateways.apple.productId}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      gateways: {
                        ...config.gateways,
                        apple: {
                          ...config.gateways.apple,
                          productId: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full bg-card border border-border-default rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 focus:border-emerald-brand focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-subtle mb-0.5 uppercase">
                  Price Tier en Apple:
                </label>
                <select
                  value={config.gateways.apple.tier}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      gateways: {
                        ...config.gateways,
                        apple: {
                          ...config.gateways.apple,
                          tier: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full bg-card border border-border-default rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 focus:border-emerald-brand focus:outline-none font-mono cursor-pointer"
                >
                  <option value="10">Tier 10 ($9.99 USD / €9.99 / S/ 39.90)</option>
                  <option value="12">Tier 12 ($11.99 USD / €11.99)</option>
                  <option value="15">Tier 15 ($14.99 USD / €14.99)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-border-default text-[10px] space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Comisión Apple Tax:</span>
                <span className="text-amber-400 font-mono">15% (Small Business) / 30%</span>
              </div>
              <div className="flex justify-between">
                <span>Server Notifications:</span>
                <span className="text-white font-mono">App Store Server V2</span>
              </div>
            </div>
          </div>
        )}

        {/* Google Play */}
        {(selectedGateway === "all" || selectedGateway === "google") && (
          <div className="p-4 rounded-2xl bg-canvas border border-border-default space-y-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-brand/20 text-emerald-brand flex items-center justify-center font-bold font-mono text-xs">
                  G
                </span>
                <strong className="text-white text-xs font-bold">Google Play Billing (Android)</strong>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/30">
                RTDN Pub/Sub
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <label className="block text-[9px] text-slate-subtle mb-0.5 uppercase">
                  Subscription Product ID:
                </label>
                <input
                  type="text"
                  value={config.gateways.google.productId}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      gateways: {
                        ...config.gateways,
                        google: {
                          ...config.gateways.google,
                          productId: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full bg-card border border-border-default rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 focus:border-emerald-brand focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-subtle mb-0.5 uppercase">
                  Base Plan ID:
                </label>
                <input
                  type="text"
                  value={config.gateways.google.basePlanId}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      gateways: {
                        ...config.gateways,
                        google: {
                          ...config.gateways.google,
                          basePlanId: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full bg-card border border-border-default rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 focus:border-emerald-brand focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border-default text-[10px] space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Comisión Google Play:</span>
                <span className="text-emerald-brand font-mono">15% primer $1M USD / 30%</span>
              </div>
              <div className="flex justify-between">
                <span>Conversión de Divisas:</span>
                <span className="text-white font-mono">Automática por país</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
