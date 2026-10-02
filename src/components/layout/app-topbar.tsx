"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/auth-context";
import { Search, Menu, Smartphone } from "lucide-react";

interface AppTopbarProps {
  onToggleMobile?: () => void;
}

export function AppTopbar({ onToggleMobile }: AppTopbarProps) {
  const { currentRole } = useAuth();
  const isModerator = currentRole === "moderator";
  const isAdmin = currentRole === "admin";

  return (
    <header className="h-14 bg-card/80 backdrop-blur border-b border-border-default flex items-center justify-between px-3 md:px-6 z-20 flex-shrink-0 gap-2">
      {/* Izquierda: Menú móvil y buscador omnibox */}
      <div className="flex items-center gap-2 md:gap-3 flex-1 max-w-md min-w-0">
        {onToggleMobile && (
          <button
            type="button"
            onClick={onToggleMobile}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-card-hover border border-border-default transition-colors flex-shrink-0 cursor-pointer"
            title="Abrir Navegación"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="relative w-full cursor-pointer min-w-0 overflow-hidden">
          <div className="w-full pl-9 pr-3 md:pr-8 py-1.5 bg-canvas rounded-xl border border-border-default text-xs text-slate-subtle flex items-center justify-between hover:border-border-subtle transition-colors truncate">
            <span className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">
                {isModerator
                  ? "Buscar en cola de PRs, reportes o vault..."
                  : isAdmin
                  ? "Buscar configuraciones, usuarios o auditoría..."
                  : "Buscar lecciones, cursos o alumnos..."}
              </span>
            </span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-card border border-border-default text-[10px] font-mono text-slate-muted flex-shrink-0">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Derecha: Estado, indicador de rol y acciones */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-subtle font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              isModerator ? "bg-blue-400" : isAdmin ? "bg-purple-400" : "bg-emerald-brand"
            }`}
          />
          <span>{isModerator ? "SLA < 24h activo" : isAdmin ? "Modo Root Activo" : "Autoguardado activo"}</span>
        </div>

        {/* Indicador de rol en barra superior */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-mono text-xs font-bold ${
            isModerator
              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              : isAdmin
              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
              : "bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/20"
          }`}
          title={isModerator ? "Consola de Moderación Activa" : isAdmin ? "Consola de Gobernanza Activa" : "Portal Docente Activo"}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              isModerator ? "bg-blue-400" : isAdmin ? "bg-purple-400" : "bg-emerald-brand"
            }`}
          />
          <span>{isModerator ? "Consola Moderación" : isAdmin ? "Super Admin" : "Modo Docente"}</span>
        </div>

        <div className="h-4 w-px bg-border-default hidden sm:block" />

        {/* Acceso rápido a simulador móvil */}
        <Link
          href={isModerator ? "/moderator/courses" : "/teacher/builder"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border text-xs font-semibold transition-colors shadow-sm cursor-pointer ${
            isModerator
              ? "border-blue-500/40 text-blue-300 hover:bg-blue-500/10"
              : "border-emerald-brand/40 text-emerald-brand hover:bg-emerald-brand/10"
          }`}
          title="Abrir Simulador de Playtest Móvil"
        >
          <Smartphone
            className={`w-3.5 h-3.5 ${
              isModerator ? "text-blue-400" : "text-emerald-brand"
            }`}
          />
          <span className="hidden md:inline">Playtest Móvil</span>
        </Link>
      </div>
    </header>
  );
}
