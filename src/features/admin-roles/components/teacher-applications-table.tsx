"use client";

import React, { useMemo, useState } from "react";
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
import { RefreshCw, UserCheck, Search } from "lucide-react";
import { SuspendTeacherModal } from "./suspend-teacher-modal";
import { DeleteTeacherModal } from "./delete-teacher-modal";
import { TeacherApplicationRow } from "./teacher-application-row";
import {
  ApplicationDecisionModal,
  ApplicationDecisionType,
  APPLICATION_DECISION_TYPE,
} from "./application-decision-modal";

interface TeacherApplicationsTableProps {
  onNotify: (msg: string) => void;
  isAdmin: boolean;
}

const APPLICATION_STATUS_FILTERS = [
  { id: "pending", label: "Pendientes" },
  { id: "approved", label: "Aprobados" },
  { id: "suspended", label: "Suspendidos" },
  { id: "rejected", label: "Rechazados" },
  { id: "all", label: "Todos" },
] as const;

function ApplicationsTableSkeleton() {
  return (
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
        <tbody className="divide-y divide-border-default/60">
          {Array.from({ length: 3 }).map((_, idx) => (
            <tr key={idx} className="animate-pulse">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700/40 flex-shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-28 rounded bg-slate-700/40" />
                    <div className="h-2.5 w-36 rounded bg-slate-700/30" />
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 space-y-1.5">
                <div className="h-3 w-28 rounded bg-slate-700/40" />
                <div className="h-2.5 w-44 rounded bg-slate-700/30" />
              </td>
              <td className="py-3 px-4">
                <div className="h-3 w-24 rounded bg-slate-700/30" />
              </td>
              <td className="py-3 px-4">
                <div className="h-4 w-20 rounded-full bg-slate-700/40" />
              </td>
              <td className="py-3 px-4 text-right">
                <div className="h-6 w-28 rounded-xl bg-slate-700/40 ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TeacherApplicationsTable({ onNotify, isAdmin }: TeacherApplicationsTableProps) {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [decisionState, setDecisionState] = useState<{
    app: ApiTeacherApplication;
    type: ApplicationDecisionType;
  } | null>(null);
  const [isDecisionSubmitting, setIsDecisionSubmitting] = useState(false);
  const [decisionError, setDecisionError] = useState<string | null>(null);

  const [suspendingApp, setSuspendingApp] = useState<ApiTeacherApplication | null>(null);
  const [isSuspending, setIsSuspending] = useState(false);
  const [deletingApp, setDeletingApp] = useState<ApiTeacherApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: applications = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["teacher-applications", statusFilter],
    queryFn: async () => {
      const res = await listTeacherApplicationsApi(statusFilter === "all" ? undefined : statusFilter);
      if (res.error) {
        onNotify("Error al cargar postulaciones de docentes");
      }
      return res.data?.applications || [];
    },
  });

  const filteredApplications = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter(
      (a) =>
        (a.user?.name || "").toLowerCase().includes(q) ||
        (a.user?.email || "").toLowerCase().includes(q)
    );
  }, [applications, searchTerm]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["teacher-applications"] });
    queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
  };

  const openDecisionModal = (app: ApiTeacherApplication, type: ApplicationDecisionType) => {
    if (!isAdmin) {
      onNotify("Solo administradores pueden gestionar postulaciones docentes");
      return;
    }
    setDecisionError(null);
    setDecisionState({ app, type });
  };

  const handleConfirmDecision = async (reason?: string) => {
    if (!decisionState || isDecisionSubmitting) return;
    const { app, type } = decisionState;

    setIsDecisionSubmitting(true);
    setDecisionError(null);
    setActionLoadingId(app.id);

    try {
      if (type === APPLICATION_DECISION_TYPE.APPROVE) {
        const res = await approveTeacherApplicationApi(app.id);
        if (res.error) {
          setDecisionError(res.error);
          return;
        }
        onNotify(`Postulación de ${app.user?.name || app.user?.email} aprobada. Rol asignado: Docente.`);
      } else if (type === APPLICATION_DECISION_TYPE.REJECT) {
        const res = await rejectTeacherApplicationApi(app.id, reason || "");
        if (res.error) {
          setDecisionError(res.error);
          return;
        }
        onNotify(`Postulación de ${app.user?.name || app.user?.email} rechazada.`);
      } else {
        const res = await reactivateTeacherApplicationApi(app.id);
        if (res.error) {
          setDecisionError(res.error);
          return;
        }
        onNotify(`Docente ${app.user?.name || app.user?.email} reactivado con rol de Docente.`);
      }

      setDecisionState(null);
      invalidate();
    } finally {
      setIsDecisionSubmitting(false);
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
        onNotify(`Docente ${suspendingApp.user?.name || suspendingApp.user?.email} suspendido.`);
        setSuspendingApp(null);
        invalidate();
      }
    } finally {
      setIsSuspending(false);
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
        onNotify("Registro eliminado y permisos de docente revocados.");
        setDeletingApp(null);
        invalidate();
      }
    } finally {
      setIsDeleting(false);
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 bg-card rounded-2xl border border-border-default">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-subtle uppercase">Filtrar por estado:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {APPLICATION_STATUS_FILTERS.map((tab) => (
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

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar postulante..."
              className="pl-8 pr-3 py-1.5 bg-canvas border border-border-default rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-brand w-48"
            />
          </div>

          <button
            type="button"
            onClick={async () => {
              const res = await refetch();
              if (!res.isError) onNotify("Cola de postulaciones actualizada.");
            }}
            disabled={isLoading || isFetching}
            className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default hover:text-white text-slate-muted text-xs font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={12} className={isLoading || isFetching ? "animate-spin" : ""} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <ApplicationsTableSkeleton />
      ) : filteredApplications.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-2xl border border-border-default space-y-2">
          <UserCheck className="w-8 h-8 text-emerald-brand/40 mx-auto" />
          <p className="text-sm font-bold text-white">
            {applications.length === 0
              ? `No hay postulaciones ${statusFilter !== "all" ? `en estado '${statusFilter}'` : ""}`
              : "No hay coincidencias para tu búsqueda"}
          </p>
          <p className="text-xs text-slate-muted">
            {applications.length === 0
              ? "Cuando un docente se registre con Google en Wordtap Studio, aparecerá aquí para su evaluación."
              : "Prueba limpiando el campo de búsqueda."}
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
              {filteredApplications.map((app) => (
                <TeacherApplicationRow
                  key={app.id}
                  app={app}
                  isItemLoading={actionLoadingId === app.id}
                  onApprove={(target) => openDecisionModal(target, APPLICATION_DECISION_TYPE.APPROVE)}
                  onReject={(target) => openDecisionModal(target, APPLICATION_DECISION_TYPE.REJECT)}
                  onOpenSuspendModal={handleOpenSuspendModal}
                  onReactivate={(target) =>
                    openDecisionModal(target, APPLICATION_DECISION_TYPE.REACTIVATE)
                  }
                  onOpenDeleteModal={handleOpenDeleteModal}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ApplicationDecisionModal
        application={decisionState?.app ?? null}
        decisionType={decisionState?.type ?? null}
        isSubmitting={isDecisionSubmitting}
        errorMsg={decisionError}
        onClose={() => {
          if (!isDecisionSubmitting) {
            setDecisionState(null);
            setDecisionError(null);
          }
        }}
        onConfirm={(reason) => void handleConfirmDecision(reason)}
      />

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
