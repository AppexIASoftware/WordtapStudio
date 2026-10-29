"use client";

import { Clock, Heart, Trophy, Layers, Minus, Plus } from "lucide-react";

interface GameChallengeRulesProps {
  timeLimit: number;
  setTimeLimit: (value: number) => void;
  allowedMistakes: number;
  setAllowedMistakes: (value: number) => void;
  rewardXP: number;
  setRewardXP: (value: number) => void;
  displayedItemCount: number;
  itemCount: number;
  setItemCount: (value: number) => void;
  minAllowed: number;
  maxAllowed: number;
  availableCardsCount: number;
}

export function GameChallengeRules({
  timeLimit,
  setTimeLimit,
  allowedMistakes,
  setAllowedMistakes,
  rewardXP,
  setRewardXP,
  displayedItemCount,
  itemCount,
  setItemCount,
  minAllowed,
  maxAllowed,
  availableCardsCount,
}: GameChallengeRulesProps) {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border-default space-y-3">
      <h4 className="text-xs font-bold text-white uppercase tracking-wide">
        2. Reglas de Desafío &amp; Gamificación
      </h4>

      <div className="grid grid-cols-2 gap-3">
        {/* Tiempo Límite */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-subtle flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Tiempo Límite</span>
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="15"
              max="180"
              step="5"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-xl bg-canvas border border-border-default text-white font-mono text-center text-xs focus:outline-none focus:border-emerald-brand [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-[11px] text-slate-400 font-mono">s</span>
          </div>
        </div>

        {/* Vidas / Fallos */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-subtle flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-400" />
            <span>Fallos / Vidas</span>
          </label>
          <select
            value={allowedMistakes}
            onChange={(e) => setAllowedMistakes(Number(e.target.value))}
            className="w-full px-2 py-1.5 rounded-xl bg-canvas border border-border-default text-white font-mono text-xs focus:outline-none focus:border-emerald-brand cursor-pointer"
          >
            <option value={0}>0 (Muerte súbita)</option>
            <option value={1}>1 Vida</option>
            <option value={2}>2 Vidas</option>
            <option value={3}>3 Vidas (Normal)</option>
            <option value={5}>5 Vidas (Relajado)</option>
          </select>
        </div>

        {/* Recompensa XP */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-subtle flex items-center gap-1">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Recompensa XP</span>
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="5"
              max="100"
              step="5"
              value={rewardXP}
              onChange={(e) => setRewardXP(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-xl bg-canvas border border-border-default text-white font-mono text-center text-xs focus:outline-none focus:border-emerald-brand [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-[11px] text-emerald-brand font-mono font-bold">XP</span>
          </div>
        </div>

        {/* Palabras a Evaluar */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-subtle flex items-center gap-1">
            <Layers className="w-3 h-3 text-mint-brand" />
            <span>Palabras a Evaluar</span>
          </label>
          <div className="flex items-center rounded-xl bg-canvas border border-border-default h-[33px] px-1 focus-within:border-emerald-brand transition-colors">
            <button
              type="button"
              onClick={() => setItemCount(Math.max(minAllowed, displayedItemCount - 1))}
              disabled={displayedItemCount <= minAllowed}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-card disabled:opacity-25 disabled:hover:bg-transparent cursor-pointer transition-colors"
              title="Disminuir palabras"
            >
              <Minus className="w-3 h-3" />
            </button>

            <div className="flex-1 flex items-center justify-center gap-1 font-mono text-xs select-none">
              <input
                type="number"
                min={minAllowed}
                max={maxAllowed}
                value={displayedItemCount}
                onChange={(e) => setItemCount(Number(e.target.value))}
                onBlur={() => {
                  const num = Number(itemCount);
                  if (availableCardsCount > 0 && num > availableCardsCount) {
                    setItemCount(availableCardsCount);
                  } else if (num < minAllowed) {
                    setItemCount(minAllowed);
                  }
                }}
                className="w-5 text-center font-bold text-white bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-slate-500 text-[10px]">
                / {availableCardsCount > 0 ? availableCardsCount : "—"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setItemCount(Math.min(maxAllowed, displayedItemCount + 1))}
              disabled={displayedItemCount >= maxAllowed}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-card disabled:opacity-25 disabled:hover:bg-transparent cursor-pointer transition-colors"
              title="Aumentar palabras"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
