"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/auth-context";
import {
  UserPlus,
  Save,
  Shield,
  Users,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { useRbacMatrix } from "../hooks/use-rbac-matrix";
import { RbacConfirmModal } from "../components/rbac-confirm-modal";
import {
  ApiStaffUser,
  ProvisionStaffPayload,
  listStaffApi,
  provisionStaffApi,
  updateStaffStatusApi,
  deleteStaffApi,
} from "@/services/api/staff";
import { InviteStaffModal } from "../components/invite-staff-modal";
import { StaffDirectoryTable } from "../components/staff-directory-table";
import {
  StaffActionModal,
  StaffActionType,
  STAFF_ACTION_TYPE,
} from "../components/staff-action-modal";
import { TeacherApplicationsTable } from "../components/teacher-applications-table";
import { PlatformSettingsCard } from "../components/platform-settings-card";
import { RbacMatrixConsole } from "../components/rbac-matrix-console";
import { ToastNotification } from "@/components/ui/toast-notification";
import { useUrlParam } from "@/hooks/use-url-params";

const ROLES_TABS = ["staff", "applications", "matrix"] as const;

export function RolesView() {
  const { currentRole, user } = useAuth();
  const isAdmin = currentRole === "admin";
  const queryClient = useQueryClient();

  // La pestaña activa vive en la URL para que la vista sea compartible.
  const [activeTab, setActiveTab] = useUrlParam<"staff" | "applications" | "matrix">(
    "tab",
    ROLES_TABS,
    "staff"
  );
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    member: ApiStaffUser;
    action: StaffActionType;
  } | null>(null);
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    data: staffList = [],
    isLoading: isStaffLoading,
    isFetching: isStaffFetching,
    refetch: refetchStaff,
  } = useQuery({
    queryKey: ["admin-staff"],
    queryFn: async () => {
      const res = await listStaffApi();
      if (res.error) {
        triggerToast(res.error);
        return [];
      }
      return res.data?.staff || [];
    },
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const {
    rbacState,
    diffCount,
    isDirty,
    matrixStats,
    rbacModalAction,
    isRbacSubmitting,
    rbacError,
    handleTogglePermission,
    requestReset: handleResetRbacDefaults,
    requestSave: handleSaveRbacMatrix,
    closeModal: closeRbacModal,
    confirmModal: handleConfirmRbacModal,
  } = useRbacMatrix(isAdmin, triggerToast);

  const handleInviteStaff = async (
    payload: ProvisionStaffPayload
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!isAdmin) {
      return { ok: false, error: "Solo administradores pueden integrar usuarios de staff." };
    }

    const res = await provisionStaffApi(payload);
    if (res.error || !res.data) {
      return { ok: false, error: res.error || "No se pudo integrar el usuario." };
    }

    await queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
    const actionLabel = res.data.created ? "integrado" : "actualizado";
    triggerToast(`${res.data.user.email} ${actionLabel} como ${res.data.user.role}.`);
    return { ok: true };
  };

  const handleConfirmStaffAction = async () => {
    if (!pendingAction || isActionSubmitting) return;
    const { member, action } = pendingAction;

    if (!isAdmin) {
      triggerToast("Solo administradores pueden gestionar cuentas de staff.");
      setPendingAction(null);
      return;
    }

    setIsActionSubmitting(true);
    setActionError(null);
    if (action === STAFF_ACTION_TYPE.DELETE) {
      const res = await deleteStaffApi(member.id);
      setIsActionSubmitting(false);
      if (res.error) {
        setActionError(res.error);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      triggerToast(`Usuario ${member.email} eliminado del sistema.`);
      setPendingAction(null);
      return;
    }

    const nextActive = action === STAFF_ACTION_TYPE.REACTIVATE;
    const res = await updateStaffStatusApi(member.id, nextActive);
    setIsActionSubmitting(false);
    if (res.error) {
      setActionError(res.error);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
    triggerToast(
      nextActive
        ? `Acceso restablecido para ${member.name}.`
        : `Acceso suspendido para ${member.name}.`
    );
    setPendingAction(null);
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
              Control de Accesos
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
              Políticas de Seguridad
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1 leading-relaxed">
            Aprovisionamiento de administradores, moderadores y docentes, y políticas granulares de permisos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            disabled={!isAdmin}
            className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus size={14} />
            <span>Integrar Usuario Staff</span>
          </button>

          {activeTab === "matrix" && (
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
          )}
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
          isLoading={isStaffLoading}
          isRefreshing={isStaffFetching}
          isAdmin={isAdmin}
          currentUserId={user?.id}
          onRequestAction={(member, action) => setPendingAction({ member, action })}
          onRefresh={async () => {
            const res = await refetchStaff();
            if (!res.isError) {
              triggerToast("Listado de staff actualizado.");
            }
          }}
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

      {/* Modal de Confirmación de Cambio de Estado o Eliminación */}
      <StaffActionModal
        member={pendingAction?.member ?? null}
        action={pendingAction?.action ?? null}
        isSubmitting={isActionSubmitting}
        errorMsg={actionError}
        onClose={() => {
          if (!isActionSubmitting) {
            setPendingAction(null);
            setActionError(null);
          }
        }}
        onConfirm={() => void handleConfirmStaffAction()}
      />

      <RbacConfirmModal
        action={rbacModalAction}
        diffCount={diffCount}
        isSubmitting={isRbacSubmitting}
        errorMsg={rbacError}
        onClose={closeRbacModal}
        onConfirm={() => void handleConfirmRbacModal()}
      />
    </div>
  );
}
