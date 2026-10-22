"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";
import { AppSidebarAdminNav } from "./app-sidebar-admin-nav";
import {
  LayoutDashboard,
  Layers,
  Database,
  Boxes,
  Gamepad2,
  Users,
  Flame,
  GitPullRequest,
  GraduationCap,
  ShieldCheck,
  Shield,
  LogOut,
  X,
  AlertTriangle,
  Activity,
  CreditCard,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AppSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({ isOpenMobile, onCloseMobile }: AppSidebarProps) {
  const pathname = usePathname();
  const { user, currentRole, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const isModerator = currentRole === "moderator";
  const isAdmin = currentRole === "admin";

  const isRouteActive = (route: string) => {
    if (route === "/teacher") return pathname === "/teacher";
    if (route === "/moderator") return pathname === "/moderator";
    if (route === "/admin/dashboard") return pathname === "/admin/dashboard";
    return pathname.startsWith(route);
  };

  const getLinkClasses = (route: string) => {
    const active = isRouteActive(route);
    const layout = collapsed
      ? "w-full flex items-center justify-center p-2.5 rounded-xl text-sm transition-all cursor-pointer"
      : "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all cursor-pointer";

    if (isModerator) {
      return `${layout} ${
        active
          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold"
          : "text-slate-muted hover:bg-card-hover hover:text-slate-100 font-medium"
      }`;
    }
    if (isAdmin) {
      return `${layout} ${
        active
          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold shadow-sm"
          : "text-slate-muted hover:bg-card-hover hover:text-slate-100 font-medium"
      }`;
    }

    return `${layout} ${
      active
        ? "bg-emerald-dark/30 text-emerald-brand border border-emerald-brand/30 font-semibold"
        : "text-slate-muted hover:bg-card-hover hover:text-slate-100 font-medium"
    }`;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full flex-shrink-0 bg-card border-r border-border-default flex flex-col justify-between transition-all duration-300 z-50 ${
          collapsed ? "w-20" : "w-64"
        } ${isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand header */}
        <div className={`border-b border-border-default space-y-3 ${collapsed ? "px-2 py-4" : "p-4"}`}>
          <div className={`flex items-center ${collapsed ? "justify-center gap-1.5" : "justify-between"}`}>
            <Link
              href={isModerator ? "/moderator" : isAdmin ? "/admin/dashboard" : "/teacher"}
              className="flex items-center gap-2.5 flex-shrink-0"
              title="Wordtap Studio"
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-base flex-shrink-0 shadow-sm ${
                  isModerator
                    ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-sm"
                    : isAdmin
                    ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm"
                    : "bg-gradient-to-br from-emerald-brand to-mint-brand text-canvas shadow-glow-emerald"
                }`}
              >
                W
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                    Wordtap{" "}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-mono font-bold tracking-wide ${
                        isModerator
                          ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 dark:border-blue-500/30"
                          : isAdmin
                          ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 dark:border-purple-500/30"
                          : "badge-studio"
                      }`}
                    >
                      Studio
                    </span>
                  </span>
                  <span className="text-[10px] text-slate-subtle font-mono">
                    {isModerator
                      ? "Consola de Moderación"
                      : "CMS & Portal Docente"}
                  </span>
                </div>
              )}
            </Link>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex p-1 rounded-lg text-slate-muted hover:text-slate-200 hover:bg-card-hover transition-colors cursor-pointer flex-shrink-0"
                title={collapsed ? "Expandir menú" : "Colapsar menú (solo iconos)"}
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              {onCloseMobile && (
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="lg:hidden p-1.5 rounded-lg text-slate-muted hover:text-white hover:bg-card-hover cursor-pointer"
                  title="Cerrar menú"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Role badge */}
          <div className="p-1 bg-canvas rounded-xl border border-border-default text-xs font-medium">
            {!collapsed ? (
              <>
                {currentRole === "instructor" && (
                  <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-card text-emerald-brand shadow-sm font-semibold border border-border-default">
                    <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">Docente</span>
                  </div>
                )}
                {currentRole === "moderator" && (
                  <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-card text-blue-400 shadow-sm font-semibold border border-border-default">
                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">Mod</span>
                  </div>
                )}
                {currentRole === "admin" && (
                  <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-card text-purple-400 shadow-sm font-semibold border border-border-default">
                    <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">Admin</span>
                  </div>
                )}
              </>
            ) : (
              <div
                className="flex items-center justify-center py-1.5 text-center"
                title={`Rol activo: ${currentRole}`}
              >
                {currentRole === "instructor" && <GraduationCap className="w-4 h-4 text-emerald-brand" />}
                {currentRole === "moderator" && <ShieldCheck className="w-4 h-4 text-blue-400" />}
                {currentRole === "admin" && <Shield className="w-4 h-4 text-purple-400" />}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {/* Moderation space */}
          {isModerator ? (
            <>
              {/* Quality and audit */}
              <div>
                <div className="flex items-center justify-between px-3 mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 font-mono">
                    Auditoría & Calidad
                  </span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
                    2 Pendientes
                  </span>
                </div>
                <nav className="space-y-0.5">
                  <Link href="/moderator/approvals" className={getLinkClasses("/moderator/approvals")}>
                    <div className="flex items-center gap-3">
                      <GitPullRequest className="w-4 h-4" />
                      <span>Cola de Revisiones (PRs)</span>
                    </div>
                  </Link>

                  <Link href="/moderator" className={getLinkClasses("/moderator")}>
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Métricas de Calidad</span>
                    </div>
                  </Link>
                </nav>
              </div>

              {/* Courses vault */}
              <div>
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                  Banco Maestro & Cursos
                </p>
                <nav className="space-y-0.5">
                  <Link href="/moderator/vault" className={getLinkClasses("/moderator/vault")}>
                    <div className="flex items-center gap-3">
                      <Database className="w-4 h-4" />
                      <span>Content Vault Maestro</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      Global
                    </span>
                  </Link>

                  <Link href="/moderator/courses" className={getLinkClasses("/moderator/courses")}>
                    <div className="flex items-center gap-3">
                      <Layers className="w-4 h-4" />
                      <span>Supervisión de Cursos</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-subtle">
                      Playtest
                    </span>
                  </Link>
                </nav>
              </div>

              {/* Reports */}
              <div>
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                  Resolución de Incidencias
                </p>
                <nav className="space-y-0.5">
                  <Link href="/moderator/reports" className={getLinkClasses("/moderator/reports")}>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Reportes de Alumnos</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      3 Pendientes
                    </span>
                  </Link>
                </nav>
              </div>
            </>
          ) : isAdmin ? (
            /* Admin space - Sincronizado con Sidebar de Studio */
            <AppSidebarAdminNav getLinkClasses={getLinkClasses} collapsed={collapsed} />
          ) : (
            /* Teacher space */
            <>
              {/* Espacio Educativo */}
              <div>
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                    Espacio Educativo
                  </p>
                )}
                <nav className="space-y-0.5">
                  <Link
                    href="/teacher"
                    className={getLinkClasses("/teacher")}
                    title="Dashboard Pedagógico"
                  >
                    <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                      <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span>Dashboard Pedagógico</span>}
                    </div>
                  </Link>

                  <Link
                    href="/teacher/builder"
                    className={getLinkClasses("/teacher/builder")}
                    title="Creador de Cursos (CMS)"
                  >
                    <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                      <Layers className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span>Creador de Cursos</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[10px] bg-emerald-brand/20 text-emerald-brand px-1.5 py-0.5 rounded font-mono font-bold flex-shrink-0">
                        CMS
                      </span>
                    )}
                  </Link>
                </nav>
              </div>

              {/* Biblioteca & Recursos */}
              <div>
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                    Biblioteca & Recursos
                  </p>
                )}
                <nav className="space-y-0.5">
                  <Link
                    href="/teacher/vault"
                    className={getLinkClasses("/teacher/vault")}
                    title="Banco de Contenidos (Vault)"
                  >
                    <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                      <Database className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span>Banco de Contenidos</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[10px] text-slate-subtle font-mono font-bold flex-shrink-0">
                        54 ítems
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/teacher/gamification"
                    className={getLinkClasses("/teacher/gamification")}
                    title="Juegos & Actividades"
                  >
                    <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                      <Gamepad2 className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span>Juegos & Actividades</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-dark/40 text-emerald-brand border border-emerald-brand/30 flex-shrink-0">
                        12 Modos
                      </span>
                    )}
                  </Link>
                </nav>
              </div>

              {/* Aulas & Seguimiento */}
              <div>
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                    Aulas & Seguimiento
                  </p>
                )}
                <nav className="space-y-0.5">
                  <Link
                    href="/teacher/students"
                    className={getLinkClasses("/teacher/students")}
                    title="Aulas & Cohortes"
                  >
                    <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                      <Users className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span>Aulas & Cohortes</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-card border border-border-default text-emerald-brand flex-shrink-0">
                        WT-Code
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/teacher#heatmap"
                    className={getLinkClasses("/teacher#heatmap")}
                    title="Diagnóstico & Heatmap"
                  >
                    <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                      <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />
                      {!collapsed && <span>Diagnóstico & Heatmap</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold flex-shrink-0">
                        En vivo
                      </span>
                    )}
                  </Link>
                </nav>
              </div>

              {/* Publicación & Calidad */}
              <div>
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                    Publicación & Calidad
                  </p>
                )}
                <nav className="space-y-0.5">
                  <Link
                    href="/teacher/approvals"
                    className={getLinkClasses("/teacher/approvals")}
                    title="Mis Solicitudes (PRs)"
                  >
                    <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                      <GitPullRequest className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span>Mis Solicitudes (PRs)</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] bg-amber-brand/10 text-amber-brand px-1.5 py-0.5 rounded font-mono font-bold flex-shrink-0">
                        Revisión
                      </span>
                    )}
                  </Link>
                </nav>
              </div>
            </>
          )}
        </div>

        {/* User profile */}
        <div className="p-3 border-t border-border-default bg-card/50">
          {!collapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-canvas border border-border-default">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isModerator
                      ? "bg-gradient-to-tr from-blue-500 to-cyan-400 text-white"
                      : isAdmin
                      ? "bg-gradient-to-tr from-purple-500 to-indigo-600 text-white"
                      : "bg-gradient-to-tr from-emerald-brand to-mint-brand text-canvas"
                  }`}
                >
                  {user.avatarInitials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-subtle font-mono truncate">
                    {user.title}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="p-1.5 text-slate-muted hover:text-rose-400 hover:bg-card-hover rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 cursor-pointer ${
                  isModerator
                    ? "bg-gradient-to-tr from-blue-500 to-cyan-400 text-white"
                    : isAdmin
                    ? "bg-gradient-to-tr from-purple-500 to-indigo-600 text-white"
                    : "bg-gradient-to-tr from-emerald-brand to-mint-brand text-canvas"
                }`}
                title={`${user.name} • ${user.title}`}
              >
                {user.avatarInitials}
              </div>
              <button
                type="button"
                onClick={logout}
                className="p-1.5 text-slate-muted hover:text-rose-400 hover:bg-card-hover rounded-lg transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
