"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listTeacherApplicationsApi,
  approveTeacherApplicationApi,
  rejectTeacherApplicationApi,
  suspendTeacherApplicationApi,
  reactivateTeacherApplicationApi,
  deleteTeacherApplicationApi,
  ApiTeacherApplication,
} from "@/services/api/teacher-applications";
import {
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
  UserCheck,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { SuspendTeacherModal } from "./suspend-teacher-modal";
import { DeleteTeacherModal } from "./delete-teacher-modal";
import { TeacherApplicationRow } from "./teacher-application-row";

interface TeacherApplicationsTableProps {
  onNotify: (msg: string) => void;
  isAdmin: boolean;
}

export function TeacherApplicationsTable({ onNotify, isAdmin }: TeacherApplicationsTableProps) {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [suspendingApp, setSuspendingApp] = useState<ApiTeacherApplication | null>(null);
  const [isSuspending, setIsSuspending] = useState(false);
  const [deletingApp, setDeletingApp] = useState<ApiTeacherApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: applications = [], isLoading, refetch } = useQuery({
    queryKey: ["teacher-applications", statusFilter],
    queryFn: async () => {
      const res = await listTeacherApplicationsApi(statusFilter === "all" ? undefined : statusFilter);
      if (res.error) {
        onNotify("Error al cargar postulaciones de docentes");
      }
      return res.data?.applications || [];
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["teacher-applications"] });
  };

  const handleApprove = async (app: ApiTeacherApplication) => {
    if (!isAdmin) {
      onNotify("Solo administradores o moderadores pueden aprobar docentes");
      return;
    }
    setActionLoadingId(app.id);
    try {
      const res = await approveTeacherApplicationApi(app.id);
      if (res.error) {
        onNotify(`Error: ${res.error}`);
      } else {
        onNotify(`¡Postulación de ${app.user?.name || app.user?.email} aprobada! Rol cambiado a Instructor.`);
        invalidate();
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (app: ApiTeacherApplication) => {
    if (!isAdmin) {
      onNotify("Solo administradores o moderadores pueden rechazar postulaciones");
      return;
    }
    const reason = prompt("Ingresa el motivo del rechazo (opcional):", "No cumple con los requisitos pedagógicos.");
    if (reason === null) return;

    setActionLoadingId(app.id);
    try {
      const res = await rejectTeacherApplicationApi(app.id, reason);
      if (res.error) {
        onNotify(`Error: ${res.error}`);
      } else {
        onNotify(`Postulación de ${app.user?.name || app.user?.email} rechazada.`);
        invalidate();
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenSuspendModal = (app: ApiTeacherApplication) => {
    if (!isAdmin) {
      onNotify("Solo administradores pueden suspender docentes");
      return;
    }
    setSuspendingApp(app);
  };

  const handleConfirmSuspend = async (reason: string) => {
    if (!suspendingApp) return;
    setIsSuspending(true);
    setActionLoadingId(suspendingApp.id);
    try {
      const res = await suspendTeacherApplicationApi(suspendingApp.id, reason);
      if (res.error) {
        onNotify(`Error: ${res.error}`);
      } else {
        onNotify(`Docente ${suspendingApp.user?.name || suspendingApp.user?.email} suspendido. Sesiones invalidadas.`);
        setSuspendingApp(null);
        invalidate();
      }
    } finally {
      setIsSuspending(false);
      setActionLoadingId(null);
    }
  };

  const handleReactivate = async (app: ApiTeacherApplication) => {
    if (!isAdmin) {
      onNotify("Solo administradores pueden reactivar docentes");
      return;
    }
    setActionLoadingId(app.id);
    try {
      const res = await reactivateTeacherApplicationApi(app.id);
      if (res.error) {
        onNotify(`Error: ${res.error}`);
      } else {
        onNotify(`Docente ${app.user?.name || app.user?.email} reactivado con rol de Instructor.`);
        invalidate();
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenDeleteModal = (app: ApiTeacherApplication) => {
    if (!isAdmin) {
      onNotify("Solo administradores pueden eliminar registros de docentes");
      return;
    }
    setDeletingApp(app);
  };

  const handleConfirmDelete = async () => {
    if (!deletingApp) return;
    setIsDeleting(true);
    setActionLoadingId(deletingApp.id);
    try {
      const res = await deleteTeacherApplicationApi(deletingApp.id);
      if (res.error) {
        onNotify(`Error: ${res.error}`);
      } else {
        onNotify(`Registro eliminado y permisos de docente revocados.`);
        setDeletingApp(null);
        invalidate();
      }
    } finally {
      setIsDeleting(false);
      setActionLoadingId(null);
    }
  };

  const pendingCount = applications.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-4">
      {/* Barra de control y filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-card rounded-2xl border border-border-default">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-subtle uppercase">Filtrar por estado:</span>
          <div className="flex items-center gap-1.5">
            {[
              { id: "pending", label: "Pendientes" },
              { id: "approved", label: "Aprobados" },
              { id: "suspended", label: "Suspendidos" },
              { id: "rejected", label: "Rechazados" },
              { id: "all", label: "Todos" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  statusFilter === tab.id
                    ? "bg-emerald-brand text-canvas font-bold"
                    : "bg-canvas text-slate-muted hover:text-white border border-border-default"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default hover:text-white text-slate-muted text-xs font-mono flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Lista / Tabla de Postulaciones */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-muted bg-card rounded-2xl border border-border-default flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-brand" />
          <span className="text-xs font-mono">Cargando postulaciones docentes...</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-2xl border border-border-default space-y-2">
          <UserCheck className="w-8 h-8 text-emerald-brand/40 mx-auto" />
          <p className="text-sm font-bold text-white">No hay postulaciones {statusFilter !== "all" ? `en estado '${statusFilter}'` : ""}</p>
          <p className="text-xs text-slate-muted">
            Cuando un docente se registre con Google en Wordtap Studio, aparecerá aquí para su evaluación.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-default bg-card shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas text-slate-subtle font-mono text-[11px] uppercase border-b border-border-default">
              <tr>
                <th className="py-3 px-4">Postulante (Google)</th>
                <th className="py-3 px-4">Especialidad & Bio</th>
                <th className="py-3 px-4">Fecha de Solicitud</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default/60 text-slate-200">
              {applications.map((app) => (
                <TeacherApplicationRow
                  key={app.id}
                  app={app}
                  isItemLoading={actionLoadingId === app.id}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onOpenSuspendModal={handleOpenSuspendModal}
                  onReactivate={handleReactivate}
                  onOpenDeleteModal={handleOpenDeleteModal}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SuspendTeacherModal
        isOpen={Boolean(suspendingApp)}
        teacherName={suspendingApp?.user?.name || "Docente"}
        teacherEmail={suspendingApp?.user?.email || ""}
        onClose={() => setSuspendingApp(null)}
        onConfirm={handleConfirmSuspend}
        isLoading={isSuspending}
      />

      <DeleteTeacherModal
        isOpen={Boolean(deletingApp)}
        teacherName={deletingApp?.user?.name || "Docente"}
        teacherEmail={deletingApp?.user?.email || ""}
        onClose={() => setDeletingApp(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
