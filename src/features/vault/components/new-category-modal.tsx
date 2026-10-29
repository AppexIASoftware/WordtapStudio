"use client";

import { useState, useEffect } from "react";
import { X, FolderPlus, Loader2, Sparkles } from "lucide-react";
import { createVaultCategoryApi, ApiVaultCategory } from "@/services/api";

interface NewCategoryModalProps {
  isOpen: boolean;
  initialName?: string;
  onClose: () => void;
  onCreated: (category: ApiVaultCategory) => void;
}

export function NewCategoryModal({
  isOpen,
  initialName = "",
  onClose,
  onCreated,
}: NewCategoryModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription("");
      setError(null);
    }
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    setIsSubmitting(true);
    setError(null);

    const res = await createVaultCategoryApi({
      name: cleanName,
      description: description.trim() || undefined,
    });
    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    if (res.data) {
      onCreated(res.data);
      setName("");
      setDescription("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border-default rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-border-default">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-brand/10 text-emerald-brand">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Nueva Categoría Temática</h2>
              <p className="text-[11px] text-slate-muted">Catálogo macro del Content Vault</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-canvas text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-mono text-slate-subtle block mb-1">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Tecnología & Software"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default text-white focus:outline-none focus:border-emerald-brand"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-subtle block mb-1">
              Descripción Pedagógica
            </label>
            <textarea
              rows={2}
              placeholder="Temas que abarca: desarrollo, código, infraestructura..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default text-white focus:outline-none focus:border-emerald-brand resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Crear Categoría</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
