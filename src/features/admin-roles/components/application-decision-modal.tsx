"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, RotateCcw, AlertTriangle, X } from "lucide-react";
import { ApiTeacherApplication } from "@/services/api/teacher-applications";

export const APPLICATION_DECISION_TYPE = {
  APPROVE: "approve",
  REJECT: "reject",
  REACTIVATE: "reactivate",
} as const;

export type ApplicationDecisionType =
  (typeof APPLICATION_DECISION_TYPE)[keyof typeof APPLICATION_DECISION_TYPE];

interface ApplicationDecisionModalProps {
  application: ApiTeacherApplication | null;
  decisionType: ApplicationDecisionType | null;
  isSubmitting: boolean;
  errorMsg: string | null;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
}

const DECISION_META: Record<
  ApplicationDecisionType,
  {
    title: string;
    description: string;
    confirmLabel: string;
    confirmClass: string;
    accentClass: string;
    icon: React.ReactNode;
    requiresReasonInput?: boolean;
  }
> = {
  [APPLICATION_DECISION_TYPE.APPROVE]: {
    title: "Aprobar postulación docente",
    description:
      "El usuario recibirá el rol de Docente (Instructor) y podrá crear cursos y contenido en Wordtap Studio.",
    confirmLabel: "Confirmar aprobación",
    confirmClass: "bg-emerald-brand text-canvas hover:bg-mint-brand",
    accentClass: "bg-emerald-brand/10 text-emerald-brand",
    icon: <CheckCircle size={16} />,
  },
  [APPLICATION_DECISION_TYPE.REJECT]: {
    title: "Rechazar postulación docente",
    description:
      "La solicitud pasará a estado Rechazado. Opcionalmente puedes indicar el motivo para el postulante.",
    confirmLabel: "Confirmar rechazo",
    confirmClass: "bg-rose-600 text-white hover:bg-rose-500",
    accentClass: "bg-rose-500/10 text-rose-400",
    icon: <XCircle size={16} />,
    requiresReasonInput: true,
  },
  [APPLICATION_DECISION_TYPE.REACTIVATE]: {
    title: "Reactivar docente",
    description:
      "El usuario recuperará su acceso activo con rol de Docente (Instructor) en Wordtap Studio.",
    confirmLabel: "Confirmar reactivación",
    confirmClass: "bg-emerald-brand text-canvas hover:bg-mint-brand",
    accentClass: "bg-emerald-brand/10 text-emerald-brand",
    icon: <RotateCcw size={16} />,
  },
};

export function ApplicationDecisionModal({
  application,
  decisionType,
  isSubmitting,
  errorMsg,
  onClose,
  onConfirm,
}: ApplicationDecisionModalProps) {
  const [reason, setReason] = useState("No cumple con los requisitos pedagógicos.");
  const modalKey = `${application?.id ?? ""}:${decisionType ?? ""}`;
  const [prevModalKey, setPrevModalKey] = useState(modalKey);
  if (prevModalKey !== modalKey) {
    setPrevModalKey(modalKey);
    if (decisionType === APPLICATION_DECISION_TYPE.REJECT) {
      setReason("No cumple con los requisitos pedagógicos.");
    }
  }

  if (!application || !decisionType) return null;

  const meta = DECISION_META[decisionType];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${meta.accentClass}`}>
              {meta.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{meta.title}</h3>
              <p className="text-[11px] text-slate-muted">Confirmación de seguridad</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-7 h-7 rounded-lg bg-canvas text-slate-muted hover:text-white flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-1">
          <p className="font-bold text-white">{application.user?.name || "Postulante"}</p>
          <p className="text-[11px] font-mono text-slate-subtle">
            {application.user?.email || "Sin correo"}
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed">{meta.description}</p>

        {meta.requiresReasonInput && (
          <div className="space-y-1">
            <label className="block font-semibold text-slate-200">
              Motivo del rechazo (opcional)
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              placeholder="Ingresa el motivo del rechazo..."
              className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-brand text-xs resize-none"
            />
          </div>
        )}

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2 text-[11px]">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-3.5 py-2 rounded-xl text-slate-muted hover:text-white font-semibold cursor-pointer transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(meta.requiresReasonInput ? reason.trim() : undefined)}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${meta.confirmClass}`}
          >
            {isSubmitting ? "Procesando..." : meta.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
