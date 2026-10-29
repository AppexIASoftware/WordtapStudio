"use client";

import { useMemo, useState } from "react";
import { BookOpen, Layers, RefreshCw, Code2 } from "lucide-react";
import { ApiCourse } from "@/services/api/types";

interface VocabSourceProps {
  isGlobal?: boolean;
  sourceType: string;
  courseId: string | null;
  courses: ApiCourse[];
  level: string;
  itemCount: number;
  loadingSources: boolean;
  customWordsText: string;
  setCourseId: (id: string) => void;
  setCustomWordsText: (text: string) => void;
  handleAutoPopulateSource: (type: "course_lesson" | "vault") => void;
}

export function VocabSource({
  isGlobal = false,
  sourceType,
  courseId,
  courses,
  level,
  itemCount,
  loadingSources,
  customWordsText,
  setCourseId,
  setCustomWordsText,
  handleAutoPopulateSource,
}: VocabSourceProps) {
  const [showJsonEditor, setShowJsonEditor] = useState(false);

  const parsedWords = useMemo<{ term: string; translation: string }[]>(() => {
    try {
      const arr = JSON.parse(customWordsText);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }, [customWordsText]);

  return (
    <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-white">4. Fuente de Vocabulario</h3>
        <div className="flex items-center gap-2">
          {!isGlobal && (
            <button
              type="button"
              onClick={() => handleAutoPopulateSource("course_lesson")}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer ${
                sourceType === "course_lesson"
                  ? "bg-mint-brand/20 text-mint-brand border border-mint-brand/40"
                  : "bg-canvas text-slate-400"
              }`}
            >
              <BookOpen className="w-3 h-3" />
              Desde Curso
            </button>
          )}
          <button
            type="button"
            onClick={() => handleAutoPopulateSource("vault")}
            disabled={loadingSources}
            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer ${
              sourceType === "vault"
                ? "bg-mint-brand/20 text-mint-brand border border-mint-brand/40"
                : "bg-canvas text-slate-400"
            }`}
          >
            <Layers className="w-3 h-3" />
            Desde Bóveda
          </button>
        </div>
      </div>

      {!isGlobal && sourceType === "course_lesson" && courses.length > 0 && (
        <div className="flex items-center gap-2">
          <select
            value={courseId || ""}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-canvas border border-border-default text-slate-200 font-mono text-[11px] cursor-pointer"
          >
            <option value="">-- Seleccionar Curso Vinculado --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.level})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => handleAutoPopulateSource("course_lesson")}
            disabled={loadingSources}
            className="px-2.5 py-1.5 rounded-lg bg-card border border-border-default hover:text-white text-slate-300 text-[10px] flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loadingSources ? "animate-spin" : ""}`} />
            Extraer
          </button>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300 font-semibold">
            Palabras cargadas ({parsedWords.length}):
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAutoPopulateSource("vault")}
              disabled={loadingSources}
              className="px-2 py-1 rounded-lg bg-emerald-brand/10 border border-emerald-brand/30 text-emerald-brand text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-emerald-brand/20 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${loadingSources ? "animate-spin" : ""}`} />
              <span>Cargar {itemCount} del Vault</span>
            </button>
            <button
              type="button"
              onClick={() => setShowJsonEditor((v) => !v)}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-mono"
              title="Alternar vista técnica de JSON"
            >
              <Code2 className="w-3 h-3" />
              <span>{showJsonEditor ? "Ocultar JSON" : "Editar JSON"}</span>
            </button>
          </div>
        </div>

        {parsedWords.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2.5 bg-canvas rounded-xl border border-border-default scrollbar-thin">
            {parsedWords.map((p, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-card border border-border-default text-[11px] font-mono text-slate-200"
              >
                <strong className="text-mint-brand">{p.term}</strong> ↔ {p.translation}
              </span>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-canvas rounded-xl border border-dashed border-border-default text-center text-xs text-slate-500">
            No hay palabras asignadas aún. Pulsa &quot;Cargar del Vault&quot; para rellenar con vocabulario oficial de nivel {level}.
          </div>
        )}

        {showJsonEditor && (
          <div className="pt-2 animate-in fade-in duration-150">
            <textarea
              rows={5}
              value={customWordsText}
              onChange={(e) => setCustomWordsText(e.target.value)}
              placeholder='[{"term": "Word", "translation": "Palabra"}]'
              className="w-full p-2.5 rounded-xl bg-canvas border border-border-default text-slate-200 font-mono text-[11px] focus:outline-none focus:border-mint-brand"
            />
          </div>
        )}
      </div>
    </div>
  );
}
