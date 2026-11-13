"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { ContentReport } from "../types";

export const REPORT_TRIAGE_ACTION = {
  RESOLVED: "resolved",
  DISMISSED: "dismissed",
} as const;

export type ReportTriageAction =
  (typeof REPORT_TRIAGE_ACTION)[keyof typeof REPORT_TRIAGE_ACTION];

const TRIAGE_COPY: Record<
  ReportTriageAction,
  {
    title: string;
    impact: string;
    confirmLabel: string;
    buttonClass: string;
    accentClass: string;
  }
> = {
  [REPORT_TRIAGE_ACTION.RESOLVED]: {
    title: "Confirmar Resolución de Incidencia",
    impact:
      "El reporte quedará marcado como Resuelto y se registrará en la bitácora oficial de auditoría.",
    confirmLabel: "Marcar como Resuelto",
    buttonClass: "bg-emerald-brand hover:bg-mint-brand text-canvas",
    accentClass: "text-emerald-brand",
  },
  [REPORT_TRIAGE_ACTION.DISMISSED]: {
    title: "Descartar Reporte de Estudiante",
    impact:
      "El reporte se archivará como Descartado y dejará de figurar en la cola de incidencias activas.",
    confirmLabel: "Confirmar Descarte",
    buttonClass: "bg-rose-600 hover:bg-rose-500 text-white",
    accentClass: "text-rose-400",
  },
};

interface ReportTriageModalProps {
  report: ContentReport | null;
  action: ReportTriageAction | null;
  onClose: () => void;
  onConfirm: (
    reportId: string,
    action: ReportTriageAction
  ) => Promise<{ ok: boolean; error?: string }>;
}

export function ReportTriageModal({
  report,
  action,
  onClose,
  onConfirm,
}: ReportTriageModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!report || !action) return null;

  const copy = TRIAGE_COPY[action];

  const handleClose = () => {
    if (isSubmitting) return;
    setErrorMessage(null);
    onClose();
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await onConfirm(report.id, action);
      if (!res.ok) {
        setErrorMessage(
          res.error || "No se pudo actualizar el estado del reporte."
        );
      }
    } catch {
      setErrorMessage("Error de conexión al actualizar el reporte.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            {action === REPORT_TRIAGE_ACTION.RESOLVED ? (
              <CheckCircle2 className={`w-4 h-4 ${copy.accentClass}`} />
            ) : (
              <XCircle className={`w-4 h-4 ${copy.accentClass}`} />
            )}
            <span>{copy.title}</span>
          </h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-slate-muted hover:text-white font-bold cursor-pointer disabled:opacity-40"
          >
            &times;
          </button>
        </div>

        <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-1">
          <p className="font-bold text-white">{report.lesson_title}</p>
          <p className="text-slate-300">{report.reason}</p>
          <p className="text-[11px] text-slate-subtle">
            Reportado por {report.reporter_name} ({report.reporter_email})
          </p>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>{copy.impact}</span>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-[11px]"
          >
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-semibold cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-xl font-bold cursor-pointer flex items-center gap-1.5 disabled:opacity-50 ${copy.buttonClass}`}
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{copy.confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
