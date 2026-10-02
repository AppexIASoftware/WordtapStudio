"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";
import {
  LayoutDashboard,
  Layers,
  Database,
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
} from "lucide-react";

interface AppSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({ isOpenMobile, onCloseMobile }: AppSidebarProps) {
  const pathname = usePathname();
  const { user, currentRole, logout } = useAuth();
  const isModerator = currentRole === "moderator";
  const isAdmin = currentRole === "admin";

  const isRouteActive = (route: string) => {
    if (route === "/teacher") return pathname === "/teacher";
    if (route === "/moderator") return pathname === "/moderator";
    if (route === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(route);
  };

  const getLinkClasses = (route: string) => {
    const active = isRouteActive(route);
    if (isModerator) {
      return `w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
        active
          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold"
          : "text-slate-muted hover:bg-card-hover hover:text-slate-100 font-medium"
      }`;
    }
    if (isAdmin) {
      return `w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
        active
          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold"
          : "text-slate-muted hover:bg-card-hover hover:text-slate-100 font-medium"
      }`;
    }

    return `w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
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
        className={`fixed lg:static top-0 left-0 h-full w-64 flex-shrink-0 bg-card border-r border-border-default flex flex-col justify-between transition-transform duration-300 z-50 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand header */}
        <div className="p-4 border-b border-border-default space-y-3">
          <div className="flex items-center justify-between">
            <Link
              href={isModerator ? "/moderator" : isAdmin ? "/dashboard" : "/teacher"}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-base flex-shrink-0 ${
                  isModerator
                    ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-sm"
                    : isAdmin
                    ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm"
                    : "bg-gradient-to-br from-emerald-brand to-mint-brand text-canvas shadow-glow-emerald"
                }`}
              >
                W
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  Wordtap{" "}
                  <span
                    className={`text-xs px-1.5 py-0.2 rounded font-mono ${
                      isModerator
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        : isAdmin
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-emerald-dark/60 text-emerald-brand border border-emerald-brand/30"
                    }`}
                  >
                    Studio
                  </span>
                </span>
                <span className="text-[10px] text-slate-subtle font-mono">
                  {isModerator
                    ? "Consola de Moderación"
                    : isAdmin
                    ? "Consola de Gobernanza"
                    : "CMS & Portal Docente"}
                </span>
              </div>
            </Link>

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

          {/* Role badge */}
          <div className="p-1 bg-canvas rounded-xl border border-border-default text-xs font-medium">
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
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-bold font-mono">
                      Diff #108
                    </span>
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
            /* Admin space */
            <>
              <div>
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-purple-400 mb-1.5 font-mono">
                  Supervisión Global (Admin)
                </p>
                <nav className="space-y-0.5">
                  <Link href="/dashboard" className={getLinkClasses("/dashboard")}>
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard Ejecutivo</span>
                    </div>
                  </Link>
                </nav>
              </div>

              <div>
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                  Gobernanza & Operaciones
                </p>
                <nav className="space-y-0.5">
                  <Link href="/roles" className={getLinkClasses("/roles")}>
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4" />
                      <span>Roles & Permisos (RBAC)</span>
                    </div>
                  </Link>

                  <Link href="/audit" className={getLinkClasses("/audit")}>
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4" />
                      <span>Log de Auditoría</span>
                    </div>
                  </Link>

                  <Link href="/monetization" className={getLinkClasses("/monetization")}>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4" />
                      <span>Monetización & Split</span>
                    </div>
                  </Link>
                </nav>
              </div>
            </>
          ) : (
            /* Teacher space */
            <>
              {/* Teacher dashboard */}
              <div>
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                  Mi Espacio Docente
                </p>
                <nav className="space-y-0.5">
                  <Link href="/teacher" className={getLinkClasses("/teacher")}>
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard Pedagógico</span>
                    </div>
                  </Link>
                </nav>
              </div>

              {/* Content management */}
              <div>
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                  Gestión Educativa (CMS)
                </p>
                <nav className="space-y-0.5">
                  <Link href="/teacher/builder" className={getLinkClasses("/teacher/builder")}>
                    <div className="flex items-center gap-3">
                      <Layers className="w-4 h-4" />
                      <span>Creador de Cursos</span>
                    </div>
                    <span className="text-[10px] bg-emerald-brand/20 text-emerald-brand px-1.5 py-0.5 rounded font-mono font-bold">
                      CMS
                    </span>
                  </Link>

                  <Link href="/teacher/vault" className={getLinkClasses("/teacher/vault")}>
                    <div className="flex items-center gap-3">
                      <Database className="w-4 h-4" />
                      <span>Banco de Contenidos</span>
                    </div>
                    <span className="text-[10px] text-slate-subtle font-mono font-bold">
                      54 ítems
                    </span>
                  </Link>

                  <Link href="/teacher/gamification" className={getLinkClasses("/teacher/gamification")}>
                    <div className="flex items-center gap-3">
                      <Gamepad2 className="w-4 h-4" />
                      <span>Juegos & Modos</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-dark/40 text-emerald-brand border border-emerald-brand/30">
                      12 Modos
                    </span>
                  </Link>
                </nav>
              </div>

              {/* Students */}
              <div>
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                  Mis Estudiantes
                </p>
                <nav className="space-y-0.5">
                  <Link href="/teacher/students" className={getLinkClasses("/teacher/students")}>
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4" />
                      <span>Progreso de Alumnos</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-brand animate-pulse" />
                  </Link>

                  <Link href="/teacher#heatmap" className={getLinkClasses("/teacher#heatmap")}>
                    <div className="flex items-center gap-3">
                      <Flame className="w-4 h-4" />
                      <span>Heatmap de Errores</span>
                    </div>
                  </Link>
                </nav>
              </div>

              {/* Submissions */}
              <div>
                <div className="flex items-center justify-between px-3 mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-subtle font-mono">
                    Mis Cursos Enviados
                  </span>
                  <span className="text-[9px] bg-amber-brand/10 text-amber-brand px-1 rounded font-mono font-bold">
                    En Revisión
                  </span>
                </div>
                <nav className="space-y-0.5">
                  <Link href="/teacher/approvals" className={getLinkClasses("/teacher/approvals")}>
                    <div className="flex items-center gap-3">
                      <GitPullRequest className="w-4 h-4" />
                      <span>Mis Solicitudes (PRs)</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-brand/20 text-amber-brand font-bold font-mono">
                      1
                    </span>
                  </Link>
                </nav>
              </div>
            </>
          )}
        </div>

        {/* User profile */}
        <div className="p-3 border-t border-border-default bg-card/50">
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
        </div>
      </aside>
    </>
  );
}
