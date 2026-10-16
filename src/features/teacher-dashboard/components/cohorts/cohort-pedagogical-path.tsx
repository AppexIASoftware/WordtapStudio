"use client";

import { BookOpen, Gamepad2, CheckCircle2, Zap, Gift, Sparkles, Crown } from "lucide-react";

export interface StationNode {
  id: string;
  order: number;
  type: "lesson" | "game" | "speed" | "milestone";
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  xp: number;
  gameKey?: string;
  isCustom?: boolean;
  customGameId?: string;
  x: number;
  y: number;
}

interface CohortPedagogicalPathProps {
  stations: StationNode[];
  svgPathD: string;
  activeStationId: string;
  simulatedCompletedCount: number;
  totalHeight: number;
  onSelectStation: (id: string) => void;
}

export function CohortPedagogicalPath({
  stations,
  svgPathD,
  activeStationId,
  simulatedCompletedCount,
  totalHeight,
  onSelectStation,
}: CohortPedagogicalPathProps) {
  return (
    <div className="lg:col-span-6 xl:col-span-6 bg-canvas/60 rounded-2xl border border-border-default p-6 flex flex-col items-center">
      <div className="relative w-[360px]" style={{ height: `${totalHeight}px` }}>
        {/* Trazo Curvo Conector de Fondo */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 360 ${totalHeight}`}
          fill="none"
        >
          {/* Sombra ancha de la pista didáctica */}
          <path
            d={svgPathD}
            stroke="#064e3b"
            strokeWidth="16"
            strokeLinecap="round"
            className="opacity-40"
          />
          {/* Línea principal discontinua de alta visibilidad */}
          <path
            d={svgPathD}
            stroke="#10b981"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="9 9"
            className="opacity-80"
          />
        </svg>

        {/* Estaciones Táctiles Interactivas */}
        {stations.map((st, idx) => {
          const isSelected = activeStationId === st.id;
          const isCompleted = idx < simulatedCompletedCount;
          const isActive = idx === simulatedCompletedCount;

          return (
            <div
              key={st.id}
              style={{ left: `${st.x}px`, top: `${st.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10"
            >
              {/* Tooltip flotante de estación en progreso */}
              {isActive && (
                <div className="absolute -top-7 px-2.5 py-0.5 rounded-full bg-emerald-500 text-canvas font-mono font-bold text-[9px] shadow-lg animate-bounce whitespace-nowrap flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>SIGUIENTE</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => onSelectStation(st.id)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer relative shadow-xl active:translate-y-1.5 ${
                  isCompleted
                    ? "bg-emerald-600 border-b-[5px] border-emerald-800 text-white hover:brightness-110"
                    : isActive
                    ? "bg-mint-brand border-b-[5px] border-teal-700 text-canvas ring-4 ring-emerald-400/50 scale-110 shadow-glow-emerald"
                    : st.isCustom
                    ? "bg-amber-500 border-b-[5px] border-amber-700 text-canvas ring-2 ring-amber-400/50 hover:brightness-110 shadow-glow-amber"
                    : st.type === "milestone"
                    ? "bg-amber-500 border-b-[5px] border-amber-700 text-canvas hover:brightness-110"
                    : "bg-slate-700 border-b-[5px] border-slate-900 text-slate-300 hover:bg-slate-600"
                } ${isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-card" : ""}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                ) : st.isCustom ? (
                  <Crown className="w-7 h-7 stroke-[2.5] text-amber-950" />
                ) : st.type === "lesson" ? (
                  <BookOpen className="w-7 h-7 stroke-[2.5]" />
                ) : st.type === "game" ? (
                  <Gamepad2 className="w-7 h-7 stroke-[2.5]" />
                ) : st.type === "speed" ? (
                  <Zap className="w-7 h-7 stroke-[2.5]" />
                ) : (
                  <Gift className="w-7 h-7 stroke-[2.5] text-amber-100" />
                )}

                {/* Número de orden */}
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card border border-border-default text-[10px] font-mono font-bold flex items-center justify-center text-slate-300 shadow">
                  {st.order}
                </span>
              </button>

              {/* Título de Estación en Píldora Protectora con Alto Contraste */}
              <div
                onClick={() => onSelectStation(st.id)}
                className={`mt-2.5 px-3 py-1 rounded-xl text-center max-w-[150px] shadow-md border transition-all backdrop-blur-xs cursor-pointer select-none ${
                  isSelected
                    ? st.isCustom
                      ? "bg-amber-950/90 border-amber-400/80 text-white shadow-amber-900/30 ring-2 ring-amber-500/30 scale-105"
                      : "bg-emerald-950/90 border-emerald-400/80 text-white shadow-emerald-900/30 ring-2 ring-emerald-500/30 scale-105"
                    : st.isCustom
                    ? "bg-card/95 border-amber-500/40 text-amber-300 hover:border-amber-400"
                    : "bg-card/95 border-border-default/90 text-slate-200 hover:border-slate-500 hover:text-white"
                }`}
              >
                <p className="text-[11px] font-bold line-clamp-2 leading-tight">
                  {st.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
