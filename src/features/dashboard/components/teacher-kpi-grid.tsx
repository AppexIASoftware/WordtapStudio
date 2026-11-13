"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getTeacherDashboardApi,
  TeacherDashboardData,
  TeacherDashboardPeriod,
} from "@/services/api";

interface TeacherKpiGridProps {
  period: TeacherDashboardPeriod;
}

interface KpiCardItem {
  id: string;
  title: string;
  badgeText: string;
  badgeVariant: "emerald" | "mint";
  value: string;
  subValue: string;
  footerDotColor: string;
  footerText: string;
  actionText?: string;
  href?: string;
}

function buildCards(data: TeacherDashboardData): KpiCardItem[] {
  const revenueUsd = (data.revenue_cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: data.revenue_cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return [
    {
      id: "kpi-active-students",
      title: "Alumnos Activos",
      badgeText: data.period === "today" ? "Hoy" : data.period.toUpperCase(),
      badgeVariant: "emerald",
      value: data.active_students.toLocaleString("en-US"),
      subValue: "estudiantes",
      footerDotColor: "bg-emerald-brand",
      footerText: `Racha promedio: ${data.avg_streak_days.toFixed(1)} días`,
    },
    {
      id: "kpi-retention",
      title: "Retención Activa",
      badgeText: `${data.total_students} totales`,
      badgeVariant: "mint",
      value: `${data.retention_percent.toFixed(1)}%`,
      subValue: "sobre alumnos",
      footerDotColor: "bg-mint-brand",
      footerText: "Actividad registrada en el período",
    },
    {
      id: "kpi-vault",
      title: "Banco de Contenidos (Vault)",
      badgeText: `${data.vault_items} ítems en ${data.vault_banks} Bancos`,
      badgeVariant: "emerald",
      value: String(data.vault_items),
      subValue: "unidades disponibles",
      footerDotColor: "bg-emerald-brand",
      footerText: "Catálogo oficial y propio",
      actionText: "Abrir Vault →",
      href: "/teacher/vault",
    },
    {
      id: "kpi-revenue",
      title: "Ventas & Suscripciones",
      badgeText: `${data.active_subscriptions} suscrip. activas`,
      badgeVariant: "emerald",
      value: `$${revenueUsd}`,
      subValue: "USD",
      footerDotColor: "bg-emerald-brand",
      footerText: `${data.paid_orders} órdenes pagadas en período`,
    },
  ];
}

export function TeacherKpiGrid({ period }: TeacherKpiGridProps) {
  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    getTeacherDashboardApi(period).then((res) => {
      if (!active) return;
      if (res.data) setData(res.data);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [period]);

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-card border border-border-default space-y-3 h-[136px]"
          >
            <div className="h-3.5 w-28 rounded bg-slate-800/80" />
            <div className="h-8 w-24 rounded bg-slate-800" />
            <div className="h-3 w-36 rounded bg-slate-800/60" />
          </div>
        ))}
      </div>
    );
  }

  const cards = buildCards(data);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((kpi) => {
        const content = (
          <div
            className={`p-5 rounded-2xl bg-card border transition-all shadow-sm h-full flex flex-col justify-between ${
              kpi.href
                ? "border-border-default hover:border-emerald-brand/50 cursor-pointer group"
                : "border-border-default hover:border-border-subtle"
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-slate-muted text-xs font-medium">
                <span
                  className={
                    kpi.href
                      ? "group-hover:text-emerald-brand font-semibold transition-colors"
                      : ""
                  }
                >
                  {kpi.title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    kpi.badgeVariant === "mint"
                      ? "text-mint-brand bg-mint-brand/10"
                      : "text-emerald-brand bg-emerald-brand/10"
                  }`}
                >
                  {kpi.badgeText}
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-white tabular-nums">
                  {kpi.value}
                </span>
                <span
                  className={`text-xs font-mono ${
                    kpi.badgeVariant === "mint"
                      ? "text-emerald-brand font-medium"
                      : "text-slate-subtle"
                  }`}
                >
                  {kpi.subValue}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-muted">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${kpi.footerDotColor}`}
                />
                <span>{kpi.footerText}</span>
              </div>
              {kpi.actionText && (
                <span className="text-emerald-brand font-bold group-hover:underline">
                  {kpi.actionText}
                </span>
              )}
            </div>
          </div>
        );

        if (kpi.href) {
          return (
            <Link key={kpi.id} href={kpi.href} className="block">
              {content}
            </Link>
          );
        }

        return <div key={kpi.id}>{content}</div>;
      })}
    </div>
  );
}
