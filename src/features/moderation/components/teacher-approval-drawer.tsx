"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  X,
  FileEdit,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Award,
  RotateCcw,
} from "lucide-react";
import { ApprovalRequest } from "@/features/moderation/types";
import { FeedbackTextRenderer } from "@/components/ui/feedback-text-renderer";

interface TeacherApprovalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePr: ApprovalRequest | null;
  feedbackThread: { sender: string; text: string; time: string; isTeacher: boolean }[];
  onWithdraw?: (pr: ApprovalRequest) => void;
}

export function TeacherApprovalDrawer({
  isOpen,
  onClose,
  activePr,
  feedbackThread,
  onWithdraw,
}: TeacherApprovalDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !activePr) return null;

  const builderHref = activePr.courseId
    ? `/teacher/builder?courseId=${activePr.courseId}`
    : "/teacher/builder";

  const isRejected = activePr.status === "rejected";
  const isChangesRequested = activePr.status === "changes_requested";
  const isApproved = activePr.status === "approved";
  const isPending = activePr.status === "pending" || activePr.status === "in_review";

  const handleWithdrawClick = () => {
    if (onWithdraw) {
      onWithdraw(activePr);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl lg:max-w-3xl bg-card border-l border-border-default h-full flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-200 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera Fijada */}
        <div className="p-5 border-b border-border-default bg-canvas/80 backdrop-blur-md flex flex-col gap-3 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-mint-brand">{activePr.id}</span>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded border inline-flex items-center gap-1.5 ${
                  isRejected
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                    : isChangesRequested
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : isApproved
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                }`}
              >
                {isRejected && <XCircle className="w-3 h-3 text-rose-400" />}
                {isChangesRequested && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                {isApproved && <Award className="w-3 h-3 text-emerald-400" />}
                {isPending && <Clock className="w-3 h-3 text-blue-400" />}
                <span>{activePr.statusLabel}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-card border border-border-default hover:border-slate-400 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Cerrar auditoría (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{activePr.title}</h3>
            <p className="text-xs text-slate-muted mt-0.5">
              Revisor Asignado: <strong className="text-slate-200">{activePr.reviewer}</strong> • Fecha: {activePr.submittedDate} • {activePr.changes}
            </p>
          </div>

          {/* Barra de Acciones Inmediatas */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-default/60">
            {isPending && onWithdraw && (
              <button
                type="button"
                onClick={handleWithdrawClick}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Cancelar solicitud y devolver curso a borrador para continuar editándolo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retirar a Borrador</span>
              </button>
            )}

            <Link
              href={builderHref}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ml-auto ${
                isChangesRequested
                  ? "bg-amber-500 hover:bg-amber-400 text-canvas shadow-sm"
                  : isRejected
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
                  : "bg-emerald-brand hover:bg-mint-brand text-canvas shadow-glow-emerald"
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>
                {isChangesRequested
                  ? "Aplicar Cambios en Creador"
                  : isRejected
                  ? "Corregir en el Creador"
                  : "Editar Curso en Creador"}
              </span>
            </Link>
          </div>
        </div>

        {/* Cuerpo con Scroll */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Banner de Estado Contextual */}
          {isChangesRequested && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">Cambios Solicitados por el Revisor</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                    Ajustes Menores
                  </span>
                </div>
                <p className="text-amber-200/95 leading-relaxed">
                  Revisa el dictamen pedagógico a continuación y aplica las correcciones solicitadas en las lecciones del creador.
                </p>
              </div>
            </div>
          )}

          {isRejected && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 shadow-sm">
              <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">Curso Rechazado</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/30">
                    Requiere Atención
                  </span>
                </div>
                <p className="text-rose-200/95 leading-relaxed">
                  El contenido no superó los estándares pedagógicos o normativos de la plataforma. Revisa las observaciones y reajusta las lecciones.
                </p>
              </div>
            </div>
          )}

          {isApproved && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3 shadow-sm">
              <Award className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white text-sm">Curso Aprobado & Verificado</p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                    En Producción
                  </span>
                </div>
                <p className="text-emerald-200/90 mt-0.5 leading-relaxed">
                  Este contenido superó la auditoría de calidad y se encuentra activo en el catálogo oficial de Wordtap.
                </p>
              </div>
            </div>
          )}

          {isPending && (
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex items-start gap-3 shadow-sm">
              <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white text-sm">
                    {activePr.isResubmission ? "Nueva Versión con Correcciones en Auditoría" : "En Proceso de Auditoría Pedagógica"}
                  </p>
                  {activePr.isResubmission && (
                    <span className="px-2 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold border border-blue-500/30">
                      Versión Corregida
                    </span>
                  )}
                </div>
                <p className="text-blue-200/90 leading-relaxed">
                  {activePr.isResubmission
                    ? "Tus correcciones fueron enviadas con éxito. El equipo de calidad está revisando la nueva versión."
                    : `La solicitud está en la cola de moderación. El equipo de calidad revisará la fonética y lecciones en breve (Espera aprox: ${activePr.waitHours}).`}
                </p>
              </div>
            </div>
          )}

          {/* Bloque 1: Contenido Sometido por el Docente */}
          <div className="p-4 rounded-2xl bg-canvas border border-border-default space-y-3">
            <div className="flex items-center justify-between border-b border-border-default pb-2">
              <span className="font-mono text-slate-subtle font-bold uppercase text-[10px]">
                Contenido Sometido por el Docente
              </span>
              <span className="px-2 py-0.5 rounded bg-card text-slate-400 font-mono text-[10px]">
                {activePr.id}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border-default space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">{activePr.title}</span>
                <span className="font-mono text-slate-400 text-xs">Fecha: {activePr.submittedDate}</span>
              </div>
              <p className="text-slate-300">{activePr.changes}</p>
              {activePr.changeSummary && (
                <p className="text-[11px] text-mint-brand font-mono">
                  Resumen: {activePr.changeSummary}
                </p>
              )}
            </div>
          </div>

          {/* Bloque 2: Dictamen Pedagógico Oficial del Revisor */}
          <div className="p-4 rounded-2xl bg-card border border-border-default space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-border-default pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-4 h-4 ${
                  isRejected
                    ? "text-rose-400"
                    : isChangesRequested
                    ? "text-amber-400"
                    : isApproved
                    ? "text-emerald-brand"
                    : "text-blue-400"
                }`} />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Dictamen Pedagógico Oficial
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {activePr.reviewer} • {activePr.submittedDate}
              </span>
            </div>

            {activePr.notes ? (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                  isRejected
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
                    : isChangesRequested
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                    : isApproved
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                    : "bg-card border-border-default text-slate-300"
                }`}
              >
                <FeedbackTextRenderer
                  text={activePr.notes}
                  bulletColor={isRejected ? "text-rose-400" : isChangesRequested ? "text-amber-400" : "text-emerald-brand"}
                />
              </div>
            ) : activePr.previousNotes ? (
              <div className="space-y-2">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                    <span>Observaciones de la revisión previa (atendidas en este re-envío):</span>
                  </div>
                  <FeedbackTextRenderer
                    text={activePr.previousNotes}
                    bulletColor="text-amber-400"
                  />
                </div>
                <p className="text-[11px] text-blue-300/80 italic">
                  En espera del nuevo dictamen del moderador sobre las correcciones aplicadas.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-canvas border border-border-default text-xs text-slate-400 italic">
                {isPending
                  ? "Solicitud en espera de revisión por el equipo pedagógico."
                  : isApproved
                  ? "Contenido verificado y aprobado sin observaciones pendientes."
                  : "Sin observaciones registradas por el revisor."}
              </div>
            )}

            <div className="pt-2 border-t border-border-default/50 text-[11px] text-slate-400">
              <span>Para responder con correcciones, edita el curso en el Creador y vuelve a enviarlo a revisión.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
