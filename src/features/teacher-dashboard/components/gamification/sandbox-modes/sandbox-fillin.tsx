"use client";

import { useState } from "react";
import { SandboxEngineProps } from "./sandbox-types";
import { Sparkles } from "lucide-react";

const FILLIN_QUESTIONS = [
  {
    sentenceBefore: "To master a new language, students need great",
    target: "patience",
    sentenceAfter: "and consistent daily review.",
    translation: "Para dominar un nuevo idioma, los alumnos necesitan gran paciencia y repaso diario.",
    options: ["patience", "haste", "doubt", "fear"],
  },
  {
    sentenceBefore: "Her speech sounded native because of her exceptional",
    target: "fluency",
    sentenceAfter: "and rhythm.",
    translation: "Su discurso sonaba nativo debido a su excepcional fluidez y ritmo.",
    options: ["fluency", "silence", "hesitation", "stumble"],
  },
  {
    sentenceBefore: "Developing emotional",
    target: "resilience",
    sentenceAfter: "helps learners overcome mistakes quickly.",
    translation: "Desarrollar resiliencia emocional ayuda a superar errores rápidamente.",
    options: ["resilience", "fragility", "anger", "fatigue"],
  },
];

export function SandboxFillin({
  onCorrect,
  onMistake,
  onWin,
}: SandboxEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = FILLIN_QUESTIONS[currentIndex] || FILLIN_QUESTIONS[0];

  const handleSelect = (option: string) => {
    if (option === current.target) {
      onCorrect(20);
      if (currentIndex + 1 >= FILLIN_QUESTIONS.length) {
        onWin();
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    } else {
      onMistake();
    }
  };

  return (
    <div className="w-full space-y-4 text-center">
      <div className="flex justify-between items-center text-slate-muted text-[11px] font-semibold px-1">
        <span>Fill-in Blank: Desafío {currentIndex + 1} de {FILLIN_QUESTIONS.length}</span>
        <span className="text-mint-brand font-mono text-[10px] flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Cloze Test
        </span>
      </div>

      <div className="p-5 bg-canvas/80 rounded-2xl border border-border-default/60 space-y-3">
        <p className="text-sm font-medium text-slate-200 leading-relaxed">
          &quot;{current.sentenceBefore}{" "}
          <span className="inline-block px-3 py-0.5 rounded-lg border-2 border-dashed border-mint-brand text-mint-brand font-mono font-bold">
            _____
          </span>{" "}
          {current.sentenceAfter}&quot;
        </p>
        <p className="text-xs text-slate-muted">
          Traducción: {current.translation}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2">
        {current.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleSelect(opt)}
            className="p-3 rounded-xl bg-card border border-border-default hover:border-mint-brand text-slate-200 hover:text-white font-bold text-xs transition-colors cursor-pointer"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
