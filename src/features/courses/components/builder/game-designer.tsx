"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Gamepad2,
  Loader2,
  Sparkles,
  BookOpen,
  Play,
} from "lucide-react";
import {
  ARCHETYPES,
  ArchetypeId,
  ARCHETYPE_LABELS,
} from "@/features/games/components/archetypes";
import { GameSandboxModal } from "@/features/games/components/game-sandbox-modal";
import { GameChallengeRules } from "./game-challenge-rules";
import {
  linkLessonGameApi,
  CreateTeacherGamePayload,
  TeacherGameDTO,
  LessonGameDTO,
} from "@/services/api";
import {
  createLessonGameApi,
  updateLessonGameActivityApi,
} from "@/services/api/lesson-games";
import { LessonItem } from "@/features/courses/types";
import { useLessonDraftValue } from "../../hooks/use-lesson-draft-value";

interface GameDesignerProps {
  lessonId: string;
  lessonTitle?: string;
  lessonItems?: LessonItem[];
  courseId?: string;
  courseLevel?: string;
  isAdmin?: boolean;
  initialGame?: LessonGameDTO | null;
  onBack: () => void;
  onTestSimulator?: () => void;
  onSuccess: (gameTitle: string) => void;
}

export function GameDesigner({
  lessonId,
  lessonTitle = "Lección",
  lessonItems = [],
  courseId,
  courseLevel = "A1",
  initialGame,
  onBack,
  onTestSimulator,
  onSuccess,
}: GameDesignerProps) {
  const availableCardsCount = useMemo(() => {
    return lessonItems.filter((item) => item.en && item.es).length;
  }, [lessonItems]);

  const maxAllowed = availableCardsCount > 0 ? availableCardsCount : 20;
  const minAllowed = availableCardsCount > 0 ? Math.min(availableCardsCount, 2) : 2;

  const [draftArchetype, setDraftArchetype] = useLessonDraftValue<ArchetypeId>(
    lessonId,
    (initialGame?.base_archetype as ArchetypeId) || "match"
  );
  const [draftTimeLimit, setDraftTimeLimit] = useLessonDraftValue(
    lessonId,
    initialGame?.time_limit_seconds ?? 45
  );
  const [draftAllowedMistakes, setDraftAllowedMistakes] = useLessonDraftValue(
    lessonId,
    initialGame?.allowed_mistakes ?? 3
  );
  const [draftRewardXP, setDraftRewardXP] = useLessonDraftValue(
    lessonId,
    initialGame?.reward_xp ?? 20
  );
  const [draftItemCount, setDraftItemCount] = useLessonDraftValue(
    lessonId,
    initialGame?.item_count ??
      (availableCardsCount > 0
        ? Math.max(minAllowed, Math.min(availableCardsCount, 6))
        : 4)
  );

  const [overrideArchetype, setOverrideArchetype] = useState<ArchetypeId | null>(
    initialGame ? (initialGame.base_archetype as ArchetypeId) : null
  );
  const [overrideTimeLimit, setOverrideTimeLimit] = useState<number | null>(
    initialGame ? initialGame.time_limit_seconds : null
  );
  const [overrideAllowedMistakes, setOverrideAllowedMistakes] = useState<number | null>(
    initialGame ? initialGame.allowed_mistakes : null
  );
  const [overrideRewardXP, setOverrideRewardXP] = useState<number | null>(
    initialGame ? initialGame.reward_xp : null
  );
  const [overrideItemCount, setOverrideItemCount] = useState<number | null>(
    initialGame ? initialGame.item_count : null
  );

  const baseArchetype = initialGame
    ? (overrideArchetype ?? (initialGame.base_archetype as ArchetypeId))
    : draftArchetype;
  const setBaseArchetype = initialGame ? setOverrideArchetype : setDraftArchetype;

  const timeLimit = initialGame
    ? (overrideTimeLimit ?? initialGame.time_limit_seconds)
    : draftTimeLimit;
  const setTimeLimit = initialGame ? setOverrideTimeLimit : setDraftTimeLimit;

  const allowedMistakes = initialGame
    ? (overrideAllowedMistakes ?? initialGame.allowed_mistakes)
    : draftAllowedMistakes;
  const setAllowedMistakes = initialGame
    ? setOverrideAllowedMistakes
    : setDraftAllowedMistakes;

  const rewardXP = initialGame
    ? (overrideRewardXP ?? initialGame.reward_xp)
    : draftRewardXP;
  const setRewardXP = initialGame ? setOverrideRewardXP : setDraftRewardXP;

  const itemCount = initialGame
    ? (overrideItemCount ?? initialGame.item_count)
    : draftItemCount;
  const setItemCount = initialGame ? setOverrideItemCount : setDraftItemCount;

  const displayedItemCount = availableCardsCount > 0
    ? Math.min(Math.max(minAllowed, itemCount), availableCardsCount)
    : itemCount;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedMeta = ARCHETYPES.find((a) => a.id === baseArchetype);
  const generatedTitle = initialGame
    ? initialGame.title
    : `${ARCHETYPE_LABELS[baseArchetype]}: ${lessonTitle}`;

  // Mock dinámico para ejecutar en el Sandbox interactivo con las tarjetas de la lección
  const sandboxGameMock: TeacherGameDTO = useMemo(() => {
    const customWords = lessonItems
      .filter((item) => item.en && item.es)
      .map((item) => ({ term: item.en.trim(), translation: item.es.trim() }));

    const effectiveItemCount = availableCardsCount > 0
      ? Math.min(Number(itemCount), availableCardsCount)
      : Number(itemCount);

    return {
      id: "sandbox-preview",
      teacher_id: "preview",
      base_archetype: baseArchetype,
      title: generatedTitle,
      level: courseLevel,
      time_limit_seconds: Number(timeLimit),
      allowed_mistakes: Number(allowedMistakes),
      reward_xp: Number(rewardXP),
      item_count: effectiveItemCount,
      source_type: "course_lesson",
      custom_words_json: customWords.length > 0 ? JSON.stringify(customWords) : undefined,
      is_active: true,
      created_at: new Date().toISOString(),
    };
  }, [lessonItems, baseArchetype, generatedTitle, courseLevel, timeLimit, allowedMistakes, rewardXP, itemCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Extraer vocabulario directo de las tarjetas de esta lección
    const customWords = lessonItems
      .filter((item) => item.en && item.es)
      .map((item) => ({ term: item.en.trim(), translation: item.es.trim() }));

    const finalItemCount = availableCardsCount > 0
      ? Math.min(Math.max(minAllowed, Number(itemCount)), availableCardsCount)
      : Math.max(minAllowed, Number(itemCount));

    const payload: CreateTeacherGamePayload = {
      course_id: courseId || null,
      base_archetype: baseArchetype,
      title: generatedTitle,
      description: selectedMeta?.desc || undefined,
      level: courseLevel, // Heredado automáticamente del curso (sin redundancias)
      time_limit_seconds: Number(timeLimit),
      allowed_mistakes: Number(allowedMistakes),
      reward_xp: Number(rewardXP),
      item_count: finalItemCount,
      source_type: "course_lesson",
      source_id: lessonId,
      custom_words_json: customWords.length > 0 ? JSON.stringify(customWords) : undefined,
    };

    try {
      if (initialGame) {
        const updateRes = await updateLessonGameActivityApi(
          lessonId,
          initialGame.game_id,
          payload
        );
        if (updateRes.error || !updateRes.data) {
          setError(updateRes.error || "No se pudo actualizar la actividad.");
          setIsSubmitting(false);
          return;
        }
        onSuccess(generatedTitle);
        onBack();
        return;
      }

      // 1. Crear actividad lúdica
      const gameRes = await createLessonGameApi(lessonId, payload);

      if (gameRes.error || !gameRes.data) {
        setError(gameRes.error || "No se pudo crear la actividad.");
        setIsSubmitting(false);
        return;
      }

      // 2. Vincular a la lección
      const linkRes = await linkLessonGameApi(lessonId, {
        game_id: gameRes.data.id,
        is_required: true,
      });

      if (linkRes.error) {
        setError(linkRes.error);
        setIsSubmitting(false);
        return;
      }

      // 3. Notificar y volver al listado
      onSuccess(generatedTitle);
      onBack();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado al guardar la actividad.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Barra Superior del Diseñador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-default">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-card border border-border-default hover:border-emerald-brand text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
            title="Volver a lista de minijuegos"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{initialGame ? "Editar Minijuego de Lección" : "Diseñar Actividad Lúdica"}</span>
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/20">
                Nivel {courseLevel}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-mint-brand/10 text-mint-brand border border-mint-brand/20 uppercase">
                {baseArchetype}
              </span>
            </div>
            <p className="text-xs text-slate-muted mt-0.5">
              Para: <strong className="text-slate-200">{lessonTitle}</strong> · Las tarjetas de la lección alimentan la mecánica automáticamente.
            </p>
          </div>
        </div>

        {/* Acciones principales en la cabecera */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsSandboxOpen(true)}
            className="px-3 py-2 rounded-xl bg-card border border-border-default hover:border-emerald-brand text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Probar mecánica jugable con las tarjetas de esta lección"
          >
            <Play className="w-3.5 h-3.5 text-emerald-brand fill-current" />
            <span>Probar en simulador</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 cursor-pointer shadow-glow-emerald disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>
              {isSubmitting
                ? initialGame
                  ? "Guardando..."
                  : "Creando..."
                : initialGame
                ? "Guardar Cambios"
                : "Crear y Vincular"}
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Grid Principal de 2 Columnas aprovechando todo el ancho */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Columna Izquierda (7 cols): Selección de Arquetipo */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-emerald-brand" />
              <span>1. Elegir Mecánica de Minijuego</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-subtle">12 dinámicas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ARCHETYPES.map((arch) => {
              const isSelected = baseArchetype === arch.id;
              return (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => setBaseArchetype(arch.id)}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "bg-emerald-brand/15 border-emerald-brand text-white shadow-sm ring-1 ring-emerald-brand/30"
                      : "bg-card border-border-default text-slate-400 hover:border-slate-600 hover:text-slate-200"
                  }`}
                >
                  <p className={`font-bold text-xs truncate ${isSelected ? "text-mint-brand" : "text-white"}`}>
                    {arch.name}
                  </p>
                  <p className="text-[11px] text-slate-muted mt-1 leading-snug line-clamp-2">
                    {arch.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha (5 cols): Reglas de Desafío y Resumen de Vocabulario */}
        <div className="lg:col-span-5 space-y-4">
          {/* 2. Reglas de Desafío & Gamificación */}
          <GameChallengeRules
            timeLimit={timeLimit}
            setTimeLimit={setTimeLimit}
            allowedMistakes={allowedMistakes}
            setAllowedMistakes={setAllowedMistakes}
            rewardXP={rewardXP}
            setRewardXP={setRewardXP}
            displayedItemCount={displayedItemCount}
            itemCount={itemCount}
            setItemCount={setItemCount}
            minAllowed={minAllowed}
            maxAllowed={maxAllowed}
            availableCardsCount={availableCardsCount}
          />

          {/* 3. Vocabulario Conectado (Sin redundancias) */}
          <div className="p-4 rounded-2xl bg-card border border-border-default space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-brand" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                  3. Vocabulario de la Lección
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-brand">
                {lessonItems.length} tarjetas
              </span>
            </div>

            {lessonItems.length > 0 ? (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                <div className="flex flex-wrap gap-1.5">
                  {lessonItems.map((it) => (
                    <span
                      key={it.id}
                      className="px-2 py-1 rounded-lg bg-canvas border border-border-default text-[10px] font-mono text-slate-200"
                    >
                      <strong className="text-emerald-brand">{it.en}</strong> ↔ {it.es}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-canvas border border-dashed border-border-default text-center">
                <p className="text-[11px] text-slate-400">
                  Esta lección aún no tiene tarjetas de vocabulario. Podrás agregarlas en la pestaña <strong>Tarjetas</strong> y la actividad las consumirá automáticamente.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal interactivo de Sandbox jugable con las tarjetas reales de la lección */}
      {isSandboxOpen && (
        <GameSandboxModal
          game={sandboxGameMock}
          onClose={() => setIsSandboxOpen(false)}
        />
      )}
    </div>
  );
}
