"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TeacherKpiGrid } from "@/features/teacher-dashboard/components/teacher-kpi-grid";
import { TeacherDifficultyHeatmap } from "@/features/teacher-dashboard/components/teacher-difficulty-heatmap";
import { TeacherPipeline } from "@/features/teacher-dashboard/components/teacher-pipeline";

export default function TeacherDashboardPage() {
  const [period, setPeriod] = useState<"today" | "7d" | "30d" | "year">("7d");
  const router = useRouter();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Banner de encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            Dashboard de Aprendizaje
          </h1>
          <p className="text-sm text-slate-muted mt-1">
            Monitoreo en tiempo real de retención, rendimiento en juegos y pipeline de cursos.
          </p>
        </div>

        {/* Pestañas de filtro de tiempo */}
        <div className="flex items-center gap-1 p-1 bg-card rounded-xl border border-border-default text-xs font-mono">
          <button
            type="button"
            onClick={() => setPeriod("today")}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              period === "today"
                ? "bg-canvas text-emerald-brand font-bold border border-border-default shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => setPeriod("7d")}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              period === "7d"
                ? "bg-canvas text-emerald-brand font-bold border border-border-default shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            7 Días
          </button>
          <button
            type="button"
            onClick={() => setPeriod("30d")}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              period === "30d"
                ? "bg-canvas text-emerald-brand font-bold border border-border-default shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            30 Días
          </button>
          <button
            type="button"
            onClick={() => setPeriod("year")}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              period === "year"
                ? "bg-canvas text-emerald-brand font-bold border border-border-default shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Año
          </button>
        </div>
      </div>

      {/* Cuadrícula de tarjetas KPI */}
      <TeacherKpiGrid />

      {/* Sección de mapa de calor y pipeline de cursos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <TeacherDifficultyHeatmap />
        </div>
        <div className="lg:col-span-4">
          <TeacherPipeline onNewCourse={() => router.push("/teacher/builder")} />
        </div>
      </div>
    </div>
  );
}

