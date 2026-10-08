"use client";

import { useState } from "react";
import {
  BookOpen,
  Volume2,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Loader2,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";
import { Lesson, LessonItem } from "@/features/teacher-dashboard/types";

interface CurriculumPreviewTabProps {
  courseTitle: string;
  lessons: Lesson[];
  isLoading: boolean;
  onPlaytestLesson: (lesson: Lesson) => void;
  onSpeak: (text: string) => void;
}

export function CurriculumPreviewTab({
  courseTitle,
  lessons,
  isLoading,
  onPlaytestLesson,
  onSpeak,
}: CurriculumPreviewTabProps) {
  const [expandedLessonIds, setExpandedLessonIds] = useState<Record<string, boolean>>({
    [lessons[0]?.id || ""]: true,
  });

  const toggleLesson = (id: string) => {
    setExpandedLessonIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    lessons.forEach((l) => {
      all[l.id] = true;
    });
    setExpandedLessonIds(all);
  };

  const collapseAll = () => {
    setExpandedLessonIds({});
  };

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-muted bg-canvas rounded-2xl border border-border-default">
        <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
        <p className="text-xs font-mono">Cargando árbol curricular y tarjetas del docente...</p>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="p-8 text-center bg-canvas rounded-2xl border border-border-default space-y-2">
        <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
        <h4 className="text-sm font-bold text-white">El curso no posee lecciones cargadas</h4>
        <p className="text-xs text-slate-muted max-w-sm mx-auto">
          No se encontraron lecciones estructuradas para auditar en esta versión.
        </p>
      </div>
    );
  }

  const totalCards = lessons.reduce((acc, l) => acc + (l.items?.length || 0), 0);

  return (
    <div className="space-y-4">
      {/* Barra de Estadísticas y Controles del Temario */}
      <div className="p-4 rounded-2xl bg-canvas border border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <span>Estructura Pedagógica del Curso</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px]">
                Modo Auditoría
              </span>
            </h4>
            <p className="text-[11px] text-slate-muted">
              {lessons.length} {lessons.length === 1 ? "lección" : "lecciones"} • {totalCards} tarjetas de aprendizaje
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="px-2.5 py-1 rounded-lg bg-card border border-border-default hover:border-slate-400 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
          >
            Expandir Todo
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-2.5 py-1 rounded-lg bg-card border border-border-default hover:border-slate-400 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
          >
            Colapsar
          </button>
        </div>
      </div>

      {/* Lista Acordeón de Lecciones */}
      <div className="space-y-3">
        {lessons.map((lesson, index) => {
          const isExpanded = Boolean(expandedLessonIds[lesson.id]);
          const items = lesson.items || [];

          return (
            <div
              key={lesson.id}
              className="rounded-2xl border border-border-default bg-card overflow-hidden transition-all shadow-sm"
            >
              {/* Encabezado de la Lección */}
              <div
                onClick={() => toggleLesson(lesson.id)}
                className="p-4 bg-card hover:bg-card-hover/60 transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-canvas border border-border-default flex items-center justify-center font-mono text-xs font-bold text-mint-brand flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white truncate flex items-center gap-2">
                      <span>{lesson.title}</span>
                      <span className="text-[10px] font-normal text-slate-muted font-mono">
                        ({items.length} tarjetas)
                      </span>
                    </h5>
                    {lesson.subtitle && (
                      <p className="text-[11px] text-slate-muted truncate">{lesson.subtitle}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlaytestLesson(lesson);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Abrir playtest interactivo de esta lección"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Playtest</span>
                  </button>

                  <div className="p-1 rounded-lg text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Contenido Expandido: Tarjetas de Aprendizaje */}
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-border-default/60 bg-canvas/40 space-y-2.5">
                  <div className="pt-3 pb-1 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-subtle">
                    <span>Fichas Pedagógicas</span>
                    <span>Nivel {lesson.tier || "Estándar"}</span>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-3 text-center">
                      Esta lección no contiene tarjetas de aprendizaje.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {items.map((item, itemIdx) => (
                        <div
                          key={item.id || itemIdx}
                          className="p-3 rounded-xl bg-card border border-border-default/80 hover:border-slate-400/50 transition-colors flex flex-col gap-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-white tracking-wide">
                                {item.en}
                              </span>
                              {item.ipa && (
                                <span className="text-[11px] font-mono text-mint-brand bg-mint-brand/10 px-1.5 py-0.2 rounded border border-mint-brand/20">
                                  {item.ipa}
                                </span>
                              )}
                              <span className="text-[10px] font-mono uppercase text-slate-400 bg-canvas px-1.5 py-0.2 rounded border border-border-default">
                                {item.pos || item.itemType || "word"}
                              </span>
                              {item.contentBankItemId && (
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  🌐 Content Vault
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => onSpeak(item.en)}
                              className="p-1.5 rounded-lg bg-canvas hover:bg-card text-slate-400 hover:text-emerald-brand transition-colors cursor-pointer flex-shrink-0"
                              title="Escuchar pronunciación nativa"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <span className="text-slate-muted">Traducción:</span>
                            <span className="font-semibold text-slate-100">{item.es}</span>
                          </div>

                          {item.example && (
                            <div className="text-[11px] text-slate-400 bg-canvas/80 p-2 rounded-lg border border-border-default/50 space-y-0.5">
                              <span className="text-[10px] font-mono uppercase text-slate-500 block">Ejemplo:</span>
                              <p className="italic text-slate-300">&quot;{item.example}&quot;</p>
                            </div>
                          )}

                          {item.note && (
                            <div className="flex items-start gap-1 text-[11px] text-amber-300/90 pt-0.5">
                              <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                              <span className="leading-snug">{item.note}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
