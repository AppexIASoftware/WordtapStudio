"use client";

import { Plus } from "lucide-react";
import { LessonItem } from "@/features/courses/types";

interface CardStripProps {
  items: LessonItem[];
  currentStepId: string;
  isCreating: boolean;
  readOnly?: boolean;
  onSelectStep: (step: LessonItem) => void;
  onStartAddCard: () => void;
}

/** Tira horizontal de seleccion rapida de tarjetas de una leccion. */
export function CardStrip({
  items,
  currentStepId,
  isCreating,
  readOnly = false,
  onSelectStep,
  onStartAddCard,
}: CardStripProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <span>Tarjetas en esta Lección</span>
          <span className="px-2 py-0.5 rounded bg-emerald-brand/10 text-emerald-brand text-[10px]">
            {items.length} tarjetas
          </span>
        </span>
        {readOnly ? (
          <span className="text-[10px] font-mono text-slate-muted">Solo lectura</span>
        ) : (
          <button
            type="button"
            onClick={onStartAddCard}
            className="text-xs text-emerald-brand hover:underline font-semibold cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Tarjeta</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {items.map((step, idx) => {
          const isSelected = !isCreating && step.id === currentStepId;
          return (
            <div
              key={step.id}
              onClick={() => onSelectStep(step)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                isSelected
                  ? "bg-emerald-brand/10 border-emerald-brand text-white shadow-sm ring-1 ring-emerald-brand/30"
                  : "bg-canvas border-border-default hover:border-emerald-brand/40 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-subtle">
                  #{idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  {step.contentBankItemId && (
                    <span className="text-[8px] font-mono px-1 rounded bg-blue-500/20 text-blue-300">
                      Vault
                    </span>
                  )}
                  <span
                    className={`text-[9px] font-mono px-1 rounded ${
                      step.itemType === "grammar"
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-emerald-brand/20 text-emerald-brand"
                    }`}
                  >
                    {step.itemType || "word"}
                  </span>
                </div>
              </div>
              <p
                className={`font-bold text-xs truncate ${
                  isSelected ? "text-white" : "text-slate-200"
                }`}
              >
                {step.en}
              </p>
              <p className="text-[10px] text-slate-subtle truncate">{step.es}</p>
            </div>
          );
        })}

        {/* Tarjeta botón interactiva para añadir nueva tarjeta */}
        {!readOnly && (
          <button
            type="button"
            onClick={onStartAddCard}
            className={`p-2.5 rounded-xl border border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[72px] ${
              isCreating
                ? "border-emerald-brand bg-emerald-brand/10 text-emerald-brand ring-1 ring-emerald-brand/30"
                : "border-border-default hover:border-emerald-brand/40 text-slate-400 hover:text-white bg-canvas/50"
            }`}
          >
            <Plus className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-bold">+ Nueva Tarjeta</span>
          </button>
        )}
      </div>
    </div>
  );
}
