"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/auth-context";
import {
  GraduationCap,
  ShieldCheck,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { AdminNav } from "./admin-nav";
import { TeacherNav } from "./teacher-nav";
import { ModeratorNav } from "./moderator-nav";
import { UserFooter } from "./user-footer";

export interface SidebarProps {
  onOpenDemoModal?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

/**
 * Shell orquestador único y modular de navegación lateral para los 3 roles.
 */
export function Sidebar({
  onOpenDemoModal,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const { user, currentRole, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isModerator = currentRole === "moderator";
  const isAdmin = currentRole === "admin";

  const homeHref = isModerator
    ? "/moderator"
    : isAdmin
    ? "/admin/dashboard"
    : "/teacher";

  const brandSubtitle = isModerator
    ? "Consola de Moderación"
    : isAdmin
    ? "Consola de Gobernanza"
    : "CMS & Portal Docente";

  return (
    <>
      {/* Overlay para móvil */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full flex-shrink-0 bg-card border-r border-border-default flex flex-col justify-between transition-all duration-300 z-50 ${
          collapsed ? "w-16" : "w-48"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Cabecera superior y badge de rol */}
        <div className={`border-b border-border-default space-y-2.5 ${collapsed ? "px-2 py-3" : "p-3"}`}>
          <div className={`flex items-center ${collapsed ? "justify-center gap-1" : "justify-between"}`}>
            <Link href={homeHref} className="flex items-center gap-2 min-w-0 flex-shrink-0 cursor-pointer" title="Wordtap Studio">
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm ${
                  isModerator
                    ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white"
                    : isAdmin
                    ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
                    : "bg-gradient-to-br from-emerald-brand to-mint-brand text-canvas shadow-glow-emerald"
                }`}
              >
                W
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs tracking-tight text-white flex items-center gap-1">
                    Wordtap{" "}
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold tracking-wide ${
                        isModerator
                          ? "bg-blue-500/10 text-blue-300 border border-blue-500/30"
                          : isAdmin
                          ? "bg-purple-500/10 text-purple-300 border border-purple-500/30"
                          : "badge-studio"
                      }`}
                    >
                      Studio
                    </span>
                  </span>
                  <span className="text-[9px] text-slate-subtle font-mono truncate">{brandSubtitle}</span>
                </div>
              )}
            </Link>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex p-1 rounded-lg text-slate-muted hover:text-slate-200 hover:bg-card-hover transition-colors cursor-pointer"
                title={collapsed ? "Expandir menú" : "Colapsar menú"}
              >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              </button>

              {onCloseMobile && (
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="lg:hidden p-1.5 rounded-lg text-slate-muted hover:text-white hover:bg-card-hover cursor-pointer"
                  title="Cerrar menú"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Role badge */}
          <div className="p-0.5 bg-canvas rounded-lg border border-border-default text-xs font-medium">
            {!collapsed ? (
              <>
                {currentRole === "instructor" && (
                  <div className="flex items-center justify-center gap-1.5 py-1 rounded-md bg-card text-emerald-brand shadow-xs font-semibold border border-border-default text-xs">
                    <GraduationCap size={13} className="flex-shrink-0" />
                    <span className="truncate">Docente</span>
                  </div>
                )}
                {isModerator && (
                  <div className="flex items-center justify-center gap-1.5 py-1 rounded-md bg-card text-blue-400 shadow-xs font-semibold border border-border-default text-xs">
                    <ShieldCheck size={13} className="flex-shrink-0" />
                    <span className="truncate">Moderación</span>
                  </div>
                )}
                {isAdmin && (
                  <div className="flex items-center justify-center gap-1.5 py-1 rounded-md bg-card text-purple-400 shadow-xs font-semibold border border-border-default text-xs">
                    <Shield size={13} className="flex-shrink-0" />
                    <span className="truncate">Administración</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-1.5 text-center" title={`Rol activo: ${currentRole}`}>
                {currentRole === "instructor" && <GraduationCap size={14} className="text-emerald-brand" />}
                {isModerator && <ShieldCheck size={14} className="text-blue-400" />}
                {isAdmin && <Shield size={14} className="text-purple-400" />}
              </div>
            )}
          </div>
        </div>

        {/* Listas de navegación por dominio de rol (Composición limpia) */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          {isAdmin && <AdminNav collapsed={collapsed} />}
          {isModerator && <ModeratorNav collapsed={collapsed} />}
          {currentRole === "instructor" && <TeacherNav collapsed={collapsed} />}
        </div>

        {/* Pie con perfil de usuario y logout */}
        <UserFooter
          user={user}
          currentRole={currentRole}
          collapsed={collapsed}
          onOpenDemoModal={onOpenDemoModal}
          onLogout={logout}
        />
      </aside>
    </>
  );
}
