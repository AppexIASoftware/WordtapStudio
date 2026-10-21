"use client";

import { useMemo, useState } from "react";
import { Gamepad2, Loader2, Plus, Search } from "lucide-react";
import {
  ARCHETYPE_LABELS,
  normalizeArchetype,
} from "@/features/games/components/archetypes";
import {
  compareLevels,
  levelBadge,
  type LevelCompatibility,
} from "@/features/games/components/levels";
import type { TeacherGameDTO } from "@/services/api";

type PickerTab = "mine" | "global";

const COMPATIBILITY_ORDER: Record<LevelCompatibility, number> = {
  equal: 0,
  lower: 1,
  unknown: 2,
  higher: 3,
};

const HIGHER_LEVEL_HINT =
  "El nivel de esta actividad supera el del curso. Elegí una compatible o de repaso.";

interface LessonGamePickerProps {
  mine: TeacherGameDTO[];
  globalGames: TeacherGameDTO[];
  courseLevel: string;
  includeMine: boolean;
  busyGameId: string | null;
  onLink: (gameId: string) => void;
}

export function LessonGamePicker({
  mine,
  globalGames,
  courseLevel,
  includeMine,
  busyGameId,
  onLink,
}: LessonGamePickerProps) {
  const [activeTab, setActiveTab] = useState<PickerTab>(
    includeMine ? "mine" : "global"
  );
  const [search, setSearch] = useState("");

  const availableMine = useMemo(() => mine.filter((game) => game.is_active), [mine]);
  const availableGlobalGames = useMemo(
    () => globalGames.filter((game) => game.is_active),
    [globalGames]
  );
  const source = activeTab === "mine" ? availableMine : availableGlobalGames;

  /**
   * El orden refleja la utilidad pedagógica para el curso: primero lo
   * compatible, después el repaso y al final lo que excede el nivel.
   */
  const rankedGames = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? source.filter(
          (game) =>
            game.title.toLowerCase().includes(term) ||
            (game.description ?? "").toLowerCase().includes(term)
        )
      : [...source];

    return filtered
      .map((game) => ({
        game,
        compatibility: compareLevels(courseLevel, game.level),
      }))
      .sort((a, b) => {
        const byCompatibility =
          COMPATIBILITY_ORDER[a.compatibility] -
          COMPATIBILITY_ORDER[b.compatibility];
        if (byCompatibility !== 0) return byCompatibility;

        const byUsage = (b.game.usage_count ?? 0) - (a.game.usage_count ?? 0);
        if (byUsage !== 0) return byUsage;

        return a.game.title.localeCompare(b.game.title, "es");
      });
  }, [source, search, courseLevel]);

  const tabs: { id: PickerTab; label: string; count: number }[] = includeMine
    ? [
        { id: "mine", label: "Mis juegos", count: availableMine.length },
        { id: "global", label: "Juegos globales", count: availableGlobalGames.length },
      ]
    : [{ id: "global", label: "Juegos globales", count: availableGlobalGames.length }];

  return (
    <div className="rounded-2xl border border-border-default bg-card/60 p-3.5 space-y-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-emerald-brand text-canvas shadow-sm"
                : "bg-canvas text-slate-muted border border-border-default hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id
                  ? "bg-canvas/30 text-canvas"
                  : "bg-card text-slate-subtle"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-muted" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por título o descripción..."
          className="w-full pl-8 pr-3 py-2 rounded-xl bg-canvas border border-border-default text-xs text-white placeholder:text-slate-subtle focus:outline-none focus:border-emerald-brand/60"
        />
      </div>

      {rankedGames.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-default bg-canvas/50 p-5 text-center space-y-1.5">
          <Gamepad2 className="w-5 h-5 text-slate-muted mx-auto" />
          <p className="text-[11px] font-semibold text-white">
            {search.trim()
              ? "No se encontraron minijuegos con esa búsqueda"
              : activeTab === "mine"
                ? "No tenés minijuegos propios disponibles"
                : "No hay juegos globales disponibles"}
          </p>
          <p className="text-[10px] text-slate-muted">
            {activeTab === "mine" && !search.trim()
              ? "Creá uno desde el Catálogo de Minijuegos para reutilizarlo en tus lecciones."
              : "Probá con otra búsqueda o revisá el catálogo."}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[26rem] overflow-y-auto pr-0.5">
          {rankedGames.map(({ game, compatibility }) => {
            const isGlobal = game.owner_type === "platform";
            const isBusy = busyGameId === game.id;
            const isBlocked = compatibility === "higher";
            const badge = levelBadge(compatibility);

            return (
              <article
                key={game.id}
                className="rounded-xl border border-border-default bg-card p-3 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h5 className="text-xs font-bold text-white truncate">
                        {game.title}
                      </h5>
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                          isGlobal
                            ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                            : "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/20"
                        }`}
                      >
                        {isGlobal ? "Global" : "Propio"}
                      </span>
                      {badge && (
                        <span className={badge.className}>{badge.label}</span>
                      )}
                      {!game.is_active && (
                        <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border bg-amber-500/10 text-amber-300 border-amber-500/20">
                          Inactivo
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-muted mt-0.5">
                      {ARCHETYPE_LABELS[normalizeArchetype(game.base_archetype)]}{" "}
                      · {game.level} · {game.item_count} ítems · Usado en{" "}
                      {game.usage_count ?? 0} lección(es)
                    </p>
                    {game.description && (
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                        {game.description}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onLink(game.id)}
                    disabled={isBusy || isBlocked}
                    title={isBlocked ? HIGHER_LEVEL_HINT : undefined}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30 hover:bg-emerald-brand/20 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isBusy ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>Vincular</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
