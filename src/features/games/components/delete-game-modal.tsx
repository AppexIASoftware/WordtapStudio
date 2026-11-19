"use client";

import { useState } from "react";
import { AlertCircle, Trash2, X } from "lucide-react";
import { TeacherGameDTO } from "@/services/api/types";

interface DeleteGameModalProps {
  game: TeacherGameDTO;
  onConfirm: (id: string) => Promise<void>;
  onClose: () => void;
}

export function DeleteGameModal({ game, onConfirm, onClose }: DeleteGameModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(game.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la actividad.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border-default shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-border-default flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Trash2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Eliminar actividad personalizada</h3>
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-7 h-7 rounded-lg bg-canvas text-slate-muted hover:text-white flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-1">
            <p className="font-bold text-white truncate">{game.title}</p>
            <p className="text-[11px] font-mono text-slate-muted uppercase">
              {game.base_archetype} • Nivel {game.level}
            </p>
          </div>

          <p className="text-slate-300 leading-relaxed">
            Esta acción eliminará la actividad personalizada de tu catálogo.
            {(game.usage_count ?? 0) > 0
              ? ` Actualmente se usa en ${game.usage_count} lección(es), por lo que dejará de estar disponible allí.`
              : " Esta operación no se puede deshacer."}
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 hover:text-white font-semibold cursor-pointer transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirm}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Eliminando..." : "Confirmar eliminación"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
