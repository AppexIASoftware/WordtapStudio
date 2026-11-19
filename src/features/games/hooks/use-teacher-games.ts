"use client";

import { useEffect, useState } from "react";
import { getTeacherGamesApi, getTeacherGlobalGamesApi } from "@/services/api/games";
import { TeacherGameDTO } from "@/services/api/types";
import { GameModeItem } from "@/features/games/types";

export function mapGlobalGameToModeItem(game: TeacherGameDTO): GameModeItem {
  const numericLevel = Number.parseInt(String(game.level).replace(/\D/g, ""), 10);
  const phase: GameModeItem["phase"] = game.is_active ? "active" : "fase2";
  return {
    id: game.id,
    type: game.base_archetype,
    title: game.title,
    desc: game.description || "",
    level: Number.isFinite(numericLevel) && numericLevel > 0 ? numericLevel : 1,
    unlockStars: 0,
    timeLimit: game.time_limit_seconds || 45,
    points: game.reward_xp || 15,
    status: phase,
    phase,
  };
}

/**
 * Loads the teacher custom activities and official global archetypes once.
 * A missing or failing list must never break the caller, so errors are swallowed
 * and an empty list is returned instead.
 */
export function useTeacherGames() {
  const [customGames, setCustomGames] = useState<TeacherGameDTO[]>([]);
  const [globalGames, setGlobalGames] = useState<TeacherGameDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadGames() {
      try {
        const [customRes, globalRes] = await Promise.all([
          getTeacherGamesApi(),
          getTeacherGlobalGamesApi(),
        ]);
        if (!cancelled && customRes.data && Array.isArray(customRes.data)) {
          setCustomGames(customRes.data);
        }
        if (!cancelled && globalRes.data && Array.isArray(globalRes.data)) {
          setGlobalGames(globalRes.data);
        }
      } catch {
        // Silencioso: sin actividades personalizadas el llamador sigue funcionando.
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadGames();

    return () => {
      cancelled = true;
    };
  }, []);

  return { customGames, globalGames, isLoading };
}
