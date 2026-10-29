"use client";

import React, { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Escribe y presiona coma o Enter...",
  className = "",
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse tags from comma-separated string
  const tags = value
    ? value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const addTag = (text: string) => {
    if (disabled) return;
    const rawItems = text
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (rawItems.length === 0) return;

    const newTags = [...tags];
    for (const item of rawItems) {
      if (!newTags.some((t) => t.toLowerCase() === item.toLowerCase())) {
        newTags.push(item);
      }
    }

    onChange(newTags.join(", "));
    setInputValue("");
  };

  const removeTag = (indexToRemove: number) => {
    if (disabled) return;
    const newTags = tags.filter((_, idx) => idx !== indexToRemove);
    onChange(newTags.join(", "));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      e.preventDefault();
      removeTag(tags.length - 1);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = e.target.value;
    if (val.includes(",")) {
      addTag(val);
    } else {
      setInputValue(val);
    }
  };

  const handleBlur = () => {
    if (disabled) return;
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const handleContainerClick = () => {
    if (disabled) return;
    inputRef.current?.focus();
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`min-h-[44px] w-full bg-canvas border border-border-default rounded-xl px-2.5 py-1.5 flex flex-wrap items-center gap-1.5 focus-within:border-emerald-brand transition-colors ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-text"
      } ${className}`}
    >
      {tags.map((tag, idx) => (
        <span
          key={`${tag}-${idx}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-brand/15 text-emerald-brand border border-emerald-brand/30 text-xs font-medium animate-in fade-in zoom-in-95 duration-100"
        >
          <span>{tag}</span>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(idx);
              }}
              className="hover:text-white hover:bg-emerald-brand/30 rounded p-0.5 transition-colors cursor-pointer"
              title={`Eliminar etiqueta ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}

      {!disabled && (
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : "+ etiqueta..."}
          className="flex-1 min-w-[120px] bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none py-1 px-1"
        />
      )}
    </div>
  );
}
