"use client";

import { useState } from "react";
import { X, Sparkles, AlertTriangle, Send, Check } from "lucide-react";
import { StumbleItem } from "@/features/teacher-dashboard/types";

interface StumbleReinforcementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stumbles: StumbleItem[];
  classroomName: string;
  studentsCount: number;
  triggerToast: (msg: string) => void;
}

export function StumbleReinforcementDrawer({
  isOpen,
  onClose,
  stumbles,
  classroomName,
  studentsCount,
  triggerToast,
}: StumbleReinforcementDrawerProps) {
  const [selectedTerms, setSelectedTerms] = useState<string[]>(
    stumbles.map((s) => s.term)
  );
  const [selectedGame, setSelectedGame] = useState("match");
  const [targetDuration, setTargetDuration] = useState("5");

  if (!isOpen) return null;

  const toggleTerm = (term: string) => {
    setSelectedTerms((prev) =>
      prev.includes(term)
        ? prev.length > 1
          ? prev.filter((t) => t !== term)
          : prev
        : [...prev, term]
    );
  };

  const handleLaunch = () => {
    triggerToast(
      `¡Desafío de refuerzo (${selectedTerms.length} términos) enviado a los ${studentsCount} alumnos de "${classroomName}"!`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-md bg-card border-l border-border-default h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-border-default pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Sesión de Refuerzo Express</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Demo
                  </span>
                </h3>
                <p className="text-[11px] text-slate-muted">Aula: {classroomName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-muted hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Términos Críticos a Incluir */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Términos con Alta Tasa de Fallo</span>
              </label>
              <span className="text-[10px] text-slate-muted">
                {selectedTerms.length} seleccionados
              </span>
            </div>

            <div className="space-y-2">
              {stumbles.map((st) => {
                const isSelected = selectedTerms.includes(st.term);
                return (
                  <div
                    key={st.term}
                    onClick={() => toggleTerm(st.term)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500/40 text-white"
                        : "bg-canvas border-border-default text-slate-400 opacity-60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono">{st.term}</span>
                        <span className="text-[10px] font-mono font-bold text-rose-400">
                          {st.failRate} Fallo
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-muted mt-0.5">{st.desc}</p>
                    </div>

                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center ${
                        isSelected ? "bg-amber-400 text-canvas" : "border border-slate-600"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modo de Minijuego para el Refuerzo */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white block">
              Modo de Juego de Práctica
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: "match", label: "WordMatch Contrarreloj" },
                { id: "speed", label: "Speed Translation" },
                { id: "scramble", label: "Word Scramble (Anagramas)" },
                { id: "listening", label: "Listening Quiz Fonético" },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGame(g.id)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all text-[11px] ${
                    selectedGame === g.id
                      ? "bg-emerald-brand/10 border-emerald-brand text-white font-bold"
                      : "bg-canvas border-border-default text-slate-400 hover:text-white"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duración de la sesión */}
          <div>
            <label className="text-xs font-bold text-white block mb-1">
              Tiempo Límite de la Práctica
            </label>
            <select
              value={targetDuration}
              onChange={(e) => setTargetDuration(e.target.value)}
              className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-xs text-white outline-none focus:border-emerald-brand"
            >
              <option value="3">3 Minutos (Rápido)</option>
              <option value="5">5 Minutos (Recomendado)</option>
              <option value="10">10 Minutos (Intensivo)</option>
            </select>
          </div>
        </div>

        {/* Acciones del Drawer */}
        <div className="pt-4 border-t border-border-default space-y-2">
          <button
            type="button"
            onClick={handleLaunch}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-canvas font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Lanzar Desafío a la Cohorte</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
