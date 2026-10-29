"use client";

import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
import { VaultPedagogicalNoteCard } from "../pedagogical-note-card";

interface ContextFieldsProps {
  example: string;
  note: string;
  noteType: "bulb" | "pin";
  isPhraseOrSentence: boolean;
  onExampleChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onNoteTypeChange: (value: "bulb" | "pin") => void;
}

export function ContextFields({ example, note, noteType, isPhraseOrSentence, onExampleChange, onNoteChange, onNoteTypeChange }: ContextFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 items-start">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-1.5 h-6">
          <label className="block text-xs font-semibold text-slate-300">Oración de Ejemplo en Contexto</label>
          {isPhraseOrSentence && <span className="text-[11px] font-normal text-slate-subtle">(Opcional si ya es frase)</span>}
        </div>
        <AutoResizeTextarea value={example} onChange={(e) => onExampleChange(e.target.value)} placeholder='Ej: "She has a beautiful house in the city center."' minHeight={56} className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-brand italic leading-relaxed" />
      </div>
      <VaultPedagogicalNoteCard note={note} noteType={noteType} onNoteChange={onNoteChange} onNoteTypeChange={onNoteTypeChange} />
    </div>
  );
}
