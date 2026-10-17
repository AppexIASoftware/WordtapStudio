"use client";

import { UserCheck, LogOut } from "lucide-react";
import { UserRole } from "@/features/auth/types";

interface SidebarUserFooterProps {
  user: {
    name: string;
    title: string;
    avatarInitials: string;
  };
  currentRole: UserRole;
  collapsed: boolean;
  onOpenDemoModal?: () => void;
  onLogout: () => void;
}

/** Pie de barra lateral con perfil del usuario activo y conmutador de login demo. */
export function SidebarUserFooter({
  user,
  currentRole,
  collapsed,
  onOpenDemoModal,
  onLogout,
}: SidebarUserFooterProps) {
  return (
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
          onClick={onLogout}
          className="p-1.5 rounded-lg text-slate-muted hover:text-rose-400 hover:bg-card-hover transition-colors cursor-pointer flex-shrink-0"
          title="Cerrar Sesión"
        >
          <LogOut size={15} />
        </button>
      </div>
    </div>
  );
}
