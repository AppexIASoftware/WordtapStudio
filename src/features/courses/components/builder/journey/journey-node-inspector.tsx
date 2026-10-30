"use client";

import React from "react";
import {
  BookOpen,
  Gamepad2,
  Zap,
  Gift,
  Clock,
  Sparkles,
  ArrowRight,
  Volume2,
  FileEdit,
  ExternalLink,
} from "lucide-react";
import { CourseJourneyNode, JOURNEY_NODE_TYPE } from "./journey-types";
import { Lesson } from "@/features/courses/types";

interface JourneyNodeInspectorProps {
  node: CourseJourneyNode | null;
  lesson: Lesson | null;
  onEditLessonCards: (lessonId: string) => void;
  onEditLessonGames: (lessonId: string) => void;
  onSpeak: (text: string) => void;
}

export function JourneyNodeInspector({
  node,
  lesson,
  onEditLessonCards,
  onEditLessonGames,
  onSpeak,
}: JourneyNodeInspectorProps) {
  if (!node) {
    return (
      <div className="bg-card rounded-3xl border border-border-default p-6 text-center text-slate-muted text-xs">
        Selecciona una estación en el mapa para inspeccionar su estructura didáctica.
      </div>
    );
  }

  const isLesson = node.type === JOURNEY_NODE_TYPE.LESSON;
  const isGame = node.type === JOURNEY_NODE_TYPE.GAME;
  const isCheckpoint = node.type === JOURNEY_NODE_TYPE.CHECKPOINT;
  const isMilestone = node.type === JOURNEY_NODE_TYPE.MILESTONE;

  const badgeColor = isMilestone
    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
    : isCheckpoint
    ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
    : isGame
    ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
    : "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/30";

  const badgeLabel = isMilestone
    ? "Hito & Certificación"
    : isCheckpoint
    ? "Checkpoint Adaptativo"
    : isGame
    ? "Minijuego de Fijación"
    : "Lección Teórica";

  return (
    <div className="bg-card rounded-3xl border border-border-default p-6 space-y-5 shadow-sm sticky top-6">
      {/* Encabezado */}
      <div className="border-b border-border-default pb-4 space-y-1.5">
        <div className="flex items-center justify-between">
          <span
            className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border uppercase ${badgeColor}`}
          >
            {badgeLabel}
          </span>
          <span className="text-[11px] font-mono text-slate-muted">
            Estación #{node.order}
          </span>
        </div>
        <h3 className="text-base font-bold text-white leading-snug">{node.title}</h3>
        <p className="text-xs text-slate-muted">{node.subtitle}</p>
      </div>

      {/* Métricas Didácticas */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-2xl bg-canvas border border-border-default flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-slate-400" />
          <div>
            <span className="text-[10px] text-slate-subtle block uppercase font-mono">
              Duración
            </span>
            <span className="text-xs font-bold text-white">{node.duration || "15 min"}</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-canvas border border-border-default flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-subtle block uppercase font-mono">
              Recompensa
            </span>
            <span className="text-xs font-bold text-amber-400 font-mono">+{node.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Lista de Contenido / Vocabulario si es Lección */}
      {isLesson && lesson && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">
              Tarjetas de Vocabulario ({lesson.items?.length || 0})
            </span>
            <span className="text-[10px] font-mono text-slate-muted">
              {lesson.tier.toUpperCase()}
            </span>
          </div>

          <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
            {(lesson.items || []).map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-2.5 rounded-xl bg-canvas border border-border-default/80 flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white truncate">{item.en}</p>
                  <p className="text-[11px] text-slate-muted truncate">{item.es}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onSpeak(item.en)}
                  className="p-1 rounded-lg hover:bg-card text-slate-400 hover:text-mint-brand transition-colors cursor-pointer"
                  title="Escuchar audio"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {(!lesson.items || lesson.items.length === 0) && (
              <p className="text-xs text-slate-500 italic py-2 text-center">
                Esta lección aún no tiene tarjetas pedagógicas creadas.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Si es Minijuego */}
      {isGame && (
        <div className="p-4 rounded-2xl bg-canvas border border-border-default space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-mint-brand font-bold">
              <Gamepad2 className="w-4 h-4" />
              <span>Mecánica: {node.gameArchetype || "WordMatch"}</span>
            </div>
            {node.isRequired !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                  node.isRequired
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "bg-slate-700/60 text-slate-300"
                }`}
              >
                {node.isRequired ? "Obligatorio" : "Opcional"}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="p-2.5 rounded-xl bg-card border border-border-default/60">
              <span className="text-[10px] text-slate-subtle block uppercase">Límite Tiempo</span>
              <span className="text-white font-bold">{node.timeLimitSeconds || 60} seg</span>
            </div>
            <div className="p-2.5 rounded-xl bg-card border border-border-default/60">
              <span className="text-[10px] text-slate-subtle block uppercase">Vidas Permitidas</span>
              <span className="text-white font-bold">
                {node.allowedMistakes === 0 ? "Muerte súbita" : `${node.allowedMistakes ?? 3} vidas`}
              </span>
            </div>
          </div>

          <p className="text-slate-muted text-[11px] leading-relaxed">
            {node.subtitle || "Fijación interactiva del vocabulario con puntuación y vidas antes de avanzar."}
          </p>
        </div>
      )}

      {/* Botones de Acción y Salto Rápido */}
      <div className="pt-2 border-t border-border-default space-y-2">
        {isLesson && (
          <button
            type="button"
            onClick={() => onEditLessonCards(node.lessonId)}
            className="w-full py-2.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Editar Tarjetas de esta Lección</span>
          </button>
        )}

        {(isLesson || isGame) && (
          <button
            type="button"
            onClick={() => onEditLessonGames(node.lessonId)}
            className="w-full py-2.5 rounded-xl bg-canvas border border-border-default text-slate-200 hover:text-white hover:border-slate-500 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-mint-brand" />
            <span>Configurar Minijuegos de la Lección</span>
          </button>
        )}
      </div>
    </div>
  );
}
