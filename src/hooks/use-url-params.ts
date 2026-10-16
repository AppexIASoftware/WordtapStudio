"use client";

// Helper compartido para leer y escribir el estado de vista en la URL.
// Convención del dashboard: query params sobre el mismo path (como juegos y aulas).
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = (key: string) => searchParams?.get(key) ?? null;

  const setParams = (
    next: Record<string, string | null>,
    mode: "push" | "replace" = "push"
  ) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    Object.entries(next).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    if (mode === "push") {
      router.push(url);
    } else {
      router.replace(url, { scroll: false });
    }
  };

  return { get, setParams };
}

/**
 * Estado de tipo enumeración respaldado por la URL (pestañas, modo de vista).
 * Devuelve el valor validado contra `allowed` y su setter; escribir el valor
 * `fallback` limpia el parámetro para mantener URLs limpias.
 */
export function useUrlParam<T extends string>(
  key: string,
  allowed: readonly T[],
  fallback: T
) {
  const { get, setParams } = useUrlParams();

  const raw = get(key);
  const value: T = allowed.includes(raw as T) ? (raw as T) : fallback;

  const set = (
    next: T,
    options: { mode?: "push" | "replace"; clear?: string[] } = {}
  ) => {
    const nextParams: Record<string, string | null> = {};
    (options.clear ?? []).forEach((k) => {
      nextParams[k] = null;
    });
    nextParams[key] = next === fallback ? null : next;
    setParams(nextParams, options.mode ?? "replace");
  };

  return [value, set] as const;
}

/**
 * Espejo de estado interno hacia la URL, para vistas donde el estado sigue
 * siendo la fuente de verdad y la URL solo refleja "dónde estás".
 *
 * Escribe en un solo paso todos los parámetros que cambiaron, de modo que dos
 * valores que cambian juntos no se pisen entre sí. Nunca borra un parámetro
 * que la vista todavía no inicializó, para no perder un enlace entrante
 * durante el primer render.
 */
export function useUrlMirror(values: Record<string, string | null | undefined>) {
  const { get, setParams } = useUrlParams();
  const written = useRef<Record<string, string | null>>({});

  useEffect(() => {
    const next: Record<string, string | null> = {};
    Object.entries(values).forEach(([key, raw]) => {
      const value = raw || null;
      if (written.current[key] === value) return;
      if (value === null && !(key in written.current)) return;
      if (get(key) === value) {
        written.current[key] = value;
        return;
      }
      next[key] = value;
    });
    if (Object.keys(next).length === 0) return;
    Object.assign(written.current, next);
    setParams(next, "replace");
  }, [values, get, setParams]);
}
