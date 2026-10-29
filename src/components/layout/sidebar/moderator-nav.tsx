"use client";

import {
  GitPullRequest,
  LayoutDashboard,
  Boxes,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { NavItem } from "./nav-item";

interface ModeratorNavProps {
  collapsed?: boolean;
}

export function ModeratorNav({ collapsed = false }: ModeratorNavProps) {
  return (
    <div className="space-y-4">
      {/* 1. AUDITORÍA & CALIDAD */}
      <div>
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-blue-400 font-mono mb-1.5">
            Auditoría & Calidad
          </p>
        )}
        <nav className="space-y-0.5">
          <NavItem
            href="/moderator/approvals"
            label="Cola de Revisiones"
            icon={GitPullRequest}
            badge="2"
            badgeColor="amber"
            collapsed={collapsed}
            roleTheme="moderator"
          />
          <NavItem
            href="/moderator"
            label="Métricas de Calidad"
            icon={LayoutDashboard}
            collapsed={collapsed}
            roleTheme="moderator"
          />
        </nav>
      </div>

      {/* 2. CONTENIDO & CURSOS */}
      <div>
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
            Contenido & Cursos
          </p>
        )}
        <nav className="space-y-0.5">
          <NavItem
            href="/moderator/vault"
            label="Content Vault"
            icon={Boxes}
            collapsed={collapsed}
            roleTheme="moderator"
          />
          <NavItem
            href="/moderator/courses"
            label="Supervisión de Cursos"
            icon={Layers}
            collapsed={collapsed}
            roleTheme="moderator"
          />
        </nav>
      </div>

      {/* 3. INCIDENCIAS */}
      <div>
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
            Incidencias
          </p>
        )}
        <nav className="space-y-0.5">
          <NavItem
            href="/moderator/reports"
            label="Reportes"
            icon={AlertTriangle}
            badge="3"
            badgeColor="amber"
            collapsed={collapsed}
            roleTheme="moderator"
          />
        </nav>
      </div>
    </div>
  );
}
