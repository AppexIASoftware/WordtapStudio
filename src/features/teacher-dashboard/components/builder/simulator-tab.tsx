"use client";

import { Volume2, Play } from "lucide-react";
import { Course, Lesson } from "../../types";

interface SimulatorTabProps {
  currentCourse: Course;
  currentLesson: Lesson;
  simScreen: "lesson" | "home" | "game";
  simTier: "free" | "premium";
  isSimLessonCompleted: boolean;
  simGameSelected: string | null;
  simGameMatched: string[];
  onSetSimScreen: (screen: "lesson" | "home" | "game") => void;
  onToggleSimTier: () => void;
  onToggleSimLessonCompleted: () => void;
  onSelectSimLesson: (lessonId: string) => void;
  onSimGameCardClick: (cardId: string, matchId: string) => void;
  onResetSimGame: () => void;
  onSpeak: (text: string) => void;
}

export function SimulatorTab({
  currentCourse,
  currentLesson,
  simScreen,
  simTier,
  isSimLessonCompleted,
  simGameSelected,
  simGameMatched,
  onSetSimScreen,
  onToggleSimTier,
  onToggleSimLessonCompleted,
  onSelectSimLesson,
  onSimGameCardClick,
  onResetSimGame,
  onSpeak,
}: SimulatorTabProps) {
  return (
    <div className="p-6 flex flex-col items-center justify-center">
      {/* Barra de control del simulador */}
      <div className="mb-4 flex items-center justify-between w-[340px]">
        <div className="flex items-center gap-1 p-1 bg-card rounded-xl border border-border-default text-[11px] font-mono">
          <button
            type="button"
            onClick={() => onSetSimScreen("lesson")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              simScreen === "lesson"
                ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Lección
          </button>
          <button
            type="button"
            onClick={() => onSetSimScreen("home")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              simScreen === "home"
                ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onSetSimScreen("game")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              simScreen === "game"
                ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Juego
          </button>
        </div>

        {/* Conmutador de plan simulado */}
        <button
          type="button"
          onClick={onToggleSimTier}
          className="px-2.5 py-1 rounded-xl bg-card border border-border-default text-[10px] font-mono text-slate-300 hover:border-emerald-brand transition-colors cursor-pointer"
        >
          Simular:{" "}
          <strong
            className={simTier === "premium" ? "text-mint-brand" : "text-emerald-brand"}
          >
            {simTier === "premium" ? "Premium" : "Free"}
          </strong>
        </button>
      </div>

      {/* Marco de simulación iPhone */}
      <div className="w-[340px] h-[640px] bg-slate-950 rounded-[44px] border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-30" />

        {/* PANTALLA SIMULADA 1: DETALLE DE LECCIÓN */}
        {simScreen === "lesson" && (
          <div className="h-full flex flex-col bg-[#EDF8F3] overflow-hidden text-slate-900">
            {/* Header Verde Esmeralda */}
            <div className="bg-gradient-to-b from-[#05B075] to-[#029E67] pt-8 px-5 pb-5 rounded-b-[28px] shadow-sm space-y-2 flex-shrink-0">
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => onSetSimScreen("home")}
                  className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-white"
                >
                  &larr;
                </button>
                <span className="text-[10px] text-white/80 font-mono">WordTap Mobile</span>
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-white tracking-tight leading-tight">
                  {currentLesson.title}
                </h2>
                <p className="text-[11px] font-medium text-white/90 leading-tight mt-0.5">
                  {currentLesson.subtitle}
                </p>
              </div>

              <div className="pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                  <span className="text-[11px]">Progreso</span>
                  <span className="font-extrabold text-[#00E5D0] text-[11px]">
                    {isSimLessonCompleted ? "100%" : "20%"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00E5D0] rounded-full transition-all duration-300"
                    style={{ width: isSimLessonCompleted ? "100%" : "20%" }}
                  />
                </div>
              </div>
            </div>

            {/* Feed deslizable */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {/* Bio del Docente Acreditado */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#05B075] text-white flex items-center justify-center font-bold font-mono text-xs flex-shrink-0">
                  MS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] font-bold text-[#0F172A] truncate">
                      Prof. Mateo Silva
                    </p>
                    <span className="w-3 h-3 rounded-full bg-[#00E5D0] text-[#044E3B] flex items-center justify-center text-[8px] font-black">
                      ✓
                    </span>
                  </div>
                  <p className="text-[9px] text-[#64748B] font-medium truncate">
                    Cambridge CELTA • Autor Acreditado
                  </p>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] font-bold">
                  Docente
                </span>
              </div>

              {/* Tarjeta de introducción */}
              <div className="bg-[#044E3B] border border-[#065F46] rounded-2xl p-3 shadow-sm text-white">
                <p className="text-[11px] font-medium leading-relaxed">
                  {currentLesson.intro}
                </p>
              </div>

              <h4 className="text-xs font-extrabold text-[#0F172A] tracking-tight">
                {currentLesson.sectionTitle}
              </h4>

              {/* Tarjetas de vocabulario en simulación */}
              <div className="space-y-2">
                {currentLesson.items.map((st) => (
                  <div
                    key={st.id}
                    className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSpeak(st.en)}
                          className="w-6 h-6 rounded-lg bg-[#ECFDF5] text-[#05B075] flex items-center justify-center"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs text-[#0F172A]">{st.en}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#00A896] font-bold">
                        {st.ipa}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#334155]">{st.es}</p>
                    {st.example && (
                      <p className="text-[10px] text-[#64748B] italic">{st.example}</p>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={onToggleSimLessonCompleted}
                className="w-full py-2.5 rounded-2xl bg-[#05B075] hover:bg-[#029E67] text-white font-bold text-xs shadow-md transition-colors text-center"
              >
                {isSimLessonCompleted ? "Completada ✓" : "Marcar como completada"}
              </button>
            </div>
          </div>
        )}

        {/* PANTALLA SIMULADA 2: HOME FEED */}
        {simScreen === "home" && (
          <div className="h-full flex flex-col bg-[#EDF8F3] overflow-y-auto text-slate-900">
            <div className="bg-gradient-to-b from-[#05B075] to-[#029E67] pt-8 px-5 pb-5 rounded-b-[28px] shadow-sm space-y-3 flex-shrink-0 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black">WordTap</h2>
                  <p className="text-[10px] text-white/90">Aprende inglés cada día</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  JD
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-white/10 rounded-xl p-1 border border-white/15">
                  <span className="text-xs font-extrabold block">47</span>
                  <span className="text-[8px] text-white/80 block">Palabras</span>
                </div>
                <div className="bg-white/10 rounded-xl p-1 border border-white/15">
                  <span className="text-xs font-extrabold block">12</span>
                  <span className="text-[8px] text-white/80 block">Días</span>
                </div>
                <div className="bg-white/10 rounded-xl p-1 border border-white/15">
                  <span className="text-xs font-extrabold block">85%</span>
                  <span className="text-[8px] text-white/80 block">Precisión</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 space-y-3">
              <div
                onClick={() => onSetSimScreen("game")}
                className="p-3 rounded-2xl bg-[#0D7253] text-white flex items-center gap-2.5 cursor-pointer shadow-sm"
              >
                <Play className="w-6 h-6 text-[#00E5D0]" />
                <div>
                  <h4 className="text-xs font-bold">Juegos y Puzzles</h4>
                  <p className="text-[10px] text-white/80">Practica con 12 modos</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#09694F] text-white space-y-1 shadow-sm">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#00E5D0] text-[#09694F] font-mono">
                  PREMIUM
                </span>
                <h4 className="text-xs font-extrabold">Desbloquea el Curso Completo</h4>
                <p className="text-[10px] text-white/80">Acceso de por vida a tips y lecciones.</p>
              </div>

              <h4 className="text-xs font-extrabold text-[#0F172A] pt-1">
                Lecciones disponibles
              </h4>

              {currentCourse.lessons.map((les) => (
                <div
                  key={les.id}
                  onClick={() => onSelectSimLesson(les.id)}
                  className="p-2.5 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between cursor-pointer hover:border-[#05B075] transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">{les.title}</p>
                    <p className="text-[10px] text-[#64748B]">{les.items.length} tarjetas</p>
                  </div>
                  <span className="text-xs font-bold text-[#05B075]">&rarr;</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANTALLA SIMULADA 3: JUEGO WORD MATCH */}
        {simScreen === "game" && (
          <div className="h-full flex flex-col bg-[#EDF8F3] overflow-hidden text-slate-900">
            <div className="bg-gradient-to-b from-[#05B075] to-[#029E67] pt-8 px-5 pb-3 rounded-b-[28px] shadow-sm flex items-center justify-between text-white flex-shrink-0">
              <button
                type="button"
                onClick={() => onSetSimScreen("lesson")}
                className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center"
              >
                &larr;
              </button>
              <div className="text-center">
                <h3 className="text-xs font-black">Word Match</h3>
                <p className="text-[9px] text-[#00E5D0] font-mono">Empareja Español ↔ Inglés</p>
              </div>
              <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full font-bold">
                {simGameMatched.length}/3
              </span>
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-center text-[10px] text-[#64748B]">
                  Toca una palabra y luego su traducción correcta:
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  {[
                    { id: "en-1", text: "thought", matchId: "pair-1" },
                    { id: "es-1", text: "pensamiento", matchId: "pair-1" },
                    { id: "en-2", text: "through", matchId: "pair-2" },
                    { id: "es-2", text: "a través de", matchId: "pair-2" },
                    { id: "en-3", text: "schedule", matchId: "pair-3" },
                    { id: "es-3", text: "horario", matchId: "pair-3" },
                  ].map((card) => {
                    const isMatched = simGameMatched.includes(card.matchId);
                    const isSelected = simGameSelected === card.id;

                    return (
                      <button
                        key={card.id}
                        type="button"
                        disabled={isMatched}
                        onClick={() => onSimGameCardClick(card.id, card.matchId)}
                        className={`p-3 rounded-xl text-xs font-bold text-center border transition-all ${
                          isMatched
                            ? "bg-[#D1FAE5] text-[#065F46] border-[#34D399] opacity-60"
                            : isSelected
                            ? "bg-[#05B075] text-white border-[#05B075] shadow-md"
                            : "bg-white border-[#CBD5E1] text-[#0F172A] hover:border-[#05B075]"
                        }`}
                      >
                        {card.text}
                      </button>
                    );
                  })}
                </div>
              </div>

              {simGameMatched.length === 3 && (
                <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl text-center space-y-1">
                  <p className="text-xs font-black text-[#065F46]">
                    ¡Excelente trabajo!
                  </p>
                  <p className="text-[10px] text-[#047857]">
                    Has completado la ronda de discriminación fonética.
                  </p>
                  <button
                    type="button"
                    onClick={onResetSimGame}
                    className="mt-1 px-3 py-1 bg-[#05B075] text-white text-[10px] font-bold rounded-lg"
                  >
                    Reiniciar Minijuego
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
