"use client";

import { FileEdit, Volume2, Trash2, Save } from "lucide-react";
import { Lesson, LessonItem } from "../../types";

interface CardsTabProps {
  currentLesson: Lesson;
  currentStepId: string;
  stepForm: LessonItem;
  onSelectStep: (step: LessonItem) => void;
  onStepFormChange: (updater: (prev: LessonItem) => LessonItem) => void;
  onSaveStep: () => void;
  onDeleteStep: (id: string) => void;
  onOpenAddStepModal: () => void;
  onSpeak: (text: string) => void;
}

export function CardsTab({
  currentLesson,
  currentStepId,
  stepForm,
  onSelectStep,
  onStepFormChange,
  onSaveStep,
  onDeleteStep,
  onOpenAddStepModal,
  onSpeak,
}: CardsTabProps) {
  return (
    <div className="p-5 md:p-6 space-y-6">
      {/* Tira horizontal de selección rápida de tarjetas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <span>Tarjetas en esta Lección</span>
            <span className="px-2 py-0.5 rounded bg-emerald-brand/10 text-emerald-brand text-[10px]">
              {currentLesson.items.length} tarjetas
            </span>
          </span>
          <button
            type="button"
            onClick={onOpenAddStepModal}
            className="text-xs text-emerald-brand hover:underline font-semibold cursor-pointer flex items-center gap-1"
          >
            <span>+ Añadir Tarjeta</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {currentLesson.items.map((step, idx) => {
            const isSelected = step.id === currentStepId;
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
        </div>
      </div>

      {/* Lienzo de edición de la tarjeta seleccionada */}
      <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border-default bg-card-hover/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center font-bold">
              <FileEdit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Editar {stepForm.itemType || "Elemento"}: &apos;{stepForm.en}&apos;
              </h3>
              <p className="text-[11px] text-slate-subtle">
                Configuración pedagógica y fonética del elemento
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-subtle font-mono">Tipo:</span>
            <select
              value={stepForm.itemType || "word"}
              onChange={(e) =>
                onStepFormChange((prev) => ({
                  ...prev,
                  itemType: e.target.value as LessonItem["itemType"],
                }))
              }
              className="bg-canvas border border-border-default rounded-xl px-3 py-1.5 text-xs text-mint-brand font-mono font-semibold cursor-pointer focus:outline-none focus:border-emerald-brand"
            >
              <option value="word">word (Vocabulario)</option>
              <option value="phrase">phrase (Frase)</option>
              <option value="grammar">grammar (Gramática)</option>
              <option value="tip">tip (Consejo)</option>
              <option value="exercise">exercise (Puzzle)</option>
            </select>
          </div>
        </div>

        {/* Formulario en 2 columnas */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna Izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Término / Palabra en Inglés (Target)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={stepForm.en}
                  onChange={(e) =>
                    onStepFormChange((prev) => ({ ...prev, en: e.target.value }))
                  }
                  className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-brand pr-10"
                  placeholder="Ej: be, take, have..."
                />
                <button
                  type="button"
                  onClick={() => onSpeak(stepForm.en)}
                  className="absolute right-3 top-2.5 p-1 text-slate-muted hover:text-mint-brand transition-colors cursor-pointer"
                  title="Escuchar pronunciación"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Traducción al Español (Prompt)
              </label>
              <input
                type="text"
                value={stepForm.es}
                onChange={(e) =>
                  onStepFormChange((prev) => ({ ...prev, es: e.target.value }))
                }
                className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-emerald-brand"
                placeholder="Ej: ser/estar..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Transcripción Fonética (IPA)
                </label>
                <input
                  type="text"
                  value={stepForm.ipa || ""}
                  onChange={(e) =>
                    onStepFormChange((prev) => ({ ...prev, ipa: e.target.value }))
                  }
                  className="w-full bg-canvas border border-border-default rounded-xl px-3.5 py-2.5 text-xs font-mono text-mint-brand focus:outline-none focus:border-emerald-brand"
                  placeholder="/biː/"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Categoría Gramatical
                </label>
                <input
                  type="text"
                  value={stepForm.pos || ""}
                  onChange={(e) =>
                    onStepFormChange((prev) => ({ ...prev, pos: e.target.value }))
                  }
                  className="w-full bg-canvas border border-border-default rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-brand"
                  placeholder="Verbo irregular..."
                />
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Oración de Ejemplo en Contexto
              </label>
              <textarea
                rows={3}
                value={stepForm.example || ""}
                onChange={(e) =>
                  onStepFormChange((prev) => ({ ...prev, example: e.target.value }))
                }
                className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-brand italic resize-none"
                placeholder='Ej: "I am happy today"'
              />
            </div>

            {/* Nota Pedagógica / Tip */}
            <div className="p-4 rounded-xl bg-canvas border border-border-default space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="text-amber-400">💡</span>
                  <span>Nota Pedagógica / Tip</span>
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-muted hover:text-white">
                    <input
                      type="radio"
                      name="noteType"
                      value="bulb"
                      checked={stepForm.noteType !== "pin"}
                      onChange={() =>
                        onStepFormChange((prev) => ({ ...prev, noteType: "bulb" }))
                      }
                      className="accent-emerald-brand"
                    />
                    <span>Foco (Tip)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-muted hover:text-white">
                    <input
                      type="radio"
                      name="noteType"
                      value="pin"
                      checked={stepForm.noteType === "pin"}
                      onChange={() =>
                        onStepFormChange((prev) => ({ ...prev, noteType: "pin" }))
                      }
                      className="accent-emerald-brand"
                    />
                    <span>Pin (Importante)</span>
                  </label>
                </div>
              </div>
              <input
                type="text"
                value={stepForm.note || ""}
                onChange={(e) =>
                  onStepFormChange((prev) => ({ ...prev, note: e.target.value }))
                }
                className="w-full bg-card border border-border-default rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-brand"
                placeholder="Nota de aprendizaje..."
              />
            </div>
          </div>
        </div>

        {/* Pie de acciones de la tarjeta */}
        <div className="p-4 bg-card-hover/40 border-t border-border-default flex items-center justify-between">
          <button
            type="button"
            onClick={() => onDeleteStep(stepForm.id)}
            className="px-4 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar Tarjeta</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAddStepModal}
              className="px-3.5 py-2 rounded-xl bg-canvas border border-border-default hover:text-white text-slate-300 text-xs font-semibold cursor-pointer"
            >
              + Nueva Tarjeta
            </button>
            <button
              type="button"
              onClick={onSaveStep}
              className="px-5 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
