"use client";

import { useState } from "react";
import { AlertCircle, ShieldAlert, ShieldCheck, X } from "lucide-react";

export const STUDENT_STATUS_ACTION = {
  SUSPEND: "suspend",
  REACTIVATE: "reactivate",
} as const;

export type StudentStatusAction =
  (typeof STUDENT_STATUS_ACTION)[keyof typeof STUDENT_STATUS_ACTION];

interface ActionMeta {
  title: string;
  description: string;
  confirmLabel: string;
  confirmClass: string;
  nextIsActive: boolean;
  icon: typeof ShieldAlert;
}

const ACTION_META: Record<StudentStatusAction, ActionMeta> = {
  [STUDENT_STATUS_ACTION.SUSPEND]: {
    title: "Suspender cuenta de alumno",
    description:
      "El estudiante perderá el acceso a la aplicación móvil y se cerrarán sus sesiones activas de inmediato.",
    confirmLabel: "Confirmar suspensión",
    confirmClass: "bg-red-600 hover:bg-red-500 text-white",
    nextIsActive: false,
    icon: ShieldAlert,
  },
  [STUDENT_STATUS_ACTION.REACTIVATE]: {
    title: "Reactivar cuenta de alumno",
    description:
      "El estudiante recuperará el acceso completo a sus cursos, aulas y progreso guardado.",
    confirmLabel: "Confirmar reactivación",
    confirmClass: "bg-emerald-brand hover:bg-emerald-header text-white",
    nextIsActive: true,
    icon: ShieldCheck,
  },
};

interface StudentStatusModalProps {
  studentName: string;
  studentEmail: string;
  action: StudentStatusAction;
  onConfirm: (nextIsActive: boolean) => Promise<void>;
  onClose: () => void;
}

export function StudentStatusModal({
  studentName,
  studentEmail,
  action,
  onConfirm,
  onClose,
}: StudentStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meta = ACTION_META[action];
  const Icon = meta.icon;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(meta.nextIsActive);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el estado del estudiante."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border-default shadow-xl overflow-hidden">
        <div className="p-5 border-b border-border-default flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-card-hover border border-border-default flex items-center justify-center text-slate-light">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">{meta.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-muted hover:text-white hover:bg-card-hover cursor-pointer disabled:opacity-40"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-canvas border border-border-default">
            <p className="text-xs font-bold text-white">{studentName}</p>
            <p className="text-[11px] text-slate-muted">{studentEmail}</p>
          </div>

          <p className="text-xs text-slate-light leading-relaxed">
            {meta.description}
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="px-5 py-4 bg-card-hover/40 border-t border-border-default flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-3.5 py-2 rounded-xl bg-canvas border border-border-default text-xs font-semibold text-slate-light hover:border-border-subtle cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50 ${meta.confirmClass}`}
          >
            {isSubmitting ? "Procesando..." : meta.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
