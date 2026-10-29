"use client";

import { Volume2 } from "lucide-react";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";

const TARGET_PLACEHOLDERS: Record<string, string> = {
  phrase: 'Ej: "Could you please tell me where the nearest station is?"',
  collocation: 'Ej: "make an effort", "take a deep breath"...',
  idioms: 'Ej: "break the ice", "bite the bullet"...',
  false_friend: 'Ej: "actually", "eventually", "embarrassed"...',
  minimal_pair: 'Ej: "ship vs sheep", "desk vs disk"...',
};
const PROMPT_PLACEHOLDERS: Record<string, string> = {
  phrase: 'Ej: "¿Podrías por favor decirme dónde queda la estación más cercana?"',
  collocation: 'Ej: "hacer un esfuerzo", "tomar un respiro"...',
  idioms: 'Ej: "romper el hielo", "hacer de tripas corazón"...',
  false_friend: 'Ej: "en realidad" (no "actualmente")...',
  minimal_pair: 'Ej: "barco vs oveja" (contraste fonético)...',
};
const TARGET_LABELS: Record<string, string> = {
  phrase: "Frase u Oración en Inglés (Target) *",
  collocation: "Colocación / Frase Fija en Inglés (Target) *",
  idioms: "Modismo / Idiom en Inglés (Target) *",
  minimal_pair: "Par Mínimo en Inglés (Target) *",
};

interface LanguageFieldsProps {
  targetText: string;
  promptText: string;
  bankType: string;
  onTargetChange: (value: string) => void;
  onPromptChange: (value: string) => void;
  onSpeak: (value: string) => void;
}

export function LanguageFields({ targetText, promptText, bankType, onTargetChange, onPromptChange, onSpeak }: LanguageFieldsProps) {
  const targetLabel = TARGET_LABELS[bankType] || "Término / Palabra en Inglés (Target) *";
  const promptLabel = bankType === "phrase" ? "Traducción o Equivalente en Español (Prompt) *" : "Traducción al Español (Prompt) *";
  const targetPlaceholder = TARGET_PLACEHOLDERS[bankType] || 'Ej: "breakthrough", "resilient", "thrive"...';
  const promptPlaceholder = PROMPT_PLACEHOLDERS[bankType] || 'Ej: "avance decisivo", "resiliente", "prosperar"...';
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-1.5 h-6">
          <label className="block text-xs font-semibold text-slate-300">{targetLabel}</label>
          <span className="text-[11px] text-slate-subtle">Requerido</span>
        </div>
        <div className="relative">
          <AutoResizeTextarea required value={targetText} onChange={(e) => onTargetChange(e.target.value)} placeholder={targetPlaceholder} minHeight={46} className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-brand pr-11 leading-relaxed" />
          <button type="button" onClick={() => onSpeak(targetText)} className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-card/80 text-slate-muted hover:text-mint-brand transition-colors cursor-pointer" title="Escuchar pronunciación">
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-1.5 h-6">
          <label className="block text-xs font-semibold text-slate-300">{promptLabel}</label>
          <span className="text-[11px] text-slate-subtle">Requerido</span>
        </div>
        <AutoResizeTextarea required value={promptText} onChange={(e) => onPromptChange(e.target.value)} placeholder={promptPlaceholder} minHeight={46} className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-emerald-brand leading-relaxed" />
      </div>
    </div>
  );
}
