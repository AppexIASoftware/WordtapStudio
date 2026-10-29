"use client";

import { useEffect, useRef } from "react";
import { Archive, Trash2 } from "lucide-react";
import type { TeacherGameDTO } from "@/services/api/types";

export function ConfirmRemoveModal({ game, busy, onCancel, onConfirm }: {
  game: TeacherGameDTO; busy: boolean; onCancel: () => void; onConfirm: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const archived = (game.usage_count ?? 0) > 0;
  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    return () => { if (node?.open) node.close(); };
  }, []);
  return (
    <dialog ref={dialog} onCancel={(event) => { event.preventDefault(); if (!busy) onCancel(); }} aria-labelledby="remove-game-title" aria-describedby="remove-game-description" className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-border-default bg-card p-0 text-white shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm">
      <div className="space-y-5 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-rose-400">{archived ? <Archive size={20} /> : <Trash2 size={20} />}</div>
          <div><h2 id="remove-game-title" className="text-base font-bold">{archived ? "Archivar juego" : "Eliminar juego"}</h2><p className="mt-1 text-sm text-slate-300">{game.title}</p></div>
        </div>
        <p id="remove-game-description" className="text-sm leading-relaxed text-slate-300">
          {archived ? `Este juego está vinculado a ${game.usage_count} lección(es). Se conservarán los vínculos, pero dejará de estar disponible para los alumnos y para nuevas lecciones.` : "Este juego no está vinculado a ninguna lección y se eliminará de forma permanente."}
        </p>
        <div className="flex justify-end gap-2 border-t border-border-default pt-4">
          <button type="button" autoFocus disabled={busy} onClick={onCancel} className="rounded-xl border border-border-default px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-50">Cancelar</button>
          <button type="button" disabled={busy} onClick={onConfirm} className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white hover:bg-rose-600 disabled:opacity-50">{busy ? "Guardando..." : archived ? "Archivar juego" : "Eliminar juego"}</button>
        </div>
      </div>
    </dialog>
  );
}
