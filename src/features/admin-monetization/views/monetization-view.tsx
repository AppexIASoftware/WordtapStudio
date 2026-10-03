"use client";

import React, { useState } from "react";
import {
  DollarSign,
  Play,
  Save,
  Check,
  CreditCard,
  Tv,
  Wallet,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  AdminMonetizationConfig,
  AdMobConfig,
  TeacherCoursePricing,
} from "../types";
import {
  INITIAL_MONETIZATION_CONFIG,
  INITIAL_ADMOB_CONFIG,
  INITIAL_TEACHER_COURSES,
} from "../data/monetization-data";
import { ToastNotification } from "@/components/ui/toast-notification";
import { CoursePricingModal } from "../components/course-pricing-modal";

export function MonetizationView() {
  const [activeTab, setActiveTab] = useState<"plans" | "admob" | "teacher">("plans");
  const [selectedGateway, setSelectedGateway] = useState<"all" | "stripe" | "apple" | "google">("stripe");

  // Configuración de Planes
  const [config, setConfig] = useState<AdminMonetizationConfig>(INITIAL_MONETIZATION_CONFIG);

  // Configuración de AdMob
  const [admob, setAdmob] = useState<AdMobConfig>(INITIAL_ADMOB_CONFIG);

  // Cursos Docente
  const [courses, setCourses] = useState<TeacherCoursePricing[]>(INITIAL_TEACHER_COURSES);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<TeacherCoursePricing | null>(null);

  // Toast flotante
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Guardar y desplegar reglas canónicas
  const handleDeployRules = () => {
    triggerToast(
      `¡Reglas financieras sincronizadas! Sub: $${config.subPrice.toFixed(2)} USD • Split: ${config.teacherSplit}/${config.platformSplit}%`
    );
  };

  const handleSaveAdmobPolicy = () => {
    triggerToast(
      `¡Reglas de AdMob actualizadas! Intersticial: cada ${admob.interstitialFreq} juegos • Banners: ${
        admob.bannersEnabled ? "ON" : "OFF"
      } • Rewarded: ${admob.rewardedEnabled ? "ON" : "OFF"}`
    );
  };

  const handleSimulateAd = () => {
    triggerToast("Simulador: Disparando anuncio intersticial AdMob en vista móvil de prueba...");
  };

  const handleRequestPayout = () => {
    triggerToast(
      "Liquidación de $1,245.80 USD enviada a procesamiento con Stripe Connect. Depósito estimado en 24-48h."
    );
  };

  const handleSaveCoursePrice = (courseId: string, newPrice: number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, price: newPrice } : c))
    );
    const teacherCut = (newPrice * (config.teacherSplit / 100)).toFixed(2);
    triggerToast(
      `¡Precio actualizado! Precio: $${newPrice.toFixed(2)} USD (Recibes ${config.teacherSplit}%: $${teacherCut} USD)`
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Toast flotante */}
      <ToastNotification message={toastMessage} variant="purple" />

      {/* Header Banner */}
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
          onClick={handleDeployRules}
          className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald flex items-center gap-1.5 self-start md:self-auto"
        >
          <Save size={14} />
          <span>Guardar y Desplegar Reglas</span>
        </button>
      </div>

      {/* Sub-Tab Navigation Bar (ADR-15) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-default pb-3 gap-3">
        <div className="flex items-center gap-1 bg-card p-1 rounded-2xl border border-border-default text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("plans")}
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
            onClick={() => setActiveTab("admob")}
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
            onClick={() => setActiveTab("teacher")}
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

      {/* SUB-TAB 1: PLANES & PAYWALLS */}
      {activeTab === "plans" && (
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
              onClick={handleDeployRules}
              className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald flex-shrink-0"
            >
              Guardar y Desplegar Reglas
            </button>
          </div>

          {/* Grid de 4 Tiers con Campos Editables */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Tier 1: Free */}
            <div className="p-5 rounded-2xl bg-card border border-border-default shadow-card-soft space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  TIER 1
                </span>
                <span className="text-xs font-bold text-emerald-brand font-mono">$0 USD (Fijo)</span>
              </div>
              <h3 className="text-base font-bold text-white">Plan Gratuito</h3>
              <p className="text-xs text-slate-muted leading-relaxed">
                Financiado con anuncios Google AdMob y vidas recargables.
              </p>
              <div className="pt-2 border-t border-border-default space-y-2 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-slate-subtle mb-1 uppercase">
                    Límite de Vidas (Corazones):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={config.freeLives}
                    onChange={(e) =>
                      setConfig({ ...config, freeLives: parseInt(e.target.value, 10) || 5 })
                    }
                    className="w-full bg-canvas border border-border-default rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-emerald-brand focus:outline-none"
                  />
                </div>
                <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                  <div>• Anuncios cada N juegos (AdMob)</div>
                  <div>• Videos para recuperar vidas</div>
                </div>
              </div>
            </div>

            {/* Tier 2: 7-Day Trial */}
            <div className="p-5 rounded-2xl bg-card border-2 border-amber-500/50 shadow-card-soft space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                  TIER 2 • TRIAL
                </span>
                <span className="text-xs font-bold text-amber-400 font-mono">$0 Hold</span>
              </div>
              <h3 className="text-base font-bold text-white">Prueba Gratuita (Trial)</h3>
              <p className="text-xs text-slate-muted leading-relaxed">
                Requiere tarjeta con hold de $0 (SetupIntent). Auto-renueva a mensual.
              </p>
              <div className="pt-2 border-t border-border-default space-y-2 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-slate-subtle mb-1 uppercase">
                    Días de Prueba:
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={3}
                      max={30}
                      value={config.trialDays}
                      onChange={(e) =>
                        setConfig({ ...config, trialDays: parseInt(e.target.value, 10) || 7 })
                      }
                      className="w-full bg-canvas border border-border-default rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold focus:border-emerald-brand focus:outline-none"
                    />
                    <span className="text-[11px] text-slate-400 font-mono">días</span>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-brand space-y-0.5 pt-1">
                  <div>• Hold $0 validación pasarela</div>
                  <div>• Reversión a Free si cancela</div>
                </div>
              </div>
            </div>

            {/* Tier 3: Suscripción Mensual */}
            <div className="p-5 rounded-2xl bg-card border-2 border-emerald-brand shadow-card-soft space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-brand/20 text-emerald-brand">
                  TIER 3 • RECURRENTE
                </span>
                <span className="text-xs font-bold text-emerald-brand font-mono">
                  ${config.subPrice.toFixed(2)} / mes
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Suscripción Mensual</h3>
              <p className="text-xs text-slate-muted leading-relaxed">
                Acceso total sin anuncios a todo el catálogo y pool de regalías docentes.
              </p>
              <div className="pt-2 border-t border-border-default space-y-2 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-slate-subtle mb-1 uppercase">
                    Precio Base Canónico (USD):
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-slate-400 font-mono font-bold text-xs">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.50"
                      min="2.99"
                      max="49.99"
                      value={config.subPrice}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          subPrice: parseFloat(e.target.value) || 9.99,
                        })
                      }
                      className="w-full bg-canvas border border-border-default rounded-lg pl-6 pr-2.5 py-1.5 text-xs text-white font-mono font-bold focus:border-emerald-brand focus:outline-none"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-mint-brand space-y-0.5 pt-1">
                  <div>• Vidas infinitas</div>
                  <div>• Sincronización offline y SM-2</div>
                </div>
              </div>
            </div>

            {/* Tier 4: Ventas de Cursos */}
            <div className="p-5 rounded-2xl bg-card border border-border-default shadow-card-soft space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  TIER 4 • STANDALONE
                </span>
                <span className="text-xs font-bold text-purple-400 font-mono">Rango Docente</span>
              </div>
              <h3 className="text-base font-bold text-white">Ventas de Cursos</h3>
              <p className="text-xs text-slate-muted leading-relaxed">
                Cursos individuales con precio autónomo fijado por profesores.
              </p>
              <div className="pt-2 border-t border-border-default space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-subtle mb-1 uppercase">
                      Precio Mínimo:
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={config.courseMin}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          courseMin: parseFloat(e.target.value) || 4.99,
                        })
                      }
                      className="w-full bg-canvas border border-border-default rounded-lg px-2 py-1.5 text-xs text-white font-mono focus:border-emerald-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-subtle mb-1 uppercase">
                      Precio Máximo:
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={config.courseMax}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          courseMax: parseFloat(e.target.value) || 99.99,
                        })
                      }
                      className="w-full bg-canvas border border-border-default rounded-lg px-2 py-1.5 text-xs text-white font-mono focus:border-emerald-brand focus:outline-none"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 space-y-0.5 pt-1">
                  <div>• Desbloqueo vitalicio de curso</div>
                  <div>• Split {config.teacherSplit}% Docente / {config.platformSplit}% App</div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Split Configuration Box (ADR-05) */}
          <div className="p-5 rounded-2xl bg-card border border-border-default space-y-4 shadow-card-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Política de Reparto de Ingresos (Revenue Split - ADR-05)</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-brand/10 text-emerald-brand font-bold border border-emerald-brand/30">
                    {config.teacherSplit}% Docente / {config.platformSplit}% Plataforma
                  </span>
                </h3>
                <p className="text-xs text-slate-muted mt-0.5">
                  Calibra el porcentaje neto de liquidación quincenal para cursos individuales vendidos en la plataforma.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-subtle uppercase">Docente:</span>
                  <strong className="text-emerald-brand text-sm ml-1">
                    {config.teacherSplit}%
                  </strong>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-subtle uppercase">Plataforma:</span>
                  <strong className="text-white text-sm ml-1">
                    {config.platformSplit}%
                  </strong>
                </div>
              </div>
            </div>

            {/* Slider de Reparto */}
            <div className="space-y-1.5">
              <input
                type="range"
                min={50}
                max={90}
                step={5}
                value={config.teacherSplit}
                onChange={(e) => {
                  const t = parseInt(e.target.value, 10);
                  setConfig({ ...config, teacherSplit: t, platformSplit: 100 - t });
                }}
                className="w-full accent-emerald-brand cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-muted">
                <span>50% (Paritario)</span>
                <span className="text-emerald-brand font-bold">70% (Estándar de la Industria)</span>
                <span>80%</span>
                <span>90% (Promocional)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-1">
                <span className="text-slate-subtle font-mono text-[10px]">
                  PAGO AL DOCENTE (STRIPE CONNECT):
                </span>
                <p className="text-sm font-bold text-white">
                  {config.teacherSplit}% del valor neto recaudado
                </p>
                <p className="text-[11px] text-slate-400">
                  Transferencias automatizadas quincenales vía Stripe Connect Payouts.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-1">
                <span className="text-slate-subtle font-mono text-[10px]">
                  RETENCIÓN WORDTAP (INFRAESTRUCTURA & PUBLICIDAD):
                </span>
                <p className="text-sm font-bold text-emerald-brand">
                  {config.platformSplit}% del valor neto recaudado
                </p>
                <p className="text-[11px] text-slate-400">
                  Cubre síntesis neural TTS de audio, almacenamiento CDN, pasarelas de pago y soporte.
                </p>
              </div>
            </div>
          </div>

          {/* Mapeo de Pasarelas de Pago & SKUs Móviles (ADR-29) */}
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
        </div>
      )}

      {/* SUB-TAB 2: PUBLICIDAD DINÁMICA ADMOB */}
      {activeTab === "admob" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border-default space-y-6 shadow-card-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Tv size={18} className="text-amber-400" />
                  <span>Telemetría y Control Remoto de Google AdMob</span>
                </h3>
                <p className="text-xs text-slate-muted mt-1 leading-relaxed">
                  Los cambios se propagan de forma instantánea a la app móvil sin necesidad de enviar nuevas versiones a Google Play o App Store.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSimulateAd}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Play size={13} />
                  <span>Probar Anuncio en Simulador</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveAdmobPolicy}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-brand text-canvas text-xs font-bold hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>

            {/* Controles de Publicidad */}
            <div className="space-y-6">
              {/* Slider de Frecuencia */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      Frecuencia de Anuncios Intersticiales (Pantalla Completa)
                    </h4>
                    <p className="text-[11px] text-slate-muted">
                      Dispara un video publicitario cada N minijuegos completados por usuarios en plan Free.
                    </p>
                  </div>
                  <span className="text-sm font-black font-mono px-3 py-1 rounded-xl bg-canvas border border-border-default text-emerald-brand">
                    Cada {admob.interstitialFreq} juegos
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={admob.interstitialFreq}
                  onChange={(e) =>
                    setAdmob({
                      ...admob,
                      interstitialFreq: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-canvas rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-subtle">
                  <span>1 juego (Alta intensidad)</span>
                  <span>2 juegos</span>
                  <span className="text-emerald-brand font-bold">3 juegos (Recomendado)</span>
                  <span>4 juegos</span>
                  <span>5 juegos (Baja fricción)</span>
                </div>
              </div>

              {/* Banners Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-canvas border border-border-default">
                <div>
                  <h4 className="text-xs font-bold text-white">Banners Inferiores en Catálogo (320x50)</h4>
                  <p className="text-[11px] text-slate-muted">
                    Muestra banners fijos al pie de la pantalla en la vista Home y Catálogo de lecciones para usuarios gratuitos.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={admob.bannersEnabled}
                    onChange={(e) => {
                      setAdmob({ ...admob, bannersEnabled: e.target.checked });
                      triggerToast(`Preferencia de banners actualizada (${e.target.checked ? "ON" : "OFF"})`);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-brand" />
                </label>
              </div>

              {/* Rewarded Ads Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-canvas border border-border-default">
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Videos Recompensados por Vidas y Congelamiento de Racha
                  </h4>
                  <p className="text-[11px] text-slate-muted">
                    Permite a los estudiantes ver un video voluntario para recuperar sus 5 corazones o proteger su racha de días.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={admob.rewardedEnabled}
                    onChange={(e) => {
                      setAdmob({ ...admob, rewardedEnabled: e.target.checked });
                      triggerToast(`Videos recompensados actualizados (${e.target.checked ? "ON" : "OFF"})`);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-brand" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MIS GANANCIAS & STRIPE CONNECT */}
      {activeTab === "teacher" && (
        <div className="space-y-6">
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-card border border-border-default space-y-2 shadow-card-soft">
              <span className="text-[10px] font-mono text-slate-subtle uppercase">
                Saldo Acumulado Disponible
              </span>
              <h3 className="text-2xl font-black text-emerald-brand font-mono">$1,245.80 USD</h3>
              <p className="text-xs text-slate-400">Listo para liquidación</p>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border-default space-y-2 shadow-card-soft">
              <span className="text-[10px] font-mono text-slate-subtle uppercase">
                Ventas Directas de Cursos
              </span>
              <h3 className="text-2xl font-black text-white font-mono">$890.00 USD</h3>
              <p className="text-xs text-mint-brand font-medium">
                Comisión {config.teacherSplit}% neta
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border-default space-y-2 shadow-card-soft">
              <span className="text-[10px] font-mono text-slate-subtle uppercase">
                Pool de Suscripción Global
              </span>
              <h3 className="text-2xl font-black text-amber-brand font-mono">$355.80 USD</h3>
              <p className="text-xs text-slate-400">Por 1,420 lecciones completadas</p>
            </div>
          </div>

          {/* Estado de Cuenta Stripe Connect */}
          <div className="p-6 rounded-2xl bg-card border border-border-default shadow-card-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold font-mono text-lg flex-shrink-0">
                S
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Cuenta Stripe Connect Activa</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-brand/20 text-emerald-brand font-bold">
                    Verificada
                  </span>
                </div>
                <p className="text-xs text-slate-muted mt-0.5">
                  Liquidaciones directas a BBVA Banco Continental • Cuenta terminada en 4482
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRequestPayout}
              className="px-5 py-2.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald"
            >
              Solicitar Liquidación ($1,245.80)
            </button>
          </div>

          {/* Cursos de mi Autoría: Precios Standalone & Split */}
          <div className="p-6 rounded-2xl bg-card border border-border-default shadow-card-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign size={16} className="text-emerald-brand" />
                  <span>
                    Mis Cursos: Precios Standalone & Liquidación Directa (Split {config.teacherSplit}/
                    {config.platformSplit})
                  </span>
                </h3>
                <p className="text-xs text-slate-muted mt-0.5">
                  Precios fijados por vos para venta directa en el catálogo móvil vs regalías por suscripción (ADR-05).
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border-default overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Curso</th>
                    <th className="p-3">Nivel</th>
                    <th className="p-3">Modelo</th>
                    <th className="p-3 font-mono">Precio Público</th>
                    <th className="p-3 font-mono">Tu Ganancia ({config.teacherSplit}%)</th>
                    <th className="p-3 font-mono">Ventas Directas</th>
                    <th className="p-3 font-mono">Total Neto</th>
                    <th className="p-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default font-medium">
                  {courses.map((c) => {
                    const teacherCut = c.price * (config.teacherSplit / 100);
                    const totalNet = c.sales * teacherCut;
                    const isFree = c.price === 0;

                    return (
                      <tr
                        key={c.id}
                        className="hover:bg-card-hover/50 transition-colors"
                      >
                        <td className="p-3 font-bold text-white">{c.title}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                              c.level.startsWith("A1")
                                ? "bg-emerald-brand/20 text-emerald-brand"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {c.level}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300 text-[11px]">{c.model}</td>
                        <td
                          className={`p-3 font-mono ${
                            isFree ? "text-slate-400" : "text-white font-bold"
                          }`}
                        >
                          {isFree ? "Gratuito" : `$${c.price.toFixed(2)} USD`}
                        </td>
                        <td
                          className={`p-3 font-mono ${
                            isFree ? "text-slate-500" : "text-emerald-brand font-bold"
                          }`}
                        >
                          {isFree ? "$0.00 USD" : `$${teacherCut.toFixed(2)} USD`}
                        </td>
                        <td className="p-3 font-mono text-slate-300">
                          {c.sales > 0 ? `${c.sales} alumnos` : "0"}
                        </td>
                        <td
                          className={`p-3 font-mono font-bold ${
                            totalNet > 0 ? "text-emerald-brand" : "text-slate-500"
                          }`}
                        >
                          {totalNet > 0 ? `$${totalNet.toFixed(2)} USD` : "$0.00 USD"}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedCourseForModal(c)}
                            className="text-xs text-emerald-brand hover:underline font-semibold cursor-pointer"
                          >
                            Ajustar Precio
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Dos Flujos de Ingreso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-1">
                <span className="text-emerald-brand font-mono font-bold text-[10px]">
                  FLUJO 1: VENTAS DIRECTAS DE CURSOS ({config.teacherSplit}% NETO)
                </span>
                <p className="text-[11px] text-slate-300">
                  Cobrás el {config.teacherSplit}% neto de cada venta de por vida fijada por vos. El {config.platformSplit}% retiene WordTap para pasarela, infraestructura y síntesis neural de audio.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-1">
                <span className="text-amber-brand font-mono font-bold text-[10px]">
                  FLUJO 2: POOL DE SUSCRIPCIÓN GLOBAL (${config.subPrice.toFixed(2)}/MES)
                </span>
                <p className="text-[11px] text-slate-300">
                  Reparto proporcional mensual en base a lecciones completadas por usuarios Premium. La tarifa de suscripción la administra la plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Precios de Curso */}
      <CoursePricingModal
        course={selectedCourseForModal}
        teacherSplitPct={config.teacherSplit}
        isOpen={selectedCourseForModal !== null}
        onClose={() => setSelectedCourseForModal(null)}
        onSave={handleSaveCoursePrice}
      />
    </div>
  );
}
