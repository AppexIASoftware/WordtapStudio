"use client";

import { CheckCircle2, Check } from "lucide-react";
import { ModeratorPR } from "../types";

interface PublishCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  activePr: ModeratorPR;
}

export function PublishCourseModal({
  isOpen,
  onClose,
  onConfirm,
  activePr,
}: PublishCourseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-brand" />
            <span>Autorizar Publicación a Producción</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-muted hover:text-white font-bold"
          >
            &times;
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Estás a punto de aprobar el despliegue del curso:
        </p>
        <div className="p-3 rounded-xl bg-canvas border border-border-default font-bold text-white">
          {activePr.title}
        </div>

        <div className="space-y-2 p-3 bg-canvas rounded-xl border border-border-default text-[11px] text-slate-300">
          <div className="flex items-center gap-2 text-emerald-brand">
            <Check className="w-3.5 h-3.5" />
            <span>Precisión lingüística y pedagógica verificada</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-brand">
            <Check className="w-3.5 h-3.5" />
            <span>Lecciones y tarjetas validadas para la app móvil</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-brand">
            <Check className="w-3.5 h-3.5" />
            <span>Despliegue directo al catálogo oficial de WordTap</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-semibold cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-emerald-brand text-canvas font-bold shadow-glow-emerald cursor-pointer"
          >
            Confirmar & Publicar en App Móvil
          </button>
        </div>
      </div>
    </div>
  );
}
