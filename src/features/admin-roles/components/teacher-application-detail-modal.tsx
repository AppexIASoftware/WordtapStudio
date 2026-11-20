"use client";

import { ApiTeacherApplication } from "@/services/api/teacher-applications";
import { parseSpecialtyTags } from "@/features/dashboard/components/specialty-tags-input";
import { isTeacherProfileComplete } from "./teacher-application-row";
import { X, GraduationCap, CheckCircle, XCircle, Calendar, AlertTriangle } from "lucide-react";

interface TeacherApplicationDetailModalProps {
  application: ApiTeacherApplication | null;
  onClose: () => void;
  onApprove: (app: ApiTeacherApplication) => void;
  onReject: (app: ApiTeacherApplication) => void;
}

export function TeacherApplicationDetailModal({
  application,
  onClose,
  onApprove,
  onReject,
}: TeacherApplicationDetailModalProps) {
  if (!application) return null;

  const tags = parseSpecialtyTags(application.specialty || "");
  const isPending = application.status === "pending";
  const profileComplete = isTeacherProfileComplete(application);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border-default shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-emerald-brand/15 border border-emerald-brand/30 text-emerald-brand font-bold flex items-center justify-center text-sm flex-shrink-0">
              {application.user?.name
                ? application.user.name.slice(0, 2).toUpperCase()
                : "WT"}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">
                {application.user?.name || "Postulante"}
              </h3>
              <p className="text-xs text-slate-subtle font-mono truncate">
                {application.user?.email || "Sin correo"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-muted hover:text-white hover:bg-card-hover transition-colors cursor-pointer"
            aria-label="Cerrar detalle"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-subtle flex items-center gap-1.5">
              <GraduationCap size={13} className="text-emerald-brand" />
              <span>Especialidad Académica</span>
            </p>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className="px-2.5 py-1 rounded-lg bg-emerald-brand/15 border border-emerald-brand/30 text-emerald-brand text-xs font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Sin especialidad especificada</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-subtle">
              Biografía y Trayectoria
            </p>
            <div className="p-3.5 rounded-xl bg-canvas border border-border-default text-xs text-slate-200 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
              {application.bio?.trim()
                ? application.bio
                : "El postulante aún no completó su biografía académica."}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-subtle">
            <Calendar size={12} />
            <span>
              Solicitado el{" "}
              {new Date(application.created_at).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {isPending && !profileComplete && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              <span>
                El postulante aún debe completar su especialidad y biografía personalizada (mín. 20 caracteres) antes de ser aprobado.
              </span>
            </div>
          )}

          {application.rejection_reason && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              <span className="font-bold">Motivo registrado:</span>{" "}
              {application.rejection_reason}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border-default bg-canvas/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-card-hover border border-border-default transition-colors cursor-pointer"
          >
            Cerrar
          </button>

          {isPending && (
            <>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReject(application);
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold text-xs hover:bg-rose-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle size={14} />
                <span>Rechazar</span>
              </button>
              <button
                type="button"
                disabled={!profileComplete}
                onClick={() => {
                  onClose();
                  onApprove(application);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 cursor-pointer shadow-glow-emerald disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCircle size={14} />
                <span>Aprobar Docente</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
