"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Play, RotateCcw, Heart, Trophy, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { GameModeItem } from "@/features/teacher-dashboard/types";
import { TeacherGameDTO } from "@/services/api/types";
import {
  WordPair,
  SANDBOX_ENGINES,
} from "./sandbox-modes";
import { normalizeArchetype, ARCHETYPE_LABELS } from "./archetypes";

interface GameSandboxModalProps {
  game: GameModeItem | TeacherGameDTO;
  onClose: () => void;
}

const DEFAULT_PAIRS: WordPair[] = [
  { term: "Flawless", translation: "Impecable" },
  { term: "Resilience", translation: "Resiliencia" },
  { term: "Fluency", translation: "Fluidez" },
  { term: "Mastery", translation: "Dominio" },
  { term: "Patience", translation: "Paciencia" },
  { term: "Achievement", translation: "Logro" },
];

export function GameSandboxModal({ game, onClose }: GameSandboxModalProps) {
  const isCustom = "base_archetype" in game;
  const title = game.title;
  const archetype = normalizeArchetype(isCustom ? game.base_archetype : game.type);
  const timeLimit = isCustom ? game.time_limit_seconds : game.timeLimit;
  const initialLives = isCustom ? (game.allowed_mistakes === 0 ? 1 : game.allowed_mistakes) : 3;
  const rewardXP = isCustom ? game.reward_xp : game.points;

  // Extraer pares de palabras configurados o por defecto
  const wordPairs = useMemo<WordPair[]>(() => {
    if (isCustom && game.custom_words_json) {
      try {
        const parsed = JSON.parse(game.custom_words_json);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, game.item_count || 6);
        }
      } catch {
        // Fallback a pares por defecto
      }
    }
    return DEFAULT_PAIRS;
  }, [isCustom, game]);

  // Estado del bucle de juego
  const [gameState, setGameState] = useState<"ready" | "playing" | "won" | "lost">("ready");
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [lives, setLives] = useState(initialLives);
  const [score, setScore] = useState(0);

  // Iniciar partida
  const startGame = () => {
    setGameState("playing");
    setTimeLeft(timeLimit);
    setLives(initialLives);
    setScore(0);
  };

  // Temporizador de partida
  useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft <= 0) {
      setGameState("lost");
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Handlers del motor activo
  const handleCorrect = (pts = 10) => {
    setScore((s) => s + pts);
  };

  const handleMistake = () => {
    setLives((l) => {
      const next = l - 1;
      if (next <= 0) {
        setGameState("lost");
      }
      return next;
    });
  };

  const handleWin = () => {
    setGameState("won");
  };

  const renderActiveEngine = () => {
    const engineProps = {
      wordPairs,
      onCorrect: handleCorrect,
      onMistake: handleMistake,
      onWin: handleWin,
    };

    const ActiveEngine = SANDBOX_ENGINES[archetype];
    return <ActiveEngine {...engineProps} />;
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-canvas border border-border-default text-slate-muted hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Encabezado del Sandbox */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-mint-brand/20 text-mint-brand border border-mint-brand/30 uppercase">
              Sandbox Interactivo
            </span>
            <span className="text-[10px] font-mono text-slate-muted">
              Mecánica: {ARCHETYPE_LABELS[archetype]}
            </span>
          </div>
          <h3 className="text-base font-bold text-white">{title}</h3>
        </div>

        {/* Barra de HUD en Vivo */}
        <div className="p-3 bg-canvas rounded-2xl border border-border-default flex items-center justify-between font-mono">
          <div className="flex items-center gap-1.5 text-mint-brand">
            <Clock className="w-4 h-4" />
            <span className="font-bold text-sm">{timeLeft}s</span>
          </div>

          <div className="flex items-center gap-1 text-rose-400">
            <Heart className="w-4 h-4 fill-current" />
            <span className="font-bold text-sm">{lives}</span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-300">
            <Trophy className="w-4 h-4" />
            <span className="font-bold text-sm">+{rewardXP} XP</span>
          </div>
        </div>

        {/* Área Jugable */}
        <div className="p-5 bg-canvas/60 rounded-2xl border border-border-default min-h-[240px] flex flex-col justify-center items-center">
          {gameState === "ready" && (
            <div className="text-center space-y-3">
              <p className="text-slate-300 text-sm font-semibold">
                Listo para probar el minijuego pedagógico
              </p>
              <p className="text-slate-muted text-xs max-w-xs">
                Contiene {wordPairs.length} palabras calibradas. Prueba la jugabilidad y límites antes de asignar a tus cohortes.
              </p>
              <button
                type="button"
                onClick={startGame}
                className="px-5 py-2.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-2 mx-auto cursor-pointer shadow-glow-emerald"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Simulación</span>
              </button>
            </div>
          )}

          {gameState === "playing" && renderActiveEngine()}

          {gameState === "won" && (
            <div className="text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-brand mx-auto" />
              <h4 className="text-base font-bold text-white">¡Actividad Superada!</h4>
              <p className="text-slate-muted text-xs">
                Puntaje pedagógico: +{score} pts • Recompensa: +{rewardXP} XP
              </p>
              <button
                type="button"
                onClick={startGame}
                className="px-4 py-2 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand text-xs font-semibold text-emerald-brand transition-colors flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Prueba</span>
              </button>
            </div>
          )}

          {gameState === "lost" && (
            <div className="text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Tiempo o Vidas Agotadas</h4>
              <p className="text-slate-muted text-xs">
                El alumno activaría un refuerzo guiado para afianzar este grupo de palabras.
              </p>
              <button
                type="button"
                onClick={startGame}
                className="px-4 py-2 rounded-xl bg-canvas border border-border-default hover:border-rose-500 text-xs font-semibold text-rose-400 transition-colors flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Volver a Intentar</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-border-default text-slate-muted text-[11px]">
          <span>Verificación en navegador para el docente</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cerrar Sandbox
          </button>
        </div>
      </div>
    </div>
  );
}
