"use client";

import { FileEdit, Volume2, Trash2, Save, Plus, X, Loader2, Sparkles } from "lucide-react";
import { LessonItem } from "@/features/courses/types";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
import { TagInput } from "@/components/ui/tag-input";

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
  readOnly?: boolean;
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

/**
 * Lienzo visual de edición y creación de tarjetas pedagógicas.
 * Adaptado con el estándar del Vault para soportar textos amplios y auto-expansión.
 */
export function CardEditorCanvas({
  isCreating,
  itemsCount,
  activeItemType = "word",
  activeEn,
  activeEs,
  activeIpa,
  activePos,
  activeExample,
  activeNote,
  activeNoteType,
  stepForm,
  isSavingStep,
  readOnly = false,
  updateField,
  onSpeak,
  onCancelCreate,
  onCreateSubmit,
  onDeleteStep,
  onStartAddCard,
  onSaveStep,
}: CardEditorCanvasProps) {
  const isPhrase = activeItemType === "phrase" || activeItemType === "grammar";

  const targetLabel = isPhrase
    ? "Frase u Oración en Inglés (Target) *"
    : "Término / Palabra en Inglés (Target) *";

  const promptLabel = isPhrase
    ? "Traducción o Equivalente en Español (Prompt) *"
    : "Traducción al Español (Prompt) *";

  const targetPlaceholder = isPhrase
    ? 'Ej: "Could you please tell me where the nearest station is?"'
    : 'Ej: "breakthrough", "resilient", "thrive"...';

  const promptPlaceholder = isPhrase
    ? 'Ej: "¿Podrías por favor decirme dónde queda la estación más cercana?"'
    : 'Ej: "avance decisivo", "resiliente", "prosperar"...';

  const ipaPlaceholder = isPhrase
    ? "Ej: /kʊd juː pliːz tel miː/ (opcional)"
    : "Ej: /ˈbjuː.tɪ.fəl/";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (isCreating) {
        onCreateSubmit();
      } else {
        onSaveStep();
      }
    }
  };

  return (
    <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-sm">
      {/* Cabecera del Editor con estándar de Vault */}
      <div className="px-5 py-4 border-b border-border-default bg-card-hover/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
            {isCreating ? (
              <Sparkles className="w-5 h-5" />
            ) : (
              <FileEdit className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white">
                {readOnly
                  ? `Tarjeta: '${stepForm.en}'`
                  : isCreating
                  ? "Añadir Nueva Tarjeta a la Lección"
                  : `Editar ${stepForm.itemType || "Elemento"}: '${stepForm.en}'`}
              </h3>
              {readOnly ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-400 border border-slate-500/25">
                  Solo lectura
                </span>
              ) : isCreating ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-brand/15 text-emerald-brand border border-emerald-brand/25">
                  Modo Creación
                </span>
              ) : stepForm.contentBankItemId ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
                  🌐 Catálogo Vault
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-brand/15 text-emerald-brand border border-emerald-brand/25">
                  Lección Local
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-subtle mt-0.5">
              {readOnly
                ? "Vista de supervisión: no podés modificar el contenido."
                : isCreating
                ? "Definí los parámetros pedagógicos, fonéticos y ejemplos del nuevo término"
                : "Configuración pedagógica y fonética del elemento"}
            </p>
          </div>
        </div>

        {/* Selector de Tipo de Contenido */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label className="text-xs font-semibold text-slate-300 whitespace-nowrap">
            Tipo:
          </label>
          <select
            value={activeItemType}
            disabled={readOnly}
            onChange={(e) => updateField("itemType", e.target.value as LessonItem["itemType"])}
            className="bg-canvas border border-border-default rounded-xl px-3 py-1.5 text-xs text-mint-brand font-semibold cursor-pointer focus:outline-none focus:border-emerald-brand disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            <option value="word">word (Vocabulario)</option>
            <option value="phrase">phrase (Frase / Oración)</option>
            <option value="grammar">grammar (Gramática)</option>
            <option value="tip">tip (Consejo / Regla)</option>
            <option value="exercise">exercise (Desafío / Puzzle)</option>
          </select>
        </div>
      </div>

      {/* Formulario en 2 Columnas amplias con AutoResizeTextarea */}
      <div
        onKeyDown={handleKeyDown}
        className={`p-5 sm:p-6 space-y-5 ${readOnly ? "opacity-70 pointer-events-none" : ""}`}
      >
        {/* Fila 1: Núcleo Bilingüe (Target y Prompt con auto-expansión independiente) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5 h-6">
              <label className="block text-xs font-semibold text-slate-300">
                {targetLabel}
              </label>
              <span className="text-[11px] text-slate-subtle">Requerido</span>
            </div>
            <div className="relative">
              <AutoResizeTextarea
                required
                disabled={readOnly}
                value={activeEn}
                onChange={(e) => updateField("en", e.target.value)}
                placeholder={targetPlaceholder}
                minHeight={46}
                className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-brand pr-11 leading-relaxed"
              />
              <button
                type="button"
                onClick={() => onSpeak(activeEn)}
                className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-card/80 text-slate-muted hover:text-mint-brand transition-colors cursor-pointer"
                title="Escuchar pronunciación"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5 h-6">
              <label className="block text-xs font-semibold text-slate-300">
                {promptLabel}
              </label>
              <span className="text-[11px] text-slate-subtle">Requerido</span>
            </div>
            <AutoResizeTextarea
              required
              disabled={readOnly}
              value={activeEs}
              onChange={(e) => updateField("es", e.target.value)}
              placeholder={promptPlaceholder}
              minHeight={46}
              className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-emerald-brand leading-relaxed"
            />
          </div>
        </div>

        {/* Fila 2: Fonética (IPA) y Categoría Gramatical independiente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5 h-6">
              <label className="block text-xs font-semibold text-slate-300">
                Transcripción Fonética (IPA)
              </label>
              <span className="text-[11px] font-normal text-slate-subtle">
                (Opcional)
              </span>
            </div>
            <AutoResizeTextarea
              disabled={readOnly}
              value={activeIpa}
              onChange={(e) => updateField("ipa", e.target.value)}
              placeholder={ipaPlaceholder}
              minHeight={44}
              className="w-full bg-canvas border border-border-default rounded-xl px-3.5 py-2.5 text-xs font-mono text-mint-brand focus:outline-none focus:border-emerald-brand leading-relaxed"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5 h-6">
              <label className="block text-xs font-semibold text-slate-300">
                Categoría Gramatical o Etiqueta
              </label>
              <span className="text-[11px] font-normal text-slate-subtle">
                (Coma o Enter)
              </span>
            </div>
            <TagInput
              disabled={readOnly}
              value={activePos}
              onChange={(val) => updateField("pos", val)}
              placeholder="Ej: Adjetivo, Verbo transitivo, Idiom..."
            />
          </div>
        </div>

        {/* Fila 3: Oración de Ejemplo en Contexto y Nota Pedagógica / Tip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5 h-6">
              <label className="block text-xs font-semibold text-slate-300">
                Oración de Ejemplo en Contexto
              </label>
              <span className="text-[11px] font-normal text-slate-subtle">
                (Opcional)
              </span>
            </div>
            <AutoResizeTextarea
              disabled={readOnly}
              value={activeExample}
              onChange={(e) => updateField("example", e.target.value)}
              placeholder='Ej: "She has a beautiful house in the city center."'
              minHeight={56}
              className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-brand italic leading-relaxed"
            />
          </div>

          {/* Nota Pedagógica / Tip con selector segmentado */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5 h-6">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="text-amber-400">💡</span>
                <span>Nota Pedagógica / Tip</span>
              </span>
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-card border border-border-default">
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => updateField("noteType", "bulb")}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    activeNoteType !== "pin"
                      ? "bg-emerald-brand/15 text-emerald-brand border border-emerald-brand/30 shadow-xs"
                      : "text-slate-muted hover:text-white"
                  }`}
                >
                  Foco (Tip)
                </button>
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => updateField("noteType", "pin")}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    activeNoteType === "pin"
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-xs"
                      : "text-slate-muted hover:text-white"
                  }`}
                >
                  Pin (Importante)
                </button>
              </div>
            </div>
            <AutoResizeTextarea
              disabled={readOnly}
              value={activeNote}
              onChange={(e) => updateField("note", e.target.value)}
              minHeight={56}
              className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-brand leading-relaxed"
              placeholder="Nota de aprendizaje, advertencia de uso o trampa léxica..."
            />
          </div>
        </div>
      </div>

      {/* Pie de Acciones Pinned */}
      {!readOnly && (
        <div className="p-4 sm:px-6 bg-card-hover/40 border-t border-border-default flex items-center justify-between gap-3">
          {isCreating ? (
            <>
              {itemsCount > 0 ? (
                <button
                  type="button"
                  onClick={onCancelCreate}
                  className="px-4 py-2.5 rounded-xl bg-canvas border border-border-default hover:text-white text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={onCreateSubmit}
                className="px-6 py-2.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-2 shadow-glow-emerald cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Tarjeta a la Lección</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onDeleteStep(stepForm.id)}
                className="px-4 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Tarjeta</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onStartAddCard}
                  className="px-4 py-2.5 rounded-xl bg-canvas border border-border-default hover:text-white text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  + Nueva Tarjeta
                </button>
                <button
                  type="button"
                  disabled={isSavingStep}
                  onClick={onSaveStep}
                  className="px-6 py-2.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-2 shadow-glow-emerald cursor-pointer disabled:opacity-60"
                >
                  {isSavingStep ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
