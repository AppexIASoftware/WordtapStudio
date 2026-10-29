"use client";

import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
import { TagInput } from "@/components/ui/tag-input";

interface LinguisticFieldsProps {
  ipa: string;
  category: string;
  tagsInput: string;
  isPhraseOrSentence: boolean;
  onIpaChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagsChange: (value: string) => void;
}

export function LinguisticFields({ ipa, category, tagsInput, isPhraseOrSentence, onIpaChange, onCategoryChange, onTagsChange }: LinguisticFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-1.5 h-6">
          <label className="block text-xs font-semibold text-slate-300">Transcripción Fonética (IPA)</label>
          {isPhraseOrSentence && <span className="text-[11px] font-normal text-slate-subtle">(Opcional)</span>}
        </div>
        <AutoResizeTextarea value={ipa} onChange={(e) => onIpaChange(e.target.value)} placeholder={isPhraseOrSentence ? "Ej: /kʊd juː pliːz tel miː weər.../ (opcional)" : "Ej: /ˈbjuː.tɪ.fəl/"} minHeight={44} className="w-full bg-canvas border border-border-default rounded-xl px-3.5 py-2.5 text-xs font-mono text-mint-brand focus:outline-none focus:border-emerald-brand leading-relaxed" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-1.5 h-6">
          <label className="block text-xs font-semibold text-slate-300">Categoría Gramatical</label>
          <span className="text-[11px] font-normal text-slate-subtle">(Función)</span>
        </div>
        <AutoResizeTextarea value={category} onChange={(e) => onCategoryChange(e.target.value)} placeholder="Ej: Adjetivo, Verbo, Sustantivo, Modismo..." minHeight={44} className="w-full bg-canvas border border-border-default rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-brand leading-relaxed" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-1.5 h-6">
          <label className="block text-xs font-semibold text-slate-300">Etiquetas Semánticas (Tags)</label>
          <span className="text-[11px] font-normal text-slate-subtle">(Coma o Enter)</span>
        </div>
        <TagInput
          value={tagsInput}
          onChange={onTagsChange}
          placeholder="Ej: aeropuerto, viaje, hotel..."
        />
      </div>
    </div>
  );
}
