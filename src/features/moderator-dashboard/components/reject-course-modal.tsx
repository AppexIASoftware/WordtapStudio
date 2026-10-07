"use client";

import { useState } from "react";
import { XCircle, AlertOctagon } from "lucide-react";
import { ModeratorPR } from "../types";

interface RejectCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (feedbackNotes: string) => void;
  activePr: ModeratorPR;
}

export function RejectCourseModal({
  isOpen,
  onClose,
  onConfirm,
  activePr,
}: RejectCourseModalProps) {
  const [feedbackNotes, setFeedbackNotes] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    const finalNotes = feedbackNotes.trim() || "El contenido no cumple las directrices pedagógicas o normativas de Wordtap.";
    onConfirm(finalNotes);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Rechazar Solicitud de Curso</span>
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
          Estás por rechazar la publicación del curso:
        </p>
        <div className="p-3 rounded-xl bg-canvas border border-border-default font-bold text-white">
          {activePr.title}
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-slate-200">
            Feedback Pedagógico del Revisor (Motivo de Rechazo) *
          </label>
          <textarea
            rows={4}
            value={feedbackNotes}
            onChange={(e) => setFeedbackNotes(e.target.value)}
            placeholder="Describe con claridad pedagógica por qué el contenido es rechazado y qué debe corregir el docente..."
            className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 text-xs outline-none focus:border-rose-400 resize-none placeholder-slate-500"
          />
        </div>

        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-start gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>
            El curso regresará a estado de borrador para el docente y este dictamen se mostrará en su bandeja de solicitudes.
          </span>
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
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
          >
            Confirmar Rechazo
          </button>
        </div>
      </div>
    </div>
  );
}
