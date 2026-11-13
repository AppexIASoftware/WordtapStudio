"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Trash2, X } from "lucide-react";
import { ApiStaffUser } from "@/services/api/staff";

export const STAFF_ACTION_TYPE = {
  SUSPEND: "suspend",
  REACTIVATE: "reactivate",
  DELETE: "delete",
} as const;

export type StaffActionType = (typeof STAFF_ACTION_TYPE)[keyof typeof STAFF_ACTION_TYPE];

interface StaffActionModalProps {
  member: ApiStaffUser | null;
  action: StaffActionType | null;
  isSubmitting: boolean;
  errorMsg?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

const ACTION_CONFIG: Record<
  StaffActionType,
  {
    title: string;
    description: string;
    confirmLabel: string;
    confirmClass: string;
    accentClass: string;
    icon: React.ReactNode;
  }
> = {
  [STAFF_ACTION_TYPE.SUSPEND]: {
    title: "Suspender acceso",
    description:
      "Se cerrará la sesión activa del usuario y no podrá ingresar a Wordtap Studio hasta que sea reactivado.",
    confirmLabel: "Confirmar suspensión",
    confirmClass: "bg-amber-500 text-canvas hover:bg-amber-400",
    accentClass: "bg-amber-500/10 text-amber-400",
    icon: <AlertTriangle size={16} />,
  },
  [STAFF_ACTION_TYPE.REACTIVATE]: {
    title: "Reactivar acceso",
    description:
      "El usuario recuperará el acceso completo correspondiente a su rol en Wordtap Studio.",
    confirmLabel: "Confirmar reactivación",
    confirmClass: "bg-emerald-brand text-canvas hover:bg-mint-brand",
    accentClass: "bg-emerald-brand/10 text-emerald-brand",
    icon: <CheckCircle2 size={16} />,
  },
  [STAFF_ACTION_TYPE.DELETE]: {
    title: "Eliminar usuario del sistema",
    description:
      "Esta acción es permanente y eliminará la cuenta y sus sesiones activas. Si el usuario tiene registros de facturación, deberás suspenderlo en su lugar.",
    confirmLabel: "Eliminar permanentemente",
    confirmClass: "bg-rose-600 text-white hover:bg-rose-500",
    accentClass: "bg-rose-500/10 text-rose-400",
    icon: <Trash2 size={16} />,
  },
};

export function StaffActionModal({
  member,
  action,
  isSubmitting,
  errorMsg,
  onClose,
  onConfirm,
}: StaffActionModalProps) {
  if (!member || !action) return null;

  const cfg = ACTION_CONFIG[action];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${cfg.accentClass}`}>
              {cfg.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{cfg.title}</h3>
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
          <p className="font-bold text-white">{member.name}</p>
          <p className="text-[11px] font-mono text-slate-subtle">{member.email}</p>
        </div>

        <p className="text-slate-300 leading-relaxed">{cfg.description}</p>

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
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${cfg.confirmClass}`}
          >
            {isSubmitting ? "Procesando..." : cfg.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
