"use client";

import { ApiTeacherApplication } from "@/services/api/teacher-applications";
import { parseSpecialtyTags } from "@/features/dashboard/components/specialty-tags-input";
import {
  CheckCircle,
  XCircle,
  ShieldAlert,
  Trash2,
  RotateCcw,
  Eye,
} from "lucide-react";

interface TeacherApplicationRowProps {
  app: ApiTeacherApplication;
  isItemLoading: boolean;
  onInspect: (app: ApiTeacherApplication) => void;
  onApprove: (app: ApiTeacherApplication) => void;
  onReject: (app: ApiTeacherApplication) => void;
  onOpenSuspendModal: (app: ApiTeacherApplication) => void;
  onReactivate: (app: ApiTeacherApplication) => void;
  onOpenDeleteModal: (app: ApiTeacherApplication) => void;
}

const STATUS_DISPLAY: Record<
  ApiTeacherApplication["status"],
  { label: string; badgeClass: string }
> = {
  approved: {
    label: "Aprobado",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  suspended: {
    label: "Suspendido",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  rejected: {
    label: "Rechazado",
    badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  },
  pending: {
    label: "Pendiente",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
};

export function isTeacherProfileComplete(app: ApiTeacherApplication): boolean {
  const tags = parseSpecialtyTags(app.specialty || "");
  const bio = (app.bio || "").trim();
  return (
    tags.length > 0 &&
    bio.length >= 20 &&
    bio !== "Postulante registrado vía Google en Wordtap Studio"
  );
}

/** Fila individual de postulacion docente con badges de estado y acciones contextuales. */
export function TeacherApplicationRow({
  app,
  isItemLoading,
  onInspect,
  onApprove,
  onReject,
  onOpenSuspendModal,
  onReactivate,
  onOpenDeleteModal,
}: TeacherApplicationRowProps) {
  const tags = parseSpecialtyTags(app.specialty || "");
  const profileComplete = isTeacherProfileComplete(app);

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
          <button
            type="button"
            onClick={() => onInspect(app)}
            className="text-left w-full group cursor-pointer space-y-1"
            title="Ver especialidad y biografía completa"
          >
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className="px-2 py-0.5 rounded-md bg-emerald-brand/10 border border-emerald-brand/25 text-emerald-brand text-[10px] font-semibold"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 2 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-card border border-border-default text-slate-300 text-[10px] font-mono">
                    +{tags.length - 2}
                  </span>
                )}
              </div>
            ) : (
              <p className="font-semibold text-white truncate">Inglés General</p>
            )}
            <p className="text-[11px] text-slate-subtle truncate group-hover:text-slate-200 transition-colors">
              {app.bio || "Registrado vía Google OAuth"}
            </p>
          </button>
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
              (STATUS_DISPLAY[app.status] ?? STATUS_DISPLAY.pending).badgeClass
            }`}
          >
            {(STATUS_DISPLAY[app.status] ?? STATUS_DISPLAY.pending).label}
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
                onClick={() => onInspect(app)}
                className="p-1.5 rounded-xl bg-card border border-border-default text-slate-300 hover:text-white hover:border-emerald-brand/50 transition-colors cursor-pointer"
                title="Ver perfil completo"
              >
                <Eye size={13} />
              </button>
              <button
                type="button"
                disabled={isItemLoading || !profileComplete}
                onClick={() => onApprove(app)}
                title={
                  profileComplete
                    ? "Aprobar postulación docente"
                    : "El postulante aún debe completar su especialidad y biografía (mín. 20 caracteres)"
                }
                className="px-3 py-1.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1 cursor-pointer shadow-glow-emerald disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCircle size={13} />
                <span>{profileComplete ? "Aprobar" : "Perfil incompleto"}</span>
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
