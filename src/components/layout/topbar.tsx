"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { useTheme } from "@/hooks/use-theme";
import { checkApiHealth } from "@/lib/api-client";
import { Search, Sun, Moon, Menu } from "lucide-react";

interface TopbarProps {
  onOpenDemoModal?: () => void;
  onToggleMobileMenu?: () => void;
}

export function Topbar({ onToggleMobileMenu }: TopbarProps) {
  const { currentRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  const isModerator = currentRole === "moderator";
  const isAdmin = currentRole === "admin";
  const searchPlaceholder = isModerator
    ? "Buscar en cola de PRs, reportes o vault..."
    : isAdmin
    ? "Buscar configuraciones, usuarios o auditoría..."
    : "Buscar lecciones, cursos o alumnos...";

  useEffect(() => {
    // Verificar conexión hacia WordtapAPI
    checkApiHealth().then((res) => {
      setApiConnected(res.connected);
    });
  }, []);

  return (
    <header className="h-14 bg-card/80 backdrop-blur border-b border-border-default flex items-center justify-between px-3 md:px-6 z-20 flex-shrink-0 gap-2">
      {/* Izquierda: Menú móvil y buscador omnibox */}
      <div className="flex items-center gap-2 md:gap-3 flex-1 max-w-md min-w-0">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-card-hover border border-border-default transition-colors flex-shrink-0 cursor-pointer"
            title="Abrir Menú"
          >
            <Menu size={18} />
          </button>
        )}

        <div className="relative w-full cursor-pointer min-w-0 overflow-hidden">
          <div className="w-full pl-9 pr-3 md:pr-8 py-1.5 bg-canvas rounded-xl border border-border-default text-xs text-slate-subtle flex items-center justify-between hover:border-border-subtle transition-colors truncate">
            <span className="flex items-center gap-2 truncate">
              <Search size={14} className="flex-shrink-0 text-slate-muted" />
              <span className="truncate">{searchPlaceholder}</span>
            </span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-card border border-border-default text-[10px] font-mono text-slate-muted flex-shrink-0">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Acciones de la derecha */}
      <div className="flex items-center gap-3">
        {/* Estado de conexión en vivo */}
        <div
          className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl border text-xs font-medium transition-colors ${
            apiConnected
              ? "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/20"
              : apiConnected === false
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
              : "bg-card border-border-default text-slate-400"
          }`}
          title={
            apiConnected
              ? "Conexión activa con el servidor en tiempo real"
              : apiConnected === false
              ? "Sin conexión al servidor. Autoguardado local activo."
              : "Verificando conexión con el servidor..."
          }
        >
          <span className="relative flex h-2 w-2">
            {apiConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                apiConnected
                  ? "bg-emerald-brand"
                  : apiConnected === false
                  ? "bg-amber-400"
                  : "bg-slate-500 animate-pulse"
              }`}
            />
          </span>
          <span className="font-mono text-xs font-bold">
            {apiConnected ? "Conectado" : apiConnected === false ? "Autoguardado" : "Conectando..."}
          </span>
        </div>

        <div className="h-4 w-px bg-border-default hidden sm:block" />

        {/* Botón conmutador de tema */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border-default hover:border-emerald-brand/40 text-xs font-medium text-slate-muted hover:text-emerald-brand transition-colors cursor-pointer"
          title="Cambiar Tema (Claro / Oscuro)"
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
          <span className="hidden md:inline">{isDark ? "Claro" : "Oscuro"}</span>
        </button>
      </div>
    </header>
  );
}
