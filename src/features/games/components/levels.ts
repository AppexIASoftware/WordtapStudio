/**
 * Relación pedagógica entre el nivel de un curso y el de un minijuego.
 *
 * El backend es la autoridad final, pero el constructor necesita anticipar la
 * comparación: una actividad por debajo del curso sirve como repaso, una del
 * mismo nivel es compatible y una superior queda fuera del alcance del alumno.
 */

export type LevelCompatibility = "equal" | "lower" | "higher" | "unknown";

const LEVEL_RANKS: Record<string, number> = {
  a1: 1,
  a2: 2,
  b1: 3,
  b2: 4,
  c1: 5,
  c2: 6,
};

const LEVEL_PREFIX = /^(a1|a2|b1|b2|c1|c2)\b/;

/**
 * El orden importa: "upper intermediate" describe B2 y contiene "intermediate",
 * así que debe evaluarse antes de caer en B1.
 */
const LEVEL_KEYWORDS: readonly { keyword: string; code: string }[] = [
  { keyword: "upper intermediate", code: "b2" },
  { keyword: "elementary", code: "a2" },
  { keyword: "intermediate", code: "b1" },
  { keyword: "beginner", code: "a1" },
  { keyword: "advanced", code: "c1" },
  { keyword: "proficient", code: "c2" },
];

const BADGE_BASE =
  "text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border";

export interface LevelBadge {
  label: string;
  className: string;
}

/**
 * Traduce cualquier etiqueta de nivel del catálogo a su código CEFR.
 * Devuelve null cuando el texto no permite deducir un nivel.
 */
export function normalizeLevel(raw: string): string | null {
  const value = (raw || "").trim().toLowerCase();
  if (!value) return null;

  const prefix = value.match(LEVEL_PREFIX);
  if (prefix) return prefix[1];

  for (const { keyword, code } of LEVEL_KEYWORDS) {
    if (value.includes(keyword)) return code;
  }

  return null;
}

/** Compara el nivel del curso contra el de la actividad. */
export function compareLevels(
  courseLevel: string,
  gameLevel: string
): LevelCompatibility {
  const course = normalizeLevel(courseLevel);
  const game = normalizeLevel(gameLevel);
  if (!course || !game) return "unknown";

  const courseRank = LEVEL_RANKS[course];
  const gameRank = LEVEL_RANKS[game];
  if (gameRank === courseRank) return "equal";

  return gameRank < courseRank ? "lower" : "higher";
}

/** Etiqueta visual de compatibilidad; sin nivel deducible no hay insignia. */
export function levelBadge(compat: LevelCompatibility): LevelBadge | null {
  switch (compat) {
    case "equal":
      return {
        label: "Compatible",
        className: `${BADGE_BASE} bg-emerald-brand/10 text-emerald-brand border-emerald-brand/20`,
      };
    case "lower":
      return {
        label: "Repaso",
        className: `${BADGE_BASE} bg-blue-500/10 text-blue-300 border-blue-500/20`,
      };
    case "higher":
      return {
        label: "Nivel superior",
        className: `${BADGE_BASE} bg-rose-500/10 text-rose-300 border-rose-500/20`,
      };
    default:
      return null;
  }
}
