"use client";

import { useCallback, useMemo, useState } from "react";
import { GAMES_DATA } from "@/features/games/data/mock-games";
import { updateClassroomApi } from "@/services/api/classroom";
import { useTeacherGames } from "./use-teacher-games";

interface UseCohortGamesProps {
  classroomId?: string;
  classroomName: string;
  initialActiveGames?: string[];
  isDemo?: boolean;
  onUpdateActiveGames?: (games: string[]) => void;
}

const DEFAULT_ACTIVE_GAMES = [
  "match",
  "memory",
  "listening",
  "multiple_choice",
  "speed_translation",
  "word_scramble",
];

/**
 * Owns the "Minijuegos Habilitados" tab state and persists every toggle
 * through the classroom API so the selection survives a reload and stays
 * consistent across devices.
 */
export function useCohortGames({
  classroomId,
  classroomName,
  initialActiveGames = DEFAULT_ACTIVE_GAMES,
  isDemo = false,
  onUpdateActiveGames,
}: UseCohortGamesProps) {
  const { customGames, isLoading: isLoadingCustomGames } = useTeacherGames();
  const [activeGames, setActiveGames] = useState<string[]>(initialActiveGames);
  const [isSaving, setIsSaving] = useState(false);

  // Keys that still exist: the 12 official archetypes plus the teacher activities.
  const validGameKeys = useMemo(() => {
    const keys = new Set<string>(GAMES_DATA.map((game) => game.type));
    customGames.forEach((game) => keys.add(`custom_${game.id}`));
    return keys;
  }, [customGames]);

  // A deleted custom activity must not inflate the counter, but while the list is
  // still loading a pending activity is indistinguishable from a deleted one.
  const visibleActiveGames = useMemo(
    () =>
      isLoadingCustomGames
        ? activeGames
        : activeGames.filter((key) => validGameKeys.has(key)),
    [activeGames, isLoadingCustomGames, validGameKeys]
  );

  const totalOptions = GAMES_DATA.length + customGames.length;
  const isDemoEntry = isDemo || !classroomId || classroomId === "empty";

  const toggleGame = useCallback(
    (type: string) => {
      const next = activeGames.includes(type)
        ? activeGames.length > 1
          ? activeGames.filter((game) => game !== type)
          : activeGames
        : [...activeGames, type];

      // Invariante: al menos un minijuego permanece habilitado.
      if (next === activeGames) return;

      setActiveGames(next);
      if (onUpdateActiveGames) {
        onUpdateActiveGames(next);
      }

      if (isDemoEntry || !classroomId) return;

      setIsSaving(true);
      updateClassroomApi(classroomId, { name: classroomName, game_ids: next })
        .catch(() => {
          // Silencioso: la selección local se conserva aunque la persistencia falle.
        })
        .finally(() => setIsSaving(false));
    },
    [activeGames, classroomId, classroomName, isDemoEntry, onUpdateActiveGames]
  );

  return {
    activeGames: visibleActiveGames,
    customGames,
    totalOptions,
    toggleGame,
    isSaving,
  };
}
