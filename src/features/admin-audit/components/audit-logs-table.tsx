"use client";

import { ChevronRight } from "lucide-react";
import { AuditEvent } from "../types";

interface AuditLogsTableProps {
  events: AuditEvent[];
  onSelectEvent: (event: AuditEvent) => void;
}

/** Tabla completa de eventos de la bitacora. */
export function AuditLogsTable({ events, onSelectEvent }: AuditLogsTableProps) {
  return (
    <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-card-soft text-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
            <tr>
              <th className="p-3.5">Timestamp (UTC)</th>
              <th className="p-3.5">Actor (Usuario / Rol)</th>
              <th className="p-3.5">IP de Origen</th>
              <th className="p-3.5">Acción / Evento</th>
              <th className="p-3.5">Entidad Afectada</th>
              <th className="p-3.5">Resumen de la Operación</th>
              <th className="p-3.5 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default font-medium">
            {events.map((evt) => (
              <tr
                key={evt.id}
                className="hover:bg-card-hover/50 transition-colors"
              >
                <td className="p-3.5 whitespace-nowrap">
                  <div className="font-mono text-white text-xs">
                    {evt.timestamp_utc.split(" ")[1] || "12:00:00"}
                  </div>
                  <div className="text-[10px] text-slate-subtle font-mono">
                    {evt.time_ago}
                  </div>
                </td>

                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold font-mono text-[10px]">
                      {evt.actor_avatar}
                    </div>
                    <div>
                      <p className="font-bold text-white">
                        {evt.actor_name}{" "}
                        <span className="text-[9px] font-normal px-1 py-0.2 rounded bg-card text-slate-300 border border-border-default font-mono">
                          {evt.actor_role}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-subtle font-mono">
                        {evt.actor_email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-3.5 font-mono text-mint-brand text-[11px] whitespace-nowrap">
                  {evt.ip_address}
                </td>

                <td className="p-3.5 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      evt.badgeColor === "emerald"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : evt.badgeColor === "amber"
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : evt.badgeColor === "purple"
                        ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                        : "bg-teal-500/20 text-teal-400 border-teal-500/30"
                    }`}
                  >
                    {evt.badge}
                  </span>
                </td>

                <td className="p-3.5 font-mono text-slate-200 text-xs">
                  {evt.entity_id}
                </td>

                <td
                  className="p-3.5 text-slate-300 text-xs max-w-xs truncate"
                  title={evt.summary}
                >
                  {evt.summary}
                </td>

                <td className="p-3.5 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onSelectEvent(evt)}
                    className="px-3 py-1.5 rounded-lg bg-canvas border border-border-default hover:border-purple-500/40 text-purple-300 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                  >
                    <span>Inspeccionar</span>
                    <ChevronRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
