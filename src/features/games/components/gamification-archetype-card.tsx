"use client";

import { Play, CopyPlus } from "lucide-react";
import { GameModeItem } from "@/features/games/types";

interface GamificationArchetypeCardProps {
  game: GameModeItem;
  onPlayTest: (game: GameModeItem) => void;
  onCreateDerived: (archetype: string) => void;
}

export function GamificationArchetypeCard({
  game,
  onPlayTest,
  onCreateDerived,
}: GamificationArchetypeCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border-default space-y-3 shadow-sm hover:border-border-subtle transition-all flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-subtle uppercase">
              {game.type}
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Demo
            </span>
          </div>
          {game.phase === "active" ? (
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/30">
              Activo en App
            </span>
          ) : game.phase === "fase2" ? (
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-mint-brand/20 text-mint-brand border border-mint-brand/30">
              Fase 2
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-700 text-slate-300 border border-slate-600">
              Fase 3
            </span>
          )}
        </div>

        <div>
          <h4 className="text-sm font-bold text-white tracking-tight">{game.title}</h4>
          <p className="text-[11px] text-slate-muted mt-0.5 leading-relaxed line-clamp-2">
            {game.desc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded bg-canvas text-amber-300 border border-border-default">
            ★ {game.unlockStars} estrellas
          </span>
          <span className="px-2 py-0.5 rounded bg-canvas text-mint-brand border border-border-default">
            ⏱ {game.timeLimit}s
          </span>
          <span className="px-2 py-0.5 rounded bg-canvas text-emerald-brand border border-border-default">
            +{game.points} XP
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-border-default flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onPlayTest(game)}
          className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand text-xs font-semibold text-emerald-brand hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Probar Sandbox</span>
        </button>

        <button
          type="button"
          onClick={() => onCreateDerived(game.type)}
          className="px-2.5 py-1.5 rounded-xl bg-card border border-border-default hover:border-mint-brand/40 text-xs font-semibold text-slate-300 hover:text-mint-brand transition-colors flex items-center gap-1 cursor-pointer"
          title="Crear minijuego personalizado con este modelo"
        >
          <CopyPlus className="w-3.5 h-3.5" />
          <span>Crear Derivado</span>
        </button>
      </div>
    </div>
  );
}
