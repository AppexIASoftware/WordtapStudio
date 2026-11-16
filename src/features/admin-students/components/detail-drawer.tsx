"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  BookOpen,
  Flame,
  GraduationCap,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import {
  getAdminStudentDetailApi,
  updateAdminStudentStatusApi,
} from "@/services/api";
import {
  STUDENT_STATUS_ACTION,
  StudentStatusAction,
  StudentStatusModal,
} from "./status-modal";

interface StudentDetailDrawerProps {
  studentId: string | null;
  canManageStatus?: boolean;
  onClose: () => void;
  onStatusUpdated: (message: string) => void;
}

export function StudentDetailDrawer({
  studentId,
  canManageStatus = true,
  onClose,
  onStatusUpdated,
}: StudentDetailDrawerProps) {
  const [modalAction, setModalAction] = useState<StudentStatusAction | null>(
    null
  );

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "students", "detail", studentId],
    enabled: Boolean(studentId),
    queryFn: async () => {
      if (!studentId) return null;
      const res = await getAdminStudentDetailApi(studentId);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
  });

  if (!studentId) return null;

  const handleConfirmStatus = async (nextIsActive: boolean) => {
    const res = await updateAdminStudentStatusApi(studentId, nextIsActive);
    if (res.error) throw new Error(res.error);
    setModalAction(null);
    await refetch();
    onStatusUpdated(
      nextIsActive
        ? `Cuenta de ${res.data?.name || "alumno"} reactivada`
        : `Cuenta de ${res.data?.name || "alumno"} suspendida`
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex justify-end bg-black/50 backdrop-blur-xs">
        <div className="w-full max-w-lg bg-card border-l border-border-default h-full flex flex-col shadow-2xl">
          <div className="p-5 border-b border-border-default flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  Detalle del Estudiante
                </h2>
                <p className="text-[11px] text-slate-muted">
                  Supervisión de progreso, aulas y estado de cuenta.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-muted hover:text-white hover:bg-card-hover cursor-pointer"
              aria-label="Cerrar panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="p-4 rounded-2xl bg-canvas border border-border-default space-y-2">
                  <div className="h-4 w-40 rounded bg-border-default" />
                  <div className="h-3 w-52 rounded bg-card-hover" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-canvas border border-border-default space-y-2"
                    >
                      <div className="h-3 w-20 rounded bg-card-hover" />
                      <div className="h-5 w-12 rounded bg-border-default" />
                    </div>
                  ))}
                </div>
                <div className="h-28 rounded-2xl bg-canvas border border-border-default" />
              </div>
            ) : isError ? (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {error instanceof Error
                    ? error.message
                    : "No se pudo cargar el detalle del estudiante."}
                </span>
              </div>
            ) : data ? (
              <>
                <div className="p-4 rounded-2xl bg-canvas border border-border-default flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">{data.name}</p>
                    <p className="text-xs text-slate-muted">{data.email}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-1.5">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-card border border-border-default text-slate-light">
                        {data.learning_level}
                      </span>
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/20">
                        {data.access_tier}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                          data.is_active
                            ? "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {data.is_active ? "Activo" : "Suspendido"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-canvas border border-border-default">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-muted">
                      <Flame className="w-3.5 h-3.5 text-amber-brand" />
                      <span>Racha actual</span>
                    </div>
                    <p className="text-lg font-bold text-white mt-1">
                      {data.current_streak_days} días
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-canvas border border-border-default">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-muted">
                      <Trophy className="w-3.5 h-3.5 text-purple-400" />
                      <span>Puntos totales</span>
                    </div>
                    <p className="text-lg font-bold text-white mt-1">
                      {data.total_points.toLocaleString("es-ES")}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-canvas border border-border-default">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-muted">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-brand" />
                      <span>Lecciones completadas</span>
                    </div>
                    <p className="text-lg font-bold text-white mt-1">
                      {data.lessons_completed}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-canvas border border-border-default">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-muted">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Palabras aprendidas</span>
                    </div>
                    <p className="text-lg font-bold text-white mt-1">
                      {data.words_learned}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-subtle">
                    Progreso por curso ({data.courses.length})
                  </h3>
                  {data.courses.length === 0 ? (
                    <p className="p-3.5 rounded-xl bg-canvas border border-border-default text-xs text-slate-muted">
                      Sin progreso registrado en cursos todavía.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {data.courses.map((c) => (
                        <div
                          key={c.course_id}
                          className="p-3.5 rounded-xl bg-canvas border border-border-default space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-semibold text-white truncate">
                              {c.course_title}
                            </span>
                            <span className="font-mono text-slate-muted shrink-0">
                              {c.completed_lessons}/{c.total_lessons} (
                              {c.progress_percent}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-card-hover overflow-hidden">
                            <div
                              className="h-full bg-emerald-brand rounded-full"
                              style={{ width: `${c.progress_percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-subtle">
                    Aulas inscritas ({data.classrooms.length})
                  </h3>
                  {data.classrooms.length === 0 ? (
                    <p className="p-3.5 rounded-xl bg-canvas border border-border-default text-xs text-slate-muted">
                      No pertenece a ningún aula docente.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {data.classrooms.map((cl) => (
                        <div
                          key={cl.classroom_id}
                          className="p-3 rounded-xl bg-canvas border border-border-default flex items-center justify-between gap-2 text-xs"
                        >
                          <span className="font-semibold text-white">
                            {cl.classroom_name}
                          </span>
                          <span className="text-[11px] text-slate-muted">
                            Docente: {cl.teacher_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>

          {data && canManageStatus && (
            <div className="p-4 border-t border-border-default bg-card-hover/30 flex items-center justify-between gap-2">
              {data.is_active ? (
                <button
                  type="button"
                  onClick={() => setModalAction(STUDENT_STATUS_ACTION.SUSPEND)}
                  className="w-full px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-400 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Suspender alumno</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setModalAction(STUDENT_STATUS_ACTION.REACTIVATE)
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-brand/15 hover:bg-emerald-brand/25 border border-emerald-brand/30 text-xs font-semibold text-emerald-brand flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Reactivar alumno</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {data && canManageStatus && modalAction && (
        <StudentStatusModal
          studentName={data.name}
          studentEmail={data.email}
          action={modalAction}
          onConfirm={handleConfirmStatus}
          onClose={() => setModalAction(null)}
        />
      )}
    </>
  );
}
