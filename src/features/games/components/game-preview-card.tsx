"use client";

import { Clock, Heart, Sparkles, BookOpen, Trophy, Volume2, Gamepad2, Layers } from "lucide-react";
import { ArchetypeId, ARCHETYPE_LABELS, normalizeArchetype } from "./archetypes";

interface GamePreviewCardProps {
  archetype: string;
  title: string;
  description: string;
  level: string;
  timeLimit: number;
  allowedMistakes: number;
  rewardXP: number;
  itemCount: number;
  courseTitle?: string;
  categoryName?: string;
}

export function GamePreviewCard({
  archetype,
  title,
  description,
  level,
  timeLimit,
  allowedMistakes,
  rewardXP,
  itemCount,
  courseTitle,
  categoryName,
}: GamePreviewCardProps) {
  const normalizedArch = normalizeArchetype(archetype);

  const renderArchetypeMockup = (arch: ArchetypeId) => {
    switch (arch) {
      case "memory":
        return (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-muted font-mono uppercase block">
              Mecánica: Cuadrícula de Memoria (Descubrir Parejas)
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-2 bg-canvas/80 rounded-xl border border-border-default/60">
              <div className="h-10 rounded-lg bg-card border border-border-default flex items-center justify-center font-mono text-xs text-slate-500">
                ?
              </div>
              <div className="h-10 rounded-lg bg-mint-brand/20 border border-mint-brand flex items-center justify-center font-bold text-[10px] text-mint-brand shadow-sm">
                Fluency
              </div>
              <div className="h-10 rounded-lg bg-card border border-border-default flex items-center justify-center font-mono text-xs text-slate-500">
                ?
              </div>
              <div className="h-10 rounded-lg bg-mint-brand/20 border border-mint-brand flex items-center justify-center font-bold text-[10px] text-mint-brand shadow-sm">
                Fluidez
              </div>
              <div className="h-10 rounded-lg bg-card border border-border-default flex items-center justify-center font-mono text-xs text-slate-500">
                ?
              </div>
              <div className="h-10 rounded-lg bg-card border border-border-default flex items-center justify-center font-mono text-xs text-slate-500">
                ?
              </div>
            </div>
          </div>
        );

      case "word_scramble":
        return (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-muted font-mono uppercase block">
              Mecánica: Anagrama de Letras Desordenadas
            </span>
            <div className="p-2.5 bg-canvas/80 rounded-xl border border-border-default/60 space-y-2 text-center">
              <div className="flex justify-center gap-1">
                {["R", "E", "S", "I", "_", "_"].map((ch, i) => (
                  <span
                    key={i}
                    className="w-6 h-7 rounded-md bg-canvas border border-dashed border-mint-brand/60 text-mint-brand font-mono font-bold text-xs flex items-center justify-center"
                  >
                    {ch}
                  </span>
                ))}
              </div>
              <div className="flex justify-center gap-1 pt-1">
                {["L", "I", "E", "N", "C", "E"].map((ch, i) => (
                  <span
                    key={i}
                    className="w-6 h-6 rounded-md bg-card border border-border-default text-white font-mono text-[10px] font-bold flex items-center justify-center"
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case "multiple_choice":
        return (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-muted font-mono uppercase block">
              Mecánica: Trivia de Selección Múltiple
            </span>
            <div className="p-2.5 bg-canvas/80 rounded-xl border border-border-default/60 space-y-2">
              <div className="text-center font-mono font-bold text-xs text-white">
                &quot;Resilience&quot;
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="p-1.5 rounded-lg bg-mint-brand/20 border border-mint-brand text-mint-brand font-bold text-center">
                  A) Resiliencia ✓
                </div>
                <div className="p-1.5 rounded-lg bg-card border border-border-default text-slate-300 text-center">
                  B) Paciencia
                </div>
                <div className="p-1.5 rounded-lg bg-card border border-border-default text-slate-300 text-center">
                  C) Dominio
                </div>
                <div className="p-1.5 rounded-lg bg-card border border-border-default text-slate-300 text-center">
                  D) Fluidez
                </div>
              </div>
            </div>
          </div>
        );

      case "listening":
        return (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-muted font-mono uppercase block">
              Mecánica: Audio Quiz con Pronunciación
            </span>
            <div className="p-3 bg-canvas/80 rounded-xl border border-border-default/60 space-y-2 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-brand text-canvas flex items-center justify-center shadow-glow-emerald">
                <Volume2 className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-[10px] text-slate-300 font-mono block">
                Escucha el audio nativo y elige el término
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
                <div className="p-1.5 rounded-lg bg-card border border-border-default text-slate-200">
                  Flawless
                </div>
                <div className="p-1.5 rounded-lg bg-mint-brand/20 border border-mint-brand text-mint-brand font-bold">
                  Fluency ✓
                </div>
              </div>
            </div>
          </div>
        );

      case "speed_translation":
        return (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-muted font-mono uppercase block">
              Mecánica: Traducción Flashcard a Velocidad
            </span>
            <div className="p-2.5 bg-canvas/80 rounded-xl border border-border-default/60 space-y-2 text-center">
              <p className="font-mono text-xs font-bold text-white">
                Flawless = &quot;Impecable&quot;
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <div className="p-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300">
                  ✕ Falso
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-brand/15 border border-emerald-brand/30 text-emerald-brand">
                  ✓ Correcto
                </div>
              </div>
            </div>
          </div>
        );

      case "hangman":
        return (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-muted font-mono uppercase block">
              Mecánica: Ahorcado Fonético
            </span>
            <div className="p-2.5 bg-canvas/80 rounded-xl border border-border-default/60 space-y-2 text-center">
              <div className="flex justify-center gap-1 font-mono font-bold text-xs">
                <span className="w-5 border-b border-mint-brand text-mint-brand">F</span>
                <span className="w-5 border-b border-mint-brand text-mint-brand">L</span>
                <span className="w-5 border-b border-slate-600">_</span>
                <span className="w-5 border-b border-mint-brand text-mint-brand">E</span>
                <span className="w-5 border-b border-slate-600">_</span>
                <span className="w-5 border-b border-mint-brand text-mint-brand">Y</span>
              </div>
              <div className="flex justify-center gap-1 text-[9px] font-mono text-slate-400">
                <span className="px-1.5 py-0.5 rounded bg-card border border-border-default">A</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-brand/20 text-emerald-brand border border-emerald-brand">E</span>
                <span className="px-1.5 py-0.5 rounded bg-card border border-border-default">I</span>
                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">O</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-brand/20 text-emerald-brand border border-emerald-brand">U</span>
              </div>
            </div>
          </div>
        );

      case "sentence_builder":
        return (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-muted font-mono uppercase block">
              Mecánica: Constructor de Oraciones
            </span>
            <div className="p-2.5 bg-canvas/80 rounded-xl border border-border-default/60 space-y-2">
              <div className="p-1.5 rounded-lg bg-mint-brand/10 border border-mint-brand/30 text-[10px] text-mint-brand font-mono text-center">
                She showed [ great ] [ resilience ]
              </div>
              <div className="flex justify-center gap-1 flex-wrap text-[9px]">
                <span className="px-2 py-0.5 rounded bg-card border border-border-default text-slate-300">in</span>
                <span className="px-2 py-0.5 rounded bg-card border border-border-default text-slate-300">adversity</span>
              </div>
            </div>
          </div>
        );

      case "phrasal_verbs":
        return (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-muted font-mono uppercase block">
              Mecánica: Phrasal Verbs (Verbo + Partícula)
            </span>
            <div className="p-2.5 bg-canvas/80 rounded-xl border border-border-default/60 flex items-center justify-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-mint-brand/20 border border-mint-brand text-mint-brand font-bold">
                Take
              </span>
              <span className="text-slate-500">+</span>
              <span className="px-2.5 py-1 rounded-lg bg-card border border-border-default text-slate-300">
                off
              </span>
              <span className="text-slate-500">= Despegar</span>
            </div>
          </div>
        );

      case "fill_in":
        return (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-muted font-mono uppercase block">
              Mecánica: Rellenar Espacios en Blanco
            </span>
            <div className="p-2.5 bg-canvas/80 rounded-xl border border-border-default/60 space-y-1.5 text-center text-[10px]">
              <p className="text-slate-200">Practice brings [ _____ ] over time.</p>
              <div className="flex justify-center gap-1">
                <span className="px-2 py-0.5 rounded bg-mint-brand/20 border border-mint-brand text-mint-brand font-bold">fluency ✓</span>
                <span className="px-2 py-0.5 rounded bg-card border border-border-default text-slate-400">haste</span>
              </div>
            </div>
          </div>
        );

      case "crossword":
      case "word_search":
        return (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-muted font-mono uppercase block">
              Mecánica: Cuadrícula & Sopa de Letras
            </span>
            <div className="p-2 bg-canvas/80 rounded-xl border border-border-default/60 flex items-center justify-center">
              <div className="grid grid-cols-4 gap-1 font-mono text-[10px] font-bold text-center">
                <span className="w-5 h-5 rounded bg-emerald-brand/20 text-emerald-brand flex items-center justify-center">F</span>
                <span className="w-5 h-5 rounded bg-emerald-brand/20 text-emerald-brand flex items-center justify-center">L</span>
                <span className="w-5 h-5 rounded bg-emerald-brand/20 text-emerald-brand flex items-center justify-center">U</span>
                <span className="w-5 h-5 rounded bg-emerald-brand/20 text-emerald-brand flex items-center justify-center">X</span>
                <span className="w-5 h-5 rounded bg-card text-slate-400 flex items-center justify-center">M</span>
                <span className="w-5 h-5 rounded bg-card text-slate-400 flex items-center justify-center">A</span>
                <span className="w-5 h-5 rounded bg-card text-slate-400 flex items-center justify-center">S</span>
                <span className="w-5 h-5 rounded bg-card text-slate-400 flex items-center justify-center">T</span>
              </div>
            </div>
          </div>
        );

      case "match":
        return (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-muted font-mono uppercase block">
              Mecánica: Emparejamiento en 2 Columnas
            </span>
            <div className="grid grid-cols-2 gap-2 p-2 bg-canvas/80 rounded-xl border border-border-default/60 text-[10px]">
              <div className="space-y-1">
                <div className="p-1.5 rounded-md bg-mint-brand/20 border border-mint-brand text-mint-brand font-bold">
                  Fluency
                </div>
                <div className="p-1.5 rounded-md bg-card border border-border-default text-slate-300">
                  Mastery
                </div>
              </div>
              <div className="space-y-1">
                <div className="p-1.5 rounded-md bg-card border border-border-default text-slate-300">
                  Dominio
                </div>
                <div className="p-1.5 rounded-md bg-mint-brand/20 border border-mint-brand text-mint-brand font-bold">
                  Fluidez
                </div>
              </div>
            </div>
          </div>
        );

      default: {
        const exhaustiveCheck: never = arch;
        return exhaustiveCheck;
      }
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-card border border-mint-brand/40 space-y-4 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-mint-brand/20 text-mint-brand border border-mint-brand/40 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Previsualización
          </span>
          <span className="text-[10px] font-mono text-mint-brand uppercase font-bold flex items-center gap-1">
            <Gamepad2 className="w-3 h-3" />
            {ARCHETYPE_LABELS[normalizedArch]}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
          {level || "B1 Intermedio"}
        </span>
      </div>

      <div>
        <h3 className="text-base font-bold text-white tracking-tight">
          {title || "Título de la Actividad"}
        </h3>
        <p className="text-xs text-slate-muted mt-1 leading-relaxed line-clamp-2">
          {description || "Define un objetivo o descripción pedagógica para orientar al alumno."}
        </p>
      </div>

      {categoryName ? (
        <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-canvas/80 px-2.5 py-1.5 rounded-xl border border-border-default/60">
          <Layers className="w-3.5 h-3.5 text-emerald-brand" />
          <span className="truncate">Categoría: {categoryName}</span>
        </div>
      ) : courseTitle ? (
        <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-canvas/80 px-2.5 py-1.5 rounded-xl border border-border-default/60">
          <BookOpen className="w-3.5 h-3.5 text-mint-brand" />
          <span className="truncate">Curso: {courseTitle}</span>
        </div>
      ) : null}

      {/* Maqueta Visual Dinámica del Arquetipo */}
      {renderArchetypeMockup(normalizedArch)}

      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
        <div className="p-2 rounded-xl bg-canvas border border-border-default flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-mint-brand" />
          <span className="text-slate-200">{timeLimit}s límite</span>
        </div>

        <div className="p-2 rounded-xl bg-canvas border border-border-default flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
          <span className="text-slate-200">
            {allowedMistakes === 0 ? "Muerte súbita" : `${allowedMistakes} vidas`}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-canvas border border-border-default flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-slate-200">+{rewardXP} XP</span>
        </div>

        <div className="p-2 rounded-xl bg-canvas border border-border-default flex items-center gap-2">
          <span className="text-slate-muted text-[10px]">Vocab:</span>
          <span className="text-slate-200">{itemCount} palabras</span>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-slate-subtle border-t border-border-default flex items-center justify-between">
        <span>Destino: Aula y Móvil</span>
        <span className="text-mint-brand font-medium">Sincronizado con App Móvil</span>
      </div>
    </div>
  );
}
