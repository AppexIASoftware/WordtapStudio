"use client";

import React, { useMemo, useState } from "react";
import { Users, RefreshCw, ShieldCheck, Search, Trash2 } from "lucide-react";
import { ApiStaffUser, STAFF_ROLE_VALUE, StaffRoleValue } from "@/services/api/staff";
import { STAFF_ACTION_TYPE, StaffActionType } from "./staff-action-modal";

const ROLE_FILTER = {
  ALL: "all",
  ADMIN: STAFF_ROLE_VALUE.ADMIN,
  MODERATOR: STAFF_ROLE_VALUE.MODERATOR,
  INSTRUCTOR: STAFF_ROLE_VALUE.INSTRUCTOR,
} as const;

type RoleFilterValue = (typeof ROLE_FILTER)[keyof typeof ROLE_FILTER];

const ROLE_FILTER_OPTIONS: { value: RoleFilterValue; label: string }[] = [
  { value: ROLE_FILTER.ALL, label: "Todos" },
  { value: ROLE_FILTER.ADMIN, label: "Administradores" },
  { value: ROLE_FILTER.MODERATOR, label: "Moderadores" },
  { value: ROLE_FILTER.INSTRUCTOR, label: "Docentes" },
];

interface StaffDirectoryTableProps {
  staffList: ApiStaffUser[];
  isLoading: boolean;
  isRefreshing?: boolean;
  isAdmin: boolean;
  currentUserId?: string;
  onRequestAction: (member: ApiStaffUser, action: StaffActionType) => void;
  onRefresh: () => void;
}

const ROLE_DISPLAY: Record<StaffRoleValue, { label: string; badgeClass: string }> = {
  [STAFF_ROLE_VALUE.ADMIN]: {
    label: "Administrador",
    badgeClass: "bg-purple-500/20 text-purple-300",
  },
  [STAFF_ROLE_VALUE.MODERATOR]: {
    label: "Moderador",
    badgeClass: "bg-blue-500/20 text-blue-400",
  },
  [STAFF_ROLE_VALUE.INSTRUCTOR]: {
    label: "Docente",
    badgeClass: "bg-emerald-brand/20 text-emerald-brand",
  },
};

function getInitials(name: string, email: string): string {
  const source = name.trim() || email.split("@")[0] || "WT";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function StaffDirectorySkeleton() {
  return (
    <tbody className="divide-y divide-border-default">
      {Array.from({ length: 4 }).map((_, idx) => (
        <tr key={idx} className="animate-pulse">
          <td className="p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-slate-700/40 flex-shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3 w-32 rounded bg-slate-700/40" />
                <div className="h-2.5 w-40 rounded bg-slate-700/30" />
              </div>
            </div>
          </td>
          <td className="p-3.5">
            <div className="h-4 w-24 rounded bg-slate-700/40" />
          </td>
          <td className="p-3.5">
            <div className="h-4 w-16 rounded bg-slate-700/40" />
          </td>
          <td className="p-3.5">
            <div className="h-3 w-20 rounded bg-slate-700/30" />
          </td>
          <td className="p-3.5 text-right">
            <div className="h-4 w-24 rounded bg-slate-700/40 ml-auto" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export function StaffDirectoryTable({
  staffList,
  isLoading,
  isRefreshing = false,
  isAdmin,
  currentUserId,
  onRequestAction,
  onRefresh,
}: StaffDirectoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilterValue>(ROLE_FILTER.ALL);

  const filteredStaff = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return staffList.filter((member) => {
      if (roleFilter !== ROLE_FILTER.ALL && member.role !== roleFilter) {
        return false;
      }
      if (!query) return true;
      return (
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
      );
    });
  }, [staffList, searchTerm, roleFilter]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Users size={16} className="text-emerald-brand" />
          <span>Equipo Autorizado (Administradores, Moderadores & Docentes)</span>
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-subtle">
            {filteredStaff.length} de {staffList.length} miembros
          </span>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading || isRefreshing}
            className="p-1.5 rounded-lg bg-card border border-border-default text-slate-muted hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Actualizar listado"
          >
            <RefreshCw size={13} className={isLoading || isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Buscador y filtro por rol */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="w-full pl-8 pr-3 py-2 bg-card border border-border-default rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-brand"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {ROLE_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRoleFilter(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                roleFilter === opt.value
                  ? "bg-emerald-brand text-canvas"
                  : "bg-card border border-border-default text-slate-muted hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-card-soft text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Usuario Staff</th>
                <th className="p-3.5">Rol en Sistema</th>
                <th className="p-3.5">Estado de Acceso</th>
                <th className="p-3.5">Alta</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>

            {isLoading ? (
              <StaffDirectorySkeleton />
            ) : filteredStaff.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-muted">
                    <div className="flex flex-col items-center gap-2">
                      <ShieldCheck size={22} className="text-slate-500" />
                      <p className="font-semibold text-slate-300">
                        {staffList.length === 0
                          ? "No hay usuarios de staff registrados todavía"
                          : "No hay coincidencias para el filtro aplicado"}
                      </p>
                      <p className="text-[11px]">
                        {staffList.length === 0
                          ? "Integra un nuevo administrador, moderador o docente desde el botón superior."
                          : "Prueba limpiando el buscador o cambiando el filtro de rol."}
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-border-default font-medium">
                {filteredStaff.map((member) => {
                  const roleMeta = ROLE_DISPLAY[member.role] ?? {
                    label: member.role,
                    badgeClass: "bg-slate-500/20 text-slate-300",
                  };
                  const isSelf = currentUserId === member.id;
                  const createdLabel = new Date(member.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <tr key={member.id} className="hover:bg-card-hover/50 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold font-mono text-xs flex-shrink-0 ${roleMeta.badgeClass}`}
                          >
                            {getInitials(member.name, member.email)}
                          </div>
                          <div>
                            <p className="font-bold text-white flex items-center gap-1.5">
                              <span>{member.name}</span>
                              {isSelf && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-brand/15 text-emerald-brand">
                                  Yo
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-slate-subtle font-mono">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-[10.5px] ${roleMeta.badgeClass}`}
                        >
                          {roleMeta.label}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            member.is_active
                              ? "bg-emerald-brand/20 text-emerald-brand"
                              : "bg-rose-500/20 text-rose-300"
                          }`}
                        >
                          {member.is_active ? "Activo" : "Suspendido"}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-slate-400 text-[11px]">
                        {createdLabel}
                      </td>

                      <td className="p-3.5 text-right">
                        {isAdmin && !isSelf ? (
                          <div className="inline-flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                onRequestAction(
                                  member,
                                  member.is_active
                                    ? STAFF_ACTION_TYPE.SUSPEND
                                    : STAFF_ACTION_TYPE.REACTIVATE
                                )
                              }
                              className={`text-[11px] font-bold hover:underline cursor-pointer ${
                                member.is_active ? "text-amber-400" : "text-emerald-brand"
                              }`}
                            >
                              {member.is_active ? "Suspender" : "Reactivar"}
                            </button>
                            <button
                              type="button"
                              onClick={() => onRequestAction(member, STAFF_ACTION_TYPE.DELETE)}
                              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer inline-flex items-center gap-1"
                              title="Eliminar usuario"
                            >
                              <Trash2 size={12} />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">
                            {isSelf ? "Sesión actual" : "Solo lectura"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
