"use client";

import React, { useState } from "react";
import { X, Plus, Tag } from "lucide-react";

export const MAX_SPECIALTY_LENGTH = 120;

const SUGGESTED_SPECIALTIES = [
  "Inglés de Negocios",
  "Fonética",
  "IELTS",
  "TOEFL",
  "Gramática",
  "Conversación",
  "Kids & Teens",
  "Inglés General",
];

interface SpecialtyTagsInputProps {
  value: string;
  onChange: (nextValue: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function parseSpecialtyTags(raw: string): string[] {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function SpecialtyTagsInput({
  value,
  onChange,
  disabled = false,
  compact = false,
}: SpecialtyTagsInputProps) {
  const [draft, setDraft] = useState("");
  const tags = parseSpecialtyTags(value);
  const currentLength = value.trim().length;

  const commitTags = (nextTags: string[]) => {
    const serialized = nextTags.join(", ");
    onChange(serialized);
  };

  const addTag = (rawTag: string) => {
    const clean = rawTag.replace(/,/g, "").trim();
    if (!clean) return;
    if (tags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
      setDraft("");
      return;
    }
    const candidate = [...tags, clean].join(", ");
    if (candidate.length > MAX_SPECIALTY_LENGTH) return;
    commitTags([...tags, clean]);
    setDraft("");
  };

  const removeTag = (index: number) => {
    commitTags(tags.filter((_, idx) => idx !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const remainingSuggestions = SUGGESTED_SPECIALTIES.filter(
    (s) =>
      !tags.some((t) => t.toLowerCase() === s.toLowerCase()) &&
      ([...tags, s].join(", ").length <= MAX_SPECIALTY_LENGTH)
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <Tag size={12} className="text-emerald-brand" />
          <span>Especialidad Académica (Tags)</span>
        </span>
        <span
          className={`text-[11px] font-mono ${
            currentLength > MAX_SPECIALTY_LENGTH ? "text-rose-400" : "text-slate-subtle"
          }`}
        >
          {currentLength}/{MAX_SPECIALTY_LENGTH}
        </span>
      </div>

      <div className="p-2.5 rounded-xl bg-canvas border border-border-default focus-within:border-emerald-brand transition-colors space-y-2">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-brand/15 border border-emerald-brand/30 text-emerald-brand text-xs font-semibold"
              >
                <span>{tag}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:text-white transition-colors cursor-pointer"
                    aria-label={`Quitar ${tag}`}
                  >
                    <X size={12} />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Escribe una especialidad y presiona Enter..."
            className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-subtle focus:outline-none disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => addTag(draft)}
            disabled={disabled || !draft.trim()}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card border border-border-default hover:border-emerald-brand/50 text-[11px] font-semibold text-slate-200 transition-colors cursor-pointer disabled:opacity-40"
          >
            <Plus size={12} />
            <span>Añadir</span>
          </button>
        </div>
      </div>

      {!compact && remainingSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-slate-subtle font-mono mr-1">Sugerencias:</span>
          {remainingSuggestions.slice(0, 5).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={disabled}
              onClick={() => addTag(suggestion)}
              className="px-2 py-0.5 rounded-md bg-card hover:bg-card-hover border border-border-default text-[11px] text-slate-300 hover:text-emerald-brand transition-colors cursor-pointer disabled:opacity-50"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
