"use client";

import { ModeratorPR } from "../types";

interface Props {
  items: ModeratorPR[];
  selectedId: string;
  isHistory: boolean;
  isApprovedOnly?: boolean;
  onOpen: (id: string) => void;
}

export function ApprovalsTable({ items, selectedId, isHistory, isApprovedOnly, onOpen }: Props) {
  return (
    <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-sm text-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
            <tr>
              <th className="p-3.5">Solicitud</th><th className="p-3.5">Curso</th>
              <th className="p-3.5">Docente Autor</th><th className="p-3.5">{isHistory ? "Fecha de decisión" : "Espera"}</th>
              <th className="p-3.5">Cambios</th><th className="p-3.5">{isHistory ? "Revisor" : "Asignado a"}</th>
              <th className="p-3.5">Estado</th><th className="p-3.5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {items.length === 0 ? (
              <tr><td colSpan={8} className="p-8 text-center text-slate-400">{isApprovedOnly ? "Aún no hay aprobaciones registradas." : isHistory ? "Aún no hay revisiones registradas." : "No hay solicitudes en esta bandeja."}</td></tr>
            ) : items.map((pr) => (
              <tr key={pr.originalId || pr.id} onClick={() => onOpen(pr.id)} className={`cursor-pointer transition-colors ${pr.id === selectedId ? "bg-blue-500/10" : "hover:bg-card-hover/40"}`}>
                <td className="p-3.5 font-bold font-mono text-mint-brand">{pr.id}</td>
                <td className="p-3.5 font-semibold text-white">{pr.title}</td>
                <td className="p-3.5 text-slate-300">{pr.author}</td>
                <td className="p-3.5 font-mono text-slate-muted">{isHistory ? pr.reviewedAt || "—" : pr.waitHours}</td>
                <td className="p-3.5 text-slate-300">{pr.changesCount}</td>
                <td className="p-3.5 text-slate-300">{pr.reviewer}</td>
                <td className="p-3.5"><span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${pr.status === "approved" ? "bg-emerald-brand/20 text-emerald-brand border-emerald-brand/30" : "bg-amber-500/20 text-amber-300 border-amber-500/30"}`}>{pr.statusLabel}</span></td>
                <td className="p-3.5 text-right"><button type="button" onClick={(e) => { e.stopPropagation(); onOpen(pr.id); }} className="px-3 py-1 rounded-lg bg-canvas border border-border-default hover:border-blue-400 text-blue-300 hover:text-white text-xs font-semibold cursor-pointer">{isHistory ? "Ver" : "Auditar"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
