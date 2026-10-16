"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2, Edit } from "lucide-react";
import { Lesson } from "@/features/courses/types";

interface EditLessonModalProps {
  isOpen: boolean;
  lesson: Lesson;
  onClose: () => void;
  onSave: (lessonId: string, title: string, subtitle: string, duration: string) => Promise<void>;
  onDelete: (lessonId: string) => Promise<void>;
}

export function EditLessonModal({
  isOpen,
  lesson,
  onClose,
  onSave,
  onDelete,
}: EditLessonModalProps) {
  const [title, setTitle] = useState(lesson.title);
  const [subtitle, setSubtitle] = useState(lesson.subtitle);
  const [duration, setDuration] = useState(lesson.duration);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(lesson.title);
    setSubtitle(lesson.subtitle);
    setDuration(lesson.duration);
    setError(null);
  }, [lesson]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave(lesson.id, cleanTitle, subtitle.trim(), duration);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al actualizar lección");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar la lección "${lesson.title}" y todas sus tarjetas?`)) {
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      await onDelete(lesson.id);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar lección");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border-default rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Edit className="w-4 h-4 text-emerald-brand" />
            <span>Editar Lección</span>
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

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-mono text-slate-subtle block mb-1">
              Título de la Lección
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default text-white focus:outline-none focus:border-emerald-brand"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-subtle block mb-1">
              Subtítulo / Objetivo
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default text-white focus:outline-none focus:border-emerald-brand"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-subtle block mb-1">
              Duración Estimada
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default text-white focus:outline-none focus:border-emerald-brand"
            >
              <option value="5 min">5 min</option>
              <option value="10 min">10 min</option>
              <option value="15 min">15 min</option>
              <option value="20 min">20 min</option>
              <option value="30 min">30 min</option>
            </select>
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
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
