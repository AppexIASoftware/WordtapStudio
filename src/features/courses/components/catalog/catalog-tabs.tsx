"use client";

import { Crown, GraduationCap } from "lucide-react";

interface CatalogTabsProps {
  activeTab: "platform" | "teacher";
  onChangeTab: (tab: "platform" | "teacher") => void;
  platformCount: number;
  teacherCount: number;
}

export function CatalogTabs({
  activeTab,
  onChangeTab,
  platformCount,
  teacherCount,
}: CatalogTabsProps) {
  return (
    <div className="flex items-center gap-2 border-b border-border-default pb-3">
      {/* Pestaña: Cursos de Plataforma */}
      <button
        type="button"
        onClick={() => onChangeTab("platform")}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
          activeTab === "platform"
            ? "bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-sm"
            : "bg-canvas border border-border-default text-slate-400 hover:text-white hover:border-slate-700"
        }`}
      >
        <Crown className={`w-3.5 h-3.5 ${activeTab === "platform" ? "text-amber-400" : "text-slate-400"}`} />
        <span>Cursos de Plataforma (Wordtap Core)</span>
        <span
          className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] font-bold ${
            activeTab === "platform"
              ? "bg-amber-500/30 text-amber-200"
              : "bg-card text-slate-400"
          }`}
        >
          {platformCount}
        </span>
      </button>

      {/* Pestaña: Cursos de Docentes */}
      <button
        type="button"
        onClick={() => onChangeTab("teacher")}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
          activeTab === "teacher"
            ? "bg-emerald-brand/15 border border-emerald-brand/40 text-emerald-300 shadow-sm"
            : "bg-canvas border border-border-default text-slate-400 hover:text-white hover:border-slate-700"
        }`}
      >
        <GraduationCap className={`w-3.5 h-3.5 ${activeTab === "teacher" ? "text-emerald-brand" : "text-slate-400"}`} />
        <span>Cursos de Docentes (Supervisión)</span>
        <span
          className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] font-bold ${
            activeTab === "teacher"
              ? "bg-emerald-brand/30 text-emerald-200"
              : "bg-card text-slate-400"
          }`}
        >
          {teacherCount}
        </span>
      </button>
    </div>
  );
}
