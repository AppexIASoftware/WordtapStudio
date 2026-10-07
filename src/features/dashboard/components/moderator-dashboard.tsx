"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  GitPullRequest,
  Clock,
  Zap,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export function ModeratorDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Banner de cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            Consola de Calidad & Moderación
          </h1>
          <p className="text-sm text-slate-muted mt-1">
            Bandeja abierta de revisión pedagógica, diffs visuales y aprobación directa (ADR-26, ADR-27).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>Cola Abierta (Self-Claim)</span>
          </span>
        </div>
      </div>

      {/* Tarjetas de métricas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-muted font-medium">Solicitudes en Cola</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <GitPullRequest size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">3</span>
            <span className="text-xs font-medium text-amber-400 ml-2">pendientes</span>
          </div>
          <p className="text-[11px] text-slate-subtle font-mono">Bandeja compartida de moderadores</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-muted font-medium">Mis Revisiones Activas</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Clock size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">1</span>
            <span className="text-xs font-medium text-blue-400 ml-2">PR-108 en curso</span>
          </div>
          <p className="text-[11px] text-slate-subtle font-mono">Reclamada por Lic. Elena Ramos</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-muted font-medium">Aprobadas este Mes</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-brand/10 border border-emerald-brand/20 flex items-center justify-center text-emerald-brand">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">28</span>
            <span className="text-xs font-medium text-emerald-brand ml-2">desplegados</span>
          </div>
          <p className="text-[11px] text-slate-subtle font-mono">Autoridad de deploy directo (ADR-27)</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-muted font-medium">Tiempo Medio de Revisión</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">4.2h</span>
            <span className="text-xs font-medium text-emerald-brand ml-2">SLO &lt; 24h</span>
          </div>
          <p className="text-[11px] text-slate-subtle font-mono">Feedback focalizado por tarjeta (ADR-26)</p>
        </div>
      </div>

      {/* Sección en 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Izquierda: Solicitudes de revisión pendientes */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border-default space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitPullRequest size={18} className="text-blue-400" />
              <h3 className="text-sm font-bold text-white">Solicitudes de Aprobación Pendientes</h3>
            </div>
            <Link
              href="/moderator/approvals"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Ver cola completa</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {/* Solicitud 1 */}
            <div className="p-4 rounded-xl bg-canvas border border-border-default hover:border-blue-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    PR-108
                  </span>
                  <h4 className="text-xs font-bold text-white">B1 Conversational Travel</h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-border-default text-slate-muted">
                    B1 Intermediate
                  </span>
                </div>
                <p className="text-[11px] text-slate-muted">
                  Autor: Prof. Mateo Silva • 12 tarjetas pedagógicas modificadas
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/moderator/approvals"
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors shadow-sm"
                >
                  Auditar Diff
                </Link>
              </div>
            </div>

            {/* Solicitud 2 */}
            <div className="p-4 rounded-xl bg-canvas border border-border-default hover:border-blue-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded border border-slate-500/20">
                    PR-109
                  </span>
                  <h4 className="text-xs font-bold text-white">Vocabulario Gastronómico A2</h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-border-default text-slate-muted">
                    A2 Elementary
                  </span>
                </div>
                <p className="text-[11px] text-slate-muted">
                  Autor: Lic. Javier Mendoza • 15 términos + audio neural
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/moderator/approvals"
                  className="px-3 py-1.5 rounded-xl bg-card border border-border-default text-slate-300 hover:text-white font-medium text-xs transition-colors"
                >
                  Reclamar
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Derecha: Reportes de incidencias de alumnos */}
        <div className="p-6 rounded-2xl bg-card border border-border-default space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-400" />
              <span>Reportes de Incidencias</span>
            </h3>
            <span className="text-[11px] font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              3 abiertos
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-canvas border border-border-default">
              <span className="text-xs font-bold text-white block">Pronunciación en /θ/</span>
              <p className="text-[11px] text-slate-muted mt-0.5">
                Alumno reportó síntesis robótica en audio neural de &apos;thought&apos;
              </p>
              <span className="text-[9px] font-mono text-slate-subtle block mt-1">Hace 2 horas</span>
            </div>

            <div className="p-3 rounded-xl bg-canvas border border-border-default">
              <span className="text-xs font-bold text-white block">Distractor ambiguo en Choice</span>
              <p className="text-[11px] text-slate-muted mt-0.5">
                Lección A1: Opciones &apos;see&apos; y &apos;watch&apos; válidas para la oración
              </p>
              <span className="text-[9px] font-mono text-slate-subtle block mt-1">Hace 4 horas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
