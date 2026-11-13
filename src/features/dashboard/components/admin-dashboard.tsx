"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  BookOpen,
  ClipboardCheck,
  Layers,
  Activity,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { getAdminDashboardApi } from "@/services/api/dashboard";
import { AdminDashboardSkeleton } from "./admin-dashboard-skeleton";
import { TeacherDifficultyHeatmap } from "./teacher-difficulty-heatmap";

function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  if (Number.isNaN(diffMs) || diffMs < 60_000) return "hace un momento";
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

export function AdminDashboard() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await getAdminDashboardApi();
      if (res.error || !res.data) {
        throw new Error(res.error || "No se pudo cargar el dashboard.");
      }
      return res.data;
    },
    refetchInterval: 60_000,
  });

  const users = data?.users;
  const catalog = data?.catalog;
  const events = data?.recent_events ?? [];
  const totalPendingApprovals =
    (catalog?.pending_teacher_apps ?? 0) + (catalog?.in_review_courses ?? 0);
  const staffCount =
    (users?.instructors ?? 0) + (users?.moderators ?? 0) + (users?.admins ?? 0);
  const studentBase = Math.max(users?.students ?? 0, 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            Dashboard Ejecutivo & Gobernanza
          </h1>
          <p className="text-sm text-slate-muted mt-1">
            Métricas en tiempo real sincronizadas con MySQL: usuarios, catálogo, aprobaciones y actividad reciente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border-default text-xs font-medium text-slate-muted hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
            Actualizar
          </button>
          <span className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-bold">
            Consola Super Admin
          </span>
        </div>
      </div>

      {isLoading ? (
        <AdminDashboardSkeleton />
      ) : isError ? (
        <div className="p-6 rounded-2xl bg-card border border-red-500/30 text-sm text-red-400 flex items-center justify-between gap-4">
          <span>No se pudieron cargar las métricas desde WordtapAPI.</span>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-300 cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-muted font-medium">Usuarios del Ecosistema</span>
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Users size={16} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-white">
                  {(users?.total_users ?? 0).toLocaleString()}
                </span>
                <span className="text-xs font-medium text-blue-400 ml-2">
                  {users?.students ?? 0} alumnos
                </span>
              </div>
              <p className="text-[11px] text-slate-subtle font-mono">
                {users?.instructors ?? 0} docentes • {users?.moderators ?? 0} moderadores
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-muted font-medium">Cursos en Catálogo</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-brand/10 border border-emerald-brand/20 flex items-center justify-center text-emerald-brand">
                  <BookOpen size={16} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-white">
                  {catalog?.published_courses ?? 0}
                </span>
                <span className="text-xs font-medium text-emerald-brand ml-2">publicados</span>
              </div>
              <p className="text-[11px] text-slate-subtle font-mono">
                {catalog?.draft_courses ?? 0} borradores • {catalog?.total_courses ?? 0} totales
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-muted font-medium">Cola de Aprobaciones</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <ClipboardCheck size={16} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-white">{totalPendingApprovals}</span>
                <span className="text-xs font-medium text-amber-400 ml-2">pendientes</span>
              </div>
              <p className="text-[11px] text-slate-subtle font-mono">
                {catalog?.pending_teacher_apps ?? 0} docentes • {catalog?.in_review_courses ?? 0} cursos
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-muted font-medium">Contenido & Aulas</span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Layers size={16} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-white">
                  {catalog?.total_vault_items ?? 0}
                </span>
                <span className="text-xs font-medium text-purple-400 ml-2">ítems Vault</span>
              </div>
              <p className="text-[11px] text-slate-subtle font-mono">
                {catalog?.total_games ?? 0} juegos • {catalog?.total_classrooms ?? 0} aulas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border-default space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-brand" />
                  <span>Distribución de Cuentas y Estado Operativo</span>
                </h3>
                <Link
                  href="/admin/roles"
                  className="text-xs text-emerald-brand hover:underline font-semibold"
                >
                  Gestionar Roles →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-canvas rounded-xl border border-border-default text-center">
                  <span className="text-[11px] text-slate-subtle font-mono block">Alumnos Free</span>
                  <strong className="text-lg text-white font-black mt-1 block">
                    {users?.free_students ?? 0}
                  </strong>
                  <span className="text-[10px] text-slate-muted">
                    {Math.round(((users?.free_students ?? 0) / studentBase) * 100)}% alumnos
                  </span>
                </div>

                <div className="p-3.5 bg-canvas rounded-xl border border-border-default text-center">
                  <span className="text-[11px] text-slate-subtle font-mono block">Por Curso</span>
                  <strong className="text-lg text-emerald-brand font-black mt-1 block">
                    {users?.course_students ?? 0}
                  </strong>
                  <span className="text-[10px] text-slate-muted">acceso individual</span>
                </div>

                <div className="p-3.5 bg-canvas rounded-xl border border-border-default text-center">
                  <span className="text-[11px] text-slate-subtle font-mono block">Suscripción</span>
                  <strong className="text-lg text-blue-400 font-black mt-1 block">
                    {users?.subscription_students ?? 0}
                  </strong>
                  <span className="text-[10px] text-slate-muted">plan activo</span>
                </div>

                <div className="p-3.5 bg-canvas rounded-xl border border-border-default text-center">
                  <span className="text-[11px] text-slate-subtle font-mono block">Staff & Docentes</span>
                  <strong className="text-lg text-purple-400 font-black mt-1 block">
                    {staffCount}
                  </strong>
                  <span className="text-[10px] text-slate-muted">
                    {users?.admins ?? 0} admin • {users?.moderators ?? 0} mod
                  </span>
                </div>
              </div>

              {/* Desglose del Catálogo y Accesos Rápidos */}
              <div className="pt-2 border-t border-border-default/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-canvas border border-border-default space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Estado del Catálogo</span>
                    <span className="text-[11px] font-mono text-slate-muted">
                      {catalog?.total_courses ?? 0} cursos
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-card overflow-hidden flex">
                    <div
                      className="bg-emerald-brand transition-all"
                      style={{
                        width: `${Math.round(((catalog?.published_courses ?? 0) / Math.max(catalog?.total_courses ?? 0, 1)) * 100)}%`,
                      }}
                    />
                    <div
                      className="bg-amber-400 transition-all"
                      style={{
                        width: `${Math.round(((catalog?.in_review_courses ?? 0) / Math.max(catalog?.total_courses ?? 0, 1)) * 100)}%`,
                      }}
                    />
                    <div
                      className="bg-slate-500 transition-all"
                      style={{
                        width: `${Math.round(((catalog?.draft_courses ?? 0) / Math.max(catalog?.total_courses ?? 0, 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-muted font-mono">
                    <span className="text-emerald-brand">{catalog?.published_courses ?? 0} publicados</span>
                    <span className="text-amber-400">{catalog?.in_review_courses ?? 0} revisión</span>
                    <span>{catalog?.draft_courses ?? 0} borradores</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-canvas border border-border-default flex flex-col justify-between gap-2.5">
                  <span className="text-xs font-semibold text-white">Accesos Directos</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-medium">
                    <Link
                      href="/admin/approvals"
                      className="px-2.5 py-1.5 rounded-lg bg-card border border-border-default hover:border-amber-400/50 text-slate-200 flex items-center justify-between"
                    >
                      <span>Aprobaciones</span>
                      <span className="text-amber-400 font-mono">{totalPendingApprovals}</span>
                    </Link>
                    <Link
                      href="/admin/courses"
                      className="px-2.5 py-1.5 rounded-lg bg-card border border-border-default hover:border-emerald-brand/50 text-slate-200 flex items-center justify-between"
                    >
                      <span>Catálogo</span>
                      <span className="text-emerald-brand font-mono">{catalog?.published_courses ?? 0}</span>
                    </Link>
                    <Link
                      href="/admin/vault"
                      className="px-2.5 py-1.5 rounded-lg bg-card border border-border-default hover:border-purple-400/50 text-slate-200 flex items-center justify-between"
                    >
                      <span>Content Vault</span>
                      <span className="text-purple-400 font-mono">{catalog?.total_vault_items ?? 0}</span>
                    </Link>
                    <Link
                      href="/admin/students"
                      className="px-2.5 py-1.5 rounded-lg bg-card border border-border-default hover:border-blue-400/50 text-slate-200 flex items-center justify-between"
                    >
                      <span>Alumnos</span>
                      <span className="text-blue-400 font-mono">{users?.students ?? 0}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border-default space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity size={16} className="text-purple-400" />
                  <span>Actividad Reciente (MySQL)</span>
                </h3>
                <Link href="/admin/audit" className="text-xs text-purple-400 hover:underline">
                  Ver log
                </Link>
              </div>

              {events.length === 0 ? (
                <div className="p-4 rounded-xl bg-canvas border border-border-default text-center text-xs text-slate-muted">
                  Aún no hay eventos registrados en la base de datos.
                </div>
              ) : (
                <div className="space-y-2 text-xs font-mono">
                  {events.slice(0, 4).map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2.5 rounded-xl bg-canvas border border-border-default"
                    >
                      <div className="flex items-center justify-between text-slate-subtle text-[10px]">
                        <span className="truncate pr-2">{ev.action}</span>
                        <span className="shrink-0">{formatRelativeTime(ev.created_at)}</span>
                      </div>
                      <p className="text-slate-200 mt-1 text-[11px]">{ev.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <TeacherDifficultyHeatmap />
    </div>
  );
}
