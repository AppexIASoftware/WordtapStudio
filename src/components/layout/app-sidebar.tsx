"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

interface AppSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({ isOpenMobile, onCloseMobile }: AppSidebarProps) {
  const pathname = usePathname();
  const isModerator = pathname.startsWith("/moderator");

  const isRouteActive = (route: string) => {
    if (route === "/teacher") return pathname === "/teacher";
    if (route === "/moderator") return pathname === "/moderator";
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

    return `w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
      active
        ? "bg-emerald-dark/30 text-emerald-brand border border-emerald-brand/30 font-semibold"
        : "text-slate-muted hover:bg-card-hover hover:text-slate-100 font-medium"
    }`;
  };

  return (
    <>
      {/* Fondo oscuro para móvil */}
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
        {/* Cabecera de marca y espacio de trabajo */}
        <div className="p-4 border-b border-border-default space-y-3">
          <div className="flex items-center justify-between">
            <Link
              href={isModerator ? "/moderator" : "/teacher"}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-base flex-shrink-0 ${
                  isModerator
                    ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-sm"
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
                        : "bg-emerald-dark/60 text-emerald-brand border border-emerald-brand/30"
                    }`}
                  >
                    Studio
                  </span>
                </span>
                <span className="text-[10px] text-slate-subtle font-mono">
                  {isModerator ? "Consola de Moderación" : "CMS & Portal Docente"}
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

          {/* Selector de rol de espacio de trabajo (Docente / Mod / Admin) */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-canvas rounded-xl border border-border-default text-xs font-medium">
            <Link
              href="/teacher"
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition-colors truncate cursor-pointer ${
                !isModerator
                  ? "bg-card text-emerald-brand shadow-sm font-semibold border border-border-default"
                  : "text-slate-muted hover:text-slate-200"
              }`}
              title="Modo Docente"
            >
              <GraduationCap className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">Docente</span>
            </Link>
            <Link
              href="/moderator"
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition-colors truncate cursor-pointer ${
                isModerator
                  ? "bg-card text-blue-400 shadow-sm font-semibold border border-border-default"
                  : "text-slate-muted hover:text-slate-200"
              }`}
              title="Modo Moderador"
            >
              <ShieldCheck className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">Mod</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-1 py-1.5 rounded-lg text-slate-muted hover:text-slate-200 truncate cursor-pointer"
              title="Modo Administrador"
            >
              <Shield className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">Admin</span>
            </Link>
          </div>
        </div>

        {/* NAVEGACIÓN DESPLAZABLE */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {/* ========================================================= */}
          {/* GRUPO DE MODERACIÓN (ACTIVO EN /moderator/*)               */}
          {/* ========================================================= */}
          {isModerator ? (
            <>
              {/* AUDITORÍA & CALIDAD */}
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

              {/* BANCO MAESTRO & CURSOS */}
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

              {/* RESOLUCIÓN DE INCIDENCIAS */}
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
          ) : (
            /* ========================================================= */
            /* GRUPO DOCENTE (ACTIVO EN /teacher/*)                       */
            /* ========================================================= */
            <>
              {/* MI ESPACIO DOCENTE */}
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

              {/* GESTIÓN EDUCATIVA (CMS) */}
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

              {/* MIS ESTUDIANTES */}
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

              {/* ESTADO DE PUBLICACIÓN */}
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

        {/* Pie de perfil del usuario logueado */}
        <div className="p-3 border-t border-border-default bg-card/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-canvas border border-border-default">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                  isModerator
                    ? "bg-gradient-to-tr from-blue-500 to-cyan-400 text-white"
                    : "bg-gradient-to-tr from-emerald-brand to-mint-brand text-canvas"
                }`}
              >
                {isModerator ? "ER" : "MS"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">
                  {isModerator ? "Lic. Elena Ramos" : "Prof. Mateo Silva"}
                </span>
                <span className="text-[10px] text-slate-subtle font-mono truncate">
                  {isModerator ? "Moderadora Oficial (Calidad)" : "Docente Autorizado"}
                </span>
              </div>
            </div>

            <Link
              href="/login"
              className="p-1.5 text-slate-muted hover:text-rose-400 hover:bg-card-hover rounded-lg transition-colors flex-shrink-0"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
