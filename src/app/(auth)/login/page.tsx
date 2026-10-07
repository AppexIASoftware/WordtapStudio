"use client";

import React from "react";
import { LoginForm } from "@/features/auth/components/login-form";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";

export default function LoginPage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-canvas text-slate-100 flex flex-col justify-between items-center px-4 py-3 sm:px-6 sm:py-4 select-none">
      {/* Barra superior con solo conmutador de tema */}
      <div className="w-full max-w-5xl flex justify-end flex-shrink-0">
        <button
          onClick={toggleTheme}
          className="px-2.5 py-1 rounded-xl bg-card border border-border-default hover:border-emerald-brand/40 text-xs text-slate-muted hover:text-emerald-brand transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          title="Cambiar Tema (Claro / Oscuro)"
        >
          {isDark ? <Sun size={13} /> : <Moon size={13} />}
          <span>{isDark ? "Claro" : "Oscuro"}</span>
        </button>
      </div>

      {/* Contenedor central de marca y formulario */}
      <main className="w-full max-w-md my-auto space-y-3 sm:space-y-4 flex-shrink-0">
        {/* Identidad visual de marca compacta */}
        <div className="text-center space-y-1">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-brand to-mint-brand flex items-center justify-center text-canvas font-black text-xl shadow-glow-emerald mx-auto">
            W
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              <span>Wordtap</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wide badge-studio">
                Studio
              </span>
            </h1>
            <p className="text-[11px] text-slate-muted mt-0.5">
              Plataforma de Autoría Docente, Moderación & Gobernanza
            </p>
          </div>
        </div>

        {/* Formulario de autenticación */}
        <LoginForm />
      </main>

      {/* Pie inferior compacto */}
      <footer className="w-full max-w-5xl pt-2 border-t border-border-default/50 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-subtle font-mono flex-shrink-0">
        <span>© 2026 Wordtap Inc. • Todos los derechos reservados</span>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-300 cursor-pointer">Seguridad</span>
          <span className="hover:text-slate-300 cursor-pointer">Términos de Servicio</span>
          <span className="hover:text-slate-300 cursor-pointer">Privacidad Docente</span>
        </div>
      </footer>
    </div>
  );
}
