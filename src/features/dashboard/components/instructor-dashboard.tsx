"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TeacherPipeline } from "@/features/teacher-dashboard/components/teacher-pipeline";

export function InstructorDashboard() {
  const [period, setPeriod] = useState<"today" | "7d" | "30d" | "year">("7d");

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Encabezado del dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            Dashboard de Aprendizaje
          </h1>
          <p className="text-sm text-slate-muted mt-1">
            Monitoreo en tiempo real de retención, rendimiento en juegos y pipeline de cursos.
          </p>
        </div>

        {/* Pestañas de filtro de período */}
        <div className="flex items-center gap-1 p-1 bg-card rounded-xl border border-border-default text-xs font-mono">
          {(["today", "7d", "30d", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                period === p
                  ? "bg-canvas text-emerald-brand font-bold border border-border-default shadow-xs"
                  : "text-slate-muted hover:text-white"
              }`}
            >
              {p === "today" && "Hoy"}
              {p === "7d" && "7 Días"}
              {p === "30d" && "30 Días"}
              {p === "year" && "Año"}
            </button>
          ))}
        </div>
      </div>

      {/* Cuadrícula de 4 tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-card border border-border-default hover:border-border-subtle transition-all shadow-card-soft">
          <div className="flex items-center justify-between text-slate-muted text-xs font-medium">
            <span>Alumnos Activos Hoy</span>
            <span className="text-emerald-brand bg-emerald-brand/10 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">
              +18.4%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-white tabular-nums">1,428</span>
            <span className="text-xs text-slate-subtle font-mono">estudiantes</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-brand" />
            <span>
              Racha promedio: <strong className="text-white font-bold">6.8 días</strong>
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-card border border-border-default hover:border-border-subtle transition-all shadow-card-soft">
          <div className="flex items-center justify-between text-slate-muted text-xs font-medium">
            <span>Retención (Día 7)</span>
            <span className="text-emerald-brand bg-emerald-brand/10 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">
              Top 5%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-white tabular-nums">74.2%</span>
            <span className="text-xs text-emerald-brand font-medium">↑ 3.1% vs anterior</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-brand" />
            <span>
              Meta mensual: <strong className="text-white font-bold">70.0%</strong> superada
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <Link
          href="/vault"
          className="p-5 rounded-2xl bg-card border border-border-default hover:border-emerald-brand/50 transition-all shadow-card-soft cursor-pointer group block"
          title="Abrir el Banco de Contenidos"
        >
          <div className="flex items-center justify-between text-slate-muted text-xs font-medium">
            <span className="group-hover:text-emerald-brand font-semibold transition-colors">
              Banco de Contenidos (Vault)
            </span>
            <span className="text-emerald-brand bg-emerald-brand/10 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">
              54 ítems en 9 Bancos
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-white tabular-nums">54</span>
            <span className="text-xs text-slate-subtle font-mono">unidades universales</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-brand" />
              <span>Vocab, Oraciones, Slang...</span>
            </span>
            <span className="text-emerald-brand font-bold">Abrir Vault →</span>
          </div>
        </Link>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-card border border-border-default hover:border-border-subtle transition-all shadow-card-soft">
          <div className="flex items-center justify-between text-slate-muted text-xs font-medium">
            <span>Ventas & Suscripciones</span>
            <span className="text-emerald-brand bg-emerald-brand/10 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">
              Stripe
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-white tabular-nums">$6,480</span>
            <span className="text-xs text-slate-subtle font-mono">USD</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-brand" />
            <span>Cursos $19.99 + Mensual $9.99</span>
          </div>
        </div>
      </div>

      {/* Sección principal: Heatmap de Dificultad (8 cols) y Pipeline (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap de Dificultad (8 columnas) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-card border border-border-default space-y-5 shadow-card-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Heatmap de Dificultad en Puzzles & Juegos</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-dark/60 text-emerald-brand border border-emerald-brand/30 font-bold">
                  Algoritmo SRS
                </span>
              </h3>
              <p className="text-xs text-slate-muted mt-0.5">
                Términos con mayor tasa de error en &apos;WordMatch&apos; y &apos;WordMemory&apos;. Haz clic para generar refuerzo.
              </p>
            </div>
            <Link
              href="/vault"
              className="text-xs font-semibold text-emerald-brand hover:underline flex items-center gap-1 transition-colors"
            >
              <span>Ver todo el vocabulario</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Cuadrícula de 6 términos con tasa de error */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Término 1 */}
            <div className="p-3.5 rounded-xl bg-canvas border border-rose-500/30 hover:border-rose-500 transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                  thought
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  68% Fallos
                </span>
              </div>
              <p className="text-xs text-slate-muted mt-1">/θɔːt/ • Pasado irregular</p>
              <div className="mt-2.5 h-1.5 w-full bg-card rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: "68%" }} />
              </div>
            </div>

            {/* Término 2 */}
            <div className="p-3.5 rounded-xl bg-canvas border border-rose-500/30 hover:border-rose-500 transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                  through
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  62% Fallos
                </span>
              </div>
              <p className="text-xs text-slate-muted mt-1">/θruː/ • Preposición</p>
              <div className="mt-2.5 h-1.5 w-full bg-card rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: "62%" }} />
              </div>
            </div>

            {/* Término 3 */}
            <div className="p-3.5 rounded-xl bg-canvas border border-amber-500/30 hover:border-amber-500 transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  thorough
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  58% Fallos
                </span>
              </div>
              <p className="text-xs text-slate-muted mt-1">/ˈθʌr.ə/ • Adjetivo</p>
              <div className="mt-2.5 h-1.5 w-full bg-card rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "58%" }} />
              </div>
            </div>

            {/* Término 4 */}
            <div className="p-3.5 rounded-xl bg-canvas border border-amber-500/30 hover:border-amber-500 transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  get up
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  51% Fallos
                </span>
              </div>
              <p className="text-xs text-slate-muted mt-1">/ɡet ʌp/ • Phrasal Verb</p>
              <div className="mt-2.5 h-1.5 w-full bg-card rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "51%" }} />
              </div>
            </div>

            {/* Término 5 */}
            <div className="p-3.5 rounded-xl bg-canvas border border-border-default hover:border-border-subtle transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  schedule
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-card text-slate-muted border border-border-default">
                  47% Fallos
                </span>
              </div>
              <p className="text-xs text-slate-muted mt-1">US /ˈskedʒ.uːl/ vs UK /ˈʃedʒ.uːl/</p>
              <div className="mt-2.5 h-1.5 w-full bg-card rounded-full overflow-hidden">
                <div className="h-full bg-emerald-brand rounded-full" style={{ width: "47%" }} />
              </div>
            </div>

            {/* Término 6 */}
            <div className="p-3.5 rounded-xl bg-canvas border border-border-default hover:border-border-subtle transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  take off
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-card text-slate-muted border border-border-default">
                  42% Fallos
                </span>
              </div>
              <p className="text-xs text-slate-muted mt-1">/teɪk ɒf/ • Phrasal Verb</p>
              <div className="mt-2.5 h-1.5 w-full bg-card rounded-full overflow-hidden">
                <div className="h-full bg-emerald-brand rounded-full" style={{ width: "42%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline de Cursos Dinámico y Seguro (4 columnas) */}
        <div className="lg:col-span-4">
          <TeacherPipeline />
        </div>
      </div>
    </div>
  );
}
