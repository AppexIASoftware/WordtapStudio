"use client";

import { Smartphone, X, Volume2 } from "lucide-react";
import { Lesson } from "../../types";

interface PlaytestDrawerProps {
  isOpen: boolean;
  currentLesson: Lesson;
  onClose: () => void;
  onSpeak: (text: string) => void;
}

export function PlaytestDrawer({
  isOpen,
  currentLesson,
  onClose,
  onSpeak,
}: PlaytestDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-sm bg-card border-l border-border-default h-full p-4 flex flex-col justify-between shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-brand" />
            <h3 className="text-xs font-bold text-white">Playtest Móvil React Native</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-canvas text-slate-muted hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-2">
          <div className="w-[300px] h-[540px] bg-slate-950 rounded-[38px] border-[5px] border-slate-800 shadow-2xl overflow-hidden flex flex-col text-slate-900">
            <div className="bg-[#05B075] pt-6 px-4 pb-4 rounded-b-[24px] text-white space-y-1">
              <div className="flex justify-between items-center text-[10px] text-white/80 font-mono">
                <span>Playtest</span>
                <span>100% Nativo</span>
              </div>
              <h4 className="text-sm font-extrabold truncate">{currentLesson.title}</h4>
              <p className="text-[10px] text-white/90 truncate">{currentLesson.subtitle}</p>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#EDF8F3]">
              {currentLesson.items.map((it) => (
                <div
                  key={it.id}
                  className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-xs text-[#0F172A]">{it.en}</p>
                    <p className="text-[10px] text-[#64748B]">{it.es}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSpeak(it.en)}
                    className="p-1 rounded-lg bg-[#ECFDF5] text-[#05B075] cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border-default flex justify-between items-center text-xs">
          <span className="text-[11px] font-mono text-slate-subtle">Simulación táctil activa</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-canvas border border-border-default rounded-xl text-slate-300 font-semibold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
