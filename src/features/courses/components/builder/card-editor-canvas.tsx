"use client";

import { FileEdit, Volume2, Trash2, Save, Plus, PlusCircle, X, Loader2 } from "lucide-react";
import { LessonItem } from "@/features/courses/types";

interface CardEditorCanvasProps {
  isCreating: boolean;
  itemsCount: number;
  activeItemType: LessonItem["itemType"];
  activeEn: string;
  activeEs: string;
  activeIpa: string;
  activePos: string;
  activeExample: string;
  activeNote: string;
  activeNoteType?: LessonItem["noteType"];
  stepForm: LessonItem;
  isSavingStep?: boolean;
  updateField: <K extends keyof Omit<LessonItem, "id">>(
    field: K,
    val: Omit<LessonItem, "id">[K]
  ) => void;
  onSpeak: (text: string) => void;
  onCancelCreate: () => void;
  onCreateSubmit: () => void;
  onDeleteStep: (id: string) => void;
  onStartAddCard: () => void;
  onSaveStep: () => void;
}

/** Lienzo visual de edicion y creacion de tarjetas pedagogicas. */
export function CardEditorCanvas({
  isCreating,
  itemsCount,
  activeItemType,
  activeEn,
  activeEs,
  activeIpa,
  activePos,
  activeExample,
  activeNote,
  activeNoteType,
  stepForm,
  isSavingStep,
  updateField,
  onSpeak,
  onCancelCreate,
  onCreateSubmit,
  onDeleteStep,
  onStartAddCard,
  onSaveStep,
}: CardEditorCanvasProps) {
  return (
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
            {itemsCount > 0 ? (
              <button
                type="button"
                onClick={onCancelCreate}
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
              onClick={onCreateSubmit}
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
                onClick={onStartAddCard}
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
  );
}
