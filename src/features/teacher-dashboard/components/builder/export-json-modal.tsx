"use client";

import { Download } from "lucide-react";
import { Course } from "../../types";

interface ExportJsonModalProps {
  isOpen: boolean;
  course: Course;
  onClose: () => void;
  onCopied: () => void;
}

export function ExportJsonModal({ isOpen, course, onClose, onCopied }: ExportJsonModalProps) {
  if (!isOpen) return null;

  const jsonStr = JSON.stringify(course, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    onCopied();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-brand" />
            <span>Exportar Copia de Seguridad JSON</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-muted hover:text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
        <textarea
          readOnly
          rows={12}
          value={jsonStr}
          className="w-full p-3.5 bg-canvas font-mono text-[11px] text-emerald-brand rounded-2xl border border-border-default outline-none resize-none"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-semibold cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold shadow-glow-emerald cursor-pointer"
          >
            Copiar JSON
          </button>
        </div>
      </div>
    </div>
  );
}
