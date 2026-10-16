"use client";

import Link from "next/link";
import {
  Smartphone,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Award,
} from "lucide-react";
import { useTeacherApprovals } from "../hooks/use-teacher-approvals";
import { useUrlParams } from "@/hooks/use-url-params";
import { TeacherApprovalDrawer } from "../components/teacher-approval-drawer";
import { ToastNotification } from "@/components/ui/toast-notification";

export function CourseApprovalsView() {
  const { get, setParams } = useUrlParams();

  const {
    prs,
    activePr,
    selectedPrId,
    activeTab,
    setActiveTab,
    isLoading,
    toastMessage,
    counts,
    feedbackThread,
    handleWithdrawReview,
    refreshApprovals,
  } = useTeacherApprovals();

  // El drawer vive en la URL: se abre solo cuando ?pr= existe en la cola actual.
  const queryPr = get("pr");
  const isDrawerOpen = Boolean(queryPr) && prs.some((p) => p.id === queryPr);

  const handleOpenDetail = (prId: string) => {
    setParams({ pr: prId }, "push");
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      <ToastNotification message={toastMessage} variant="emerald" />

      {/* Encabezado y Estadísticas Dinámicas de la Cola */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Mis Solicitudes de Aprobación (PRs)
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
              Espacio Docente
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            Seguimiento de cursos enviados a revisión y feedback pedagógico del revisor antes de su publicación en la app móvil.
          </p>
        </div>

        {/* Indicadores Dinámicos de Estado */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {counts.corrections > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Correcciones Pedidas:</span>
              <strong className="text-amber-400">{counts.corrections}</strong>
            </div>
          )}

          {counts.rejected > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Rechazadas:</span>
              <strong className="text-rose-400">{counts.rejected}</strong>
            </div>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-card border border-border-default flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-slate-muted">En Revisión:</span>
            <strong className="text-blue-400">{counts.pending}</strong>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-card border border-border-default flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-brand" />
            <span className="text-slate-muted">Aprobadas:</span>
            <strong className="text-emerald-brand">{counts.approved}</strong>
          </div>
        </div>
      </div>

      {/* Banner Informativo y Acceso Rápido al Creador */}
      <div className="p-3.5 rounded-2xl bg-card border border-border-default text-slate-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-bold font-mono text-emerald-brand">ℹ</span>
          <span>
            <strong>Ciclo de Revisión & Feedback:</strong> Si un curso es rechazado o requiere cambios, revisa el <em>Feedback Pedagógico del Revisor</em> y edita el contenido directamente en el creador.
          </span>
        </div>
        <Link
          href="/teacher/builder"
          className="px-3.5 py-1.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs flex items-center gap-1.5 hover:bg-mint-brand transition-colors cursor-pointer flex-shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Ir al Creador</span>
        </Link>
      </div>

      {/* Pestañas de Filtrado Dinámico por Estado */}
      <div className="flex items-center justify-between border-b border-border-default pb-3">
        <div className="flex flex-wrap items-center gap-1 bg-card p-1 rounded-2xl border border-border-default text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Todas ({counts.total})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("corrections")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "corrections"
                ? "bg-amber-500 text-canvas font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            <span>Correcciones</span>
            {counts.corrections > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === "corrections" ? "bg-white text-amber-700" : "bg-amber-500/20 text-amber-300"
              }`}>
                {counts.corrections}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "pending"
                ? "bg-blue-500 text-white font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            <span>En Revisión</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === "pending" ? "bg-white/20 text-white" : "bg-card-hover text-slate-400"
            }`}>
              {counts.pending}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("approved")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "approved"
                ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            <span>Aprobadas</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === "approved" ? "bg-white/20 text-canvas" : "bg-card-hover text-slate-400"
            }`}>
              {counts.approved}
            </span>
          </button>

          {counts.rejected > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("rejected")}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "rejected"
                  ? "bg-rose-500 text-white font-bold shadow-sm"
                  : "text-slate-muted hover:text-white"
              }`}
            >
              <span>Rechazadas</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === "rejected" ? "bg-white text-rose-600" : "bg-rose-500/20 text-rose-300"
              }`}>
                {counts.rejected}
              </span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={refreshApprovals}
          disabled={isLoading}
          className="p-2 rounded-xl bg-card border border-border-default hover:border-emerald-brand text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold disabled:opacity-50"
          title="Recargar solicitudes manualmente"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-brand" : ""}`} />
          <span className="hidden sm:inline">Recargar</span>
        </button>
      </div>

      {/* Tabla de Solicitudes Dinámica */}
      <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-sm text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Solicitud</th>
                <th className="p-3.5">Curso</th>
                <th className="p-3.5">Fecha</th>
                <th className="p-3.5">Revisor</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5">Feedback Pedagógico</th>
                <th className="p-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {prs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-canvas border border-border-default flex items-center justify-center text-slate-500">
                        <Clock className="w-6 h-6 text-emerald-brand/60" />
                      </div>
                      <p className="font-bold text-white text-sm">
                        No hay solicitudes de revisión disponibles
                      </p>
                      <p className="text-xs text-slate-muted max-w-md">
                        {activeTab === "corrections"
                          ? "¡Excelente! No tienes cursos con correcciones solicitadas por el revisor."
                          : activeTab === "pending"
                          ? "No tienes cursos en espera de revisión en este momento."
                          : activeTab === "approved"
                          ? "Aún no tienes cursos aprobados en la plataforma."
                          : activeTab === "rejected"
                          ? "No tienes cursos rechazados."
                          : "Cuando envíes un curso a revisión desde el Creador de Cursos, aquí podrás ver su auditoría pedagógica y dictamen oficial."}
                      </p>
                      {activeTab === "all" && (
                        <Link
                          href="/teacher/builder"
                          className="mt-2 px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors shadow-sm inline-flex items-center gap-1.5"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Ir al Creador de Cursos</span>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                prs.map((pr) => {
                  const isSelected = pr.id === selectedPrId;
                  const isRejected = pr.status === "rejected";
                  const isChangesReq = pr.status === "changes_requested";
                  const isApproved = pr.status === "approved";

                  return (
                    <tr
                      key={pr.id}
                      onClick={() => handleOpenDetail(pr.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? isRejected
                            ? "bg-rose-500/10"
                            : isChangesReq
                            ? "bg-amber-500/10"
                            : "bg-emerald-brand/10"
                          : "hover:bg-card-hover/40"
                      }`}
                    >
                      <td className="p-3.5 font-bold font-mono text-mint-brand">{pr.id}</td>
                      <td className="p-3.5 font-semibold text-white">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span>{pr.title}</span>
                            {isApproved && (
                              <span title="Insignia oficial: Curso auditado y aprobado">
                                <Award className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              </span>
                            )}
                            {pr.isResubmission && (
                              <span
                                className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                title="El curso fue re-enviado con correcciones aplicadas"
                              >
                                Versión Corregida
                              </span>
                            )}
                          </div>
                          {(pr.changeSummary || pr.changes) && (
                            <p className="text-[11px] text-slate-400 font-normal truncate max-w-sm">
                              ✎ {pr.changeSummary || pr.changes}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-300 font-mono">{pr.submittedDate}</td>
                      <td className="p-3.5 text-slate-300">{pr.reviewer}</td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                            isRejected
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                              : isChangesReq
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                              : isApproved
                              ? "bg-emerald-brand/20 text-emerald-brand border-emerald-brand/30"
                              : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                          }`}
                        >
                          {isRejected && <XCircle className="w-3 h-3 text-rose-400" />}
                          {isChangesReq && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                          {isApproved && <Award className="w-3 h-3 text-emerald-400" />}
                          {pr.status === "in_review" && <Clock className="w-3 h-3 text-blue-400" />}
                          {pr.statusLabel}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {pr.notes ? (
                          <div className="flex items-center gap-1.5 max-w-xs truncate text-[11px]">
                            <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${
                              isRejected
                                ? "text-rose-400"
                                : isChangesReq
                                ? "text-amber-400"
                                : "text-emerald-brand"
                            }`} />
                            <span className={`truncate ${
                              isRejected
                                ? "text-rose-200"
                                : isChangesReq
                                ? "text-amber-200"
                                : "text-slate-300"
                            }`}>
                              {pr.notes}
                            </span>
                          </div>
                        ) : pr.previousNotes ? (
                          <div
                            className="flex items-center gap-1.5 max-w-xs truncate text-[11px] text-amber-300/80"
                            title={`Observaciones anteriores atendidas: ${pr.previousNotes}`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                            <span className="truncate">Previo: {pr.previousNotes}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-mono text-[10px]">—</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(pr.id);
                          }}
                          className="px-3 py-1 rounded-lg bg-canvas border border-border-default hover:border-emerald-brand text-emerald-brand hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer Lateral de Detalle y Feedback Pedagógico */}
      <TeacherApprovalDrawer
        isOpen={isDrawerOpen}
        onClose={() => setParams({ pr: null }, "replace")}
        activePr={activePr}
        feedbackThread={feedbackThread}
        onWithdraw={handleWithdrawReview}
      />
    </div>
  );
}
