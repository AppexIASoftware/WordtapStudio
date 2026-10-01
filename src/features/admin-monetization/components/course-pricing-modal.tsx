"use client";

import React, { useState, useEffect } from "react";
import { X, DollarSign, Check, Info } from "lucide-react";
import { TeacherCoursePricing } from "../types";

interface CoursePricingModalProps {
  course: TeacherCoursePricing | null;
  teacherSplitPct: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseId: string, newPrice: number) => void;
}

export function CoursePricingModal({
  course,
  teacherSplitPct,
  isOpen,
  onClose,
  onSave,
}: CoursePricingModalProps) {
  const [standaloneEnabled, setStandaloneEnabled] = useState(true);
  const [price, setPrice] = useState("19.99");

  useEffect(() => {
    if (course) {
      setPrice(course.price > 0 ? course.price.toFixed(2) : "19.99");
      setStandaloneEnabled(course.price > 0);
    }
  }, [course]);

  if (!isOpen || !course) return null;

  const numPrice = standaloneEnabled ? parseFloat(price) || 0 : 0;
  const teacherCut = (numPrice * (teacherSplitPct / 100)).toFixed(2);
  const platformCut = (numPrice * ((100 - teacherSplitPct) / 100)).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(course.id, numPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl relative overflow-hidden">
        {/* Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-brand via-mint-brand to-purple-500 absolute top-0 left-0" />

        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center font-bold">
              <DollarSign size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Comercialización & Precio del Curso</h3>
              <p className="text-[10px] text-slate-muted font-mono">
                ADR-05: Venta Directa & Split {teacherSplitPct}/{100 - teacherSplitPct}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-canvas text-slate-muted hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Resumen del Curso */}
        <div className="p-3.5 bg-canvas rounded-2xl border border-border-default space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-muted">Curso Seleccionado:</span>
            <strong className="text-white text-xs font-semibold">{course.title}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-muted">Nivel CEFR:</span>
            <span className="text-mint-brand font-mono text-xs font-bold">{course.level}</span>
          </div>
        </div>

        {/* Canales de Distribución */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Canal 1: Suscripción Global (Inmutable para docente) */}
          <div className="p-3 rounded-xl bg-card border border-border-default flex items-start gap-3">
            <div className="mt-0.5">
              <input
                type="checkbox"
                checked
                disabled
                className="accent-emerald-brand w-4 h-4 rounded cursor-not-allowed"
              />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-white">Pool de Suscripción Global WordTap ($9.99/mes)</p>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-brand/20 text-emerald-brand font-bold">
                  Activo
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Tus lecciones aprobadas generan regalías por tiempo de juego de los suscriptores. Administrado por la plataforma.
              </p>
            </div>
          </div>

          {/* Canal 2: Venta Individual Directa (Configurable) */}
          <div className="p-3.5 rounded-xl bg-canvas border border-emerald-brand/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Venta Individual Directa (Pago Único)</p>
                <p className="text-[11px] text-slate-400">Permite a los alumnos comprar solo este curso de por vida.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={standaloneEnabled}
                  onChange={(e) => setStandaloneEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-brand" />
              </label>
            </div>

            {standaloneEnabled ? (
              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-[11px]">
                  Precio al Público (USD):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 text-slate-400 font-mono font-bold">$</span>
                  <input
                    type="number"
                    step="0.50"
                    min="4.99"
                    max="99.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-card border border-border-default rounded-xl pl-8 pr-3.5 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-brand"
                    placeholder="19.99"
                  />
                </div>
                <p className="text-[10px] text-slate-subtle mt-1 font-mono">
                  Rango canónico permitido: $4.99 - $99.99 USD
                </p>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-card text-[11px] text-amber-300 flex items-center gap-1.5 font-medium">
                <Info size={13} className="flex-shrink-0" />
                <span>Curso disponible únicamente mediante el catálogo global.</span>
              </div>
            )}

            {/* Split Calculator Live Box */}
            {standaloneEnabled && (
              <div className="p-3 bg-card rounded-xl border border-border-default space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-muted">Precio Final al Alumno:</span>
                  <span className="text-white font-bold">${numPrice.toFixed(2)} USD</span>
                </div>
                <div className="flex items-center justify-between text-emerald-brand">
                  <span className="font-bold">Tu Pago Neto ({teacherSplitPct}%):</span>
                  <span className="font-black text-xs">${teacherCut} USD</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>Retención WordTap ({100 - teacherSplitPct}%):</span>
                  <span>${platformCut} USD</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-muted hover:text-white font-semibold cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
