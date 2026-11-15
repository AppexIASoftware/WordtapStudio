"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  GitPullRequest,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import {
  getAdminContentReportsApi,
  getAdminCourseReviewsApi,
  getAdminDashboardApi,
} from "@/services/api";

export function ModeratorMetricsView() {
  const {
    data: dashboard,
    isLoading: isDashLoading,
    isError: isDashError,
  } = useQuery({
    queryKey: ["moderator", "dashboard"],
    queryFn: async () => {
      const res = await getAdminDashboardApi();
      if (res.error) throw new Error(res.error);
      return res.data;
    },
  });

  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useQuery({
    queryKey: ["moderator", "course-reviews", "pending"],
    queryFn: async () => {
      const res = await getAdminCourseReviewsApi();
      if (res.error) throw new Error(res.error);
      return res.data ?? [];
    },
  });

  const {
    data: reportsData,
    isLoading: isReportsLoading,
  } = useQuery({
    queryKey: ["moderator", "reports", "summary"],
    queryFn: async () => {
      const res = await getAdminContentReportsApi({ limit: 5, offset: 0 });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
  });

  const isLoading = isDashLoading || isReviewsLoading || isReportsLoading;
  const pendingReviews = reviewsData ?? [];
  const openReports = (reportsData?.items ?? []).filter(
    (r) => r.status === "open" || r.status === "reviewing"
  );
  const openReportsCount = reportsData?.total ?? openReports.length;

  const kpis = [
    {
      id: "pending-reviews",
      title: "Revisiones Pendientes",
      value: dashboard?.catalog?.in_review_courses ?? pendingReviews.length,
      sub: "cursos en cola",
      badge: pendingReviews.length > 0 ? "Prioridad" : "Al día",
      accent: "bg-amber-500/15 text-amber-400",
      dot: "bg-amber-400",
      footer: "Cola de aprobación pedagógica",
    },
    {
      id: "published-courses",
      title: "Cursos Publicados",
      value: dashboard?.catalog?.published_courses ?? 0,
      sub: `de ${dashboard?.catalog?.total_courses ?? 0} totales`,
      badge: "Catálogo",
      accent: "bg-emerald-brand/10 text-emerald-brand",
      dot: "bg-emerald-brand",
      footer: "Activos en app móvil",
    },
    {
      id: "vault-items",
      title: "Ítems en Content Vault",
      value: dashboard?.catalog?.total_vault_items ?? 0,
      sub: `${dashboard?.catalog?.total_games ?? 0} minijuegos`,
      badge: "Banco",
      accent: "bg-blue-500/15 text-blue-400",
      dot: "bg-blue-400",
      footer: "Vocabulario y fonética",
    },
    {
      id: "open-reports",
      title: "Reportes Abiertos",
      value: openReportsCount,
      sub: "incidencias",
      badge: openReportsCount > 0 ? "Triaje" : "Sin alertas",
      accent: "bg-rose-500/15 text-rose-400",
      dot: "bg-rose-400",
      footer: "Feedback desde app móvil",
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Consola de Calidad & Moderación
          </h1>
          <p className="text-sm text-slate-muted mt-1">
            Supervisión de revisiones pedagógicas, reportes de estudiantes y salud del catálogo.
          </p>
        </div>

        <Link
          href="/moderator/approvals"
          className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors flex items-center gap-1.5 shadow-sm self-start md:self-auto"
        >
          <GitPullRequest className="w-3.5 h-3.5" />
          <span>Ver Cola de Aprobaciones</span>
        </Link>
      </div>

      {(isDashError || isReviewsError) && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>No se pudieron cargar todas las métricas de moderación.</span>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-card border border-border-default space-y-4"
            >
              <div className="flex justify-between">
                <div className="h-3 w-28 rounded bg-border-default" />
                <div className="h-4 w-14 rounded-full bg-card-hover" />
              </div>
              <div className="h-8 w-16 rounded bg-border-default" />
              <div className="h-3 w-32 rounded bg-card-hover" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.id}
              className="p-5 rounded-2xl bg-card border border-border-default hover:border-blue-500/40 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-slate-muted text-xs font-medium">
                  <span>{kpi.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${kpi.accent}`}
                  >
                    {kpi.badge}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tight text-white tabular-nums">
                    {kpi.value}
                  </span>
                  <span className="text-xs text-slate-subtle font-mono">
                    {kpi.sub}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-muted pt-2 border-t border-border-default">
                <span className={`w-1.5 h-1.5 rounded-full ${kpi.dot}`} />
                <span>{kpi.footer}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-2xl bg-card border border-border-default space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Bandeja de Revisiones Prioritarias</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30">
                  {pendingReviews.length} Pendientes
                </span>
              </h3>
              <p className="text-xs text-slate-muted mt-0.5">
                Cursos enviados por docentes pendientes de revisión y publicación.
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

          {isReviewsLoading ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-20 rounded-xl bg-canvas border border-border-default"
                />
              ))}
            </div>
          ) : pendingReviews.length === 0 ? (
            <div className="p-8 rounded-xl bg-canvas border border-border-default text-center space-y-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-brand mx-auto" />
              <p className="text-xs font-semibold text-white">
                No hay cursos pendientes de revisión
              </p>
              <p className="text-[11px] text-slate-muted">
                La cola de aprobaciones está al día.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReviews.slice(0, 5).map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-canvas border border-border-default hover:border-blue-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {rev.course?.title || "Curso sin título"}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 font-bold">
                        En revisión
                      </span>
                    </div>
                    <p className="text-xs text-slate-muted">
                      Nivel: {rev.course?.level || "N/A"} • Autor:{" "}
                      {rev.instructor?.name || "Docente"}
                    </p>
                  </div>

                  <Link
                    href="/moderator/approvals"
                    className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                  >
                    <span>Auditar</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-card border border-border-default space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Reportes Recientes</span>
              </h4>
              <span className="text-[10px] font-mono text-blue-400">
                {openReportsCount} abiertos
              </span>
            </div>

            {openReports.length === 0 ? (
              <div className="p-4 rounded-xl bg-canvas border border-border-default text-center text-xs text-slate-muted">
                Sin incidencias abiertas reportadas desde la app.
              </div>
            ) : (
              <div className="space-y-2.5 text-xs">
                {openReports.slice(0, 3).map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3 rounded-xl bg-canvas border border-rose-500/30 space-y-1"
                  >
                    <p className="font-bold text-rose-400 truncate">
                      {rep.reason}
                    </p>
                    <p className="text-[11px] text-slate-muted line-clamp-2">
                      {rep.description || "Sin descripción adicional."}
                    </p>
                    <Link
                      href="/moderator/reports"
                      className="text-[11px] text-blue-400 hover:underline font-semibold block pt-1"
                    >
                      Ir a reportes &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/moderator/courses"
              className="w-full py-2.5 px-3 rounded-xl bg-card border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Supervisión & Playtest</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
