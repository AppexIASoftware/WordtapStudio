"use client";

import { AutoResizeTextarea } from "./auto-resize-textarea";

interface VaultPedagogicalNoteCardProps {
  note: string;
  noteType: "bulb" | "pin";
  onNoteChange: (val: string) => void;
  onNoteTypeChange: (val: "bulb" | "pin") => void;
}

export function VaultPedagogicalNoteCard({
  note,
  noteType,
  onNoteChange,
  onNoteTypeChange,
}: VaultPedagogicalNoteCardProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-1.5 h-6">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <span className="text-amber-400">💡</span>
          <span>Nota Pedagógica / Tip</span>
        </span>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-card border border-border-default">
          <button
            type="button"
            onClick={() => onNoteTypeChange("bulb")}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              noteType !== "pin"
                ? "bg-emerald-brand/15 text-emerald-brand border border-emerald-brand/30 shadow-xs"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Foco (Tip)
          </button>
          <button
            type="button"
            onClick={() => onNoteTypeChange("pin")}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              noteType === "pin"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-xs"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Pin (Importante)
          </button>
        </div>
      </div>
      <AutoResizeTextarea
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        minHeight={56}
        className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-brand leading-relaxed"
        placeholder="Nota de aprendizaje, advertencia de uso o trampa léxica..."
      />
    </div>
  );
}
