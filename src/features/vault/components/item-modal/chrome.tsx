"use client";

import { X, Sparkles, Loader2, Edit3, CheckCircle2, AlertCircle } from "lucide-react";

interface HeaderProps {
  isEditing: boolean;
  isOfficial: boolean;
  errorMessage: string | null;
  onClose: () => void;
}

export function EditorHeader({ isEditing, isOfficial, errorMessage, onClose }: HeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-border-default pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center font-bold flex-shrink-0">
            {isEditing ? <Edit3 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base md:text-lg font-bold text-white">
                {isEditing ? (isOfficial ? "Editar Término Oficial" : "Editar Término Privado") : isOfficial ? "Nuevo Término Oficial" : "Nuevo Término en Mi Biblioteca"}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-brand/15 text-emerald-brand border border-emerald-brand/25">
                {isEditing ? "Edición" : "Catálogo Vault"}
              </span>
            </div>
            <p className="text-xs text-slate-subtle mt-0.5">
              {isOfficial ? "Unidad pedagógica universal para el repositorio global de Wordtap" : "Término lingüístico exclusivo para tu colección privada"}
            </p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="p-2 rounded-xl bg-card text-slate-muted hover:text-white hover:bg-card-hover border border-border-default transition-colors cursor-pointer flex items-center justify-center" title="Cerrar modal">
          <X className="w-4 h-4" />
        </button>
      </div>
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}
    </>
  );
}

interface ActionsProps {
  isSaving: boolean;
  isEditing: boolean;
  isOfficial: boolean;
  onClose: () => void;
}

export function EditorActions({ isSaving, isEditing, isOfficial, onClose }: ActionsProps) {
  return (
    <div className="pt-6 border-t border-border-default flex items-center justify-between gap-3">
      <button type="button" onClick={onClose} disabled={isSaving} className="px-5 py-2.5 rounded-xl bg-canvas border border-border-default text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer">Cancelar</button>
      <button type="submit" disabled={isSaving} className="px-7 py-2.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs flex items-center gap-2 hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald disabled:opacity-50">
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
        <span>{isEditing ? "Guardar Cambios" : isOfficial ? "Incorporar al Catálogo" : "Guardar en Mi Biblioteca"}</span>
      </button>
    </div>
  );
}
