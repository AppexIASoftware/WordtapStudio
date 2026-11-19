"use client";

import React from "react";
import { useAuth } from "@/features/auth/auth-context";
import { UserRole } from "@/features/auth/types";
import { DEMO_ACCOUNTS } from "@/features/auth/hooks/use-login";
import { UserCheck, X } from "lucide-react";

interface DemoLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoLoginModal({ isOpen, onClose }: DemoLoginModalProps) {
  const { currentRole, switchRole } = useAuth();

  if (!isOpen) return null;

  const handleSelectRole = (role: UserRole) => {
    switchRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border-default rounded-3xl p-6 shadow-2xl space-y-4 max-w-lg w-full animate-in fade-in duration-200">
        {/* Encabezado */}
        <div className="flex items-center justify-between pb-3 border-b border-border-default">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-brand/10 border border-emerald-brand/30 flex items-center justify-center text-emerald-brand">
              <UserCheck size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Login Demo • Cuentas de Prueba</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-brand/20 text-emerald-brand font-bold">
                  1-Clic
                </span>
              </h3>
              <p className="text-[11px] text-slate-subtle">
                Simula cualquier perfil del ecosistema Wordtap sin recargar.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-canvas text-slate-muted hover:text-white flex items-center justify-center cursor-pointer font-bold transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Lista de perfiles */}
        <div className="space-y-2.5">
          {/* Perfil 1: Docente */}
          <div
            onClick={() => handleSelectRole("instructor")}
            className={`p-3.5 rounded-2xl bg-canvas border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
              currentRole === "instructor"
                ? "border-emerald-brand bg-card-hover/80"
                : "border-border-default hover:border-emerald-brand hover:bg-card-hover"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-brand to-mint-brand flex items-center justify-center text-canvas font-bold text-sm flex-shrink-0 shadow-md">
                MS
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-brand transition-colors truncate">
                    {DEMO_ACCOUNTS.instructor.name}
                  </h4>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-brand/20 text-emerald-brand font-bold border border-emerald-brand/30">
                    Docente
                  </span>
                </div>
                <p className="text-[11px] text-slate-muted truncate font-mono">
                  {DEMO_ACCOUNTS.instructor.email}
                </p>
                <p className="text-[10px] text-slate-subtle mt-0.5">
                  Creación de cursos, gestión de cohortes, banco propio y envío a moderación.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-brand flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              Acceder →
            </span>
          </div>

          {/* Perfil 2: Moderadora */}
          <div
            onClick={() => handleSelectRole("moderator")}
            className={`p-3.5 rounded-2xl bg-canvas border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
              currentRole === "moderator"
                ? "border-blue-500 bg-card-hover/80"
                : "border-border-default hover:border-blue-500 hover:bg-card-hover"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                ER
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                    {DEMO_ACCOUNTS.moderator.name}
                  </h4>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                    Moderadora Oficial
                  </span>
                </div>
                <p className="text-[11px] text-slate-muted truncate font-mono">
                  {DEMO_ACCOUNTS.moderator.email}
                </p>
                <p className="text-[10px] text-slate-subtle mt-0.5">
                  Cola de revisión abierta, feedback por tarjeta y publicación directa a producción.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-blue-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              Acceder →
            </span>
          </div>

          {/* Perfil 3: Super Administrador */}
          <div
            onClick={() => handleSelectRole("admin")}
            className={`p-3.5 rounded-2xl bg-canvas border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
              currentRole === "admin"
                ? "border-purple-500 bg-card-hover/80"
                : "border-border-default hover:border-purple-500 hover:bg-card-hover"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                CM
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors truncate">
                    {DEMO_ACCOUNTS.admin.name}
                  </h4>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
                    Super Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-muted truncate font-mono">
                  {DEMO_ACCOUNTS.admin.email}
                </p>
                <p className="text-[10px] text-slate-subtle mt-0.5">
                  Control de permisos y roles, equipo, reparto de ingresos, publicidad y bitácora de auditoría.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-purple-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              Acceder →
            </span>
          </div>
        </div>

        {/* Pie del modal */}
        <div className="pt-2 border-t border-border-default flex items-center justify-between text-xs">
          <span className="text-slate-subtle text-[11px] font-mono">
            Entorno emulado local • Control de acceso por rol
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-card border border-border-default text-slate-300 hover:text-white font-medium transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
