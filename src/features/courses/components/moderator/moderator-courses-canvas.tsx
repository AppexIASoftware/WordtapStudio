"use client";

import { BookOpen, Smartphone, Gamepad2 } from "lucide-react";
import { Lesson } from "@/features/courses/types";
import { ModeratorLessonInspector } from "@/features/moderation/components/moderator-lesson-inspector";

interface ModeratorCoursesCanvasProps {
  currentLesson: Lesson | null;
  activeTab: "cards" | "simulator" | "games";
  onTabChange: (tab: "cards" | "simulator" | "games") => void;
  onSpeak: (text: string) => void;
  onOpenPlaytestDrawer: () => void;
}

/** Canvas de inspeccion modular: pestanas y renderizado de tarjetas/simulador/juegos. */
export function ModeratorCoursesCanvas({
  currentLesson,
  activeTab,
  onTabChange,
  onSpeak,
  onOpenPlaytestDrawer,
}: ModeratorCoursesCanvasProps) {
  return (
    <div className="flex-1 flex flex-col bg-canvas overflow-hidden">
      {/* Barra de Pestañas del Canvas */}
      <div className="h-12 border-b border-border-default bg-card px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onTabChange("cards")}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "cards"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tarjetas Pedagógicas</span>
            {currentLesson && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
                {currentLesson.items?.length || 0}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange("simulator")}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "simulator"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Simulador Playtest</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("games")}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "games"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Juegos Didácticos</span>
          </button>
        </div>

        {currentLesson && (
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Lección Activa: <strong className="text-white">{currentLesson.title}</strong>
          </span>
        )}
      </div>

      {/* Contenido Modular del Inspector */}
      <div className="flex-1 overflow-y-auto p-5">
        <ModeratorLessonInspector
          currentLesson={currentLesson}
          activeTab={activeTab}
          onSpeak={onSpeak}
          onOpenPlaytestDrawer={onOpenPlaytestDrawer}
        />
      </div>
    </div>
  );
}
