"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  CheckCircle2,
  Shield,
  Activity,
  CreditCard,
  Boxes,
  Gamepad2,
  Layers,
  Flame,
} from "lucide-react";

interface AppSidebarAdminNavProps {
  getLinkClasses: (route: string) => string;
  collapsed?: boolean;
}

/** Seccion de navegacion admin para AppSidebar (dashboard-shell). */
export function AppSidebarAdminNav({ getLinkClasses, collapsed }: AppSidebarAdminNavProps) {
  return (
    <>
      {/* 1. SUPERVISIÓN & REVISIÓN */}
      <div>
        {!collapsed && (
          <div className="flex items-center justify-between px-3 mb-1.5 gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400 font-mono truncate">
              Supervisión
            </span>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold whitespace-nowrap flex-shrink-0">
              2 Pendientes
            </span>
          </div>
        )}
        <nav className="space-y-0.5">
          <Link
            href="/admin/dashboard"
            className={getLinkClasses("/admin/dashboard")}
            title="Dashboard Ejecutivo"
          >
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Dashboard Ejecutivo</span>}
            </div>
          </Link>

          <Link
            href="/admin/approvals"
            className={getLinkClasses("/admin/approvals")}
            title="Aprobación de Cursos"
          >
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
              {!collapsed && <span>Aprobación de Cursos</span>}
            </div>
            {!collapsed && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/30 text-amber-300 font-bold font-mono flex-shrink-0">
                PRs
              </span>
            )}
          </Link>

          <Link
            href="/admin/courses"
            className={getLinkClasses("/admin/courses")}
            title="Creador de Cursos (CMS)"
          >
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <Layers className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Creador de Cursos</span>}
            </div>
            {!collapsed && (
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono font-bold flex-shrink-0">
                CMS
              </span>
            )}
          </Link>

          <Link
            href="/admin/dashboard#heatmap"
            className={getLinkClasses("/admin/dashboard#heatmap")}
            title="Diagnóstico & Heatmap Global"
          >
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />
              {!collapsed && <span>Diagnóstico & Heatmap</span>}
            </div>
            {!collapsed && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold flex-shrink-0">
                Global
              </span>
            )}
          </Link>
        </nav>
      </div>

      {/* 2. CATÁLOGO GLOBAL */}
      <div>
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
            Catálogo & Recursos
          </p>
        )}
        <nav className="space-y-0.5">
          <Link
            href="/admin/vault"
            className={getLinkClasses("/admin/vault")}
            title="Content Vault Maestro"
          >
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <Boxes className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Content Vault Maestro</span>}
            </div>
            {!collapsed && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold flex-shrink-0">
                Global
              </span>
            )}
          </Link>

          <Link
            href="/admin/games"
            className={getLinkClasses("/admin/games")}
            title="Catálogo de Minijuegos"
          >
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <Gamepad2 className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Catálogo de Minijuegos</span>}
            </div>
            {!collapsed && (
              <span className="text-[9px] font-mono text-slate-subtle font-bold flex-shrink-0">
                Modos
              </span>
            )}
          </Link>
        </nav>
      </div>

      {/* 3. GOBERNANZA & NEGOCIO */}
      <div>
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
            Gobernanza & Monetización
          </p>
        )}
        <nav className="space-y-0.5">
          <Link
            href="/admin/monetization"
            className={getLinkClasses("/admin/monetization")}
            title="Marketplace & Stripe"
          >
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <CreditCard className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Marketplace & Stripe</span>}
            </div>
            {!collapsed && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-dark/60 text-emerald-brand font-bold flex-shrink-0">
                70 / 30
              </span>
            )}
          </Link>

          <Link
            href="/admin/roles"
            className={getLinkClasses("/admin/roles")}
            title="Roles & Permisos"
          >
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <Shield className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Roles & Permisos</span>}
            </div>
            {!collapsed && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold flex-shrink-0">
                Total
              </span>
            )}
          </Link>

          <Link
            href="/admin/audit"
            className={getLinkClasses("/admin/audit")}
            title="Auditoría & Trazabilidad"
          >
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <Activity className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Auditoría & Trazabilidad</span>}
            </div>
            {!collapsed && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold flex-shrink-0">
                En vivo
              </span>
            )}
          </Link>
        </nav>
      </div>
    </>
  );
}
