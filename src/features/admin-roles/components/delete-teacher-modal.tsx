"use client";

import React from "react";
import { Trash2, X, Loader2, AlertTriangle } from "lucide-react";

interface DeleteTeacherModalProps {
  isOpen: boolean;
  teacherName: string;
  teacherEmail: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isLoading: boolean;
}

export function DeleteTeacherModal({
  isOpen,
  teacherName,
  teacherEmail,
  onClose,
  onConfirm,
  isLoading,
}: DeleteTeacherModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
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
            <Trash2 size={20} />
          </div>
          <div>
            <h3 id="delete-modal-title" className="text-base font-bold text-white tracking-tight">
              Eliminar Registro Docente
            </h3>
            <p className="text-xs text-slate-muted mt-0.5 leading-relaxed">
              Esta acción revocará los privilegios de docente y eliminará la postulación de la plataforma.
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
            A eliminar
          </span>
        </div>

        {/* Advertencia destructiva */}
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle size={14} className="flex-shrink-0" />
            <span>Acción Destructiva Irreversible</span>
          </div>
          <p className="text-[11px] text-rose-200/80 leading-relaxed">
            El usuario volverá al rol estándar de estudiante y se invalidarán de inmediato todas las sesiones activas en Wordtap Studio.
          </p>
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
            type="button"
            onClick={() => onConfirm()}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-500/20 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <Trash2 size={13} />
                <span>Confirmar Eliminación</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
