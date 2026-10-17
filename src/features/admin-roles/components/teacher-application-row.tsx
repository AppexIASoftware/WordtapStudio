"use client";

import { ApiTeacherApplication } from "@/services/api/teacher-applications";
import {
  CheckCircle,
  XCircle,
  ShieldAlert,
  Trash2,
  RotateCcw,
} from "lucide-react";

interface TeacherApplicationRowProps {
  app: ApiTeacherApplication;
  isItemLoading: boolean;
  onApprove: (app: ApiTeacherApplication) => void;
  onReject: (app: ApiTeacherApplication) => void;
  onOpenSuspendModal: (app: ApiTeacherApplication) => void;
  onReactivate: (app: ApiTeacherApplication) => void;
  onOpenDeleteModal: (app: ApiTeacherApplication) => void;
}

/** Fila individual de postulacion docente con badges de estado y acciones contextuales. */
export function TeacherApplicationRow({
  app,
  isItemLoading,
  onApprove,
  onReject,
  onOpenSuspendModal,
  onReactivate,
  onOpenDeleteModal,
}: TeacherApplicationRowProps) {
  return (
      <tr key={app.id} className="hover:bg-card-hover/40 transition-colors">
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-brand/10 border border-emerald-brand/30 text-emerald-brand font-bold flex items-center justify-center text-xs">
              {app.user?.name ? app.user.name.slice(0, 2).toUpperCase() : "WT"}
            </div>
            <div>
              <p className="font-bold text-white text-xs">{app.user?.name || "Sin nombre"}</p>
              <p className="text-[11px] text-slate-subtle font-mono">{app.user?.email || "Sin email"}</p>
            </div>
          </div>
        </td>

        <td className="py-3 px-4 max-w-xs">
          <p className="font-semibold text-white truncate">{app.specialty || "Inglés General"}</p>
          <p className="text-[11px] text-slate-subtle truncate">{app.bio || "Registrado vía Google OAuth"}</p>
        </td>

        <td className="py-3 px-4 font-mono text-slate-subtle text-[11px]">
          {new Date(app.created_at).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>

        <td className="py-3 px-4">
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border ${
              app.status === "approved"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : app.status === "suspended"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : app.status === "rejected"
                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                : "bg-blue-500/10 text-blue-400 border-blue-500/30"
            }`}
          >
            {app.status}
          </span>
          {app.rejection_reason && (
            <p className="text-[10px] text-rose-400 mt-1 truncate max-w-xs">
              Motivo: {app.rejection_reason}
            </p>
          )}
        </td>

        <td className="py-3 px-4 text-right">
          {app.status === "pending" ? (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isItemLoading}
                onClick={() => onApprove(app)}
                className="px-3 py-1.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1 cursor-pointer shadow-glow-emerald disabled:opacity-50"
              >
                <CheckCircle size={13} />
                <span>Aprobar</span>
              </button>

              <button
                type="button"
                disabled={isItemLoading}
                onClick={() => onReject(app)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold text-xs hover:bg-rose-500/20 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <XCircle size={13} />
                <span>Rechazar</span>
              </button>
            </div>
          ) : app.status === "approved" ? (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isItemLoading}
                onClick={() => onOpenSuspendModal(app)}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs hover:bg-amber-500/20 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Suspender cuenta e invalidar sesiones"
              >
                <ShieldAlert size={12} />
                <span>Suspender</span>
              </button>
              <button
                type="button"
                disabled={isItemLoading}
                onClick={() => onOpenDeleteModal(app)}
                className="p-1.5 rounded-xl text-slate-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                title="Eliminar postulación y revocar permisos"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ) : app.status === "suspended" ? (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isItemLoading}
                onClick={() => onReactivate(app)}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1 cursor-pointer shadow-glow-emerald disabled:opacity-50"
                title="Restablecer cuenta docente"
              >
                <RotateCcw size={12} />
                <span>Reactivar</span>
              </button>
              <button
                type="button"
                disabled={isItemLoading}
                onClick={() => onOpenDeleteModal(app)}
                className="p-1.5 rounded-xl text-slate-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                title="Eliminar registro permanentemente"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isItemLoading}
                onClick={() => onApprove(app)}
                className="px-2.5 py-1.5 rounded-xl bg-card border border-border-default hover:border-emerald-brand text-xs text-slate-300 hover:text-emerald-brand transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Reconsiderar y autorizar"
              >
                <CheckCircle size={12} />
                <span>Aprobar</span>
              </button>
              <button
                type="button"
                disabled={isItemLoading}
                onClick={() => onOpenDeleteModal(app)}
                className="p-1.5 rounded-xl text-slate-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                title="Eliminar registro"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </td>
      </tr>
  );
}
