"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";
import { Course } from "../../types";

interface PricingModalProps {
  isOpen: boolean;
  course: Course;
  onClose: () => void;
  onSavePrice: (newPrice: number) => void;
}

export function PricingModal({ isOpen, course, onClose, onSavePrice }: PricingModalProps) {
  const [price, setPrice] = useState(course.price || 19.99);

  if (!isOpen) return null;

  const teacherShare = (price * 0.7).toFixed(2);
  const platformShare = (price * 0.3).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePrice(price);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-brand" />
            <span>Configurar Precio de Venta (ADR-05)</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-muted hover:text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-1">
            <span className="text-[10px] font-mono text-slate-subtle uppercase">Curso:</span>
            <p className="font-bold text-white text-xs">{course.title}</p>
          </div>

          <div className="space-y-2">
            <label className="block font-semibold text-slate-200">
              Precio de Venta Standalone (USD)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 bg-canvas border border-border-default rounded-xl text-white font-mono text-sm focus:border-emerald-brand outline-none"
            />
            <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span>Regalía Docente (70%):</span>
                <strong className="text-emerald-brand font-mono">${teacherShare} USD</strong>
              </div>
              <div className="flex justify-between">
                <span>WordTap Plataforma (30%):</span>
                <strong className="text-slate-400 font-mono">${platformShare} USD</strong>
              </div>
            </div>
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
              Guardar Tarifa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
