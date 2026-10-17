"use client";

import { Plus, Download } from "lucide-react";

interface ClassroomsHeaderProps {
  classroomsCount: number;
  mainTab: "cohorts" | "global";
  onTabChange: (tab: "cohorts" | "global") => void;
  onCreateClassroom: () => void;
  onExportCsv: () => void;
}

/** Encabezado institucional y barra de pestañas principal (Cohortes vs Global). */
export function ClassroomsHeader({
  classroomsCount,
  mainTab,
  onTabChange,
  onCreateClassroom,
  onExportCsv,
}: ClassroomsHeaderProps) {
  return (
    <>
      {/* Encabezado Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Aulas & Estudiantes
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
              Cohortes & Telemetría
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            Gestión de cohortes privadas mediante códigos de invitación y seguimiento del aprendizaje.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCreateClassroom}
            className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Crear Nueva Aula</span>
          </button>

          <button
            type="button"
            onClick={onExportCsv}
            className="px-3.5 py-2 rounded-xl bg-card border border-border-default hover:border-border-subtle text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Pestañas de Navegación Principal */}
      <div className="flex items-center justify-between border-b border-border-default pb-3">
        <div className="flex items-center gap-1 bg-card p-1 rounded-2xl border border-border-default text-xs font-medium">
          <button
            type="button"
            onClick={() => onTabChange("cohorts")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              mainTab === "cohorts"
                ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Aulas Privadas & Cohortes{" "}
            <span
              className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                mainTab === "cohorts" ? "bg-black/20 text-white" : "bg-card text-slate-300"
              }`}
            >
              {classroomsCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("global")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              mainTab === "global"
                ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Alumnos del Catálogo Global{" "}
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 ml-1">
              Demo
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
