import React from "react";
import { Users } from "lucide-react";
import { StaffMember } from "../types";

interface StaffDirectoryTableProps {
  staffList: StaffMember[];
  onNotify: (msg: string) => void;
  onToggleAccess: (member: StaffMember) => void;
  onRevokeInvite: (id: string, name: string) => void;
}

export function StaffDirectoryTable({
  staffList,
  onNotify,
  onToggleAccess,
  onRevokeInvite,
}: StaffDirectoryTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Users size={16} className="text-emerald-brand" />
          <span>Equipo Autorizado (Docentes & Moderadores)</span>
        </h3>
        <span className="text-xs font-mono text-slate-subtle">
          {staffList.length} miembros registrados
        </span>
      </div>

      <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-card-soft text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Usuario Staff</th>
                <th className="p-3.5">Rol en Sistema</th>
                <th className="p-3.5">Alcance / Idiomas</th>
                <th className="p-3.5">Cuota de Borradores</th>
                <th className="p-3.5">Estado de Acceso</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default font-medium">
              {staffList.map((member) => {
                const isPending = member.status === "Invitación Pendiente";
                const isSuspended = member.status === "Suspendido";

                return (
                  <tr
                    key={member.id}
                    className="hover:bg-card-hover/50 transition-colors"
                  >
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold font-mono text-xs flex-shrink-0 ${member.avatarBg}`}
                        >
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-white">{member.name}</p>
                          <p className="text-[10px] text-slate-subtle font-mono">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-[10.5px] ${
                          member.role === "Docente"
                            ? "bg-emerald-brand/20 text-emerald-brand"
                            : member.role === "Moderador"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-200">{member.scope}</td>

                    <td className="p-3.5 font-mono text-slate-300">
                      {member.quota}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          isPending
                            ? "bg-amber-500/20 text-amber-300"
                            : isSuspended
                            ? "bg-rose-500/20 text-rose-300"
                            : "bg-emerald-brand/20 text-emerald-brand"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      {isPending ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              onNotify(`Enlace de invitación reenviado a ${member.email}`)
                            }
                            className="text-xs text-mint-brand hover:underline mr-2.5 cursor-pointer font-semibold"
                          >
                            Reenviar
                          </button>
                          <button
                            type="button"
                            onClick={() => onRevokeInvite(member.id, member.name)}
                            className="text-xs text-slate-500 hover:underline cursor-pointer"
                          >
                            Revocar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => onToggleAccess(member)}
                            className={`text-xs hover:underline mr-2.5 cursor-pointer font-semibold ${
                              isSuspended
                                ? "text-emerald-brand"
                                : "text-rose-400"
                            }`}
                          >
                            {isSuspended ? "Reactivar" : "Suspender"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onNotify(`Editando cuota y alcance de ${member.name}`)
                            }
                            className="text-xs text-emerald-brand hover:underline cursor-pointer"
                          >
                            Editar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
