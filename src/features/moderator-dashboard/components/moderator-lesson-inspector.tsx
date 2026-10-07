"use client";

import { Volume2, Sparkles, Gamepad2, Play } from "lucide-react";
import { Lesson } from "@/features/teacher-dashboard/types";

interface ModeratorLessonInspectorProps {
  currentLesson: Lesson | null;
  activeTab: "cards" | "simulator" | "games";
  onSpeak: (text: string) => void;
  onOpenPlaytestDrawer: () => void;
}

export function ModeratorLessonInspector({
  currentLesson,
  activeTab,
  onSpeak,
  onOpenPlaytestDrawer,
}: ModeratorLessonInspectorProps) {
  if (!currentLesson) {
    return (
      <div className="p-12 text-center text-slate-muted">
        Selecciona una lección para auditar su contenido.
      </div>
    );
  }

  if (activeTab === "cards") {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{currentLesson.title}</span>
              <span className="text-xs font-mono text-slate-muted">
                • {currentLesson.items.length} tarjetas
              </span>
            </h3>
            <p className="text-xs text-slate-muted mt-0.5">{currentLesson.subtitle}</p>
          </div>
          <span className="text-xs font-mono text-blue-400 font-semibold">
            Duración estimada: {currentLesson.duration || "10 min"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentLesson.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-4 rounded-2xl bg-card border border-border-default hover:border-slate-500 transition-colors space-y-2 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">{item.en}</span>
                  {item.ipa && (
                    <span className="text-xs font-mono text-mint-brand bg-mint-brand/10 px-2 py-0.5 rounded border border-mint-brand/20">
                      {item.ipa}
                    </span>
                  )}
                  <span className="text-[10px] font-mono uppercase text-slate-400 bg-canvas px-2 py-0.5 rounded border border-border-default">
                    {item.pos || item.itemType || "word"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onSpeak(item.en)}
                  className="p-1.5 rounded-lg bg-canvas text-slate-400 hover:text-emerald-brand hover:bg-card transition-colors cursor-pointer"
                  title="Reproducir audio nativo"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-300">
                <span className="text-slate-muted">Traducción:</span>{" "}
                <strong className="text-slate-100">{item.es}</strong>
              </div>

              {item.example && (
                <div className="text-xs bg-canvas/80 p-2.5 rounded-xl border border-border-default/60 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">
                    Oración de Ejemplo:
                  </span>
                  <p className="italic text-slate-300">
                    &quot;{item.example.replace(/^["“”']+|["“”']+$/g, "").trim()}&quot;
                  </p>
                </div>
              )}

              {item.note && (
                <div className="flex items-start gap-1.5 text-xs text-amber-300/90 pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{item.note}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === "simulator") {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-[320px] h-[580px] bg-slate-950 rounded-[42px] border-[6px] border-slate-800 shadow-2xl overflow-hidden flex flex-col text-slate-900">
          <div className="bg-[#05B075] pt-6 px-4 pb-4 rounded-b-[24px] text-white space-y-1">
            <div className="flex justify-between items-center text-[10px] text-white/80 font-mono">
              <span>Simulador WordTap</span>
              <span>100% Nativo</span>
            </div>
            <h4 className="text-sm font-extrabold truncate">{currentLesson.title}</h4>
            <p className="text-[10px] text-white/90 truncate">{currentLesson.subtitle}</p>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#EDF8F3]">
            {currentLesson.items.map((it) => (
              <div
                key={it.id}
                className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-xs text-[#0F172A]">{it.en}</p>
                  <p className="text-[11px] text-[#64748B]">{it.es}</p>
                  {it.ipa && <p className="text-[10px] font-mono text-[#05B075]">{it.ipa}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => onSpeak(it.en)}
                  className="p-1.5 rounded-lg bg-[#ECFDF5] text-[#05B075] hover:bg-[#D1FAE5] cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 rounded-2xl bg-card border border-border-default text-center space-y-3">
      <Gamepad2 className="w-8 h-8 text-blue-400 mx-auto" />
      <h4 className="text-sm font-bold text-white">Prueba de Juegos Didácticos</h4>
      <p className="text-xs text-slate-muted">
        Esta lección cuenta con {currentLesson.items.length} tarjetas compatibles con los modos Speed
        Match, Memory Pairs y Sentence Builder.
      </p>
      <button
        type="button"
        onClick={onOpenPlaytestDrawer}
        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        <span>Lanzar en Playtest Móvil</span>
      </button>
    </div>
  );
}
