"use client";

import { Volume2, Edit3, Trash2 } from "lucide-react";
import { ApiVaultItem } from "@/services/api";
import { VaultAccent } from "../types/vault";

// El acento solo cambia el color del borde al pasar el mouse y del nivel CEFR:
// la estructura de la tarjeta es una sola para los tres roles.
const CARD_ACCENT: Record<VaultAccent, { hover: string; cefr: string }> = {
  emerald: {
    hover: "hover:border-slate-400/50",
    cefr: "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/20",
  },
  blue: {
    hover: "hover:border-blue-500/40",
    cefr: "bg-blue-500/15 text-blue-300 border-blue-500/25",
  },
};

function speakTerm(text: string) {
  if (typeof window !== "undefined" && "speechSynthesis" in window && text) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }
}

interface VaultItemCardProps {
  item: ApiVaultItem;
  accent?: VaultAccent;
  canEdit?: boolean;
  editTitle?: string;
  deleteTitle?: string;
  onEdit?: (item: ApiVaultItem) => void;
  onDelete?: (id: string) => void;
}

export function VaultItemCard({
  item,
  accent = "emerald",
  canEdit = false,
  editTitle = "Editar término",
  deleteTitle = "Eliminar término",
  onEdit,
  onDelete,
}: VaultItemCardProps) {
  const tone = CARD_ACCENT[accent];

  return (
    <div
      className={`p-4 rounded-2xl bg-card border border-border-default ${tone.hover} transition-all space-y-2.5 shadow-sm`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white text-sm">{item.target_text}</span>
            {item.ipa && (
              <span className="text-[10px] font-mono text-mint-brand bg-mint-brand/10 px-1.5 py-0.5 rounded border border-mint-brand/20">
                {item.ipa}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-0.5">{item.prompt_text}</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => speakTerm(item.target_text)}
            className="p-1.5 rounded-lg bg-canvas hover:bg-canvas-hover text-slate-400 hover:text-white cursor-pointer"
            title="Escuchar audio nativo"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          {canEdit && (
            <>
              <button
                type="button"
                onClick={() => onEdit?.(item)}
                className="p-1.5 rounded-lg bg-canvas hover:bg-canvas-hover text-slate-400 hover:text-blue-400 cursor-pointer"
                title={editTitle}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(item.id)}
                className="p-1.5 rounded-lg bg-canvas hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 cursor-pointer"
                title={deleteTitle}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border-default/60 text-[10px] font-mono text-slate-subtle">
        <span className="uppercase px-1.5 py-0.5 rounded bg-canvas border border-border-default">
          {item.bank_type}
        </span>
        <span className={`px-1.5 py-0.5 rounded border font-bold ${tone.cefr}`}>
          Nivel {item.cefr_level}
        </span>
      </div>
    </div>
  );
}
