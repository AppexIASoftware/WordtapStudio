"use client";

import { Smartphone } from "lucide-react";

interface GamesTabProps {
  onTestGames: () => void;
}

export function GamesTab({ onTestGames }: GamesTabProps) {
  return (
    <div className="p-5 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">
            Minijuegos Calibrados para esta Lección
          </h3>
          <p className="text-xs text-slate-muted">
            Ejercicios interactivos generados automáticamente a partir de las tarjetas pedagógicas (RF-S11, RF-S12)
          </p>
        </div>
        <button
          type="button"
          onClick={onTestGames}
          className="px-3.5 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs flex items-center gap-1.5 hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Probar Juegos en Simulador</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Matching */}
        <div className="p-4 rounded-2xl bg-card border border-border-default space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center font-bold text-xs">
                M
              </span>
              <div>
                <h4 className="font-bold text-white text-xs">Matching: Parejas Rápidas</h4>
                <span className="text-[10px] font-mono text-emerald-brand">
                  Arquetipo Emparejamiento
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-brand/10 text-emerald-brand font-bold">
              Activo
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Empareja palabras en inglés con su traducción al español antes de que termine el temporizador.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-border-default text-xs text-slate-muted">
            <span>3 Niveles Calibrados (L1-L3)</span>
            <button
              type="button"
              onClick={onTestGames}
              className="text-emerald-brand hover:underline font-semibold cursor-pointer"
            >
              Probar Juego &rarr;
            </button>
          </div>
        </div>

        {/* 2. Sequence */}
        <div className="p-4 rounded-2xl bg-card border border-border-default space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                S
              </span>
              <div>
                <h4 className="font-bold text-white text-xs">Sequence: Ordena la Frase</h4>
                <span className="text-[10px] font-mono text-blue-400">
                  Arquetipo Secuencia
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
              Activo
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Construye oraciones completas arrastrando bloques de palabras en el orden sintáctico correcto.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-border-default text-xs text-slate-muted">
            <span>Distractores: 4 semejantes</span>
            <button
              type="button"
              onClick={onTestGames}
              className="text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              Probar Juego &rarr;
            </button>
          </div>
        </div>

        {/* 3. Choice */}
        <div className="p-4 rounded-2xl bg-card border border-border-default space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                C
              </span>
              <div>
                <h4 className="font-bold text-white text-xs">Choice: Traducción Rápida</h4>
                <span className="text-[10px] font-mono text-purple-400">
                  Arquetipo Opción
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold">
              Activo
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Selección múltiple contra reloj basada en listening neural y estímulo visual de fonética.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-border-default text-xs text-slate-muted">
            <span>Temporizador: 15s (Nivel 2)</span>
            <button
              type="button"
              onClick={onTestGames}
              className="text-purple-400 hover:underline font-semibold cursor-pointer"
            >
              Probar Juego &rarr;
            </button>
          </div>
        </div>

        {/* 4. Slots */}
        <div className="p-4 rounded-2xl bg-card border border-border-default space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                K
              </span>
              <div>
                <h4 className="font-bold text-white text-xs">Slots: Rellena el Espacio</h4>
                <span className="text-[10px] font-mono text-amber-400">
                  Arquetipo Ranuras
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">
              Activo
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Completa oraciones con la conjugación correcta o el collocate natural adecuado.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-border-default text-xs text-slate-muted">
            <span>Pistas: Hints graduales</span>
            <button
              type="button"
              onClick={onTestGames}
              className="text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              Probar Juego &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
