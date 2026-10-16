"use client";

import { Sparkles, Calculator, PlayCircle } from "lucide-react";

export type GamificationFilter = "custom" | "archetypes" | "simulator";

interface GamificationFilterBarProps {
  activeFilter: GamificationFilter;
  onChangeFilter: (f: GamificationFilter) => void;
  customCount: number;
}

export function GamificationFilterBar({
  activeFilter,
  onChangeFilter,
  customCount,
}: GamificationFilterBarProps) {
  const tabs: { id: GamificationFilter; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "custom",
      label: `Mis Actividades (${customCount})`,
      icon: <Sparkles className="w-3.5 h-3.5 text-mint-brand" />,
    },
    {
      id: "archetypes",
      label: "Plantillas Demo (12)",
      icon: <PlayCircle className="w-3.5 h-3.5 text-amber-300" />,
      badge: "Demo",
    },
    {
      id: "simulator",
      label: "Calibrador de Repaso",
      icon: <Calculator className="w-3.5 h-3.5 text-emerald-brand" />,
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-default pb-4">
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChangeFilter(t.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeFilter === t.id
                ? "bg-emerald-brand text-canvas shadow-sm"
                : "bg-card border border-border-default text-slate-300 hover:text-white"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.badge && (
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                  activeFilter === t.id
                    ? "bg-canvas/30 text-white"
                    : t.badge === "Demo"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-mint-brand/20 text-mint-brand border border-mint-brand/30"
                }`}
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <span className="text-xs text-slate-muted flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-brand animate-pulse" />
        Entorno de pruebas y calibración listo
      </span>
    </div>
  );
}
