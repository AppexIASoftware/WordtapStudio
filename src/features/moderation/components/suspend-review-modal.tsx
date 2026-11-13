"use client";

import { useState } from "react";
import { PauseCircle, AlertTriangle, Loader2 } from "lucide-react";
import { ModeratorPR } from "@/features/moderation/types";

interface SuspendReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<{ ok: boolean; error?: string }>;
  activePr: ModeratorPR;
}

export function SuspendReviewModal({
  isOpen,
  onClose,
  onConfirm,
  activePr,
}: SuspendReviewModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    setErrorMessage(null);
    onClose();
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    const finalReason =
      reason.trim() ||
      "Publicación suspendida por moderación para re-evaluación curricular.";
    try {
      const result = await onConfirm(finalReason);
      if (!result.ok) {
        setErrorMessage(
          result.error || "No se pudo suspender la publicación del curso."
        );
      } else {
        setReason("");
      }
    } catch {
      setErrorMessage("Error de conexión al suspender la publicación.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PauseCircle className="w-4 h-4 text-amber-400" />
            <span>Suspender Publicación y Enviar a Revisión</span>
          </h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-slate-muted hover:text-white font-bold disabled:opacity-40 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Estás por suspender la publicación oficial del curso:
        </p>
        <div className="p-3 rounded-xl bg-canvas border border-border-default font-bold text-white">
          {activePr.title}
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-slate-200">
            Motivo de Suspensión / Nota de Auditoría (Opcional)
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isSubmitting}
            placeholder="Indica por qué se retira temporalmente del catálogo oficial para nueva revisión..."
            className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 text-xs outline-none focus:border-amber-400 resize-none placeholder-slate-500 disabled:opacity-50"
          />
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            El curso dejará de estar visible en el catálogo público oficial y volverá a estado En Revisión para emitir un nuevo dictamen.
          </span>
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
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-canvas font-bold cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Confirmar Suspensión</span>
          </button>
        </div>
      </div>
    </div>
  );
}
