"use client";

import { Gamepad2, Globe2, Heart, Pencil, Play, Plus, RefreshCw, Trash2 } from "lucide-react";
import { TeacherGameDTO } from "@/services/api/types";
import { ARCHETYPE_LABELS, normalizeArchetype } from "./archetypes";

interface GamificationGlobalPanelProps {
  games: TeacherGameDTO[];
  isLoading: boolean;
  errorMessage?: string | null;
  onCreate: () => void;
  onPlayTest: (game: TeacherGameDTO) => void;
  onEdit: (game: TeacherGameDTO) => void;
  onDelete: (id: string) => void;
  onRefresh?: () => void;
}

interface GlobalGameCardProps {
  game: TeacherGameDTO;
  onPlayTest: (game: TeacherGameDTO) => void;
  onEdit: (game: TeacherGameDTO) => void;
  onDelete: (id: string) => void;
}

/**
 * Tarjeta de un juego propio de la plataforma: se puede probar, editar y
 * eliminar sin depender de la cuenta de un docente.
 */
function GlobalGameCard({ game, onPlayTest, onEdit, onDelete }: GlobalGameCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-card border border-mint-brand/30 space-y-3 shadow-sm hover:border-mint-brand/60 transition-all flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-mint-brand/5 rounded-bl-full pointer-events-none" />

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-mint-brand/20 text-mint-brand border border-mint-brand/40 shrink-0">
              Plataforma
            </span>
            <span className="text-[10px] font-mono text-slate-muted uppercase truncate">
              {ARCHETYPE_LABELS[normalizeArchetype(game.base_archetype)]}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30 shrink-0">
            {game.level}
          </span>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white tracking-tight">{game.title}</h4>
          {game.description ? (
            <p className="text-[11px] text-slate-muted mt-0.5 leading-relaxed line-clamp-2">
              {game.description}
            </p>
          ) : (
            <p className="text-[11px] text-slate-500 italic mt-0.5">Sin descripción adicional</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded bg-canvas text-mint-brand border border-border-default">
            ⏱ {game.time_limit_seconds}s
          </span>
          <span className="px-2 py-0.5 rounded bg-canvas text-rose-400 border border-border-default flex items-center gap-0.5">
            <Heart className="w-2.5 h-2.5 fill-current" />
            {game.allowed_mistakes === 0 ? "Muerte súbita" : `${game.allowed_mistakes} vidas`}
          </span>
          <span className="px-2 py-0.5 rounded bg-canvas text-emerald-brand border border-border-default">
            +{game.reward_xp} XP
          </span>
          <span className="px-2 py-0.5 rounded bg-canvas text-amber-300 border border-border-default">
            {game.item_count} palabras
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-border-default flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onPlayTest(game)}
          className="px-3 py-1.5 rounded-xl bg-canvas border border-mint-brand/40 hover:border-mint-brand text-xs font-semibold text-mint-brand hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Probar</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
              game.is_active
                ? "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/30"
                : "bg-canvas text-slate-subtle border-border-default"
            }`}
          >
            {game.is_active ? "Activo" : "Pausado"}
          </span>

          <button
            type="button"
            onClick={() => onEdit(game)}
            className="p-1.5 rounded-lg bg-card border border-border-default hover:border-border-subtle text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Editar juego global"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(game.id)}
            className="p-1.5 rounded-lg bg-card border border-border-default hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Eliminar juego global"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Listado de los juegos globales de la plataforma. A diferencia de las
 * actividades docentes, aquí el administrador sí crea, edita y elimina.
 */
export function GamificationGlobalPanel({
  games,
  isLoading,
  errorMessage,
  onCreate,
  onPlayTest,
  onEdit,
  onDelete,
  onRefresh,
}: GamificationGlobalPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white">Juegos globales de Wordtap</h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-mint-brand/20 text-mint-brand border border-mint-brand/40">
            {games.length} {games.length === 1 ? "juego" : "juegos"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-card border border-border-default hover:border-mint-brand text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Volver a consultar los juegos globales"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-mint-brand" : ""}`} />
              <span>Actualizar listado</span>
            </button>
          )}

          <button
            type="button"
            onClick={onCreate}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Crear Juego Global</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 rounded-2xl bg-card border border-border-default text-center text-xs text-slate-muted">
          Cargando los juegos globales de la plataforma...
        </div>
      ) : errorMessage ? (
        <div className="p-8 rounded-2xl bg-card border border-rose-500/30 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">No pudimos cargar los juegos globales</h4>
          <p className="text-xs text-slate-muted max-w-md mx-auto">{errorMessage}</p>
        </div>
      ) : games.length === 0 ? (
        /* Estado vacío real: la plataforma todavía no ofrece juegos propios. */
        <div className="p-8 rounded-2xl bg-card border border-border-default text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-mint-brand/10 text-mint-brand flex items-center justify-center">
            <Globe2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">
            Todavía no hay juegos globales creados por la plataforma
          </h4>
          <p className="text-xs text-slate-muted max-w-md mx-auto">
            Un juego global pertenece a Wordtap y no a un docente: queda disponible para toda la
            plataforma sin depender de un curso. Crea el primero para ofrecer una actividad lista
            desde el inicio.
          </p>
          <button
            type="button"
            onClick={onCreate}
            className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-glow-emerald"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Crear Primer Juego Global</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {games.map((game) => (
            <GlobalGameCard
              key={game.id}
              game={game}
              onPlayTest={onPlayTest}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
