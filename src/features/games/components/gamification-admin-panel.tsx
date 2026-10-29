"use client";

import { Archive, BookOpen, Gamepad2, Heart, Play, RefreshCw, UserRound } from "lucide-react";
import { TeacherGameDTO } from "@/services/api/types";
import { ARCHETYPE_LABELS, normalizeArchetype } from "./archetypes";

interface GamificationAdminPanelProps {
  games: TeacherGameDTO[];
  isLoading: boolean;
  errorMessage?: string | null;
  isArchivedView?: boolean;
  onPlayTest: (game: TeacherGameDTO) => void;
  onRefresh?: () => void;
}

interface AdminGameCardProps {
  game: TeacherGameDTO;
  onPlayTest: (game: TeacherGameDTO) => void;
}

/**
 * Una actividad solo puede probarse cuando tiene vocabulario cargado.
 * Sin palabras no hay nada que simular y el docente todavía debe configurarla.
 */
function isPlayable(game: TeacherGameDTO): boolean {
  return game.item_count > 0;
}

/** Tarjeta de supervisión: describe la actividad, su autor y permite probarla. */
function AdminGameCard({ game, onPlayTest }: AdminGameCardProps) {
  const teacherName = game.teacher_name?.trim() || "Docente de Wordtap";
  const teacherEmail = game.teacher_email?.trim() || null;
  const courseTitle = game.course_title?.trim() || null;
  const playable = isPlayable(game);

  return (
    <div className="p-4 rounded-2xl bg-card border border-mint-brand/30 space-y-3 shadow-sm hover:border-mint-brand/60 transition-all flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-mint-brand/5 rounded-bl-full pointer-events-none" />

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-mint-brand/20 text-mint-brand border border-mint-brand/30 truncate">
            {ARCHETYPE_LABELS[normalizeArchetype(game.base_archetype)]}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {game.access_tier === "subscription" ? (
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                <span>👑</span>
                <span>Pro</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
                Gratis
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-canvas text-slate-300 border border-border-default shrink-0">
              {game.level}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white tracking-tight">{game.title}</h4>
          {game.description ? (
            <p className="text-[11px] text-slate-muted mt-0.5 leading-relaxed line-clamp-2">
              {game.description}
            </p>
          ) : (
            <p className="text-[11px] text-slate-500 italic mt-0.5">
              Sin descripción adicional
            </p>
          )}
        </div>

        {/* Autoría de la actividad: quién la creó y con qué cuenta. */}
        <div className="flex items-start gap-1.5 text-[11px] text-slate-300 bg-canvas/60 px-2 py-1.5 rounded-lg border border-border-default/60">
          <UserRound className="w-3 h-3 mt-0.5 text-mint-brand shrink-0" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-200">{teacherName}</p>
            {teacherEmail && (
              <p className="truncate text-[10px] text-slate-muted">{teacherEmail}</p>
            )}
          </div>
        </div>

        {courseTitle && (
          <div className="flex items-center gap-1 text-[11px] text-slate-300 bg-canvas/60 px-2 py-1 rounded-lg border border-border-default/60">
            <BookOpen className="w-3 h-3 text-mint-brand shrink-0" />
            <span className="truncate">Curso: {courseTitle}</span>
          </div>
        )}

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
          <span className="px-2 py-0.5 rounded bg-canvas text-slate-300 border border-border-default">
            {game.usage_count ?? 0} usos
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-border-default flex items-center justify-between gap-2">
        {playable ? (
          <button
            type="button"
            onClick={() => onPlayTest(game)}
            className="px-3 py-1.5 rounded-xl bg-canvas border border-mint-brand/40 hover:border-mint-brand text-xs font-semibold text-mint-brand hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Probar Sandbox</span>
          </button>
        ) : (
          <span className="px-2 py-1.5 rounded-xl bg-canvas border border-border-default/60 text-[10px] font-mono text-slate-subtle">
            Sin palabras cargadas
          </span>
        )}

        <span
          className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
            game.is_active
              ? "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/30"
              : "bg-canvas text-slate-subtle border-border-default"
          }`}
        >
          {game.is_active ? "Habilitada" : "Archivada"}
        </span>
      </div>
    </div>
  );
}

/**
 * Listado global de minijuegos en modo supervisión.
 * Solo lectura: muestra de quién es cada actividad y permite probarla.
 */
export function GamificationAdminPanel({
  games,
  isLoading,
  errorMessage,
  isArchivedView = false,
  onPlayTest,
  onRefresh,
}: GamificationAdminPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white">
            {isArchivedView ? "Actividades de docentes archivadas" : "Actividades de todos los docentes"}
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-mint-brand/20 text-mint-brand border border-mint-brand/40">
            {games.length} {games.length === 1 ? (isArchivedView ? "archivada" : "actividad") : (isArchivedView ? "archivadas" : "actividades")}
          </span>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl bg-card border border-border-default hover:border-mint-brand text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Volver a consultar las actividades creadas por los docentes"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-mint-brand" : ""}`} />
            <span>Actualizar listado</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="p-8 rounded-2xl bg-card border border-border-default text-center text-xs text-slate-muted">
          {isArchivedView
            ? "Cargando las actividades de docentes archivadas..."
            : "Cargando las actividades creadas por los docentes..."}
        </div>
      ) : errorMessage ? (
        <div className="p-8 rounded-2xl bg-card border border-rose-500/30 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">No pudimos cargar el catálogo de actividades</h4>
          <p className="text-xs text-slate-muted max-w-md mx-auto">{errorMessage}</p>
        </div>
      ) : games.length === 0 ? (
        /* Estado vacío real: todavía no existe ninguna actividad docente o archivada. */
        <div className="p-8 rounded-2xl bg-card border border-border-default text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-mint-brand/10 text-mint-brand flex items-center justify-center">
            {isArchivedView ? <Archive className="w-6 h-6" /> : <Gamepad2 className="w-6 h-6" />}
          </div>
          <h4 className="text-sm font-bold text-white">
            {isArchivedView
              ? "No hay actividades de docentes archivadas"
              : "Todavía no hay actividades lúdicas creadas por los docentes"}
          </h4>
          <p className="text-xs text-slate-muted max-w-md mx-auto">
            {isArchivedView
              ? "Las actividades docentes que hayan sido archivadas por sus creadores se mostrarán aquí con su estado y lecciones vinculadas."
              : "Cuando un docente diseñe su primera dinámica pedagógica aparecerá aquí, con su autor y su curso asociado, lista para revisar y probar."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {games.map((game) => (
            <AdminGameCard key={game.id} game={game} onPlayTest={onPlayTest} />
          ))}
        </div>
      )}
    </div>
  );
}
