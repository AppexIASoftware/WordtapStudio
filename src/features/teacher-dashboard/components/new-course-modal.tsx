"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createCourseApi, ApiCourse } from "@/services/api";

interface NewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (course: ApiCourse) => void;
}

export function NewCourseModal({ isOpen, onClose, onCreated }: NewCourseModalProps) {
  const [title, setTitle] = useState("");
  const [level, setNewLevel] = useState("A1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    setIsSubmitting(true);
    setError(null);

    const res = await createCourseApi({ title: cleanTitle, level });
    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    if (res.data) {
      onCreated(res.data);
      setTitle("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border-default rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Crear Nuevo Curso</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-muted hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-mono text-slate-subtle block mb-1">
              Título del Curso
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Inglés Técnico para Devs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default text-white focus:outline-none focus:border-emerald-brand"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-subtle block mb-1">
              Nivel Pedagógico
            </label>
            <select
              value={level}
              onChange={(e) => setNewLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default text-white focus:outline-none focus:border-emerald-brand"
            >
              <option value="A1">A1 - Principiante</option>
              <option value="A2">A2 - Elemental</option>
              <option value="B1">B1 - Intermedio</option>
              <option value="B2">B2 - Intermedio Alto</option>
              <option value="C1">C1 - Avanzado</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-xs rounded-xl border border-border-default text-slate-muted hover:text-white cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 text-xs rounded-xl bg-emerald-brand text-canvas font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50 cursor-pointer flex justify-center items-center gap-1"
            >
              {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
