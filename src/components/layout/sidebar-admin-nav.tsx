"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  CheckCircle2,
  FileSearch,
  BookOpen,
  DollarSign,
  Globe2,
  ShieldAlert,
  Users2,
  Shield,
  Activity,
  CreditCard,
  Boxes,
  Layers,
} from "lucide-react";

interface SidebarAdminNavProps {
  collapsed: boolean;
  navItemAdminClass: (path: string) => string;
}

/** Grupo de navegacion exclusivo para rol Admin / Super Admin. */
export function SidebarAdminNav({ collapsed, navItemAdminClass }: SidebarAdminNavProps) {
  return (
        <div className="space-y-5">
          {/* 1. SUPERVISIÓN GLOBAL */}
          <div>
            {!collapsed && (
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-purple-400 mb-1.5 font-mono">
                Supervisión Global (Admin)
              </p>
            )}
            <nav className="space-y-0.5">
              <Link href="/admin/dashboard" className={navItemAdminClass("/admin/dashboard")}>
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
              <Link href="/admin/approvals" className={navItemAdminClass("/admin/approvals")}>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} />
                  {!collapsed && <span>Aprobación de Cursos</span>}
                </div>
                {!collapsed && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/30 text-amber-300 font-bold font-mono">
                    Pendientes
                  </span>
                )}
              </Link>
            </nav>
          </div>

          {/* 3. GOBERNANZA & SEGURIDAD */}
          <div>
            {!collapsed && (
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
                Gobernanza & Seguridad
              </p>
            )}
            <nav className="space-y-0.5">
              <Link href="/admin/roles" className={navItemAdminClass("/admin/roles")}>
                <div className="flex items-center gap-3">
                  <Shield size={18} />
                  {!collapsed && <span>Roles & Permisos</span>}
                </div>
                {!collapsed && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                    Total
                  </span>
                )}
              </Link>

              <Link href="/admin/audit" className={navItemAdminClass("/admin/audit")}>
                <div className="flex items-center gap-3">
                  <Activity size={18} />
                  {!collapsed && <span>Auditoría & Trazabilidad</span>}
                </div>
                {!collapsed && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                    En vivo
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
              <Link href="/admin/monetization" className={navItemAdminClass("/admin/monetization")}>
                <div className="flex items-center gap-3">
                  <CreditCard size={18} />
                  {!collapsed && <span>Marketplace & Stripe</span>}
                </div>
                {!collapsed && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-dark/60 text-emerald-brand font-bold">
                    70 / 30
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
              <Link href="/admin/vault" className={navItemAdminClass("/admin/vault")}>
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

              <Link href="/admin/courses" className={navItemAdminClass("/admin/courses")}>
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
  );
}
