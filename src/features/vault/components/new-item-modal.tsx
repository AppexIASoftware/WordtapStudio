"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EditorActions, EditorHeader } from "./item-modal/chrome";
import { LanguageFields } from "./item-modal/language-fields";
import { LinguisticFields } from "./item-modal/linguistic-fields";
import { ContextFields } from "./item-modal/context-fields";
import { createMetadata } from "./item-modal/metadata";
import {
  CreateVaultItemPayload,
  ApiVaultItem,
  getVaultCategoriesApi,
  ApiVaultCategory,
} from "@/services/api";
import { VaultDrawerConfigBar } from "./drawer-config-bar";
import { NewCategoryModal } from "./new-category-modal";
import { useSpeak } from "@/hooks/use-speak";

interface NewVaultItemModalProps {
  isOpen: boolean;
  initialItem?: ApiVaultItem | null;
  isOfficial?: boolean;
  canCreateCategory?: boolean;
  onClose: () => void;
  onSave: (payload: CreateVaultItemPayload, id?: string) => Promise<void>;
}

export function NewVaultItemModal({
  isOpen,
  initialItem,
  isOfficial = false,
  canCreateCategory = false,
  onClose,
  onSave,
}: NewVaultItemModalProps) {
  const [bankType, setBankType] = useState("vocabulary");
  const [categoryId, setCategoryId] = useState("");
  const [promptText, setPromptText] = useState("");
  const [targetText, setTargetText] = useState("");
  const [ipa, setIpa] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [cefrLevel, setCefrLevel] = useState("A1");
  const [difficulty, setDifficulty] = useState(1);
  const [example, setExample] = useState("");
  const [note, setNote] = useState("");
  const [noteType, setNoteType] = useState<"bulb" | "pin">("bulb");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const speak = useSpeak();
  const queryClient = useQueryClient();
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [newCategoryInitialName, setNewCategoryInitialName] = useState("");

  const { data: categories = [] } = useQuery<ApiVaultCategory[]>({
    queryKey: ["vault-categories"],
    queryFn: async () => {
      const res = await getVaultCategoriesApi();
      return res.data || [];
    },
    staleTime: 10 * 60 * 1000,
    enabled: isOpen,
  });

  useEffect(() => {
    if (initialItem) {
      setBankType(initialItem.bank_type || "vocabulary");
      setCategoryId(initialItem.category_id || "");
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
          if (Array.isArray(parsed.tags)) setTagsInput(parsed.tags.join(", "));
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
      setCategoryId("");
      setPromptText("");
      setTargetText("");
      setIpa("");
      setCategory("");
      setTagsInput("");
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
          category_id: categoryId || (isEditing ? null : undefined),
          prompt_text: cleanPrompt,
          target_text: cleanTarget,
          ipa: ipa.trim() || undefined,
          cefr_level: cefrLevel,
          difficulty: Number(difficulty),
          explanation: note.trim() || undefined,
          metadata: createMetadata(example, note, category, tagsInput, noteType),
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
            <EditorHeader isEditing={isEditing} isOfficial={isOfficial} errorMessage={errorMessage} onClose={onClose} />

            {/* 1. Clasificación Pedagógica Superior */}
            <VaultDrawerConfigBar
              bankType={bankType}
              categoryId={categoryId}
              categories={categories}
              cefrLevel={cefrLevel}
              difficulty={difficulty}
              onBankTypeChange={setBankType}
              onCategoryIdChange={setCategoryId}
              onCefrLevelChange={setCefrLevel}
              onDifficultyChange={setDifficulty}
              onAddCategory={canCreateCategory ? (name) => {
                setNewCategoryInitialName(name || "");
                setIsNewCategoryModalOpen(true);
              } : undefined}
            />

            <LanguageFields
              targetText={targetText}
              promptText={promptText}
              bankType={bankType}
              onTargetChange={setTargetText}
              onPromptChange={setPromptText}
              onSpeak={speak}
            />

            <LinguisticFields
              ipa={ipa}
              category={category}
              tagsInput={tagsInput}
              isPhraseOrSentence={isPhraseOrSentence}
              onIpaChange={setIpa}
              onCategoryChange={setCategory}
              onTagsChange={setTagsInput}
            />

            <ContextFields
              example={example}
              note={note}
              noteType={noteType}
              isPhraseOrSentence={isPhraseOrSentence}
              onExampleChange={setExample}
              onNoteChange={setNote}
              onNoteTypeChange={setNoteType}
            />
          </div>

          <EditorActions isSaving={isSaving} isEditing={isEditing} isOfficial={isOfficial} onClose={onClose} />
        </form>
      </div>

      {/* Modal para Crear Nueva Categoría Temática al instante */}
      <NewCategoryModal
        isOpen={isNewCategoryModalOpen}
        initialName={newCategoryInitialName}
        onClose={() => setIsNewCategoryModalOpen(false)}
        onCreated={(newCat) => {
          queryClient.invalidateQueries({ queryKey: ["vault-categories"] });
          setCategoryId(newCat.id);
        }}
      />
    </div>
  );
}

export { NewVaultItemModal as VaultItemDrawer };
