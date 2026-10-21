"use client";

import { useState } from "react";
import { CardStrip } from "./card-strip";
import { CardEditorCanvas } from "./card-editor-canvas";
import { Lesson, LessonItem } from "@/features/courses/types";

interface CardsTabProps {
  currentLesson: Lesson;
  currentStepId: string;
  stepForm: LessonItem;
  isSavingStep?: boolean;
  readOnly?: boolean;
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
  readOnly = false,
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

  const isCreating = !readOnly && (isCreatingState || currentLesson.items.length === 0);

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

  if (readOnly && currentLesson.items.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-muted">
        Esta lección todavía no tiene tarjetas.
      </div>
    );
  }

  return (
    <div className="p-3.5 sm:p-4 space-y-4">
      <CardStrip
        items={currentLesson.items}
        currentStepId={currentStepId}
        isCreating={isCreating}
        readOnly={readOnly}
        onSelectStep={handleSelectExisting}
        onStartAddCard={handleStartAddCard}
      />

      <CardEditorCanvas
        isCreating={isCreating}
        readOnly={readOnly}
        itemsCount={currentLesson.items.length}
        activeItemType={activeItemType}
        activeEn={activeEn}
        activeEs={activeEs}
        activeIpa={activeIpa}
        activePos={activePos}
        activeExample={activeExample}
        activeNote={activeNote}
        activeNoteType={activeNoteType}
        stepForm={stepForm}
        isSavingStep={isSavingStep}
        updateField={updateField}
        onSpeak={onSpeak}
        onCancelCreate={() => setIsCreatingState(false)}
        onCreateSubmit={handleCreateSubmit}
        onDeleteStep={onDeleteStep}
        onStartAddCard={handleStartAddCard}
        onSaveStep={onSaveStep}
      />
    </div>
  );
}
