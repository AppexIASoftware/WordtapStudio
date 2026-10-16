"use client";

import { AdminMonetizationConfig } from "../types";

/** Los 4 tiers de acceso con sus campos editables. */
interface PlanTiersGridProps {
  config: AdminMonetizationConfig;
  setConfig: (next: AdminMonetizationConfig) => void;
}

export function PlanTiersGrid({ config, setConfig }: PlanTiersGridProps) {
  return (
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
            <div>• Sincronización offline y repaso adaptativo</div>
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
  );
}
