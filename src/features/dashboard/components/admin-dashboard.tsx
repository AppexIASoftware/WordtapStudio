"use client";

import React from "react";
import Link from "next/link";
import {
  DollarSign,
  Wallet,
  Users,
  BarChart3,
  Activity,
  TrendingUp,
} from "lucide-react";

export function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Banner de cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            Dashboard Ejecutivo & Gobernanza
          </h1>
          <p className="text-sm text-slate-muted mt-1">
            Supervisión global de monetización, split 70/30, telemetría publicitaria y seguridad RBAC.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-bold">
            Consola Super Admin
          </span>
        </div>
      </div>

      {/* Tarjetas de métricas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Métrica 1 */}
        <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-muted font-medium">Ingresos Brutos Stripe</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-brand/10 border border-emerald-brand/20 flex items-center justify-center text-emerald-brand">
              <DollarSign size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">$18,450</span>
            <span className="text-xs font-medium text-emerald-brand ml-2">↑ +18.5%</span>
          </div>
          <p className="text-[11px] text-slate-subtle font-mono">Mes en curso • Stripe Connect</p>
        </div>

        {/* Métrica 2 */}
        <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-muted font-medium">Split Docente (70%)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Wallet size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">$12,915</span>
            <span className="text-xs font-medium text-purple-400 ml-2">70% neto</span>
          </div>
          <p className="text-[11px] text-slate-subtle font-mono">Retención plataforma 30%: $5,535</p>
        </div>

        {/* Métrica 3 */}
        <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-muted font-medium">Usuarios Activos Ecosistema</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">4,280</span>
            <span className="text-xs font-medium text-blue-400 ml-2">alumnos</span>
          </div>
          <p className="text-[11px] text-slate-subtle font-mono">72% Free • 28% Suscriptores</p>
        </div>

        {/* Métrica 4 */}
        <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-muted font-medium">AdMob eCPM Promedio</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <BarChart3 size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">$2.45</span>
            <span className="text-xs font-medium text-amber-400 ml-2">94% fill</span>
          </div>
          <p className="text-[11px] text-slate-subtle font-mono">Frecuencia: 3 partidas / anuncio</p>
        </div>
      </div>

      {/* Sección en 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Izquierda: Desglose de monetización */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border-default space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-brand" />
              <span>Distribución de Monetización (4 Tiers)</span>
            </h3>
            <Link
              href="/admin/monetization"
              className="text-xs text-emerald-brand hover:underline font-semibold"
            >
              Configurar Pasarelas →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-canvas rounded-xl border border-border-default text-center">
              <span className="text-[11px] text-slate-subtle font-mono block">Free (AdMob)</span>
              <strong className="text-lg text-white font-black mt-1 block">3,080</strong>
              <span className="text-[10px] text-slate-muted">72% cuota</span>
            </div>

            <div className="p-3.5 bg-canvas rounded-xl border border-border-default text-center">
              <span className="text-[11px] text-slate-subtle font-mono block">Trial 7d ($0 hold)</span>
              <strong className="text-lg text-emerald-brand font-black mt-1 block">600</strong>
              <span className="text-[10px] text-slate-muted">14% conversión</span>
            </div>

            <div className="p-3.5 bg-canvas rounded-xl border border-border-default text-center">
              <span className="text-[11px] text-slate-subtle font-mono block">Mensual ($9.99)</span>
              <strong className="text-lg text-blue-400 font-black mt-1 block">470</strong>
              <span className="text-[10px] text-slate-muted">11% activos</span>
            </div>

            <div className="p-3.5 bg-canvas rounded-xl border border-border-default text-center">
              <span className="text-[11px] text-slate-subtle font-mono block">Vitalicio ($19)</span>
              <strong className="text-lg text-purple-400 font-black mt-1 block">130</strong>
              <span className="text-[10px] text-slate-muted">3% compras</span>
            </div>
          </div>
        </div>

        {/* Derecha: Registro de auditoría en tiempo real */}
        <div className="p-6 rounded-2xl bg-card border border-border-default space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-purple-400" />
              <span>Eventos de Auditoría en Vivo</span>
            </h3>
            <Link href="/admin/audit" className="text-xs text-purple-400 hover:underline">
              Ver log
            </Link>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-canvas border border-border-default">
              <div className="flex items-center justify-between text-slate-subtle text-[10px]">
                <span>auth.login</span>
                <span>hace 4 min</span>
              </div>
              <span className="text-slate-200 mt-1 block text-[11px]">
                Prof. Mateo Silva inició sesión desde IP 192.168.1.42
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-canvas border border-border-default">
              <div className="flex items-center justify-between text-slate-subtle text-[10px]">
                <span>course.deploy</span>
                <span>hace 18 min</span>
              </div>
              <span className="text-emerald-brand mt-1 block text-[11px]">
                Lic. Elena Ramos publicó curso &apos;B1 Travel&apos; a prod
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-canvas border border-border-default">
              <div className="flex items-center justify-between text-slate-subtle text-[10px]">
                <span>rbac.policy_update</span>
                <span>hace 1 hora</span>
              </div>
              <span className="text-purple-400 mt-1 block text-[11px]">
                Admin Carlos Morales actualizó matriz de permisos
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
