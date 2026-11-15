"use client";

import { Users, Crown, UserCheck } from "lucide-react";
import { DashboardUserStats } from "@/services/api";

interface StudentKpisProps {
  stats?: DashboardUserStats | null;
  isLoading: boolean;
}

const KPI_CARDS = [
  {
    key: "students",
    label: "Total Alumnos",
    icon: Users,
    accent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    key: "subscription_students",
    label: "Suscripción Activa",
    icon: Crown,
    accent: "text-emerald-brand bg-emerald-brand/10 border-emerald-brand/20",
  },
  {
    key: "free_students",
    label: "Plan Gratuito",
    icon: UserCheck,
    accent: "text-slate-300 bg-slate-500/10 border-slate-500/20",
  },
] as const;

export function StudentKpis({ stats, isLoading }: StudentKpisProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
        {KPI_CARDS.map((card) => (
          <div
            key={card.key}
            className="p-4 rounded-2xl bg-card border border-border-default space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-slate-800/80" />
              <div className="w-8 h-8 rounded-xl bg-slate-800/70" />
            </div>
            <div className="h-7 w-16 rounded bg-slate-800/80" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {KPI_CARDS.map((card) => {
        const Icon = card.icon;
        const value = stats ? stats[card.key] : 0;

        return (
          <div
            key={card.key}
            className="p-4 rounded-2xl bg-card border border-border-default flex items-center justify-between shadow-sm"
          >
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-subtle">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-white tabular-nums">
                {value.toLocaleString("es-ES")}
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center ${card.accent}`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
