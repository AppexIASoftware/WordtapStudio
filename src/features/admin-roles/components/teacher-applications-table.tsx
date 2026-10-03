"use client";

import React, { useState, useEffect } from "react";
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
  XCircle,
  Clock,
  Loader2,
  RefreshCw,
  UserCheck,
  AlertCircle,
  ShieldAlert,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { SuspendTeacherModal } from "./suspend-teacher-modal";
import { DeleteTeacherModal } from "./delete-teacher-modal";

interface TeacherApplicationsTableProps {
  onNotify: (msg: string) => void;
  isAdmin: boolean;
}

export function TeacherApplicationsTable({ onNotify, isAdmin }: TeacherApplicationsTableProps) {
  const [applications, setApplications] = useState<ApiTeacherApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [suspendingApp, setSuspendingApp] = useState<ApiTeacherApplication | null>(null);
  const [isSuspending, setIsSuspending] = useState(false);
  const [deletingApp, setDeletingApp] = useState<ApiTeacherApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const res = await listTeacherApplicationsApi(statusFilter === "all" ? undefined : statusFilter);
      if (res.data) {
        setApplications(res.data.applications || []);
      }
    } catch {
      onNotify("Error al cargar postulaciones de docentes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

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
        loadApplications();
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
        loadApplications();
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
        loadApplications();
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
        loadApplications();
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
        loadApplications();
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
          onClick={loadApplications}
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
              {applications.map((app) => {
                const isItemLoading = actionLoadingId === app.id;
                return (
                  <tr key={app.id} className="hover:bg-card-hover/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-brand/10 border border-emerald-brand/30 text-emerald-brand font-bold flex items-center justify-center text-xs">
                          {app.user?.name ? app.user.name.slice(0, 2).toUpperCase() : "WT"}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{app.user?.name || "Sin nombre"}</p>
                          <p className="text-[11px] text-slate-subtle font-mono">{app.user?.email || "Sin email"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-semibold text-white truncate">{app.specialty || "Inglés General"}</p>
                      <p className="text-[11px] text-slate-subtle truncate">{app.bio || "Registrado vía Google OAuth"}</p>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-subtle text-[11px]">
                      {new Date(app.created_at).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border ${
                          app.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : app.status === "suspended"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : app.status === "rejected"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {app.status}
                      </span>
                      {app.rejection_reason && (
                        <p className="text-[10px] text-rose-400 mt-1 truncate max-w-xs">
                          Motivo: {app.rejection_reason}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {app.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={isItemLoading}
                            onClick={() => handleApprove(app)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1 cursor-pointer shadow-glow-emerald disabled:opacity-50"
                          >
                            <CheckCircle size={13} />
                            <span>Aprobar</span>
                          </button>

                          <button
                            type="button"
                            disabled={isItemLoading}
                            onClick={() => handleReject(app)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold text-xs hover:bg-rose-500/20 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <XCircle size={13} />
                            <span>Rechazar</span>
                          </button>
                        </div>
                      ) : app.status === "approved" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={isItemLoading}
                            onClick={() => handleOpenSuspendModal(app)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs hover:bg-amber-500/20 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            title="Suspender cuenta e invalidar sesiones"
                          >
                            <ShieldAlert size={12} />
                            <span>Suspender</span>
                          </button>
                          <button
                            type="button"
                            disabled={isItemLoading}
                            onClick={() => handleOpenDeleteModal(app)}
                            className="p-1.5 rounded-xl text-slate-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                            title="Eliminar postulación y revocar permisos"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ) : app.status === "suspended" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={isItemLoading}
                            onClick={() => handleReactivate(app)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1 cursor-pointer shadow-glow-emerald disabled:opacity-50"
                            title="Restablecer cuenta docente"
                          >
                            <RotateCcw size={12} />
                            <span>Reactivar</span>
                          </button>
                          <button
                            type="button"
                            disabled={isItemLoading}
                            onClick={() => handleOpenDeleteModal(app)}
                            className="p-1.5 rounded-xl text-slate-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                            title="Eliminar registro permanentemente"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={isItemLoading}
                            onClick={() => handleApprove(app)}
                            className="px-2.5 py-1.5 rounded-xl bg-card border border-border-default hover:border-emerald-brand text-xs text-slate-300 hover:text-emerald-brand transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            title="Reconsiderar y autorizar"
                          >
                            <CheckCircle size={12} />
                            <span>Aprobar</span>
                          </button>
                          <button
                            type="button"
                            disabled={isItemLoading}
                            onClick={() => handleOpenDeleteModal(app)}
                            className="p-1.5 rounded-xl text-slate-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                            title="Eliminar registro"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
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
