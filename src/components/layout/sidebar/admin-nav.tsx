"use client";

import {
  LayoutDashboard,
  CheckCircle2,
  Layers,
  Boxes,
  Gamepad2,
  CreditCard,
  Shield,
  Activity,
} from "lucide-react";
import { NavItem } from "./nav-item";

interface AdminNavProps {
  collapsed?: boolean;
}

export function AdminNav({ collapsed = false }: AdminNavProps) {
  return (
    <div className="space-y-4">
      {/* 1. SUPERVISIÓN */}
      <div>
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-purple-400 font-mono mb-1.5">
            Supervisión
          </p>
        )}
        <nav className="space-y-0.5">
          <NavItem
            href="/admin/dashboard"
            label="Dashboard"
            icon={LayoutDashboard}
            collapsed={collapsed}
            roleTheme="admin"
          />
          <NavItem
            href="/admin/approvals"
            label="Aprobaciones"
            icon={CheckCircle2}
            badge="2"
            badgeColor="amber"
            collapsed={collapsed}
            roleTheme="admin"
          />
          <NavItem
            href="/admin/courses"
            label="Creador de Cursos"
            icon={Layers}
            collapsed={collapsed}
            roleTheme="admin"
          />
        </nav>
      </div>

      {/* 2. CONTENIDO & JUEGOS */}
      <div>
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
            Contenido & Juegos
          </p>
        )}
        <nav className="space-y-0.5">
          <NavItem
            href="/admin/vault"
            label="Content Vault"
            icon={Boxes}
            collapsed={collapsed}
            roleTheme="admin"
          />
          <NavItem
            href="/admin/games"
            label="Minijuegos"
            icon={Gamepad2}
            collapsed={collapsed}
            roleTheme="admin"
          />
        </nav>
      </div>

      {/* 3. GOBERNANZA */}
      <div>
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
            Gobernanza
          </p>
        )}
        <nav className="space-y-0.5">
          <NavItem
            href="/admin/monetization"
            label="Monetización"
            icon={CreditCard}
            collapsed={collapsed}
            roleTheme="admin"
          />
          <NavItem
            href="/admin/roles"
            label="Roles & Permisos"
            icon={Shield}
            collapsed={collapsed}
            roleTheme="admin"
          />
          <NavItem
            href="/admin/audit"
            label="Auditoría"
            icon={Activity}
            collapsed={collapsed}
            roleTheme="admin"
          />
        </nav>
      </div>
    </div>
  );
}
