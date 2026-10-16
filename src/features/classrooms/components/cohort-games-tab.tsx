"use client";

import { Gamepad2, Check, Clock, Trophy, Star, Sparkles, Loader2 } from "lucide-react";
import { GameModeItem } from "@/features/games/types";;
import { GAMES_DATA } from "@/features/games/data/mock-games";
import { useCohortGames } from "../hooks/use-cohort-games";

interface CohortGamesTabProps {
  activeGameSlugs?: string[];
  classroomName: string;
  classroomId?: string;
  isDemo?: boolean;
  onUpdateActiveGames?: (games: string[]) => void;
  triggerToast: (msg: string) => void;
}

const DEFAULT_ACTIVE_GAMES = [
  "match",
  "memory",
  "listening",
  "multiple_choice",
  "speed_translation",
  "word_scramble",
];

export function CohortGamesTab({
  activeGameSlugs = DEFAULT_ACTIVE_GAMES,
  classroomName,
  classroomId,
  isDemo = false,
  onUpdateActiveGames,
  triggerToast,
}: CohortGamesTabProps) {
  const { activeGames, customGames, totalOptions, toggleGame, isSaving } = useCohortGames({
    classroomId,
    classroomName,
    initialActiveGames: activeGameSlugs,
    isDemo,
    onUpdateActiveGames,
  });

  const handleToggle = (type: string) => {
    toggleGame(type);
    triggerToast("Configuración de minijuegos actualizada para la cohorte");
  };

  const isLocalOnly = isDemo || !classroomId;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Minijuegos Habilitados para la Cohorte: &apos;{classroomName}&apos;</span>
            {isLocalOnly ? (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Demo
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30 flex items-center gap-1">
                {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>{isSaving ? "Guardando..." : "Guardado automático"}</span>
              </span>
            )}
          </h3>
          <p className="text-[11px] text-slate-muted">
            Personaliza qué actividades interactivas y mecánicas de juego tienen disponibles los alumnos de esta aula.
          </p>
        </div>

        <span className="text-xs font-mono text-emerald-brand bg-emerald-brand/10 border border-emerald-brand/30 px-3 py-1 rounded-xl font-bold">
          {activeGames.length} de {totalOptions} Modos Activos
        </span>
      </div>

      {/* Tus Actividades Personalizadas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-mint-brand uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Tus Actividades Personalizadas ({customGames.length})
          </span>
          <span className="text-[10px] text-slate-muted">
            Retos de autor calibrados en Juegos & Gamificación
          </span>
        </div>

        {customGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customGames.map((customGame) => {
              const gameKey = `custom_${customGame.id}`;
              const isEnabled = activeGames.includes(gameKey);
              return (
                <div
                  key={customGame.id}
                  onClick={() => handleToggle(gameKey)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 shadow-sm ${
                    isEnabled
                      ? "bg-card border-mint-brand/40 ring-1 ring-mint-brand/20"
                      : "bg-card/60 border-border-default opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        isEnabled
                          ? "bg-mint-brand/20 text-mint-brand border-mint-brand/40"
                          : "bg-slate-700/30 text-slate-400 border-slate-700"
                      }`}
                    >
                      {customGame.base_archetype}
                    </span>

                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                        isEnabled ? "bg-mint-brand text-canvas" : "border border-slate-500"
                      }`}
                    >
                      {isEnabled && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white truncate">{customGame.title}</h4>

                  <div className="pt-2 border-t border-border-default/80 flex items-center justify-between text-[10px] font-mono text-slate-subtle">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{customGame.time_limit_seconds}s</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span>+{customGame.reward_xp} XP</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-canvas border border-dashed border-border-default/80 flex items-center gap-2 text-xs text-slate-muted">
            <Sparkles className="w-3.5 h-3.5 text-mint-brand shrink-0" />
            <span>
              Aún no tienes actividades personalizadas. Puedes crearlas en{" "}
              <strong>Juegos & Gamificación</strong> para asignarlas a esta cohorte.
            </span>
          </div>
        )}
      </div>

      {/* Dinámicas Base Oficiales */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Dinámicas Base Oficiales ({GAMES_DATA.length})
          </span>
          <span className="text-[10px] text-slate-muted">
            Generadas automáticamente con las palabras de tus lecciones
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAMES_DATA.map((game: GameModeItem) => {
            const isEnabled = activeGames.includes(game.type);
            return (
              <div
                key={game.id}
                onClick={() => handleToggle(game.type)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 shadow-sm ${
                  isEnabled
                    ? "bg-card border-mint-brand/40 ring-1 ring-mint-brand/20"
                    : "bg-card/60 border-border-default opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      isEnabled
                        ? "bg-mint-brand/20 text-mint-brand border-mint-brand/40"
                        : "bg-slate-700/30 text-slate-400 border-slate-700"
                    }`}
                  >
                    Nivel {game.level}
                  </span>

                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                      isEnabled ? "bg-mint-brand text-canvas" : "border border-slate-500"
                    }`}
                  >
                    {isEnabled && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Gamepad2 className="w-3.5 h-3.5 text-mint-brand" />
                    <span>{game.title}</span>
                  </h4>
                  <p className="text-[11px] text-slate-muted mt-1 leading-relaxed">
                    {game.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-border-default/80 flex items-center justify-between text-[10px] font-mono text-slate-subtle">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{game.timeLimit}s</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    <span>+{game.points} pts</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span>{game.unlockStars} ★</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
