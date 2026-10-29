"use client";

import { Play, Pencil, Trash2, BookOpen, Sparkles, Heart } from "lucide-react";
import { TeacherGameDTO } from "@/services/api/types";

interface GamificationCustomCardProps {
  game: TeacherGameDTO;
  onPlayTest: (game: TeacherGameDTO) => void;
  onEdit: (game: TeacherGameDTO) => void;
  onDelete: (id: string) => void;
}

export function GamificationCustomCard({
  game,
  onPlayTest,
  onEdit,
  onDelete,
}: GamificationCustomCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-card border border-mint-brand/30 space-y-3 shadow-sm hover:border-mint-brand/60 transition-all flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-mint-brand/5 rounded-bl-full pointer-events-none" />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/30 flex items-center gap-1">
              Personalizada
            </span>
            <span className="text-[10px] font-mono text-slate-muted uppercase">
              {game.base_archetype}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
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
            <p className="text-[11px] text-slate-500 italic mt-0.5">
              Sin descripción adicional
            </p>
          )}
        </div>

        {game.course_title && (
          <div className="flex items-center gap-1 text-[11px] text-slate-300 bg-canvas/60 px-2 py-1 rounded-lg border border-border-default/60">
            <BookOpen className="w-3 h-3 text-mint-brand" />
            <span className="truncate">Curso: {game.course_title}</span>
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
          {(game.usage_count ?? 0) > 0 && (
            <span className="px-2 py-0.5 rounded bg-canvas text-slate-300 border border-border-default">
              Usado en {game.usage_count} lección(es)
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-border-default flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onPlayTest(game)}
          className="px-3 py-1.5 rounded-xl bg-canvas border border-mint-brand/40 hover:border-mint-brand text-xs font-semibold text-mint-brand hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Probar Sandbox</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
              game.is_active
                ? "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/30"
                : "bg-canvas text-slate-subtle border-border-default"
            }`}
          >
            {game.is_active ? "Activa" : "Archivada"}
          </span>
          <button
            type="button"
            onClick={() => onEdit(game)}
            className="p-1.5 rounded-lg bg-card border border-border-default hover:border-border-subtle text-slate-400 hover:text-white transition-colors"
            title="Editar actividad"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(game.id)}
            className="p-1.5 rounded-lg bg-card border border-border-default hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
            title="Eliminar actividad"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
