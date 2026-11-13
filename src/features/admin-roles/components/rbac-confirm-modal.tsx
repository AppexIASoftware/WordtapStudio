"use client";

import React from "react";
import { Shield, RotateCcw, AlertTriangle, X } from "lucide-react";

export const RBAC_MODAL_ACTION = {
  SAVE: "save",
  RESET: "reset",
} as const;

export type RbacModalAction = (typeof RBAC_MODAL_ACTION)[keyof typeof RBAC_MODAL_ACTION];

interface RbacConfirmModalProps {
  action: RbacModalAction | null;
  diffCount: number;
  isSubmitting: boolean;
  errorMsg: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

const MODAL_META: Record<
  RbacModalAction,
  {
    title: string;
    confirmLabel: string;
    confirmClass: string;
    accentClass: string;
    icon: React.ReactNode;
  }
> = {
  [RBAC_MODAL_ACTION.SAVE]: {
    title: "Guardar matriz de políticas",
    confirmLabel: "Confirmar guardado",
    confirmClass: "bg-emerald-brand text-canvas hover:bg-mint-brand",
    accentClass: "bg-emerald-brand/10 text-emerald-brand",
    icon: <Shield size={16} />,
  },
  [RBAC_MODAL_ACTION.RESET]: {
    title: "Restablecer políticas recomendadas",
    confirmLabel: "Confirmar restablecimiento",
    confirmClass: "bg-amber-500 text-canvas hover:bg-amber-400",
    accentClass: "bg-amber-500/10 text-amber-400",
    icon: <RotateCcw size={16} />,
  },
};

export function RbacConfirmModal({
  action,
  diffCount,
  isSubmitting,
  errorMsg,
  onClose,
  onConfirm,
}: RbacConfirmModalProps) {
  if (!action) return null;

  const meta = MODAL_META[action];
  const description =
    action === RBAC_MODAL_ACTION.SAVE
      ? `Se guardarán ${diffCount} cambio${diffCount === 1 ? "" : "s"} de permisos en la configuración global del sistema.`
      : "Se restaurarán todos los permisos configurables a sus valores recomendados por defecto en el servidor.";

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

        <p className="text-slate-300 leading-relaxed">{description}</p>

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
            className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${meta.confirmClass}`}
          >
            {isSubmitting ? "Aplicando..." : meta.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
