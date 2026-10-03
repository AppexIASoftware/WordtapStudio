"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/features/auth/auth-context";
import {
  UserPlus,
  Save,
  Shield,
  Users,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { StaffMember, RbacMatrixState } from "../types";
import {
  INITIAL_STAFF_DATA,
  RBAC_MODULES_DATA,
  buildInitialRbacState,
} from "../data/rbac-data";
import { InviteStaffModal } from "../components/invite-staff-modal";
import { StaffDirectoryTable } from "../components/staff-directory-table";
import { TeacherApplicationsTable } from "../components/teacher-applications-table";
import { PlatformSettingsCard } from "../components/platform-settings-card";
import { RbacMatrixConsole } from "../components/rbac-matrix-console";
import { ToastNotification } from "@/components/ui/toast-notification";

export function RolesView() {
  const { currentRole } = useAuth();
  const isAdmin = currentRole === "admin";

  const [activeTab, setActiveTab] = useState<"staff" | "applications" | "matrix">("staff");
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF_DATA);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const [rbacState, setRbacState] = useState<RbacMatrixState>(() =>
    buildInitialRbacState()
  );
  const [rbacBaseline, setRbacBaseline] = useState<RbacMatrixState>(() =>
    buildInitialRbacState()
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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
      <ToastNotification message={toastMessage} variant="purple" />

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

      {/* Selector de Pestañas de Gobernanza */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border-default pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("staff")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "staff"
              ? "bg-emerald-brand text-canvas shadow-glow-emerald"
              : "bg-card border border-border-default text-slate-muted hover:text-white"
          }`}
        >
          <Users size={14} />
          <span>Directorio de Staff ({staffList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "applications"
              ? "bg-emerald-brand text-canvas shadow-glow-emerald"
              : "bg-card border border-border-default text-slate-muted hover:text-white"
          }`}
        >
          <UserCheck size={14} />
          <span>Postulaciones Docentes (Google)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("matrix")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "matrix"
              ? "bg-emerald-brand text-canvas shadow-glow-emerald"
              : "bg-card border border-border-default text-slate-muted hover:text-white"
          }`}
        >
          <Shield size={14} />
          <span>Matriz de Políticas RBAC</span>
        </button>
      </div>

      {/* 1. Directorio de Staff */}
      {activeTab === "staff" && (
        <StaffDirectoryTable
          staffList={staffList}
          onNotify={triggerToast}
          onToggleAccess={handleToggleStaffAccess}
          onRevokeInvite={handleRevokeInvite}
        />
      )}

      {/* 2. Postulaciones Docentes & Configuración Institucional */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          <PlatformSettingsCard onNotify={triggerToast} isAdmin={isAdmin} />

          <div className="flex items-center justify-between pt-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck size={16} className="text-emerald-brand" />
                <span>Cola de Postulaciones Docentes</span>
              </h3>
              <p className="text-xs text-slate-muted mt-0.5">
                Usuarios registrados vía Google OAuth esperando autorización para publicar contenido pedagógico.
              </p>
            </div>
          </div>

          <TeacherApplicationsTable onNotify={triggerToast} isAdmin={isAdmin} />
        </div>
      )}

      {/* 3. Matriz de Permisos por Rol (RBAC) */}
      {activeTab === "matrix" && (
        <RbacMatrixConsole
          rbacState={rbacState}
          isDirty={isDirty}
          matrixStats={matrixStats}
          isAdmin={isAdmin}
          onTogglePermission={handleTogglePermission}
          onResetDefaults={handleResetRbacDefaults}
        />
      )}

      {/* Modal de Invitación */}
      <InviteStaffModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteStaff}
      />
    </div>
  );
}
