"use client";

import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  GitPullRequest,
  Smartphone,
} from "lucide-react";
import { MODERATOR_KPIS, MODERATOR_PRS_DATA } from "../data/mock-moderator-data";

export function ModeratorMetricsView() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Banner de Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              Consola de Calidad & Moderación
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              ADR-27 Autoridad Plena
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            Bandeja abierta de revisión pedagógica, diffs visuales y aprobación directa para despliegue en app móvil.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Link
            href="/moderator/approvals"
            className="px-3.5 py-2 rounded-xl bg-blue-500 text-white font-bold text-xs hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>Ver Cola de Aprobaciones</span>
          </Link>
        </div>
      </div>

      {/* Cuadrícula de KPIs de Calidad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MODERATOR_KPIS.map((kpi) => (
          <div
            key={kpi.id}
            className="p-5 rounded-2xl bg-card border border-border-default hover:border-blue-500/40 transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-slate-muted text-xs font-medium">
                <span>{kpi.title}</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    kpi.badgeVariant === "blue"
                      ? "bg-blue-500/20 text-blue-300"
                      : kpi.badgeVariant === "mint"
                      ? "bg-mint-brand/10 text-mint-brand"
                      : kpi.badgeVariant === "amber"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-emerald-brand/10 text-emerald-brand"
                  }`}
                >
                  {kpi.badgeText}
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-white tabular-nums">
                  {kpi.value}
                </span>
                <span className="text-xs text-slate-subtle font-mono">{kpi.subValue}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-muted pt-2 border-t border-border-default">
              <span className={`w-1.5 h-1.5 rounded-full ${kpi.footerDotColor}`} />
              <span>{kpi.footerText}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sección en 2 columnas: Revisiones Prioritarias vs Alertas de Calidad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna 1: Solicitudes en Cola Prioritaria (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-card border border-border-default space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Bandeja de Revisiones Prioritarias</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  2 Pendientes
                </span>
              </h3>
              <p className="text-xs text-slate-muted mt-0.5">
                Cursos y lecciones enviados por docentes que esperan auditoría de pronunciación y jugabilidad.
              </p>
            </div>
            <Link
              href="/moderator/approvals"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {MODERATOR_PRS_DATA.filter((p) => p.status !== "approved").map((pr) => (
              <div
                key={pr.id}
                className="p-4 rounded-xl bg-canvas border border-border-default hover:border-blue-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-mint-brand">{pr.id}</span>
                    <span className="text-xs font-bold text-white">{pr.title}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        pr.status === "in_review"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {pr.statusLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Autor: <strong>{pr.author}</strong> • Espera: {pr.waitHours} • {pr.changesCount}
                  </p>
                  <p className="text-[11px] text-slate-muted">{pr.summary}</p>
                </div>

                <Link
                  href="/moderator/approvals"
                  className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500 hover:text-white text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0"
                >
                  <span>Auditar Diff</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Columna 2: Alertas de Calidad Pedagógica (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-card border border-border-default space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Alertas de Calidad</span>
              </h4>
              <span className="text-[10px] font-mono text-blue-400">SLA 24 Horas</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-canvas border border-rose-500/30 space-y-1">
                <div className="flex items-center justify-between text-rose-300 font-bold">
                  <span>Reporte Estudiante Urgente</span>
                  <span className="text-[10px] font-mono">REP-301</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Audio neural de <em>&apos;schedule&apos;</em> confuso en A1 Lección 1.
                </p>
                <Link
                  href="/moderator/reports"
                  className="text-[11px] text-rose-400 hover:underline font-semibold block pt-1"
                >
                  Ir a mesa de triaje &rarr;
                </Link>
              </div>

              <div className="p-3 rounded-xl bg-canvas border border-amber-500/30 space-y-1">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <span>Pares Mínimos Pendientes</span>
                  <span className="text-[10px] font-mono">PR-108</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Falta transcripción IPA contrastada en lección 3 de Mateo Silva.
                </p>
                <Link
                  href="/moderator/approvals"
                  className="text-[11px] text-amber-300 hover:underline font-semibold block pt-1"
                >
                  Auditar cambios propuestos &rarr;
                </Link>
              </div>
            </div>

            <Link
              href="/moderator/courses"
              className="w-full py-2.5 px-3 rounded-xl bg-card border border-blue-500/40 text-blue-300 hover:bg-blue-500/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer block text-center"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulador Playtest Móvil</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
