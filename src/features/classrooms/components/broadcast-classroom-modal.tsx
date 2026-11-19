"use client";

import { useState, useEffect } from "react";
import { X, Bell, Send, Loader2, CheckCircle2, AlertCircle, Layers } from "lucide-react";
import { Classroom } from "@/features/classrooms/types";
import { broadcastToClassroomApi, BroadcastClassroomResult } from "@/services/api";
import { useClassroomCourses } from "../hooks/use-classroom-courses";
import { BroadcastActionStep } from "./broadcast-action-step";

interface BroadcastClassroomModalProps {
  classroom: Classroom | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (result: BroadcastClassroomResult) => void;
}

export function BroadcastClassroomModal({
  classroom,
  isOpen,
  onClose,
  onSuccess,
}: BroadcastClassroomModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [actionType, setActionType] = useState<"open_classroom" | "open_content">("open_classroom");
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<BroadcastClassroomResult | null>(null);

  const {
    courses,
    lessons,
    selectedCourseId,
    selectedLessonId,
    setSelectedCourseId,
    setSelectedLessonId,
    selectedCourse,
    selectedLesson,
    isLoadingLessons,
  } = useClassroomCourses(classroom);

  const goToStep2 = () => {
    if (!title.trim() || !message.trim()) {
      setErrorMessage("Por favor completa el título y mensaje del aviso.");
      return;
    }
    setErrorMessage(null);
    setStep(2);
  };

  const goToStep1 = () => {
    setStep(1);
    setErrorMessage(null);
    setSuccessResult(null);
  };

  // Reset step when modal closes
  const [prevOpen, setPrevOpen] = useState(isOpen);
  if (prevOpen !== isOpen) {
    setPrevOpen(isOpen);
    if (!isOpen) {
      setStep(1);
      setErrorMessage(null);
      setSuccessResult(null);
    }
  }

  // Synchronize browser URL query parameters (?action=broadcast&classId=...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isOpen && classroom) {
      const url = new URL(window.location.href);
      if (
        url.searchParams.get("action") !== "broadcast" ||
        url.searchParams.get("classId") !== classroom.id
      ) {
        url.searchParams.set("action", "broadcast");
        url.searchParams.set("classId", classroom.id);
        window.history.replaceState(null, "", url.toString());
      }
    }
  }, [isOpen, classroom]);

  const handleModalClose = () => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.get("action") === "broadcast") {
        url.searchParams.delete("action");
        if (!url.searchParams.get("view") && url.searchParams.get("tab") !== "history") {
          url.searchParams.delete("classId");
        }
        window.history.replaceState(null, "", url.toString());
      }
    }
    onClose();
  };

  if (!isOpen || !classroom) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setErrorMessage("Por favor completa el título y mensaje del aviso.");
      return;
    }

    if (actionType === "open_content" && !selectedCourseId.trim()) {
      setErrorMessage("Por favor selecciona el curso de destino obligatorio.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessResult(null);

    // Mapeo canónico a deep links:
    // Lección elegida -> open_lesson (/lessons/:id)
    // Curso completo -> open_course (/courses/:id)
    // Aula -> open_classroom (/classrooms/:id)
    const effectiveActionType =
      actionType === "open_content"
        ? selectedLessonId
          ? "open_lesson"
          : "open_course"
        : "open_classroom";

    const effectiveActionPayload =
      actionType === "open_content"
        ? selectedLessonId
          ? selectedLessonId.trim()
          : selectedCourseId.trim()
        : undefined;

    const res = await broadcastToClassroomApi(classroom.id, {
      title: title.trim(),
      message: message.trim(),
      action_type: effectiveActionType,
      action_payload: effectiveActionPayload,
    });

    setIsSubmitting(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else if (res.data) {
      setSuccessResult(res.data);
      onSuccess?.(res.data);
      setTimeout(() => {
        handleModalClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card border border-border-default rounded-3xl shadow-2xl p-6 sm:p-7 relative space-y-5 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95">
        {/* Barra superior de acento */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-brand via-mint-brand to-emerald-dark absolute top-0 left-0" />

        {/* Cabecera */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border-default">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-brand/10 border border-emerald-brand/20 text-emerald-brand flex items-center justify-center font-bold flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Publicar Aviso a la Clase</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-brand/15 text-emerald-brand border border-emerald-brand/30 font-semibold">
                  Push Inmediato
                </span>
              </div>
              <p className="text-xs text-slate-muted mt-0.5">
                Notificación push y aviso en bandeja para los alumnos matriculados.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="p-2 rounded-xl bg-card text-slate-muted hover:text-white hover:bg-card-hover border border-border-default transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tarjeta de aula */}
        <div className="p-4 rounded-2xl bg-canvas border border-border-default flex items-center justify-between text-xs shadow-sm">
          <div>
            <p className="font-bold text-white text-sm">{classroom.name}</p>
            <p className="text-xs text-slate-muted font-mono mt-0.5">Código: {classroom.code}</p>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
            {classroom.studentsCount} Alumnos
          </span>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successResult && (
          <div className="p-3.5 bg-emerald-brand/10 border border-emerald-brand/30 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-brand font-medium animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Aviso enviado a {successResult.recipients_count} alumnos ({successResult.devices_count} dispositivos notificados).
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stepper indicator */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-muted">
            <span className={`px-2 py-0.5 rounded-full ${
              step === 1 ? 'bg-emerald-brand/20 text-emerald-brand' : 'bg-canvas text-slate-400'
            }`}>1</span>
            <span className="flex-1 h-0.5 bg-border-default" />
            <span className={`px-2 py-0.5 rounded-full ${
              step === 2 ? 'bg-emerald-brand/20 text-emerald-brand' : 'bg-canvas text-slate-400'
            }`}>2</span>
          </div>

          {step === 1 && (
            <>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Título del Aviso <span className="text-emerald-brand">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Recordatorio: Repaso de Phrasal Verbs"
                  className="w-full bg-canvas border border-border-default focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand/30 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Mensaje para los Alumnos <span className="text-emerald-brand">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ej: Completar la actividad antes de las 18:00 hs para la clase de mañana..."
                  rows={3}
                  className="w-full bg-canvas border border-border-default focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand/30 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Acción al Tocar la Notificación</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as "open_classroom" | "open_content")}
                  className="w-full bg-canvas border border-border-default focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none transition-all cursor-pointer"
                >
                  <option value="open_classroom">Abrir pantalla de la clase</option>
                  <option value="open_content">Abrir contenido del curso o lección</option>
                </select>
              </div>

              <div className="pt-4 border-t border-border-default flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleModalClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-canvas border border-border-default text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={goToStep2}
                  disabled={isSubmitting || !title.trim() || !message.trim()}
                  className="px-6 py-2.5 rounded-xl bg-emerald-brand hover:bg-mint-brand text-canvas font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-glow-emerald disabled:opacity-50"
                >
                  <span>Continuar</span>
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <BroadcastActionStep
                actionType={actionType}
                courses={courses}
                lessons={lessons}
                selectedCourseId={selectedCourseId}
                selectedLessonId={selectedLessonId}
                onSelectCourseId={setSelectedCourseId}
                onSelectLessonId={setSelectedLessonId}
                selectedCourse={selectedCourse}
                selectedLesson={selectedLesson}
                isLoadingLessons={isLoadingLessons}
              />

              <div className="pt-4 border-t border-border-default flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={goToStep1}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-canvas border border-border-default text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !title.trim() ||
                    !message.trim() ||
                    (actionType === "open_content" && !selectedCourseId)
                  }
                  className="px-6 py-2.5 rounded-xl bg-emerald-brand hover:bg-mint-brand text-canvas font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-glow-emerald disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publicando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publicar a la Clase</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
