"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, AlertTriangle, Loader2 } from "lucide-react";
import { Course } from "@/features/courses/types";;

interface SubmitReviewModalProps {
  isOpen: boolean;
  course: Course;
  onClose: () => void;
  onSubmit: (changeSummary: string) => Promise<void>;
}

export function SubmitReviewModal({
  isOpen,
  course,
  onClose,
  onSubmit,
}: SubmitReviewModalProps) {
  const isResubmission = course.reviewStatus === "changes_requested";
  const defaultText = isResubmission
    ? "Correcciones aplicadas según las observaciones pedagógicas del revisor."
    : `Solicitud de revisión para publicación oficial del curso: ${course.title}`;

  const [summary, setSummary] = useState(defaultText);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(summary.trim() || defaultText);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            {isResubmission ? (
              <RotateCcw className="w-4 h-4 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-brand" />
            )}
            <span>
              {isResubmission
                ? "Re-enviar Correcciones a Revisión"
                : "Enviar Curso a Revisión Oficial"}
            </span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-muted hover:text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {isResubmission && course.feedbackNotes && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Observaciones del Revisor a Resolver:</span>
            </div>
            <p className="text-[11px] text-amber-100/90 leading-relaxed italic line-clamp-3">
              &quot;{course.feedbackNotes}&quot;
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-200">
              {isResubmission
                ? "Resumen de las correcciones aplicadas:"
                : "Resumen o notas para el equipo revisor:"}
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={
                isResubmission
                  ? "Ej: Se ajustaron fonemas IPA en lección 2 y se niveló el vocabulario a A1..."
                  : "Ej: Curso completo para principiantes..."
              }
              className="w-full px-3.5 py-2.5 bg-canvas border border-border-default rounded-xl text-white text-xs focus:border-emerald-brand outline-none resize-none leading-relaxed"
            />
            <p className="text-[11px] text-slate-muted">
              {isResubmission
                ? "Este resumen se registrará en la auditoría del revisor para que pueda validar tus cambios rápidamente."
                : "Se enviará al equipo de moderación para iniciar la evaluación pedagógica."}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 hover:text-white font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isResubmission
                  ? "bg-amber-500 hover:bg-amber-400 text-canvas shadow-sm"
                  : "bg-emerald-brand hover:bg-mint-brand text-canvas shadow-glow-emerald"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {isResubmission ? "Confirmar y Re-enviar" : "Confirmar Envío"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
