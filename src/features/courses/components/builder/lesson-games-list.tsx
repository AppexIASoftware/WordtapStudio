"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Gamepad2,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  ARCHETYPE_LABELS,
  normalizeArchetype,
} from "@/features/games/components/archetypes";
import type { LessonGameDTO } from "@/services/api";

interface LessonGamesListProps {
  games: LessonGameDTO[];
  canEdit: boolean;
  busyGameId: string | null;
  onMove: (gameId: string, direction: "up" | "down") => void;
  onToggleRequired: (gameId: string, value: boolean) => void;
  onUnlink: (gameId: string) => void;
  onEdit?: (game: LessonGameDTO) => void;
}

const ICON_BUTTON =
  "p-1.5 rounded-lg border border-border-default bg-canvas text-slate-muted transition-colors cursor-pointer hover:text-white hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed";

export function LessonGamesList({
  games,
  canEdit,
  busyGameId,
  onMove,
  onToggleRequired,
  onUnlink,
  onEdit,
}: LessonGamesListProps) {
  if (games.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-default bg-card/40 p-6 text-center space-y-2">
        <Gamepad2 className="w-6 h-6 text-slate-muted mx-auto" />
        <p className="text-xs font-semibold text-white">
          Todavía no hay minijuegos en esta lección
        </p>
        <p className="text-[11px] text-slate-muted leading-relaxed">
          {canEdit
            ? "Elegí una actividad del catálogo y vinculala para que el alumno la encuentre al terminar las tarjetas."
            : "El autor de la lección todavía no vinculó actividades."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {games.map((game, index) => {
        const isBusy = busyGameId === game.game_id;
        const isGlobal = game.is_global === true;
        const typeLabel =
          ARCHETYPE_LABELS[normalizeArchetype(game.base_archetype)];

        return (
          <article
            key={game.id}
            className="rounded-2xl border border-border-default bg-card p-3.5 shadow-sm space-y-2.5"
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-emerald-brand/10 text-emerald-brand text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0">
                {index + 1}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-bold text-white truncate">
                    {game.title}
                  </h4>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                      isGlobal
                        ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                        : "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/20"
                    }`}
                  >
                    {isGlobal ? "Global" : "Propio"}
                  </span>
                  {!game.is_active && (
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border bg-amber-500/10 text-amber-300 border-amber-500/20">
                      Inactivo
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-muted mt-0.5">
                  {typeLabel} · {game.level} · {game.item_count} ítems ·{" "}
                  {game.reward_xp} XP · Usado en {game.usage_count ?? 0}{" "}
                  lección(es)
                </p>
                {game.description && (
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                    {game.description}
                  </p>
                )}
                {game.level_warning && (
                  <div className="mt-1.5 flex items-start gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-[11px] text-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 mt-0.5" />
                    <span>{game.level_warning}</span>
                  </div>
                )}
              </div>

              {canEdit && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(game)}
                      disabled={isBusy}
                      className={ICON_BUTTON}
                      aria-label={`Editar ${game.title}`}
                      title="Editar"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onMove(game.game_id, "up")}
                    disabled={isBusy || index === 0}
                    className={ICON_BUTTON}
                    aria-label={`Subir ${game.title}`}
                    title="Subir"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMove(game.game_id, "down")}
                    disabled={isBusy || index === games.length - 1}
                    className={ICON_BUTTON}
                    aria-label={`Bajar ${game.title}`}
                    title="Bajar"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onUnlink(game.game_id)}
                    disabled={isBusy}
                    className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-300 transition-colors cursor-pointer hover:bg-rose-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={`Desvincular ${game.title}`}
                    title="Desvincular"
                  >
                    {isBusy ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border-default/70 pt-2">
              {canEdit ? (
                <>
                  <span className="text-[11px] text-slate-muted">
                    Obligatorio
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={game.is_required}
                    aria-label={`Marcar ${game.title} como obligatorio`}
                    onClick={() =>
                      onToggleRequired(game.game_id, !game.is_required)
                    }
                    disabled={isBusy}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer disabled:opacity-40 ${
                      game.is_required ? "bg-emerald-brand" : "bg-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        game.is_required
                          ? "translate-x-[18px]"
                          : "translate-x-[2px]"
                      }`}
                    />
                  </button>
                </>
              ) : (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    game.is_required
                      ? "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/20"
                      : "bg-slate-500/10 text-slate-300 border-slate-500/20"
                  }`}
                >
                  {game.is_required ? "Obligatorio" : "Opcional"}
                </span>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
