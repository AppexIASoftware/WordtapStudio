"use client";

import { useEffect, useState } from "react";
import { getTeacherGamesApi } from "@/services/api/games";
import { TeacherGameDTO } from "@/services/api/types";

/**
 * Loads the teacher custom activities once.
 * A missing or failing list must never break the caller, so errors are swallowed
 * and an empty list is returned instead.
 */
export function useTeacherGames() {
  const [customGames, setCustomGames] = useState<TeacherGameDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCustomGames() {
      try {
        const res = await getTeacherGamesApi();
        if (!cancelled && res.data && Array.isArray(res.data)) {
          setCustomGames(res.data);
        }
      } catch {
        // Silencioso: sin actividades personalizadas el llamador sigue funcionando.
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadCustomGames();

    return () => {
      cancelled = true;
    };
  }, []);

  return { customGames, isLoading };
}
