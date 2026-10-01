"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createLessonApi, saveLessonItemApi } from "@/services/api";
import { Lesson } from "../types";

interface AddLessonModalProps {
  isOpen: boolean;
  courseId: string;
  onClose: () => void;
  onCreated: (newLesson: Lesson) => void;
}

export function AddLessonModal({ isOpen, courseId, onClose, onCreated }: AddLessonModalProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [duration, setDuration] = useState("15 min");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    setIsSubmitting(true);
    setError(null);

    const minutes = parseInt(duration.replace(/\D/g, ""), 10) || 15;

    const res = await createLessonApi(courseId, {
      title: cleanTitle,
      description: subtitle.trim() || undefined,
      estimated_minutes: minutes,
      sort_order: 1,
    });

    if (res.error) {
      setIsSubmitting(false);
      setError(res.error);
      return;
    }

    if (res.data) {
      const lessonId = res.data.id;
      // Persist initial card
      const initialCardData = {
        en: "learn",
        es: "aprender",
        ipa: "/lɜːrn/",
        pos: "Verbo",
        example: '"I learn English"',
        note: "Verbo esencial",
        noteType: "bulb" as const,
        itemType: "word" as const,
      };

      const itemRes = await saveLessonItemApi(lessonId, {
        item_type: "word",
        content_text: JSON.stringify(initialCardData),
        sort_order: 1,
        is_required: true,
      });

      const initialItemId = itemRes.data?.id || `step-${Date.now()}`;

      const createdLesson: Lesson = {
        id: lessonId,
        title: cleanTitle,
        subtitle: subtitle.trim() || "Objetivo pedagógico de la lección",
        duration: `${minutes} min`,
        tier: "Draft",
        isPublished: false,
        intro: subtitle.trim() || "Bienvenido a esta lección.",
        sectionTitle: "Vocabulario esencial",
        items: [
          {
            id: initialItemId,
            ...initialCardData,
          },
        ],
      };

      setIsSubmitting(false);
      onCreated(createdLesson);
      setTitle("");
      setSubtitle("");
      setDuration("15 min");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-brand" />
            <span>Añadir Nueva Lección</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-muted hover:text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-semibold text-slate-200 mb-1">Título</label>
            <input
              type="text"
              required
              placeholder="Ej: 5. Adjetivos Comparativos"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">Subtítulo / Objetivo</label>
            <input
              type="text"
              placeholder="Ej: Aprende a comparar personas y cosas"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">Duración Estimada</label>
            <input
              type="text"
              placeholder="Ej: 15 min"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold hover:bg-mint-brand transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Crear Lección</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
