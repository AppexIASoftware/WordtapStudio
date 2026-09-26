"use client";

import { useState } from "react";
import {
  Play,
  Plus,
  Calculator,
  X,
} from "lucide-react";
import { GAMES_DATA } from "../data/mock-teacher-data";
import { GameModeItem } from "../types";

export function GamificationView() {
  const [games] = useState<GameModeItem[]>(GAMES_DATA);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "fase2" | "fase3">("all");

  // Parámetros de simulación matemática SuperMemo SM-2
  const [easeFactor, setEaseFactor] = useState(2.5);
  const [quality, setQuality] = useState(4);
  const [repetitions, setRepetitions] = useState(3);

  // Modal para probar juego en vivo
  const [activeTestingGame, setActiveTestingGame] = useState<GameModeItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cálculo didáctico de la fórmula SuperMemo SM-2
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const newEaseFactor = Math.max(
    1.3,
    parseFloat(
      (
        easeFactor +
        (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
      ).toFixed(2)
    )
  );

  // Cálculo de intervalo en días I(n)
  let calculatedInterval = 1;
  if (repetitions === 1) {
    calculatedInterval = 1;
  } else if (repetitions === 2) {
    calculatedInterval = 6;
  } else {
    calculatedInterval = Math.round(6 * Math.pow(newEaseFactor, repetitions - 2));
  }

  const filteredGames = games.filter((g) => {
    if (activeFilter === "all") return true;
    return g.phase === activeFilter;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-2.5 rounded-xl bg-slate-900 text-white border border-slate-700/80 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-brand flex-shrink-0 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Motor de Juegos & Gamificación
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/40 font-mono">
              12 Modos Interactivos
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            Catálogo de minijuegos interactivos, asignación de estrellas de desbloqueo y calibrador matemático del algoritmo SuperMemo (SM-2).
          </p>
        </div>

        <button
          type="button"
          onClick={() => triggerToast("Formulario para crear nuevo modo de juego interactivo")}
          className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>+ Nueva Actividad</span>
        </button>
      </div>

      {/* Barra de Métricas Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-card border border-border-default">
          <span className="text-[10px] font-mono uppercase text-slate-subtle">
            Modos en Catálogo
          </span>
          <p className="text-xl font-bold font-mono text-white">12 Juegos</p>
        </div>
        <div className="p-3.5 rounded-xl bg-card border border-border-default">
          <span className="text-[10px] font-mono uppercase text-slate-subtle">
            Habilitados en App
          </span>
          <p className="text-xl font-bold font-mono text-emerald-brand">2 Activos</p>
        </div>
        <div className="p-3.5 rounded-xl bg-card border border-border-default">
          <span className="text-[10px] font-mono uppercase text-slate-subtle">
            Estrellas en Ruta
          </span>
          <p className="text-xl font-bold font-mono text-amber-300">38 ★ Total</p>
        </div>
        <div className="p-3.5 rounded-xl bg-card border border-border-default">
          <span className="text-[10px] font-mono uppercase text-slate-subtle">
            Puntos por Victoria
          </span>
          <p className="text-xl font-bold font-mono text-mint-brand">+10 a +30 XP</p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="p-3.5 rounded-2xl bg-card border border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs">
          {[
            { id: "all", label: "Todos (12)" },
            { id: "active", label: "Activos en App (2)" },
            { id: "fase2", label: "Fase 2 (5)" },
            { id: "fase3", label: "Fase 3 (5)" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id as "all" | "active" | "fase2" | "fase3")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeFilter === f.id
                  ? "bg-canvas text-emerald-brand border border-emerald-brand/40 shadow-sm"
                  : "bg-card border border-border-default text-slate-muted hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-subtle font-mono">
          Haz clic en &apos;▶ Probar en Vivo&apos; para ejecutar cualquier minijuego
        </span>
      </div>

      {/* Cuadrícula Dinámica de los 12 Modos de Juego */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="p-4 rounded-2xl bg-card border border-border-default space-y-3 shadow-sm hover:border-border-subtle transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-subtle uppercase">
                  tipo: {game.type}
                </span>
                {game.phase === "active" ? (
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/30">
                    Activo en App
                  </span>
                ) : game.phase === "fase2" ? (
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-mint-brand/20 text-mint-brand border border-mint-brand/30">
                    Fase 2
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Fase 3
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">{game.title}</h4>
                <p className="text-[11px] text-slate-muted mt-0.5 leading-relaxed">{game.desc}</p>
              </div>

              {/* Atributos del juego */}
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

            <div className="pt-3 border-t border-border-default flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTestingGame(game)}
                className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand text-xs font-semibold text-emerald-brand hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>▶ Probar en Vivo</span>
              </button>
              <button
                type="button"
                onClick={() => triggerToast(`Configuración de ${game.title}`)}
                className="text-slate-muted hover:text-white text-xs font-semibold"
              >
                Ajustes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sección del Simulador Matemático SuperMemo (SM-2) */}
      <div className="p-6 rounded-2xl bg-card border border-border-default space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-default pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-brand" />
              <span>Simulador Matemático SuperMemo (SM-2) para Vocabulario</span>
            </h3>
            <p className="text-xs text-slate-muted mt-0.5">
              Calcula cómo los fallos y aciertos en los minijuegos recalculan los intervalos de repaso de cada palabra.
            </p>
          </div>
          <button
            type="button"
            onClick={() => triggerToast("¡Configuración del algoritmo SRS guardada!")}
            className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer"
          >
            Guardar Configuración SRS
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sliders (7 cols) */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            {/* Slider 1: Ease Factor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-200 font-semibold">
                  Factor de Facilidad Inicial (Ease Factor - EF):
                </span>
                <span className="font-mono font-bold text-emerald-brand text-sm">
                  {easeFactor.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="1.3"
                max="3.0"
                step="0.1"
                value={easeFactor}
                onChange={(e) => setEaseFactor(parseFloat(e.target.value))}
                className="w-full accent-emerald-brand cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-subtle font-mono">
                <span>1.3 (Muy Difícil)</span>
                <span>2.5 (Estándar SM-2)</span>
                <span>3.0 (Muy Fácil)</span>
              </div>
            </div>

            {/* Slider 2: Response Quality */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-200 font-semibold">
                  Calidad de Respuesta en el Minijuego (Calificación 0 a 5):
                </span>
                <span className="font-mono font-bold text-mint-brand text-sm">
                  {quality} -{" "}
                  {quality === 5
                    ? "Perfecto inmediato"
                    : quality === 4
                    ? "Respuesta Correcta Rápida"
                    : quality === 3
                    ? "Con esfuerzo"
                    : quality === 2
                    ? "Duda severa"
                    : quality === 1
                    ? "Respuesta incorrecta"
                    : "Olvido total"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full accent-mint-brand cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-subtle font-mono">
                <span>0: Olvido total</span>
                <span>3: Con esfuerzo</span>
                <span>5: Perfecto inmediato</span>
              </div>
            </div>

            {/* Slider 3: Repetitions */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-200 font-semibold">
                  Número de Repetición Exitosa (n):
                </span>
                <span className="font-mono font-bold text-amber-300 text-sm">
                  {repetitions}ª repetición
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={repetitions}
                onChange={(e) => setRepetitions(parseInt(e.target.value))}
                className="w-full accent-amber-300 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-subtle font-mono">
                <span>1ª vez (1 día)</span>
                <span>2ª vez (6 días)</span>
                <span>10ª vez (&gt;180 días)</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Resultados (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-canvas border border-border-default space-y-3.5 text-xs">
            <h4 className="font-bold text-white flex items-center justify-between">
              <span>Resultado Matemático SRS</span>
              <span className="text-[10px] font-mono text-emerald-brand font-bold">
                Algoritmo SM-2
              </span>
            </h4>

            <div className="space-y-2 pt-1 border-t border-border-default">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-muted">Próximo intervalo de repaso:</span>
                <span className="text-lg font-black font-mono text-emerald-brand">
                  {calculatedInterval} {calculatedInterval === 1 ? "día" : "días"}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-muted">Nuevo Factor de Facilidad (EF&apos;):</span>
                <span className="font-mono font-bold text-white text-sm">
                  {newEaseFactor.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-muted">Impacto de la calificación:</span>
                <span
                  className={`font-mono text-[11px] font-bold ${
                    quality >= 3 ? "text-emerald-brand" : "text-rose-400"
                  }`}
                >
                  {quality >= 3 ? "Intervalo Expandido" : "Reinicio / Penalización"}
                </span>
              </div>
            </div>

            <div className="p-3 bg-card rounded-xl border border-border-default text-[11px] text-slate-300 space-y-1">
              <p className="font-semibold text-white">Fórmula pedagógica en vigor:</p>
              <code className="text-mint-brand font-mono block text-[10px]">
                I(n) = I(n-1) × EF&apos;
              </code>
              <p className="text-[10px] text-slate-muted leading-relaxed">
                Si el alumno responde con rapidez y precisión (q=4 o 5), la palabra tardará más en reaparecer para no aburrirlo. Si comete fallos (q&lt;3), se programa un refuerzo prioritario.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: PROBADOR DE JUEGO EN VIVO */}
      {activeTestingGame && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActiveTestingGame(null)}
              className="absolute top-4 right-4 p-1 rounded-xl bg-canvas border border-border-default text-slate-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-emerald-brand font-bold uppercase">
                Simulador de Minijuego
              </span>
              <h3 className="text-base font-bold text-white">{activeTestingGame.title}</h3>
              <p className="text-xs text-slate-muted">{activeTestingGame.desc}</p>
            </div>

            <div className="p-4 bg-canvas rounded-2xl border border-border-default space-y-3">
              <div className="flex justify-between text-slate-300">
                <span>Tiempo límite:</span>
                <strong className="text-white font-mono">{activeTestingGame.timeLimit} segundos</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Recompensa XP:</span>
                <strong className="text-emerald-brand font-mono">+{activeTestingGame.points} XP</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Estrellas requeridas:</span>
                <strong className="text-amber-300 font-mono">★ {activeTestingGame.unlockStars}</strong>
              </div>
            </div>

            <div className="p-3 bg-[#05B075]/10 border border-[#05B075]/30 rounded-xl text-center text-xs text-emerald-brand font-semibold">
              ✓ Conexión con motor de gamificación móvil React Native verificada.
            </div>

            <div className="flex justify-end pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setActiveTestingGame(null)}
                className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs"
              >
                Cerrar Prueba
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
