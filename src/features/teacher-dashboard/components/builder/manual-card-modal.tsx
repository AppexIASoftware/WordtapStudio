"use client";

import { useState } from "react";
import { FileEdit, Volume2, Plus, X } from "lucide-react";
import { LessonItem } from "../../types";

interface ManualCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: Omit<LessonItem, "id">) => void;
}

export function ManualCardModal({ isOpen, onClose, onAddCard }: ManualCardModalProps) {
  const [en, setEn] = useState("");
  const [es, setEs] = useState("");
  const [ipa, setIpa] = useState("");
  const [pos, setPos] = useState("");
  const [itemType, setItemType] = useState<LessonItem["itemType"]>("word");
  const [example, setExample] = useState("");
  const [note, setNote] = useState("");
  const [noteType, setNoteType] = useState<"bulb" | "pin">("bulb");

  if (!isOpen) return null;

  const handleSpeak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && text) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEn = en.trim() || "new term";
    const cleanEs = es.trim() || "nuevo término";

    onAddCard({
      en: cleanEn,
      es: cleanEs,
      ipa: ipa.trim() || "/IPA/",
      pos: pos.trim(),
      itemType: itemType || "word",
      example: example.trim(),
      note: note.trim(),
      noteType,
    });

    setEn("");
    setEs("");
    setIpa("");
    setPos("");
    setExample("");
    setNote("");
    setNoteType("bulb");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-card border border-border-default rounded-3xl overflow-hidden shadow-2xl space-y-0">
        {/* Cabecera idéntica al formulario de edición */}
        <div className="p-4 border-b border-border-default bg-card-hover/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center font-bold">
              <FileEdit className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Añadir Nueva Tarjeta de Lección
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-brand/15 text-emerald-brand border border-emerald-brand/25">
                  Borrador
                </span>
              </div>
              <p className="text-[11px] text-slate-subtle">
                Definí el término pedagógico, traducción, pronunciación y ejemplo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-subtle font-mono">Tipo:</span>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value as LessonItem["itemType"])}
                className="bg-canvas border border-border-default rounded-xl px-3 py-1.5 text-xs text-mint-brand font-mono font-semibold cursor-pointer focus:outline-none focus:border-emerald-brand"
              >
                <option value="word">word (Vocabulario)</option>
                <option value="phrase">phrase (Frase)</option>
                <option value="grammar">grammar (Gramática)</option>
                <option value="tip">tip (Consejo)</option>
                <option value="exercise">exercise (Puzzle)</option>
              </select>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-muted hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formulario en 2 columnas idéntico */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna Izquierda */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Término / Palabra en Inglés (Target)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={en}
                    onChange={(e) => setEn(e.target.value)}
                    className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-brand pr-10"
                    placeholder="Ej: be, take, have, know..."
                  />
                  <button
                    type="button"
                    onClick={() => handleSpeak(en)}
                    className="absolute right-3 top-2.5 p-1 text-slate-muted hover:text-mint-brand transition-colors cursor-pointer"
                    title="Escuchar pronunciación"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Traducción al Español (Prompt)
                </label>
                <input
                  type="text"
                  required
                  value={es}
                  onChange={(e) => setEs(e.target.value)}
                  className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-emerald-brand"
                  placeholder="Ej: ser / estar, saber / conocer..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Transcripción Fonética (IPA)
                  </label>
                  <input
                    type="text"
                    value={ipa}
                    onChange={(e) => setIpa(e.target.value)}
                    className="w-full bg-canvas border border-border-default rounded-xl px-3.5 py-2.5 text-xs font-mono text-mint-brand focus:outline-none focus:border-emerald-brand"
                    placeholder="/noʊ/"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Categoría Gramatical
                  </label>
                  <input
                    type="text"
                    value={pos}
                    onChange={(e) => setPos(e.target.value)}
                    className="w-full bg-canvas border border-border-default rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-brand"
                    placeholder="Verbo irregular..."
                  />
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Oración de Ejemplo en Contexto
                </label>
                <textarea
                  rows={3}
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                  className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-brand italic resize-none"
                  placeholder='Ej: "I know the answer to this question"'
                />
              </div>

              {/* Nota Pedagógica / Tip */}
              <div className="p-4 rounded-xl bg-canvas border border-border-default space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="text-amber-400">💡</span>
                    <span>Nota Pedagógica / Tip</span>
                  </span>
                  <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-muted hover:text-white">
                      <input
                        type="radio"
                        name="modalNoteType"
                        value="bulb"
                        checked={noteType !== "pin"}
                        onChange={() => setNoteType("bulb")}
                        className="accent-emerald-brand"
                      />
                      <span>Foco (Tip)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-muted hover:text-white">
                      <input
                        type="radio"
                        name="modalNoteType"
                        value="pin"
                        checked={noteType === "pin"}
                        onChange={() => setNoteType("pin")}
                        className="accent-emerald-brand"
                      />
                      <span>Pin (Importante)</span>
                    </label>
                  </div>
                </div>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-card border border-border-default rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-brand"
                  placeholder="Nota de aprendizaje o advertencia..."
                />
              </div>
            </div>
          </div>

          {/* Pie de acciones idéntico */}
          <div className="p-4 bg-card-hover/40 border-t border-border-default flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-canvas border border-border-default hover:text-white text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Tarjeta a la Lección</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
