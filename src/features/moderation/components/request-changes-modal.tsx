"use client";

import { useState } from "react";
import { AlertTriangle, Sparkles } from "lucide-react";
import { ModeratorPR } from "@/features/moderation/types";

interface RequestChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (feedbackNotes: string) => void;
  activePr: ModeratorPR;
}

const QUICK_FEEDBACK_TEMPLATES = [
  "Ajustar transcripción fonética (IPA) en vocabulario de lecciones.",
  "Revisar traducción ambigua en opciones de ejercicios interactivos.",
  "Completar ejemplos contextuales y notas explicativas de tarjetas.",
  "Corregir nivel de dificultad para alinearlo con el marco CEFR.",
];

export function RequestChangesModal({
  isOpen,
  onClose,
  onConfirm,
  activePr,
}: RequestChangesModalProps) {
  const [feedbackNotes, setFeedbackNotes] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    const finalNotes =
      feedbackNotes.trim() ||
      "Se solicitan ajustes pedagógicos en el contenido antes de autorizar la publicación.";
    onConfirm(finalNotes);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Solicitar Correcciones Pedagógicas</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-muted hover:text-white font-bold"
          >
            &times;
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-300">
            Curso bajo revisión y Docente Solicitante:
          </label>
          <div className="p-3.5 rounded-2xl bg-canvas border border-border-default space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-white text-xs truncate">{activePr.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 flex-shrink-0">
                {activePr.id}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-border-default/60 pt-1.5">
              <span>Docente autor del curso:</span>
              <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px]">
                  {activePr.author}
                </span>
                {activePr.authorEmail && (
                  <span className="text-slate-500 text-[10px]">({activePr.authorEmail})</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Plantillas Rápidas */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Plantillas sugeridas de retroalimentación:</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_FEEDBACK_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  setFeedbackNotes((prev) =>
                    prev ? `${prev}\n• ${tmpl}` : `• ${tmpl}`
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-canvas border border-border-default hover:border-amber-400/50 text-[10px] text-slate-300 transition-colors text-left"
              >
                + {tmpl}
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea para Feedback */}
        <div className="space-y-2">
          <label className="block font-semibold text-slate-200">
            Instrucciones para el Docente (Feedback Pedagógico) *
          </label>
          <textarea
            rows={5}
            value={feedbackNotes}
            onChange={(e) => setFeedbackNotes(e.target.value)}
            placeholder="Detalla qué lecciones, palabras o ejercicios debe corregir el docente en el creador antes de volver a postular el curso..."
            className="w-full px-3.5 py-2.5 bg-canvas border border-border-default rounded-xl text-slate-200 text-xs outline-none focus:border-amber-400 resize-none placeholder-slate-500"
          />
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            Esta instrucción se enviará a la bandeja del docente con acceso directo al creador para aplicar los cambios solicitados.
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
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-canvas font-bold cursor-pointer transition-colors shadow-sm"
          >
            Enviar Correcciones al Docente
          </button>
        </div>
      </div>
    </div>
  );
}
