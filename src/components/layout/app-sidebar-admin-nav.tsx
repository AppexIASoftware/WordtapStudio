"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  CheckCircle2,
  Shield,
  Activity,
  CreditCard,
  Boxes,
  Layers,
} from "lucide-react";

interface AppSidebarAdminNavProps {
  getLinkClasses: (route: string) => string;
}

/** Seccion de navegacion admin para AppSidebar (dashboard-shell). */
export function AppSidebarAdminNav({ getLinkClasses }: AppSidebarAdminNavProps) {
  return (
    <>
      {/* 1. SUPERVISIÓN GLOBAL */}
      <div>
        <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-purple-400 mb-1.5 font-mono">
          Supervisión Global (Admin)
        </p>
        <nav className="space-y-0.5">
          <Link href="/admin/dashboard" className={getLinkClasses("/admin/dashboard")}>
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Ejecutivo</span>
            </div>
          </Link>
        </nav>
      </div>
      {/* 2. CENTRO DE MODERACIÓN */}
      <div>
        <div className="flex items-center justify-between px-3 mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-subtle font-mono">
            Centro de Moderación
          </span>
          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
            2 Pendientes
          </span>
        </div>
        <nav className="space-y-0.5">
          <Link href="/admin/approvals" className={getLinkClasses("/admin/approvals")}>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Aprobación de Cursos</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/30 text-amber-300 font-bold font-mono">
              Pendientes
            </span>
          </Link>
        </nav>
      </div>
      {/* 3. GOBERNANZA & SEGURIDAD */}
      <div>
        <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
          Gobernanza & Seguridad
        </p>
        <nav className="space-y-0.5">
          <Link href="/admin/roles" className={getLinkClasses("/admin/roles")}>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4" />
              <span>Roles & Permisos</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
              Total
            </span>
          </Link>
          <Link href="/admin/audit" className={getLinkClasses("/admin/audit")}>
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4" />
              <span>Auditoría & Trazabilidad</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
              En vivo
            </span>
          </Link>
        </nav>
      </div>
      {/* 4. MONETIZACIÓN & PAGOS */}
      <div>
        <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
          Monetización & Pagos
        </p>
        <nav className="space-y-0.5">
          <Link href="/admin/monetization" className={getLinkClasses("/admin/monetization")}>
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4" />
              <span>Marketplace & Stripe</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-dark/60 text-emerald-brand font-bold">
              70 / 30
            </span>
          </Link>
        </nav>
      </div>
      {/* 5. CATÁLOGO GLOBAL */}
      <div>
        <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
          Catálogo Global
        </p>
        <nav className="space-y-0.5">
          <Link href="/admin/vault" className={getLinkClasses("/admin/vault")}>
            <div className="flex items-center gap-3">
              <Boxes className="w-4 h-4" />
              <span>Content Vault Maestro</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
              Global
            </span>
          </Link>
          <Link href="/moderator/courses" className={getLinkClasses("/moderator/courses")}>
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4" />
              <span>Todos los Cursos</span>
            </div>
            <span className="text-[9px] font-mono text-slate-subtle font-bold">
              Supervisar
            </span>
          </Link>
        </nav>
      </div>
    </>
  );
}
