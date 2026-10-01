"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";
import {
  LayoutDashboard,
  BookOpen,
  Boxes,
  Users,
  GitPullRequest,
  Shield,
  Activity,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCheck,
  CheckCircle2,
  Layers,
} from "lucide-react";

interface SidebarProps {
  onOpenDemoModal: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ onOpenDemoModal, isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user, currentRole, switchRole, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const navItemClass = (path: string) =>
    `w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
      isActive(path)
        ? "bg-emerald-dark/30 text-emerald-brand border border-emerald-brand/30 font-semibold"
        : "text-slate-muted hover:bg-card-hover hover:text-slate-100 font-medium"
    }`;

  const navItemAdminClass = (path: string) =>
    `w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
      isActive(path)
        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold shadow-sm"
        : "text-slate-muted hover:bg-card-hover hover:text-slate-100 font-medium"
    }`;

  return (
    <>
      {/* Fondo oscuro para móvil */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full flex-shrink-0 bg-card border-r border-border-default flex flex-col justify-between transition-all duration-300 z-50 ${
          collapsed ? "w-18" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Cabecera superior y conmutador de rol */}
        <div className="p-4 border-b border-border-default space-y-3">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 overflow-hidden cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-brand to-mint-brand flex items-center justify-center text-canvas font-black text-base shadow-glow-emerald flex-shrink-0">
                W
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                    Wordtap{" "}
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-dark/60 text-emerald-brand border border-emerald-brand/30 font-mono">
                      Studio
                    </span>
                  </span>
                  <span className="text-[10px] text-slate-subtle font-mono">
                    CMS & Portal Docente
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1 rounded-lg text-slate-muted hover:text-slate-200 hover:bg-card-hover transition-colors cursor-pointer"
              title={collapsed ? "Expandir menú" : "Colapsar menú"}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Botones de cambio rápido de rol */}
          {!collapsed && (
            <div className="grid grid-cols-3 gap-1 p-1 bg-canvas rounded-xl border border-border-default text-center text-xs">
              <button
                type="button"
                onClick={() => switchRole("instructor")}
                className={`py-1 rounded-lg transition-colors font-medium cursor-pointer ${
                  currentRole === "instructor"
                    ? "bg-card text-emerald-brand shadow-sm font-bold border border-border-default"
                    : "text-slate-subtle hover:text-white"
                }`}
              >
                Docente
              </button>
              <button
                type="button"
                onClick={() => switchRole("moderator")}
                className={`py-1 rounded-lg transition-colors font-medium cursor-pointer ${
                  currentRole === "moderator"
                    ? "bg-card text-blue-400 shadow-sm font-bold border border-border-default"
                    : "text-slate-subtle hover:text-white"
                }`}
              >
                Mod
              </button>
              <button
                type="button"
                onClick={() => switchRole("admin")}
                className={`py-1 rounded-lg transition-colors font-medium cursor-pointer ${
                  currentRole === "admin"
                    ? "bg-card text-purple-400 shadow-sm font-bold border border-border-default"
                    : "text-slate-subtle hover:text-white"
                }`}
              >
                Admin
              </button>
            </div>
          )}
        </div>

        {/* Listas de navegación */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* GRUPO 1: NAVEGACIÓN DE DOCENTE */}
          {currentRole === "instructor" && (
            <>
              <div>
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                    Mi Espacio Docente
                  </p>
                )}
                <nav className="space-y-0.5">
                  <Link href="/dashboard" className={navItemClass("/dashboard")}>
                    <div className="flex items-center gap-3">
                      <LayoutDashboard size={18} />
                      {!collapsed && <span>Dashboard Pedagógico</span>}
                    </div>
                  </Link>
                </nav>
              </div>

              <div>
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                    Gestión Educativa (CMS)
                  </p>
                )}
                <nav className="space-y-0.5">
                  <Link href="/courses" className={navItemClass("/courses")}>
                    <div className="flex items-center gap-3">
                      <BookOpen size={18} />
                      {!collapsed && <span>Creador de Cursos</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-card border border-border-default text-slate-subtle">
                        CMS
                      </span>
                    )}
                  </Link>

                  <Link href="/vault" className={navItemClass("/vault")}>
                    <div className="flex items-center gap-3">
                      <Boxes size={18} />
                      {!collapsed && <span>Content Vault</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-dark/60 text-emerald-brand border border-emerald-brand/30">
                        9 Bancos
                      </span>
                    )}
                  </Link>
                </nav>
              </div>

              <div>
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                    Mis Estudiantes
                  </p>
                )}
                <nav className="space-y-0.5">
                  <Link href="/students" className={navItemClass("/students")}>
                    <div className="flex items-center gap-3">
                      <Users size={18} />
                      {!collapsed && <span>Aulas & Cohortes</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-card border border-border-default text-emerald-brand">
                        WT-Code
                      </span>
                    )}
                  </Link>

                  <Link href="/approvals" className={navItemClass("/approvals")}>
                    <div className="flex items-center gap-3">
                      <GitPullRequest size={18} />
                      {!collapsed && <span>Mis Solicitudes (PRs)</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                        1
                      </span>
                    )}
                  </Link>
                </nav>
              </div>
            </>
          )}

          {/* GRUPO 2: NAVEGACIÓN DE MODERADORA */}
          {currentRole === "moderator" && (
            <>
              <div>
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-blue-400 mb-1.5 font-mono">
                    Consola de Calidad & Revisión
                  </p>
                )}
                <nav className="space-y-0.5">
                  <Link href="/approvals" className={navItemClass("/approvals")}>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={18} />
                      {!collapsed && <span>Cola de Moderación</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 font-bold font-mono">
                        Diff #108
                      </span>
                    )}
                  </Link>

                  <Link href="/dashboard" className={navItemClass("/dashboard")}>
                    <div className="flex items-center gap-3">
                      <LayoutDashboard size={18} />
                      {!collapsed && <span>Métricas de Calidad</span>}
                    </div>
                  </Link>
                </nav>
              </div>

              <div>
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                    Supervisión Pedagógica
                  </p>
                )}
                <nav className="space-y-0.5">
                  <Link href="/vault" className={navItemClass("/vault")}>
                    <div className="flex items-center gap-3">
                      <Boxes size={18} />
                      {!collapsed && <span>Content Vault</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        Global
                      </span>
                    )}
                  </Link>

                  <Link href="/courses" className={navItemClass("/courses")}>
                    <div className="flex items-center gap-3">
                      <BookOpen size={18} />
                      {!collapsed && <span>Supervisar Cursos</span>}
                    </div>
                  </Link>

                  <Link href="/audit" className={navItemClass("/audit")}>
                    <div className="flex items-center gap-3">
                      <Activity size={18} />
                      {!collapsed && <span>Reportes de Incidencias</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                        3
                      </span>
                    )}
                  </Link>
                </nav>
              </div>
            </>
          )}

          {/* GRUPO 3: NAVEGACIÓN DE SUPER ADMIN (OPEN-DESIGN) */}
          {currentRole === "admin" && (
            <div className="space-y-5">
              {/* 1. SUPERVISIÓN GLOBAL */}
              <div>
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-purple-400 mb-1.5 font-mono">
                    Supervisión Global (Admin)
                  </p>
                )}
                <nav className="space-y-0.5">
                  <Link href="/dashboard" className={navItemAdminClass("/dashboard")}>
                    <div className="flex items-center gap-3">
                      <LayoutDashboard size={18} />
                      {!collapsed && <span>Dashboard Ejecutivo</span>}
                    </div>
                  </Link>
                </nav>
              </div>

              {/* 2. CENTRO DE MODERACIÓN */}
              <div>
                <div className="flex items-center justify-between px-3 mb-1.5">
                  {!collapsed && (
                    <>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-subtle font-mono">
                        Centro de Moderación
                      </span>
                      <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded font-mono font-bold">
                        2 Pendientes
                      </span>
                    </>
                  )}
                </div>
                <nav className="space-y-0.5">
                  <Link href="/approvals" className={navItemAdminClass("/approvals")}>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={18} />
                      {!collapsed && <span>Aprobación de Cursos</span>}
                    </div>
                    {!collapsed && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/30 text-amber-300 font-bold font-mono">
                        Diff #108
                      </span>
                    )}
                  </Link>
                </nav>
              </div>

              {/* 3. GOBERNANZA & RBAC */}
              <div>
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                    Gobernanza & Seguridad
                  </p>
                )}
                <nav className="space-y-0.5">
                  <Link href="/roles" className={navItemAdminClass("/roles")}>
                    <div className="flex items-center gap-3">
                      <Shield size={18} />
                      {!collapsed && <span>Roles & Permisos (RBAC)</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                        Total
                      </span>
                    )}
                  </Link>

                  <Link href="/audit" className={navItemAdminClass("/audit")}>
                    <div className="flex items-center gap-3">
                      <Activity size={18} />
                      {!collapsed && <span>Auditoría & Trazabilidad</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                        Logs Live
                      </span>
                    )}
                  </Link>
                </nav>
              </div>

              {/* 4. MONETIZACIÓN & STRIPE */}
              <div>
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                    Monetización & Pagos
                  </p>
                )}
                <nav className="space-y-0.5">
                  <Link href="/monetization" className={navItemAdminClass("/monetization")}>
                    <div className="flex items-center gap-3">
                      <CreditCard size={18} />
                      {!collapsed && <span>Marketplace & Stripe</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-dark/60 text-emerald-brand font-bold">
                        25% / 75%
                      </span>
                    )}
                  </Link>
                </nav>
              </div>

              {/* 5. CATÁLOGO GLOBAL */}
              <div>
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                    Catálogo Global
                  </p>
                )}
                <nav className="space-y-0.5">
                  <Link href="/vault" className={navItemAdminClass("/vault")}>
                    <div className="flex items-center gap-3">
                      <Boxes size={18} />
                      {!collapsed && <span>Content Vault Maestro</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                        Global
                      </span>
                    )}
                  </Link>

                  <Link href="/courses" className={navItemAdminClass("/courses")}>
                    <div className="flex items-center gap-3">
                      <Layers size={18} />
                      {!collapsed && <span>Todos los Cursos</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[9px] font-mono text-slate-subtle font-bold">
                        Supervisar
                      </span>
                    )}
                  </Link>
                </nav>
              </div>
            </div>
          )}
        </div>

        {/* Perfil del usuario en el pie del sidebar */}
        <div className="p-3 border-t border-border-default bg-card/60">
          <div className="flex items-center justify-between gap-2.5">
            <div
              onClick={onOpenDemoModal}
              className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer hover:opacity-85 transition-opacity"
              title="Ver perfil o cambiar usuario (Login Demo)"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-canvas font-bold text-xs flex-shrink-0 shadow-sm ${
                  currentRole === "instructor"
                    ? "bg-gradient-to-tr from-emerald-brand to-mint-brand"
                    : currentRole === "moderator"
                    ? "bg-gradient-to-tr from-blue-500 to-cyan-400"
                    : "bg-gradient-to-tr from-purple-500 to-indigo-600"
                }`}
              >
                {user.avatarInitials}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-subtle truncate">
                    {user.title}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={onOpenDemoModal}
              className="p-1.5 rounded-lg text-slate-muted hover:text-slate-200 hover:bg-card-hover transition-colors cursor-pointer flex-shrink-0"
              title="Cambiar Usuario / Login Demo (RF-S27)"
            >
              <UserCheck size={15} />
            </button>

            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-muted hover:text-rose-400 hover:bg-card-hover transition-colors cursor-pointer flex-shrink-0"
              title="Cerrar Sesión"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
