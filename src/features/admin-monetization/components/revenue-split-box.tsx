"use client";

import { AdminMonetizationConfig } from "../types";

/** Reparto de ingresos entre plataforma y docente. */
interface RevenueSplitBoxProps {
  config: AdminMonetizationConfig;
  setConfig: (next: AdminMonetizationConfig) => void;
}

export function RevenueSplitBox({ config, setConfig }: RevenueSplitBoxProps) {
  return (
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
  );
}
