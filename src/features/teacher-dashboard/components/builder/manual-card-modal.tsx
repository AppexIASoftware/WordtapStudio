"use client";

import { useState } from "react";
import { FileEdit } from "lucide-react";
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
  const [itemType, setItemType] = useState<LessonItem["itemType"]>("word");
  const [example, setExample] = useState("");
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEn = en.trim() || "new term";
    const cleanEs = es.trim() || "nuevo término";

    onAddCard({
      en: cleanEn,
      es: cleanEs,
      ipa: ipa.trim() || "/IPA/",
      itemType: itemType || "word",
      example: example.trim(),
      note: note.trim(),
      noteType: "bulb",
    });

    setEn("");
    setEs("");
    setIpa("");
    setExample("");
    setNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-emerald-brand" />
            <span>Redactar Tarjeta Manual</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-muted hover:text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-200 mb-1">
                Término (Inglés)
              </label>
              <input
                type="text"
                required
                value={en}
                onChange={(e) => setEn(e.target.value)}
                placeholder="Ej: know"
                className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-200 mb-1">
                Traducción (Español)
              </label>
              <input
                type="text"
                required
                value={es}
                onChange={(e) => setEs(e.target.value)}
                placeholder="Ej: saber / conocer"
                className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-200 mb-1">
                Transcripción (IPA)
              </label>
              <input
                type="text"
                value={ipa}
                onChange={(e) => setIpa(e.target.value)}
                placeholder="/noʊ/"
                className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-mint-brand font-mono outline-none focus:border-emerald-brand"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-200 mb-1">
                Tipo de Elemento
              </label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value as LessonItem["itemType"])}
                className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 outline-none focus:border-emerald-brand"
              >
                <option value="word">word</option>
                <option value="phrase">phrase</option>
                <option value="grammar">grammar</option>
                <option value="tip">tip</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">
              Oración de Ejemplo
            </label>
            <input
              type="text"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder='"I know the truth"'
              className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand italic"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">
              Nota Pedagógica
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Indica certeza o conocimiento"
              className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold shadow-glow-emerald cursor-pointer"
            >
              Añadir Tarjeta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
