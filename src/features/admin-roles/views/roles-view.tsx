"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/features/auth/auth-context";
import {
  UserPlus,
  Save,
  RotateCcw,
  Check,
  Lock,
  Minus,
  Shield,
  Users,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { StaffMember, RbacMatrixState } from "../types";
import {
  INITIAL_STAFF_DATA,
  RBAC_MODULES_DATA,
  buildInitialRbacState,
} from "../data/rbac-data";
import { InviteStaffModal } from "../components/invite-staff-modal";

export function RolesView() {
  const { currentRole } = useAuth();
  const isAdmin = currentRole === "admin";

  // Estado del Directorio de Staff
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF_DATA);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Estado de la Matriz Dinámica RBAC
  const [rbacState, setRbacState] = useState<RbacMatrixState>(() =>
    buildInitialRbacState()
  );
  const [rbacBaseline, setRbacBaseline] = useState<RbacMatrixState>(() =>
    buildInitialRbacState()
  );

  // Toast flotante
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cálculo de estado sucio (dirty)
  const isDirty = useMemo(() => {
    for (const key in rbacState) {
      const roles = ["student", "instructor", "moderator", "admin"] as const;
      for (const r of roles) {
        if (rbacState[key]?.[r]?.val !== rbacBaseline[key]?.[r]?.val) {
          return true;
        }
      }
    }
    return false;
  }, [rbacState, rbacBaseline]);

  // Contadores de la matriz
  const matrixStats = useMemo(() => {
    let totalPerms = 0;
    let invariantCount = 0;
    let toggleCount = 0;

    RBAC_MODULES_DATA.forEach((mod) => {
      mod.permissions.forEach((perm) => {
        totalPerms++;
        const state = rbacState[perm.key];
        (["student", "instructor", "moderator", "admin"] as const).forEach((r) => {
          if (state?.[r]?.locked) invariantCount++;
          else toggleCount++;
        });
      });
    });

    return { totalPerms, invariantCount, toggleCount };
  }, [rbacState]);

  // Manejadores de Staff
  const handleInviteStaff = (newMember: StaffMember) => {
    setStaffList((prev) => [newMember, ...prev]);
    triggerToast(`¡Invitación enviada a ${newMember.email}! Token seguro generado.`);
  };

  const handleToggleStaffAccess = (member: StaffMember) => {
    setStaffList((prev) =>
      prev.map((m) => {
        if (m.id === member.id) {
          const nextStatus = m.status === "Suspendido" ? "Activo" : "Suspendido";
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );

    if (member.status === "Suspendido") {
      triggerToast(`Acceso restablecido para ${member.name}`);
    } else {
      triggerToast(`Acceso suspendido para ${member.name}. Sesión JWT invalidada.`);
    }
  };

  const handleRevokeInvite = (id: string, name: string) => {
    setStaffList((prev) => prev.filter((m) => m.id !== id));
    triggerToast(`Invitación revocada para ${name}`);
  };

  // Manejadores de la Matriz RBAC
  const handleTogglePermission = (
    key: string,
    role: "student" | "instructor" | "moderator" | "admin",
    checked: boolean
  ) => {
    if (!isAdmin) {
      triggerToast("Acceso denegado: Solo administradores pueden modificar la matriz RBAC");
      return;
    }

    setRbacState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [role]: {
          ...prev[key][role],
          val: checked,
        },
      },
    }));
  };

  const handleResetRbacDefaults = () => {
    const defaults = buildInitialRbacState();
    setRbacState(defaults);
    triggerToast("Matriz restablecida a las políticas de seguridad recomendadas");
  };

  const handleSaveRbacMatrix = () => {
    if (!isAdmin) {
      triggerToast("Acceso denegado: Solo administradores pueden modificar permisos RBAC");
      return;
    }

    let diffCount = 0;
    for (const key in rbacState) {
      const roles = ["student", "instructor", "moderator", "admin"] as const;
      for (const r of roles) {
        if (rbacState[key]?.[r]?.val !== rbacBaseline[key]?.[r]?.val) {
          diffCount++;
        }
      }
    }

    if (diffCount === 0) {
      triggerToast("No hay cambios pendientes en la matriz de permisos RBAC");
      return;
    }

    setRbacBaseline(JSON.parse(JSON.stringify(rbacState)));
    triggerToast(`¡Matriz RBAC guardada con éxito! (${diffCount} políticas actualizadas)`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Toast flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl bg-card border border-emerald-brand/40 shadow-2xl flex items-center gap-2.5 text-xs text-emerald-brand font-medium animate-in fade-in slide-in-from-bottom-2 backdrop-blur-md">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Alerta si el rol activo no es admin */}
      {!isAdmin && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span>
              <strong>Modo de solo lectura:</strong> Estás navegando como docente o moderador.
              Solo los usuarios con rol <strong>Super Admin</strong> pueden modificar permisos RBAC o autorizar nuevo staff.
            </span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Directorio de Staff & Roles (RBAC)
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
              ADR-08 • Acceso Tokenizado
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
              ADR-30 • Matriz Dinámica
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1 leading-relaxed">
            Aprovisionamiento de docentes y moderadores, asignación de cuotas de borradores y políticas granulares de permisos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
          >
            <UserPlus size={14} />
            <span>Invitar Docente / Moderador</span>
          </button>

          <button
            type="button"
            onClick={handleSaveRbacMatrix}
            disabled={!isAdmin}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              isDirty && isAdmin
                ? "bg-emerald-brand text-canvas hover:bg-mint-brand shadow-glow-emerald"
                : "bg-card border border-border-default text-slate-muted hover:text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Save size={14} />
            <span>Guardar Matriz</span>
          </button>
        </div>
      </div>

      {/* 1. TABLA: Directorio de Staff (ADR-08) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users size={16} className="text-emerald-brand" />
            <span>Equipo Autorizado (Docentes & Moderadores)</span>
          </h3>
          <span className="text-xs font-mono text-slate-subtle">
            {staffList.length} miembros registrados
          </span>
        </div>

        <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-card-soft text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Usuario Staff</th>
                  <th className="p-3.5">Rol en Sistema</th>
                  <th className="p-3.5">Alcance / Idiomas</th>
                  <th className="p-3.5">Cuota de Borradores</th>
                  <th className="p-3.5">Estado de Acceso</th>
                  <th className="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default font-medium">
                {staffList.map((member) => {
                  const isPending = member.status === "Invitación Pendiente";
                  const isSuspended = member.status === "Suspendido";

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-card-hover/50 transition-colors"
                    >
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold font-mono text-xs flex-shrink-0 ${member.avatarBg}`}
                          >
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-white">{member.name}</p>
                            <p className="text-[10px] text-slate-subtle font-mono">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-[10.5px] ${
                            member.role === "Docente"
                              ? "bg-emerald-brand/20 text-emerald-brand"
                              : member.role === "Moderador"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>

                      <td className="p-3.5 text-slate-200">{member.scope}</td>

                      <td className="p-3.5 font-mono text-slate-300">
                        {member.quota}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            isPending
                              ? "bg-amber-500/20 text-amber-300"
                              : isSuspended
                              ? "bg-rose-500/20 text-rose-300"
                              : "bg-emerald-brand/20 text-emerald-brand"
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right whitespace-nowrap">
                        {isPending ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                triggerToast(`Enlace de invitación reenviado a ${member.email}`)
                              }
                              className="text-xs text-mint-brand hover:underline mr-2.5 cursor-pointer font-semibold"
                            >
                              Reenviar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRevokeInvite(member.id, member.name)}
                              className="text-xs text-slate-500 hover:underline cursor-pointer"
                            >
                              Revocar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleToggleStaffAccess(member)}
                              className={`text-xs hover:underline mr-2.5 cursor-pointer font-semibold ${
                                isSuspended
                                  ? "text-emerald-brand"
                                  : "text-rose-400"
                              }`}
                            >
                              {isSuspended ? "Reactivar" : "Suspender"}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                triggerToast(`Editando cuota y alcance de ${member.name}`)
                              }
                              className="text-xs text-emerald-brand hover:underline cursor-pointer"
                            >
                              Editar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. TABLA: Matriz de Permisos por Rol (ADR-30) */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield size={16} className="text-emerald-brand" />
              <span>Matriz de Permisos por Rol</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                ADR-30 • Dinámica
              </span>
            </h3>
            <p className="text-xs text-slate-muted mt-0.5">
              Políticas globales de acceso. Las invariantes estructurales de seguridad están fijadas por código (candado inmutable).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border flex items-center gap-1.5 ${
                isDirty
                  ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isDirty ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                }`}
              />
              <span>{isDirty ? "Cambios sin guardar" : "Sincronizado"}</span>
            </span>

            <button
              type="button"
              onClick={handleResetRbacDefaults}
              className="px-3 py-1.5 rounded-xl bg-card border border-border-default hover:text-white text-slate-muted text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Restablecer a valores de seguridad recomendados"
            >
              <RotateCcw size={12} />
              <span>Restablecer</span>
            </button>
          </div>
        </div>

        {/* Barra de leyenda y estadísticas */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border-default text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-bold">
                <Check size={11} strokeWidth={2.5} />
                <Lock size={9} strokeWidth={2} />
              </span>
              <span className="text-[11px] text-slate-300">
                Invariante Estructural (Activo)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/60 text-slate-500 border border-slate-700/50 font-mono text-[10px]">
                <Minus size={10} />
                <Lock size={9} strokeWidth={2} />
              </span>
              <span className="text-[11px] text-slate-400">
                Restricción de Dominio (Denegado)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-6 h-3 bg-emerald-brand rounded-full relative">
                <div className="w-2 h-2 bg-white rounded-full absolute right-0.5 top-0.5" />
              </div>
              <span className="text-[11px] text-slate-300">
                Toggle Configurable por Admin
              </span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-subtle">
            {matrixStats.totalPerms} Permisos Mapeados • {matrixStats.invariantCount} Invariantes • {matrixStats.toggleCount} Toggles
          </div>
        </div>

        {/* Tabla de Matriz */}
        <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-card-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3.5 min-w-[280px]">Módulo / Permiso Granular</th>
                  <th className="p-3.5 text-center w-28">Student</th>
                  <th className="p-3.5 text-center w-36">Instructor (Docente)</th>
                  <th className="p-3.5 text-center w-32">Moderator</th>
                  <th className="p-3.5 text-center w-28">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default font-medium">
                {RBAC_MODULES_DATA.map((mod) => (
                  <React.Fragment key={mod.moduleId}>
                    {/* Fila separadora de módulo */}
                    <tr className="bg-card-hover/40">
                      <td
                        colSpan={5}
                        className="p-3 bg-canvas/60 border-y border-border-default font-mono text-[11px] font-bold text-slate-300"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                              mod.badgeColor === "blue"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : mod.badgeColor === "emerald"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : mod.badgeColor === "amber"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                : mod.badgeColor === "teal"
                                ? "bg-teal-500/20 text-teal-300 border-teal-500/30"
                                : mod.badgeColor === "purple"
                                ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                            }`}
                          >
                            {mod.badge}
                          </span>
                          <span className="text-white font-semibold">
                            {mod.moduleName}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Filas de permisos individuales */}
                    {mod.permissions.map((perm) => {
                      const roles = [
                        "student",
                        "instructor",
                        "moderator",
                        "admin",
                      ] as const;

                      return (
                        <tr
                          key={perm.key}
                          className="hover:bg-card-hover/30 transition-colors"
                        >
                          <td className="p-3.5">
                            <div className="space-y-0.5">
                              <p className="font-bold text-white text-xs">
                                {perm.name}
                              </p>
                              <p className="text-[11px] text-slate-subtle leading-tight">
                                {perm.desc}
                              </p>
                              <span className="text-[10px] font-mono text-slate-500">
                                {perm.key}
                              </span>
                            </div>
                          </td>

                          {roles.map((r) => {
                            const cell = rbacState[perm.key]?.[r];
                            if (!cell) return <td key={r} className="p-3.5" />;

                            if (cell.locked) {
                              return (
                                <td key={r} className="p-3.5 text-center">
                                  <div className="flex items-center justify-center">
                                    {cell.val ? (
                                      <span
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] font-bold"
                                        title="Invariante estructural activa"
                                      >
                                        <Check size={12} strokeWidth={2.5} />
                                        <Lock size={10} strokeWidth={2} className="opacity-70" />
                                      </span>
                                    ) : (
                                      <span
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/40 text-slate-500 border border-slate-700/40 font-mono text-[11px]"
                                        title="Restricción de seguridad del dominio"
                                      >
                                        <Minus size={11} />
                                        <Lock size={10} strokeWidth={2} className="opacity-60" />
                                      </span>
                                    )}
                                  </div>
                                </td>
                              );
                            }

                            // Toggle configurable
                            return (
                              <td key={r} className="p-3.5 text-center">
                                <div className="flex items-center justify-center">
                                  <label
                                    className={`relative inline-flex items-center ${
                                      isAdmin
                                        ? "cursor-pointer"
                                        : "cursor-not-allowed opacity-60"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={cell.val}
                                      disabled={!isAdmin}
                                      onChange={(e) =>
                                        handleTogglePermission(
                                          perm.key,
                                          r,
                                          e.target.checked
                                        )
                                      }
                                      className="sr-only peer"
                                    />
                                    <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-emerald-brand" />
                                  </label>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Invitación */}
      <InviteStaffModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteStaff}
      />
    </div>
  );
}
