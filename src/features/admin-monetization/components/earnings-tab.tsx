"use client";

import { DollarSign } from "lucide-react";
import { AdminMonetizationConfig, TeacherCoursePricing } from "../types";

/** Sub-tab 3: liquidación de regalías y precios de cursos. */
interface EarningsTabProps {
  config: AdminMonetizationConfig;
  courses: TeacherCoursePricing[];
  onSelectCourse: (course: TeacherCoursePricing) => void;
  onRequestPayout: () => void;
}

export function EarningsTab({ config, courses, onSelectCourse, onRequestPayout }: EarningsTabProps) {
  return (
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
          onClick={onRequestPayout}
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
                        onClick={() => onSelectCourse(c)}
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
  );
}
