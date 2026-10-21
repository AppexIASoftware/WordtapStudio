"use client";

import { AlertCircle, Info, Loader2, Smartphone } from "lucide-react";
import { useLessonGames } from "../../hooks/use-lesson-games";
import { LessonGamesList } from "./lesson-games-list";
import { LessonGamePicker } from "./lesson-game-picker";

interface LessonGamesTabProps {
  lessonId: string;
  canEdit: boolean;
  includeMine: boolean;
  courseLevel?: string;
  readOnlyReason: string | null;
  onTestGames: () => void;
  onToast: (message: string) => void;
}

export function LessonGamesTab({
  lessonId,
  canEdit,
  includeMine,
  courseLevel = "",
  readOnlyReason,
  onTestGames,
  onToast,
}: LessonGamesTabProps) {
  const {
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
    reload,
  } = useLessonGames({
    lessonId,
    enabled: Boolean(lessonId),
    includeMine,
    onToast,
  });

  const availableCount =
    availableMine.filter((game) => game.is_active).length +
    availableGlobal.filter((game) => game.is_active).length;

  return (
    <div className="p-5 md:p-6 space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white">
            Minijuegos de esta lección
          </h3>
          <p className="text-xs text-slate-muted mt-0.5">
            Vincula actividades del catálogo y define el orden en que las recibe
            el alumno.
          </p>
        </div>
        <button
          type="button"
          onClick={onTestGames}
          className="px-3.5 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald flex-shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Probar en simulador</span>
        </button>
      </header>

      {readOnlyReason && (
        <div className="flex items-start gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2.5 text-[11px] text-blue-200">
          <Info className="w-4 h-4 text-blue-300 flex-shrink-0 mt-0.5" />
          <span>{readOnlyReason}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-[11px] text-rose-200">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-300 flex-shrink-0" />
            {error}
          </span>
          <button
            type="button"
            onClick={() => void reload()}
            className="px-2.5 py-1 rounded-lg border border-rose-500/30 text-rose-100 font-bold hover:bg-rose-500/20 transition-colors cursor-pointer flex-shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

      <div
        className={
          canEdit
            ? "grid grid-cols-1 xl:grid-cols-2 gap-5 items-start"
            : "space-y-5"
        }
      >
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wide">
              En esta lección
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/20">
              {linkedGames.length}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-border-default bg-card/40 p-8 text-xs text-slate-muted">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-brand" />
              Cargando minijuegos...
            </div>
          ) : (
            <LessonGamesList
              games={linkedGames}
              canEdit={canEdit}
              busyGameId={busyGameId}
              onMove={moveGame}
              onToggleRequired={setRequired}
              onUnlink={unlinkGame}
            />
          )}
        </section>

        {canEdit && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                Agregar minijuego
              </h4>
              <span className="text-[10px] text-slate-subtle">
                {availableCount} disponibles
              </span>
            </div>
            <LessonGamePicker
              mine={availableMine}
              globalGames={availableGlobal}
              courseLevel={courseLevel}
              includeMine={includeMine}
              busyGameId={busyGameId}
              onLink={linkGame}
            />
          </section>
        )}
      </div>
    </div>
  );
}
