"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, X, Loader2, AlertTriangle } from "lucide-react";

interface SuspendTeacherModalProps {
  isOpen: boolean;
  teacherName: string;
  teacherEmail: string;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
  isLoading: boolean;
}

export function SuspendTeacherModal({
  isOpen,
  teacherName,
  teacherEmail,
  onClose,
  onConfirm,
  isLoading,
}: SuspendTeacherModalProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("Suspensión administrativa preventiva.");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || isLoading) return;
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-subtle hover:text-white hover:bg-card-hover transition-colors cursor-pointer disabled:opacity-50"
        >
          <X size={16} />
        </button>

        {/* Encabezado */}
        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 id="modal-title" className="text-base font-bold text-white tracking-tight">
              Suspender Cuenta Docente
            </h3>
            <p className="text-xs text-slate-muted mt-0.5 leading-relaxed">
              Esta acción revocará inmediatamente las sesiones activas y bloqueará el acceso al portal.
            </p>
          </div>
        </div>

        {/* Ficha del docente afectado */}
        <div className="p-3 rounded-2xl bg-canvas border border-border-default flex items-center justify-between">
          <div className="truncate">
            <p className="text-xs font-bold text-white truncate">{teacherName || "Docente"}</p>
            <p className="text-[11px] text-slate-subtle font-mono truncate">{teacherEmail}</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            A suspender
          </span>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="suspension-reason" className="block text-xs font-semibold text-slate-200">
              Motivo de la suspensión <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="suspension-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ingresa el motivo específico de la suspensión..."
              disabled={isLoading}
              className="w-full bg-canvas border border-border-default rounded-xl p-3 text-xs text-white placeholder:text-slate-muted focus:outline-none focus:border-rose-500/60 transition-colors resize-none disabled:opacity-50"
              required
            />
            <div className="flex items-center gap-1.5 text-[11px] text-amber-300/80">
              <AlertTriangle size={12} className="flex-shrink-0" />
              <span>Este motivo será mostrado al docente al intentar iniciar sesión.</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-muted hover:text-white hover:bg-card-hover transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !reason.trim()}
              className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Suspendiendo...</span>
                </>
              ) : (
                <>
                  <ShieldAlert size={13} />
                  <span>Confirmar Suspensión</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
