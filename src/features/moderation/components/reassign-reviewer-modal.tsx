"use client";

import { useState } from "react";
import { UserCheck } from "lucide-react";

interface ReassignReviewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reviewer: string) => void;
}

export function ReassignReviewerModal({
  isOpen,
  onClose,
  onConfirm,
}: ReassignReviewerModalProps) {
  const [selectedReviewer, setSelectedReviewer] = useState("Lic. Elena Ramos");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>Reasignar Revisor Pedagógico</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-muted hover:text-white font-bold"
          >
            &times;
          </button>
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-slate-200">Seleccionar Moderador:</label>
          <select
            value={selectedReviewer}
            onChange={(e) => setSelectedReviewer(e.target.value)}
            className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 outline-none focus:border-blue-400 cursor-pointer"
          >
            <option value="Lic. Elena Ramos">Lic. Elena Ramos (Tú)</option>
            <option value="Prof. David Chen">Prof. David Chen (Especialista Fonética)</option>
            <option value="Bandeja Abierta">Devolver a Bandeja Abierta (Sin Asignar)</option>
          </select>
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
            type="button"
            onClick={() => onConfirm(selectedReviewer)}
            className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold cursor-pointer"
          >
            Confirmar Reasignación
          </button>
        </div>
      </div>
    </div>
  );
}
