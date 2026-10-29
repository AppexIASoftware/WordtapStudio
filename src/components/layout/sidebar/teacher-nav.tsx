"use client";

import {
  LayoutDashboard,
  Layers,
  Boxes,
  Gamepad2,
  Users,
  Flame,
  GitPullRequest,
} from "lucide-react";
import { NavItem } from "./nav-item";

interface TeacherNavProps {
  collapsed?: boolean;
}

export function TeacherNav({ collapsed = false }: TeacherNavProps) {
  return (
    <div className="space-y-4">
      {/* 1. ESPACIO EDUCATIVO */}
      <div>
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-emerald-brand font-mono mb-1.5">
            Espacio Educativo
          </p>
        )}
        <nav className="space-y-0.5">
          <NavItem
            href="/teacher"
            label="Dashboard"
            icon={LayoutDashboard}
            collapsed={collapsed}
            roleTheme="instructor"
          />
          <NavItem
            href="/teacher/builder"
            label="Creador de Cursos"
            icon={Layers}
            collapsed={collapsed}
            roleTheme="instructor"
          />
        </nav>
      </div>

      {/* 2. CONTENIDO & RECURSOS */}
      <div>
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
            Contenido & Recursos
          </p>
        )}
        <nav className="space-y-0.5">
          <NavItem
            href="/teacher/vault"
            label="Content Vault"
            icon={Boxes}
            collapsed={collapsed}
            roleTheme="instructor"
          />
          <NavItem
            href="/teacher/gamification"
            label="Minijuegos"
            icon={Gamepad2}
            collapsed={collapsed}
            roleTheme="instructor"
          />
        </nav>
      </div>

      {/* 3. AULAS & SEGUIMIENTO */}
      <div>
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
            Aulas & Seguimiento
          </p>
        )}
        <nav className="space-y-0.5">
          <NavItem
            href="/teacher/students"
            label="Aulas & Cohortes"
            icon={Users}
            collapsed={collapsed}
            roleTheme="instructor"
          />
          <NavItem
            href="/teacher#heatmap"
            label="Diagnóstico"
            icon={Flame}
            collapsed={collapsed}
            roleTheme="instructor"
          />
        </nav>
      </div>

      {/* 4. PUBLICACIÓN & CALIDAD */}
      <div>
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
            Publicación & Calidad
          </p>
        )}
        <nav className="space-y-0.5">
          <NavItem
            href="/teacher/approvals"
            label="Mis Solicitudes"
            icon={GitPullRequest}
            collapsed={collapsed}
            roleTheme="instructor"
          />
        </nav>
      </div>
    </div>
  );
}
