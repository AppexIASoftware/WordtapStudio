"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2, Edit3 } from "lucide-react";
import { Course } from "@/features/courses/types";;

interface EditCourseModalProps {
  isOpen: boolean;
  course: Course;
  onClose: () => void;
  onSave: (updated: { title: string; level: string; price: number }) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function EditCourseModal({
  isOpen,
  course,
  onClose,
  onSave,
  onDelete,
}: EditCourseModalProps) {
  const [title, setTitle] = useState(course.title);
  const [level, setLevel] = useState(course.level);
  const [price, setPrice] = useState(course.price || 19.99);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(course.title);
    setLevel(course.level);
    setPrice(course.price || 19.99);
    setError(null);
  }, [course]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave({ title: cleanTitle, level, price });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al actualizar curso");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar definitivamente el curso "${course.title}"?`)) {
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      await onDelete();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar curso");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border-default rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-emerald-brand" />
            <span>Editar Curso</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-muted hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-mono text-slate-subtle block mb-1">
              Título del Curso
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default text-white focus:outline-none focus:border-emerald-brand"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-subtle block mb-1">
                Nivel Pedagógico
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default text-white focus:outline-none focus:border-emerald-brand"
              >
                <option value="A1">A1 - Principiante</option>
                <option value="A2">A2 - Elemental</option>
                <option value="B1">B1 - Intermedio</option>
                <option value="B2">B2 - Intermedio Alto</option>
                <option value="C1">C1 - Avanzado</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-subtle block mb-1">
                Precio (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default text-white font-mono focus:outline-none focus:border-emerald-brand"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border-default">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              <span>Eliminar</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs text-slate-muted hover:text-white rounded-xl bg-canvas border border-border-default cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="px-4 py-2 text-xs rounded-xl bg-emerald-brand text-canvas font-bold hover:bg-mint-brand transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
