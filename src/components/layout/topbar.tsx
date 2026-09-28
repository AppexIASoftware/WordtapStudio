"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { useTheme } from "@/hooks/use-theme";
import { checkApiHealth } from "@/lib/api-client";
import { Search, Sun, Moon, Menu } from "lucide-react";

interface TopbarProps {
  onOpenDemoModal: () => void;
  onToggleMobileMenu: () => void;
}

export function Topbar({ onOpenDemoModal, onToggleMobileMenu }: TopbarProps) {
  const { currentRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar conexión hacia WordtapAPI
    checkApiHealth().then((res) => {
      setApiConnected(res.connected);
    });
  }, []);

  const roleBadgeStyle = () => {
    if (currentRole === "instructor") {
      return "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/20 hover:bg-emerald-brand/20";
    }
    if (currentRole === "moderator") {
      return "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20";
    }
    return "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20";
  };

  const roleDotStyle = () => {
    if (currentRole === "instructor") return "bg-emerald-brand";
    if (currentRole === "moderator") return "bg-blue-400";
    return "bg-purple-400";
  };

  return (
    <header className="h-14 bg-card/80 backdrop-blur border-b border-border-default flex items-center justify-between px-3 md:px-6 z-20 flex-shrink-0 gap-2">
      {/* Izquierda: Menú móvil y buscador omnibox */}
      <div className="flex items-center gap-2 md:gap-3 flex-1 max-w-md min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-card-hover border border-border-default transition-colors flex-shrink-0 cursor-pointer"
          title="Abrir Menú"
        >
          <Menu size={18} />
        </button>

        <div className="relative w-full cursor-pointer min-w-0 overflow-hidden">
          <div className="w-full pl-9 pr-3 md:pr-8 py-1.5 bg-canvas rounded-xl border border-border-default text-xs text-slate-subtle flex items-center justify-between hover:border-border-subtle transition-colors truncate">
            <span className="flex items-center gap-2 truncate">
              <Search size={14} className="flex-shrink-0 text-slate-muted" />
              <span className="truncate">Buscar lecciones o alumnos...</span>
            </span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-card border border-border-default text-[10px] font-mono text-slate-muted flex-shrink-0">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Acciones de la derecha */}
      <div className="flex items-center gap-3">
        {/* Estado de conexión de API */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-subtle font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              apiConnected ? "bg-emerald-brand animate-pulse" : "bg-emerald-brand/80"
            }`}
          />
          <span>{apiConnected ? "API v1 • Conectado" : "Autoguardado activo"}</span>
        </div>

        {/* Indicador de rol activo */}
        <div
          onClick={onOpenDemoModal}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border font-mono text-xs font-bold cursor-pointer transition-colors ${roleBadgeStyle()}`}
          title="Cambiar Rol / Login Demo (RF-S27)"
        >
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${roleDotStyle()}`} />
          <span>
            {currentRole === "instructor" && "Modo Docente"}
            {currentRole === "moderator" && "Modo Moderador"}
            {currentRole === "admin" && "Modo Administrador"}
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
