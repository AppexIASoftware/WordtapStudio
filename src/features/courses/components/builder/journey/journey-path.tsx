"use client";

import React from "react";
import { BookOpen, Gamepad2, Zap, Gift, Sparkles } from "lucide-react";
import { CourseJourneyNode, JOURNEY_NODE_TYPE } from "./journey-types";

interface JourneyPathProps {
  nodes: CourseJourneyNode[];
  svgPathD: string;
  activeNodeId: string | null;
  totalHeight: number;
  onSelectNode: (node: CourseJourneyNode) => void;
}

export function JourneyPath({
  nodes,
  svgPathD,
  activeNodeId,
  totalHeight,
  onSelectNode,
}: JourneyPathProps) {
  return (
    <div className="w-full bg-canvas/60 rounded-3xl border border-border-default p-6 md:p-8 pt-8 md:pt-10 flex flex-col items-center shadow-inner overflow-hidden">
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

        {/* Nodos Táctiles Interactivos */}
        {nodes.map((node) => {
          const isSelected = activeNodeId === node.id;
          const isMilestone = node.type === JOURNEY_NODE_TYPE.MILESTONE;
          const isGame = node.type === JOURNEY_NODE_TYPE.GAME;
          const isCheckpoint = node.type === JOURNEY_NODE_TYPE.CHECKPOINT;
          const isLesson = node.type === JOURNEY_NODE_TYPE.LESSON;

          return (
            <div
              key={node.id}
              style={{ left: `${node.x}px`, top: `${node.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10"
            >
              {isSelected && (
                <div className="absolute -top-7 px-2.5 py-0.5 rounded-full bg-emerald-500 text-canvas font-mono font-bold text-[9px] shadow-lg whitespace-nowrap flex items-center gap-1 animate-bounce">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>SELECCIONADA</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => onSelectNode(node)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer relative shadow-xl active:translate-y-1 ${
                  isSelected
                    ? "bg-mint-brand border-b-[5px] border-teal-700 text-canvas ring-4 ring-emerald-400/50 scale-110 shadow-glow-emerald"
                    : isMilestone
                    ? "bg-amber-500 border-b-[5px] border-amber-700 text-canvas hover:brightness-110 shadow-glow-amber"
                    : isCheckpoint
                    ? "bg-blue-600 border-b-[5px] border-blue-800 text-white hover:brightness-110"
                    : isGame
                    ? "bg-slate-700 border-b-[5px] border-slate-900 text-mint-brand hover:bg-slate-600"
                    : "bg-emerald-600 border-b-[5px] border-emerald-800 text-white hover:brightness-110"
                }`}
                title={`Ver detalles de ${node.title}`}
              >
                {isMilestone ? (
                  <Gift className="w-7 h-7 stroke-[2.5] text-amber-100" />
                ) : isCheckpoint ? (
                  <Zap className="w-7 h-7 stroke-[2.5]" />
                ) : isGame ? (
                  <Gamepad2 className="w-7 h-7 stroke-[2.5]" />
                ) : (
                  <BookOpen className="w-7 h-7 stroke-[2.5]" />
                )}

                {/* Número de orden */}
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card border border-border-default text-[10px] font-mono font-bold flex items-center justify-center text-slate-300 shadow">
                  {node.order}
                </span>
              </button>

              {/* Título de Estación en Píldora */}
              <div
                onClick={() => onSelectNode(node)}
                className={`mt-2.5 px-3 py-1 rounded-xl text-center max-w-[150px] shadow-md border transition-all backdrop-blur-xs cursor-pointer select-none ${
                  isSelected
                    ? "bg-emerald-950/90 border-emerald-400/80 text-white shadow-emerald-900/30 ring-2 ring-emerald-500/30 scale-105"
                    : isMilestone
                    ? "bg-card/95 border-amber-500/40 text-amber-300 hover:border-amber-400"
                    : isGame
                    ? "bg-card/95 border-border-default/90 text-mint-brand hover:border-mint-brand"
                    : "bg-card/95 border-border-default/90 text-slate-200 hover:border-slate-500 hover:text-white"
                }`}
              >
                <p className="text-[11px] font-bold line-clamp-2 leading-tight">
                  {node.title}
                </p>
                {node.cardsCount > 0 && isLesson && (
                  <span className="text-[9px] text-slate-muted block mt-0.5 font-mono">
                    {node.cardsCount} tarjetas
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
