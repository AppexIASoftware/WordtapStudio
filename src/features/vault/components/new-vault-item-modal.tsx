"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Loader2, Edit3, Volume2, CheckCircle2, AlertCircle } from "lucide-react";
import { CreateVaultItemPayload, ApiVaultItem } from "@/services/api";
import { VaultDrawerConfigBar } from "./vault-drawer-config-bar";
import { VaultPedagogicalNoteCard } from "./vault-pedagogical-note-card";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
import { useSpeak } from "@/hooks/use-speak";

interface NewVaultItemModalProps {
  isOpen: boolean;
  initialItem?: ApiVaultItem | null;
  isOfficial?: boolean;
  onClose: () => void;
  onSave: (payload: CreateVaultItemPayload, id?: string) => Promise<void>;
}

export function NewVaultItemModal({
  isOpen,
  initialItem,
  isOfficial = false,
  onClose,
  onSave,
}: NewVaultItemModalProps) {
  const [bankType, setBankType] = useState("vocabulary");
  const [promptText, setPromptText] = useState("");
  const [targetText, setTargetText] = useState("");
  const [ipa, setIpa] = useState("");
  const [category, setCategory] = useState("");
  const [cefrLevel, setCefrLevel] = useState("A1");
  const [difficulty, setDifficulty] = useState(1);
  const [example, setExample] = useState("");
  const [note, setNote] = useState("");
  const [noteType, setNoteType] = useState<"bulb" | "pin">("bulb");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialItem) {
      setBankType(initialItem.bank_type || "vocabulary");
      setPromptText(initialItem.prompt_text || "");
      setTargetText(initialItem.target_text || "");
      setIpa(initialItem.ipa || "");
      setCefrLevel(initialItem.cefr_level || "A1");
      setDifficulty(initialItem.difficulty || 1);
      let ex = "";
      let nt = initialItem.explanation || "";
      let cat = "";
      let nType: "bulb" | "pin" = "bulb";
      if (initialItem.metadata) {
        try {
          const parsed = JSON.parse(initialItem.metadata);
          if (parsed.example) ex = parsed.example;
          if (parsed.note || parsed.trap) nt = parsed.note || parsed.trap;
          if (parsed.category) cat = parsed.category;
          if (parsed.noteType === "pin") nType = "pin";
        } catch {
          // ignorar JSON malformado
        }
      }
      setExample(ex);
      setNote(nt);
      setCategory(cat);
      setNoteType(nType);
    } else {
      setBankType("vocabulary");
      setPromptText("");
      setTargetText("");
      setIpa("");
      setCategory("");
      setCefrLevel("A1");
      setDifficulty(1);
      setExample("");
      setNote("");
      setNoteType("bulb");
    }
    setErrorMessage(null);
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const isEditing = Boolean(initialItem);
  const isPhraseOrSentence =
    bankType === "phrase" || bankType === "idioms" || bankType === "collocation";

  const targetPlaceholder =
    bankType === "phrase"
      ? 'Ej: "Could you please tell me where the nearest station is?"'
      : bankType === "collocation"
      ? 'Ej: "make an effort", "take a deep breath"...'
      : bankType === "idioms"
      ? 'Ej: "break the ice", "bite the bullet"...'
      : bankType === "false_friend"
      ? 'Ej: "actually", "eventually", "embarrassed"...'
      : bankType === "minimal_pair"
      ? 'Ej: "ship vs sheep", "desk vs disk"...'
      : 'Ej: "breakthrough", "resilient", "thrive"...';

  const promptPlaceholder =
    bankType === "phrase"
      ? 'Ej: "¿Podrías por favor decirme dónde queda la estación más cercana?"'
      : bankType === "collocation"
      ? 'Ej: "hacer un esfuerzo", "tomar un respiro"...'
      : bankType === "idioms"
      ? 'Ej: "romper el hielo", "hacer de tripas corazón"...'
      : bankType === "false_friend"
      ? 'Ej: "en realidad" (no "actualmente")...'
      : bankType === "minimal_pair"
      ? 'Ej: "barco vs oveja" (contraste fonético)...'
      : 'Ej: "avance decisivo", "resiliente", "prosperar"...';

  const targetLabel =
    bankType === "phrase"
      ? "Frase u Oración en Inglés (Target) *"
      : bankType === "collocation"
      ? "Colocación / Frase Fija en Inglés (Target) *"
      : bankType === "idioms"
      ? "Modismo / Idiom en Inglés (Target) *"
      : bankType === "minimal_pair"
      ? "Par Mínimo en Inglés (Target) *"
      : "Término / Palabra en Inglés (Target) *";

  const promptLabel =
    bankType === "phrase"
      ? "Traducción o Equivalente en Español (Prompt) *"
      : "Traducción al Español (Prompt) *";

  const speak = useSpeak();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTarget = targetText.trim();
    const cleanPrompt = promptText.trim();

    if (!cleanTarget || !cleanPrompt) {
      setErrorMessage("Por favor completá los campos obligatorios: Inglés y Español.");
      return;
    }

    setErrorMessage(null);
    setIsSaving(true);
    try {
      await onSave(
        {
          bank_type: bankType,
          prompt_text: cleanPrompt,
          target_text: cleanTarget,
          ipa: ipa.trim() || undefined,
          cefr_level: cefrLevel,
          difficulty: Number(difficulty),
          explanation: note.trim() || undefined,
          metadata: JSON.stringify({
            example: example.trim(),
            note: note.trim(),
            category: category.trim(),
            noteType,
          }),
        },
        initialItem?.id
      );
      onClose();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error al guardar el término en la biblioteca"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed top-14 bottom-0 right-0 left-0 lg:left-64 z-30 bg-canvas/98 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200 overflow-y-auto border-l border-t border-border-default">
      <div className="w-full flex-1 flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-5xl xl:max-w-6xl mx-auto flex flex-col flex-1 justify-between space-y-6">
          <div className="space-y-6">
            {/* Cabecera del Formulario en Pantalla Completa */}
            <div className="flex items-center justify-between border-b border-border-default pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center font-bold flex-shrink-0">
                  {isEditing ? <Edit3 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base md:text-lg font-bold text-white">
                      {isEditing
                        ? isOfficial
                          ? "Editar Término Oficial"
                          : "Editar Término Privado"
                        : isOfficial
                        ? "Nuevo Término Oficial"
                        : "Nuevo Término en Mi Biblioteca"}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-brand/15 text-emerald-brand border border-emerald-brand/25">
                      {isEditing ? "Edición" : "Catálogo Vault"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-subtle mt-0.5">
                    {isOfficial
                      ? "Unidad pedagógica universal para el repositorio global de Wordtap"
                      : "Término lingüístico exclusivo para tu colección privada"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-card text-slate-muted hover:text-white hover:bg-card-hover border border-border-default transition-colors cursor-pointer flex items-center justify-center"
                title="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Banner de error */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Clasificación Pedagógica Superior */}
            <VaultDrawerConfigBar
              bankType={bankType}
              cefrLevel={cefrLevel}
              difficulty={difficulty}
              onBankTypeChange={setBankType}
              onCefrLevelChange={setCefrLevel}
              onDifficultyChange={setDifficulty}
            />

            {/* 2a. Núcleo Bilingüe (Target y Prompt con auto-expansión independiente) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
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
                    value={targetText}
                    onChange={(e) => setTargetText(e.target.value)}
                    placeholder={targetPlaceholder}
                    minHeight={46}
                    className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-brand pr-11 leading-relaxed"
                  />
                  <button
                    type="button"
                    onClick={() => speak(targetText)}
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
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder={promptPlaceholder}
                  minHeight={46}
                  className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-emerald-brand leading-relaxed"
                />
              </div>
            </div>

            {/* 2b. Fonética (IPA auto-expandible) y Categoría Gramatical independiente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1.5 h-6">
                  <label className="block text-xs font-semibold text-slate-300">
                    Transcripción Fonética (IPA)
                  </label>
                  {isPhraseOrSentence && (
                    <span className="text-[11px] font-normal text-slate-subtle">
                      (Opcional)
                    </span>
                  )}
                </div>
                <AutoResizeTextarea
                  value={ipa}
                  onChange={(e) => setIpa(e.target.value)}
                  placeholder={
                    isPhraseOrSentence
                      ? "Ej: /kʊd juː pliːz tel miː weər ðə nɪərɪst steɪʃən ɪz/ (opcional)"
                      : "Ej: /ˈbjuː.tɪ.fəl/"
                  }
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
                    (Opcional)
                  </span>
                </div>
                <AutoResizeTextarea
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ej: Adjetivo, Verbo transitivo, Idiom, Expresión coloquial..."
                  minHeight={44}
                  className="w-full bg-canvas border border-border-default rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-brand leading-relaxed"
                />
              </div>
            </div>

            {/* 3. Refuerzo & Contexto (Ejemplo y Nota Pedagógica con auto-expansión independiente) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 items-start">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1.5 h-6">
                  <label className="block text-xs font-semibold text-slate-300">
                    Oración de Ejemplo en Contexto
                  </label>
                  {isPhraseOrSentence && (
                    <span className="text-[11px] font-normal text-slate-subtle">
                      (Opcional si ya es frase)
                    </span>
                  )}
                </div>
                <AutoResizeTextarea
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                  placeholder='Ej: "She has a beautiful house in the city center."'
                  minHeight={56}
                  className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-brand italic leading-relaxed"
                />
              </div>

              <VaultPedagogicalNoteCard
                note={note}
                noteType={noteType}
                onNoteChange={setNote}
                onNoteTypeChange={setNoteType}
              />
            </div>
          </div>

          {/* Pie de Acciones Pinned */}
          <div className="pt-6 border-t border-border-default flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-canvas border border-border-default text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-7 py-2.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs flex items-center gap-2 hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>
                {isEditing
                  ? "Guardar Cambios"
                  : isOfficial
                  ? "Incorporar al Catálogo"
                  : "Guardar en Mi Biblioteca"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { NewVaultItemModal as VaultItemDrawer };
