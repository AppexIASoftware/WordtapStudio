"use client";

import { useMemo, useState } from "react";
import { BookOpen, Layers, PenLine, RefreshCw, X, Plus, Code2 } from "lucide-react";
import { ApiCourse } from "@/services/api/types";

interface WordPair {
  term: string;
  translation: string;
}

interface VocabSourceProps {
  isGlobal?: boolean;
  sourceType: string;
  courseId: string | null;
  courses: ApiCourse[];
  level: string;
  itemCount: number;
  loadingSources: boolean;
  sourceMessage: string | null;
  customWordsText: string;
  setCourseId: (id: string) => void;
  setCustomWordsText: (text: string) => void;
  handleAutoPopulateSource: (type: "course_lesson" | "vault", targetCourseId?: string) => void;
}

export function VocabSource({
  isGlobal = false,
  sourceType,
  courseId,
  courses,
  level,
  itemCount,
  loadingSources,
  sourceMessage,
  customWordsText,
  setCourseId,
  setCustomWordsText,
  handleAutoPopulateSource,
}: VocabSourceProps) {
  const [activeTab, setActiveTab] = useState<"courses" | "vault" | "manual">(
    isGlobal || sourceType === "vault" ? "vault" : "courses"
  );
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [newTerm, setNewTerm] = useState("");
  const [newTranslation, setNewTranslation] = useState("");

  const parsedWords = useMemo<WordPair[]>(() => {
    try {
      const arr = JSON.parse(customWordsText);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }, [customWordsText]);

  const handleRemoveWord = (indexToRemove: number) => {
    const updated = parsedWords.filter((_, idx) => idx !== indexToRemove);
    setCustomWordsText(JSON.stringify(updated, null, 2));
  };

  const handleAddWord = () => {
    const trimmedTerm = newTerm.trim();
    const trimmedTrans = newTranslation.trim();
    if (!trimmedTerm || !trimmedTrans) return;

    const updated = [...parsedWords, { term: trimmedTerm, translation: trimmedTrans }];
    setCustomWordsText(JSON.stringify(updated, null, 2));
    setNewTerm("");
    setNewTranslation("");
  };

  const handleClearAll = () => {
    setCustomWordsText("[]");
  };

  return (
    <div className="p-5 rounded-2xl bg-card border border-border-default space-y-4">
      {/* Cabecera y Selector de Origen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h3 className="text-sm font-bold text-white">4. Fuente de Vocabulario</h3>
          <p className="text-xs text-slate-400">
            Elegí cómo alimentar las palabras y respuestas para esta actividad interactiva.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-canvas p-1 rounded-xl border border-border-default shrink-0">
          {!isGlobal && (
            <button
              type="button"
              onClick={() => {
                setActiveTab("courses");
                if (courseId) {
                  handleAutoPopulateSource("course_lesson", courseId);
                }
              }}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeTab === "courses"
                  ? "bg-mint-brand/20 text-mint-brand border border-mint-brand/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mis Cursos</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setActiveTab("vault");
              handleAutoPopulateSource("vault");
            }}
            disabled={loadingSources}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === "vault"
                ? "bg-mint-brand/20 text-mint-brand border border-mint-brand/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bóveda Oficial</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === "manual"
                ? "bg-mint-brand/20 text-mint-brand border border-mint-brand/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Manual</span>
          </button>
        </div>
      </div>

      {/* Panel específico según la pestaña activa */}
      {activeTab === "courses" && !isGlobal && (
        <div className="space-y-2">
          {courses.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={courseId || ""}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setCourseId(selectedId);
                  if (selectedId) {
                    handleAutoPopulateSource("course_lesson", selectedId);
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-canvas border border-border-default text-slate-200 text-xs cursor-pointer focus:outline-none focus:border-mint-brand"
              >
                <option value="">-- Seleccionar curso publicado --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.level})
                  </option>
                ))}
              </select>

              {courseId && (
                <button
                  type="button"
                  onClick={() => handleAutoPopulateSource("course_lesson", courseId)}
                  disabled={loadingSources}
                  className="px-3.5 py-2 rounded-xl bg-card border border-border-default hover:text-white text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingSources ? "animate-spin" : ""}`} />
                  <span>Re-extraer</span>
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
              Solo podés extraer vocabulario de cursos aprobados y publicados. Actualmente no tenés cursos publicados disponibles.
            </p>
          )}
        </div>
      )}

      {activeTab === "vault" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-canvas border border-border-default">
          <div className="text-xs text-slate-300">
            Vocabulario oficial certificado para nivel <span className="font-bold text-mint-brand">{level}</span>.
          </div>
          <button
            type="button"
            onClick={() => handleAutoPopulateSource("vault")}
            disabled={loadingSources}
            className="px-3.5 py-1.5 rounded-lg bg-mint-brand/15 border border-mint-brand/30 text-mint-brand hover:bg-mint-brand/25 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingSources ? "animate-spin" : ""}`} />
            <span>Cargar {itemCount} del Vault</span>
          </button>
        </div>
      )}

      {activeTab === "manual" && (
        <p className="text-xs text-slate-400 bg-canvas p-3 rounded-xl border border-border-default">
          Modo manual activo: podés añadir pares de palabras uno a uno con el formulario inferior o pegar un listado en modo avanzado.
        </p>
      )}

      {sourceMessage && (
        <p role="status" className="text-xs text-amber-400 bg-amber-400/10 px-3 py-2 rounded-lg border border-amber-400/20">
          {sourceMessage}
        </p>
      )}

      {/* Lista interactiva de palabras */}
      <div className="space-y-2.5 pt-1 border-t border-border-default/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span>Palabras cargadas</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                parsedWords.length >= itemCount
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
              }`}
            >
              {parsedWords.length} de {itemCount} recomendadas
            </span>
          </div>

          {parsedWords.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] text-slate-400 hover:text-rose-400 cursor-pointer transition-colors"
            >
              Limpiar todo
            </button>
          )}
        </div>

        {parsedWords.length > 0 ? (
          <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto p-3 bg-canvas rounded-xl border border-border-default scrollbar-thin">
            {parsedWords.map((p, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border-default text-xs text-slate-200 group hover:border-slate-600 transition-colors"
              >
                <strong className="text-mint-brand font-medium">{p.term}</strong>
                <span className="text-slate-500">↔</span>
                <span className="text-slate-300">{p.translation}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveWord(idx)}
                  className="text-slate-500 hover:text-rose-400 p-0.5 rounded cursor-pointer transition-colors"
                  title={`Eliminar "${p.term}"`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-canvas rounded-xl border border-dashed border-border-default text-center text-xs text-slate-500">
            No hay palabras asignadas todavía. Seleccioná un curso arriba o añadí palabras con el formulario rápido.
          </div>
        )}

        {/* Formulario rápido de adición de palabra */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <input
            type="text"
            placeholder="Término en inglés (ej. eraser)"
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddWord())}
            className="flex-1 px-3 py-1.5 rounded-lg bg-canvas border border-border-default text-slate-200 text-xs focus:outline-none focus:border-mint-brand"
          />
          <input
            type="text"
            placeholder="Traducción en español (ej. borrador)"
            value={newTranslation}
            onChange={(e) => setNewTranslation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddWord())}
            className="flex-1 px-3 py-1.5 rounded-lg bg-canvas border border-border-default text-slate-200 text-xs focus:outline-none focus:border-mint-brand"
          />
          <button
            type="button"
            onClick={handleAddWord}
            disabled={!newTerm.trim() || !newTranslation.trim()}
            className="px-3.5 py-1.5 rounded-lg bg-card border border-border-default hover:bg-mint-brand/10 hover:border-mint-brand/40 text-slate-200 hover:text-mint-brand text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir</span>
          </button>
        </div>

        {/* Modo técnico colapsable */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={() => setShowJsonEditor((v) => !v)}
            className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 font-mono cursor-pointer"
          >
            <Code2 className="w-3 h-3" />
            <span>{showJsonEditor ? "Ocultar editor JSON" : "Modo avanzado (JSON)"}</span>
          </button>
        </div>

        {showJsonEditor && (
          <div className="pt-1 animate-in fade-in duration-150">
            <textarea
              rows={4}
              value={customWordsText}
              onChange={(e) => setCustomWordsText(e.target.value)}
              placeholder='[{"term": "eraser", "translation": "goma de borrar"}]'
              className="w-full p-2.5 rounded-xl bg-canvas border border-border-default text-slate-200 font-mono text-[11px] focus:outline-none focus:border-mint-brand"
            />
          </div>
        )}
      </div>
    </div>
  );
}
