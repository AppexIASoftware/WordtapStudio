"use client";

import {
  BookOpen,
  Crown,
  Gift,
  GraduationCap,
  Plus,
  Search,
  X,
  Layers,
} from "lucide-react";

interface CatalogHeaderProps {
  totalCourses: number;
  proCount: number;
  freeCount: number;
  teacherCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedLevel: string;
  onLevelChange: (lvl: string) => void;
  onOpenNewCourseModal: () => void;
}

const CEFR_LEVELS = ["Todos", "A1", "A2", "B1", "B2", "C1"] as const;

export function CatalogHeader({
  totalCourses,
  proCount,
  freeCount,
  teacherCount,
  searchQuery,
  onSearchChange,
  selectedLevel,
  onLevelChange,
  onOpenNewCourseModal,
}: CatalogHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Fila Principal: Título, Descripción y Botón Nuevo Curso */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-brand" />
              <span>Catálogo Global de Cursos</span>
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
              Modo Administrador
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-muted mt-1 leading-relaxed">
            Administración del currículo oficial de Wordtap y supervisión de cursos docentes.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewCourseModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Crear Nuevo Curso</span>
        </button>
      </div>

      {/* Fila de Métricas Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-card border border-border-default shadow-card-soft space-y-1">
          <div className="flex items-center justify-between text-slate-subtle text-[11px]">
            <span>Total Catálogo</span>
            <Layers className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="text-lg font-bold font-mono text-white block">
            {totalCourses}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-card border border-border-default shadow-card-soft space-y-1">
          <div className="flex items-center justify-between text-amber-200 text-[11px]">
            <span>Suscripción Pro</span>
            <Crown className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-lg font-bold font-mono text-amber-300 block">
            {proCount}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-card border border-border-default shadow-card-soft space-y-1">
          <div className="flex items-center justify-between text-emerald-200 text-[11px]">
            <span>Prueba Gratis</span>
            <Gift className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-lg font-bold font-mono text-emerald-300 block">
            {freeCount}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-card border border-border-default shadow-card-soft space-y-1">
          <div className="flex items-center justify-between text-purple-200 text-[11px]">
            <span>Cursos Docentes</span>
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <span className="text-lg font-bold font-mono text-purple-300 block">
            {teacherCount}
          </span>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-2.5 rounded-2xl bg-card border border-border-default flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Buscador */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar curso por título o autor..."
            className="w-full pl-8 pr-7 py-1.5 bg-canvas rounded-xl border border-border-default text-xs text-white placeholder:text-slate-muted focus:outline-none focus:border-emerald-brand font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-2 p-0.5 rounded text-slate-muted hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filtro por Nivel CEFR */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[10px] font-mono text-slate-subtle mr-1 hidden md:inline">
            Nivel:
          </span>
          {CEFR_LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl || (lvl === "Todos" && !selectedLevel);
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => onLevelChange(lvl === "Todos" ? "" : lvl)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-brand text-canvas shadow-xs"
                    : "bg-canvas text-slate-400 hover:text-white border border-border-default"
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
