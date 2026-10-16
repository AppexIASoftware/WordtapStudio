"use client";

import { useState } from "react";
import { FileEdit, Volume2, Trash2, Save, Plus, PlusCircle, X, Loader2 } from "lucide-react";
import { Lesson, LessonItem } from "@/features/courses/types";;

interface CardsTabProps {
  currentLesson: Lesson;
  currentStepId: string;
  stepForm: LessonItem;
  isSavingStep?: boolean;
  onSelectStep: (step: LessonItem) => void;
  onStepFormChange: (updater: (prev: LessonItem) => LessonItem) => void;
  onSaveStep: () => void;
  onDeleteStep: (id: string) => void;
  onAddCard?: (card: Omit<LessonItem, "id">) => void;
  onOpenAddStepModal?: () => void;
  onSpeak: (text: string) => void;
}

const DEFAULT_NEW_CARD: Omit<LessonItem, "id"> = {
  en: "",
  es: "",
  ipa: "",
  pos: "",
  example: "",
  note: "",
  noteType: "bulb",
  itemType: "word",
};

export function CardsTab({
  currentLesson,
  currentStepId,
  stepForm,
  isSavingStep = false,
  onSelectStep,
  onStepFormChange,
  onSaveStep,
  onDeleteStep,
  onAddCard,
  onOpenAddStepModal,
  onSpeak,
}: CardsTabProps) {
  const [isCreatingState, setIsCreatingState] = useState(false);
  const [newCardForm, setNewCardForm] = useState<Omit<LessonItem, "id">>(DEFAULT_NEW_CARD);

  const isCreating = isCreatingState || currentLesson.items.length === 0;

  const handleStartAddCard = () => {
    setNewCardForm(DEFAULT_NEW_CARD);
    setIsCreatingState(true);
    if (onOpenAddStepModal && !onAddCard) {
      onOpenAddStepModal();
    }
  };

  const handleSelectExisting = (step: LessonItem) => {
    setIsCreatingState(false);
    onSelectStep(step);
  };

  const handleCreateSubmit = () => {
    const cleanEn = newCardForm.en.trim() || "new term";
    const cleanEs = newCardForm.es.trim() || "nuevo término";
    if (onAddCard) {
      onAddCard({
        ...newCardForm,
        en: cleanEn,
        es: cleanEs,
        ipa: newCardForm.ipa?.trim() || "/IPA/",
      });
    }
    setNewCardForm(DEFAULT_NEW_CARD);
    setIsCreatingState(false);
  };

  const activeEn = isCreating ? newCardForm.en : stepForm.en;
  const activeEs = isCreating ? newCardForm.es : stepForm.es;
  const activeIpa = isCreating ? newCardForm.ipa || "" : stepForm.ipa || "";
  const activePos = isCreating ? newCardForm.pos || "" : stepForm.pos || "";
  const activeExample = isCreating ? newCardForm.example || "" : stepForm.example || "";
  const activeNote = isCreating ? newCardForm.note || "" : stepForm.note || "";
  const activeNoteType = isCreating ? newCardForm.noteType : stepForm.noteType;
  const activeItemType = isCreating ? newCardForm.itemType || "word" : stepForm.itemType || "word";

  const updateField = <K extends keyof Omit<LessonItem, "id">>(field: K, val: Omit<LessonItem, "id">[K]) => {
    if (isCreating) {
      setNewCardForm((prev) => ({ ...prev, [field]: val }));
    } else {
      onStepFormChange((prev) => ({ ...prev, [field]: val }));
    }
  };

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
            onClick={handleStartAddCard}
            className="text-xs text-emerald-brand hover:underline font-semibold cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Tarjeta</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {currentLesson.items.map((step, idx) => {
            const isSelected = !isCreating && step.id === currentStepId;
            return (
              <div
                key={step.id}
                onClick={() => handleSelectExisting(step)}
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
          <button
            type="button"
            onClick={handleStartAddCard}
            className={`p-2.5 rounded-xl border border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[72px] ${
              isCreating
                ? "border-emerald-brand bg-emerald-brand/10 text-emerald-brand ring-1 ring-emerald-brand/30"
                : "border-border-default hover:border-emerald-brand/40 text-slate-400 hover:text-white bg-canvas/50"
            }`}
          >
            <Plus className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-bold">+ Nueva Tarjeta</span>
          </button>
        </div>
      </div>

      {/* Lienzo de edición o creación con exactamente la misma estructura visual */}
      <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border-default bg-card-hover/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center font-bold">
              {isCreating ? <PlusCircle className="w-4 h-4" /> : <FileEdit className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  {isCreating
                    ? "Añadir Nueva Tarjeta a la Lección"
                    : `Editar ${stepForm.itemType || "Elemento"}: '${stepForm.en}'`}
                </h3>
                {isCreating ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-brand/15 text-emerald-brand border border-emerald-brand/25">
                    Modo Creación
                  </span>
                ) : stepForm.contentBankItemId ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
                    🌐 Content Vault
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-slate-subtle">
                {isCreating
                  ? "Definí los parámetros pedagógicos, fonéticos y ejemplos del nuevo término"
                  : "Configuración pedagógica y fonética del elemento"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-subtle font-mono">Tipo:</span>
            <select
              value={activeItemType}
              onChange={(e) => updateField("itemType", e.target.value as LessonItem["itemType"])}
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

        {/* Formulario en 2 columnas - 100% idéntico para crear y editar */}
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
                  value={activeEn}
                  onChange={(e) => updateField("en", e.target.value)}
                  className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-brand pr-10"
                  placeholder="Ej: be, take, have, know..."
                />
                <button
                  type="button"
                  onClick={() => onSpeak(activeEn)}
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
                value={activeEs}
                onChange={(e) => updateField("es", e.target.value)}
                className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-emerald-brand"
                placeholder="Ej: ser / estar, saber / conocer..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Transcripción Fonética (IPA)
                </label>
                <input
                  type="text"
                  value={activeIpa}
                  onChange={(e) => updateField("ipa", e.target.value)}
                  className="w-full bg-canvas border border-border-default rounded-xl px-3.5 py-2.5 text-xs font-mono text-mint-brand focus:outline-none focus:border-emerald-brand"
                  placeholder="/noʊ/"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Categoría Gramatical
                </label>
                <input
                  type="text"
                  value={activePos}
                  onChange={(e) => updateField("pos", e.target.value)}
                  className="w-full bg-canvas border border-border-default rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-brand"
                  placeholder="Verbo irregular, adjetivo..."
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
                value={activeExample}
                onChange={(e) => updateField("example", e.target.value)}
                className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-brand italic resize-none"
                placeholder='Ej: "I know the answer to this question"'
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
                      checked={activeNoteType !== "pin"}
                      onChange={() => updateField("noteType", "bulb")}
                      className="accent-emerald-brand"
                    />
                    <span>Foco (Tip)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-muted hover:text-white">
                    <input
                      type="radio"
                      name="noteType"
                      value="pin"
                      checked={activeNoteType === "pin"}
                      onChange={() => updateField("noteType", "pin")}
                      className="accent-emerald-brand"
                    />
                    <span>Pin (Importante)</span>
                  </label>
                </div>
              </div>
              <input
                type="text"
                value={activeNote}
                onChange={(e) => updateField("note", e.target.value)}
                className="w-full bg-card border border-border-default rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-brand"
                placeholder="Nota de aprendizaje o advertencia..."
              />
            </div>
          </div>
        </div>

        {/* Pie de acciones del formulario */}
        <div className="p-4 bg-card-hover/40 border-t border-border-default flex items-center justify-between">
          {isCreating ? (
            <>
              {currentLesson.items.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setIsCreatingState(false)}
                  className="px-4 py-2 rounded-xl bg-canvas border border-border-default hover:text-white text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancelar</span>
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={handleCreateSubmit}
                className="px-5 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Tarjeta a la Lección</span>
              </button>
            </>
          ) : (
            <>
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
                  onClick={handleStartAddCard}
                  className="px-3.5 py-2 rounded-xl bg-canvas border border-border-default hover:text-white text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  + Nueva Tarjeta
                </button>
                <button
                  type="button"
                  disabled={isSavingStep}
                  onClick={onSaveStep}
                  className="px-5 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer disabled:opacity-60"
                >
                  {isSavingStep ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{isSavingStep ? "Guardando..." : "Guardar Cambios"}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
