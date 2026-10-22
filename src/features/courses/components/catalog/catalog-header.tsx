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
  CheckCircle2,
} from "lucide-react";

interface CatalogHeaderProps {
  totalCourses: number;
  publishedCount: number;
  platformPublishedCount: number;
  teacherPublishedCount: number;
  proCount: number;
  freeCount: number;
  teacherCount: number;
  tabTotal: number;
  tabPublishedCount: number;
  tabDraftCount: number;
  tabInReviewCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedLevel: string;
  onLevelChange: (lvl: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onOpenNewCourseModal: () => void;
}

const CEFR_LEVELS = ["Todos", "A1", "A2", "B1", "B2", "C1"] as const;

export function CatalogHeader({
  totalCourses,
  publishedCount,
  platformPublishedCount,
  teacherPublishedCount,
  proCount,
  freeCount,
  teacherCount,
  tabTotal,
  tabPublishedCount,
  tabDraftCount,
  tabInReviewCount,
  searchQuery,
  onSearchChange,
  selectedLevel,
  onLevelChange,
  selectedStatus,
  onStatusChange,
  onOpenNewCourseModal,
}: CatalogHeaderProps) {
  const STATUS_FILTERS = [
    { id: "", label: "Todos", count: tabTotal },
    { id: "published", label: "Publicados (Live)", count: tabPublishedCount },
    { id: "draft", label: "Borradores", count: tabDraftCount },
    { id: "in_review", label: "En Revisión", count: tabInReviewCount },
  ] as const;

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

      {/* Fila de Métricas Rápidas: 5 columnas */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded-2xl bg-card border border-border-default shadow-card-soft space-y-1">
          <div className="flex items-center justify-between text-slate-subtle text-[11px]">
            <span>Total Catálogo</span>
            <Layers className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="text-lg font-bold font-mono text-white block">
            {totalCourses}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-card border border-emerald-500/30 bg-emerald-500/5 shadow-card-soft space-y-1">
          <div className="flex items-center justify-between text-emerald-300 text-[11px] font-semibold">
            <span>Publicados (Live)</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-lg font-bold font-mono text-emerald-300 block">
              {publishedCount}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {platformPublishedCount} plat • {teacherPublishedCount} doc
            </span>
          </div>
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
      <div className="p-2.5 rounded-2xl bg-card border border-border-default flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
        {/* Buscador */}
        <div className="relative flex-1 max-w-sm">
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

        {/* Filtros: Estado & Nivel */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filtro por Estado contextual a la pestaña actual */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <span className="text-[10px] font-mono text-slate-subtle mr-1 hidden sm:inline">
              Estado:
            </span>
            {STATUS_FILTERS.map((st) => {
              const isSelected = selectedStatus === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onStatusChange(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? st.id === "published"
                        ? "bg-emerald-brand text-canvas shadow-xs"
                        : "bg-slate-200 text-canvas font-extrabold shadow-xs"
                      : "bg-canvas text-slate-400 hover:text-white border border-border-default"
                  }`}
                >
                  {st.id === "published" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  <span>{st.label}</span>
                  <span
                    className={`text-[9px] font-mono px-1 rounded-full ${
                      isSelected
                        ? "bg-canvas/30 text-canvas"
                        : "bg-card text-slate-400"
                    }`}
                  >
                    {st.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-border-default hidden sm:block" />

          {/* Filtro por Nivel CEFR */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <span className="text-[10px] font-mono text-slate-subtle mr-1 hidden sm:inline">
              Nivel:
            </span>
            {CEFR_LEVELS.map((lvl) => {
              const isSelected = selectedLevel === lvl || (lvl === "Todos" && !selectedLevel);
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onLevelChange(lvl === "Todos" ? "" : lvl)}
                  className={`px-2 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
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
    </div>
  );
}
