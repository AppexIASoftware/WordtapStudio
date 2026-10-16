"use client";

import { useEffect, useState } from "react";
import { useSpeak } from "@/hooks/use-speak";
import Link from "next/link";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  UserCheck,
  MessageSquare,
  Smartphone,
  BookOpen,
  FileText,
  ExternalLink,
} from "lucide-react";
import { ModeratorPR } from "../types";
import { PublishCourseModal } from "./publish-course-modal";
import { ReassignReviewerModal } from "./reassign-reviewer-modal";
import { RejectCourseModal } from "./reject-course-modal";
import { RequestChangesModal } from "./request-changes-modal";
import { CurriculumPreviewTab } from "./curriculum-preview-tab";
import { FeedbackTextRenderer } from "@/components/ui/feedback-text-renderer";
import { PlaytestDrawer } from "@/features/teacher-dashboard/components/builder/playtest-drawer";
import { Lesson } from "@/features/teacher-dashboard/types";
import { getCourseDetailApi } from "@/services/api";
import { mapApiLessonToLesson } from "@/features/courses/utils/course-mapper";
import { COURSES_DATA } from "@/features/courses/data/mock-courses";

interface ApprovalAuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePr: ModeratorPR | null;
  thread: { sender: string; text: string; time: string; isMod: boolean }[];
  showPublishModal: boolean;
  setShowPublishModal: (open: boolean) => void;
  showReassignModal: boolean;
  setShowReassignModal: (open: boolean) => void;
  showRejectModal: boolean;
  setShowRejectModal: (open: boolean) => void;
  showRequestChangesModal: boolean;
  setShowRequestChangesModal: (open: boolean) => void;
  onPublish: () => void | Promise<void>;
  onRequestChanges: (feedback: string) => void | Promise<void>;
  onReject: (feedback: string) => void | Promise<void>;
  onReassign: (reviewerName: string) => void | Promise<void>;
}

export function ApprovalAuditDrawer({
  isOpen,
  onClose,
  activePr,
  thread,
  showPublishModal,
  setShowPublishModal,
  showReassignModal,
  setShowReassignModal,
  showRejectModal,
  setShowRejectModal,
  showRequestChangesModal,
  setShowRequestChangesModal,
  onPublish,
  onRequestChanges,
  onReject,
  onReassign,
}: ApprovalAuditDrawerProps) {
  const [activeTab, setActiveTab] = useState<"curriculum" | "verdict">("curriculum");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [isPlaytestOpen, setIsPlaytestOpen] = useState(false);
  const [playtestLesson, setPlaytestLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Carga asíncrona no-bloqueante del árbol curricular
  useEffect(() => {
    if (!isOpen || !activePr?.courseId) {
      setLessons([]);
      return;
    }

    let isMounted = true;
    setIsLoadingLessons(true);

    const loadCourse = async () => {
      try {
        const res = await getCourseDetailApi(activePr.courseId!);
        if (!isMounted) return;

        if (res.data?.lessons && res.data.lessons.length > 0) {
          setLessons(res.data.lessons.map(mapApiLessonToLesson));
        } else {
          const fallback = COURSES_DATA[activePr.courseId!]?.lessons || [];
          setLessons(fallback);
        }
      } catch {
        if (!isMounted) return;
        const fallback = COURSES_DATA[activePr.courseId!]?.lessons || [];
        setLessons(fallback);
      } finally {
        if (isMounted) setIsLoadingLessons(false);
      }
    };

    void loadCourse();

    return () => {
      isMounted = false;
    };
  }, [isOpen, activePr?.courseId]);

  const speak = useSpeak();

  const handleOpenPlaytest = (lesson: Lesson) => {
    setPlaytestLesson(lesson);
    setIsPlaytestOpen(true);
  };

  if (!isOpen || !activePr) return null;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl lg:max-w-3xl bg-card border-l border-border-default h-full flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-200 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera Fijada */}
        <div className="p-5 border-b border-border-default bg-canvas/80 backdrop-blur-md flex flex-col gap-3 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-mint-brand">{activePr.id}</span>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  activePr.status === "in_review"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    : activePr.status === "approved"
                    ? "bg-emerald-brand/20 text-emerald-brand border-emerald-brand/30"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                }`}
              >
                {activePr.statusLabel}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-card border border-border-default hover:border-slate-400 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Cerrar auditoría (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{activePr.title}</h3>
            <p className="text-xs text-slate-muted mt-0.5">
              Docente: <strong className="text-slate-200">{activePr.author}</strong> ({activePr.authorEmail}) • {activePr.summary}
            </p>
          </div>

          {/* Barra de Acciones de Decisión */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-default/60">
            {lessons.length > 0 && (
              <button
                type="button"
                onClick={() => handleOpenPlaytest(lessons[0])}
                className="px-3 py-1.5 rounded-xl bg-card border border-emerald-brand/50 hover:border-emerald-brand text-emerald-brand hover:bg-emerald-brand/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Abrir Simulador Móvil de Playtest con las lecciones reales del curso"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Playtest Móvil</span>
              </button>
            )}

            {activePr.courseId && (
              <Link
                href={`/moderator/courses?courseId=${activePr.courseId}&pr=${activePr.id}&from=/approvals`}
                className="px-3 py-1.5 rounded-xl bg-card border border-blue-500/40 hover:border-blue-500 text-blue-300 hover:text-white hover:bg-blue-500/10 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Abrir en vista de pantalla completa tipo Creador de Cursos (Solo Lectura)"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Vista Completa (Creador)</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setShowReassignModal(true)}
              className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default hover:border-blue-400 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Reasignar</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRejectModal(true)}
              className="px-3 py-1.5 rounded-xl bg-card border border-rose-500/30 hover:border-rose-500 text-xs font-semibold text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Rechazar</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRequestChangesModal(true)}
              className="px-3 py-1.5 rounded-xl bg-card border border-amber-500/30 hover:border-amber-500 text-xs font-semibold text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Pedir Cambios</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPublishModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer ml-auto"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Aprobar & Publicar</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación del Drawer */}
        <div className="flex items-center gap-2 px-5 border-b border-border-default bg-canvas/40">
          <button
            type="button"
            onClick={() => setActiveTab("curriculum")}
            className={`px-3 py-2.5 border-b-2 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "curriculum"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Contenido Curricular</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px]">
              {lessons.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("verdict")}
            className={`px-3 py-2.5 border-b-2 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "verdict"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dictamen & Feedback</span>
            {activePr.diffItems.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-card text-slate-300 font-mono text-[10px]">
                {activePr.diffItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Cuerpo con Scroll de Auditoría */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === "curriculum" ? (
            <CurriculumPreviewTab
              courseTitle={activePr.title}
              lessons={lessons}
              isLoading={isLoadingLessons}
              onPlaytestLesson={handleOpenPlaytest}
              onSpeak={speak}
            />
          ) : (
            <>
              {/* Comparación Visual del Diff */}
              <div className="p-4 rounded-2xl bg-canvas border border-border-default space-y-3">
                <div className="flex items-center justify-between border-b border-border-default pb-2">
                  <span className="font-mono text-slate-subtle font-bold uppercase text-[10px]">
                    Cambios Detectados en el Curso
                  </span>
                  <span className="px-2 py-0.5 rounded bg-card text-slate-400 font-mono text-[10px]">
                    Diff Inspector
                  </span>
                </div>

                <div className="space-y-2">
                  {activePr.diffItems.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-card border border-border-default space-y-1">
                      <span className="font-bold text-white text-xs block">{item.field}</span>
                      <p className="text-slate-400 text-[11px] line-through">{item.original}</p>
                      <p className="text-emerald-brand text-xs font-semibold">{item.proposed}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hilo de Feedback Pedagógico */}
              <div className="p-4 rounded-2xl bg-card border border-border-default space-y-3 shadow-sm">
                <div className="flex items-center gap-2 border-b border-border-default pb-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Hilo de Feedback Pedagógico
                  </h4>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {thread.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        msg.isMod
                          ? "bg-blue-500/10 border-blue-500/30 ml-4"
                          : "bg-canvas border-border-default mr-4"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <strong className={msg.isMod ? "text-blue-300" : "text-emerald-brand"}>
                          {msg.sender}
                        </strong>
                        <span className="text-slate-subtle font-mono text-[10px]">{msg.time}</span>
                      </div>
                      <FeedbackTextRenderer text={msg.text} />
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-border-default/50 text-[11px] text-slate-400">
                  <span>Dictamen oficial emitido por el equipo de moderación.</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modales de Decisión */}
        <PublishCourseModal
          isOpen={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          onConfirm={onPublish}
          activePr={activePr}
        />

        <ReassignReviewerModal
          isOpen={showReassignModal}
          onClose={() => setShowReassignModal(false)}
          onConfirm={onReassign}
        />

        <RejectCourseModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onConfirm={onReject}
          activePr={activePr}
        />

        <RequestChangesModal
          isOpen={showRequestChangesModal}
          onClose={() => setShowRequestChangesModal(false)}
          onConfirm={onRequestChanges}
          activePr={activePr}
        />

        {/* Simulador Playtest Móvil Integrado */}
        {isPlaytestOpen && playtestLesson && (
          <PlaytestDrawer
            isOpen={isPlaytestOpen}
            currentLesson={playtestLesson}
            onClose={() => setIsPlaytestOpen(false)}
            onSpeak={speak}
          />
        )}
      </div>
    </div>
  );
}
