"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getLessonGamesApi,
  getTeacherGamesApi,
  getTeacherGlobalGamesApi,
  linkLessonGameApi,
  unlinkLessonGameApi,
  updateLessonGameApi,
} from "@/services/api";
import type { LessonGameDTO, TeacherGameDTO } from "@/services/api";

interface UseLessonGamesOptions {
  lessonId: string;
  enabled: boolean;
  includeMine: boolean;
  onToast: (message: string) => void;
}

/**
 * Loads the games linked to a lesson plus the catalogs the current user can
 * link from. Mutations refresh the linked list so ordering stays authoritative.
 */
export function useLessonGames({
  lessonId,
  enabled,
  includeMine,
  onToast,
}: UseLessonGamesOptions) {
  const [linkedGames, setLinkedGames] = useState<LessonGameDTO[]>([]);
  const [mine, setMine] = useState<TeacherGameDTO[]>([]);
  const [globalGames, setGlobalGames] = useState<TeacherGameDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyGameId, setBusyGameId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled || !lessonId) {
      setLinkedGames([]);
      setMine([]);
      setGlobalGames([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [linkedRes, mineRes, globalRes] = await Promise.all([
        getLessonGamesApi(lessonId),
        includeMine
          ? getTeacherGamesApi()
          : Promise.resolve({ data: [] as TeacherGameDTO[], error: null }),
        getTeacherGlobalGamesApi(),
      ]);

      if (linkedRes.error || globalRes.error || (includeMine && mineRes.error)) {
        setError("No se pudieron cargar los minijuegos.");
      }

      setLinkedGames(linkedRes.data ?? []);
      setMine(mineRes.data ?? []);
      setGlobalGames(globalRes.data ?? []);
    } catch {
      setError("No se pudieron cargar los minijuegos.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, lessonId, includeMine]);

  useEffect(() => {
    void load();
  }, [load]);

  const linkedIds = useMemo(
    () => new Set(linkedGames.map((game) => game.game_id)),
    [linkedGames]
  );

  const availableMine = useMemo(
    () => mine.filter((game) => !linkedIds.has(game.id)),
    [mine, linkedIds]
  );

  const availableGlobal = useMemo(
    () => globalGames.filter((game) => !linkedIds.has(game.id)),
    [globalGames, linkedIds]
  );

  const runAction = useCallback(
    async (
      gameId: string,
      action: () => Promise<{ error: string | null }>,
      successMessage: string
    ) => {
      setBusyGameId(gameId);
      try {
        const res = await action();
        if (res.error) {
          onToast(res.error);
          return;
        }
        onToast(successMessage);
        await load();
      } finally {
        setBusyGameId(null);
      }
    },
    [load, onToast]
  );

  const linkGame = useCallback(
    async (gameId: string) => {
      setBusyGameId(gameId);
      try {
        const res = await linkLessonGameApi(lessonId, { game_id: gameId });
        if (res.error) {
          onToast(res.error);
          return;
        }
        // El backend avisa cuando el nivel de la actividad difiere del curso.
        onToast(res.data?.level_warning || "Minijuego vinculado.");
        await load();
      } finally {
        setBusyGameId(null);
      }
    },
    [lessonId, load, onToast]
  );

  const unlinkGame = useCallback(
    (gameId: string) =>
      runAction(
        gameId,
        () => unlinkLessonGameApi(lessonId, gameId),
        "Minijuego desvinculado."
      ),
    [lessonId, runAction]
  );

  const setRequired = useCallback(
    (gameId: string, isRequired: boolean) =>
      runAction(
        gameId,
        () => updateLessonGameApi(lessonId, gameId, { is_required: isRequired }),
        isRequired ? "Marcado como obligatorio." : "Marcado como opcional."
      ),
    [lessonId, runAction]
  );

  const moveGame = useCallback(
    async (gameId: string, direction: "up" | "down") => {
      const index = linkedGames.findIndex((game) => game.game_id === gameId);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || targetIndex < 0 || targetIndex >= linkedGames.length) {
        return;
      }

      const current = linkedGames[index];
      const neighbor = linkedGames[targetIndex];

      setBusyGameId(gameId);
      try {
        const first = await updateLessonGameApi(lessonId, current.game_id, {
          sort_order: neighbor.sort_order,
        });
        if (first.error) {
          onToast(first.error);
          return;
        }

        const second = await updateLessonGameApi(lessonId, neighbor.game_id, {
          sort_order: current.sort_order,
        });
        if (second.error) {
          onToast(second.error);
          return;
        }

        await load();
      } finally {
        setBusyGameId(null);
      }
    },
    [lessonId, linkedGames, load, onToast]
  );

  return {
    linkedGames,
    availableMine,
    availableGlobal,
    isLoading,
    error,
    busyGameId,
    linkGame,
    unlinkGame,
    setRequired,
    moveGame,
    reload: load,
  };
}
