"use client";

import { useState, useEffect } from "react";
import { BookOpen, Loader2, Plus, AlertTriangle, ChevronDown, ChevronUp, RotateCcw, CheckCircle2, Crown } from "lucide-react";
import { Course, Lesson, LessonItem } from "@/features/courses/types";
import { ApiCourse } from "@/services/api";
import { NewCourseModal } from "../new-course-modal";
import { AddLessonModal } from "../add-lesson-modal";
import { EditCourseModal } from "../edit-course-modal";
import { EditLessonModal } from "../edit-lesson-modal";
import { BuilderHeader } from "./builder-header";
import { CourseStructurePanel } from "./course-structure-panel";
import { CardsTab } from "./cards-tab";
import { LessonGamesTab } from "./lesson-games-tab";
import { SimulatorTab } from "./simulator-tab";
import { PricingModal } from "./pricing-modal";
import { ManualCardModal } from "./manual-card-modal";
import { ExportJsonModal } from "./export-json-modal";
import { VaultDrawer } from "@/features/vault/components/vault-drawer";
import { PlaytestDrawer } from "@/features/games/components/playtest-drawer";
import { SubmitReviewModal } from "./submit-review-modal";
import { FeedbackTextRenderer } from "@/components/ui/feedback-text-renderer";

type CanvasTab = "cards" | "games" | "preview";
type SimScreen = "lesson" | "home" | "game";

interface CourseBuilderWorkspaceProps {
  courses: Record<string, Course>;
  currentCourseId: string;
  currentCourse: Course | null;
  currentLessonId: string;
  currentLesson: Lesson | null;
  currentStepId: string;
  stepForm: LessonItem;
  isLoading: boolean;
  activeCanvasTab: CanvasTab;
  simScreen: SimScreen;
  simTier: "free" | "premium";
  isSimLessonCompleted: boolean;
  simGameSelected: string | null;
  simGameMatched: string[];
  showNewCourseModal: boolean;
  showEditCourseModal: boolean;
  showPricingModal: boolean;
  showAddLessonModal: boolean;
  editingLesson: Lesson | null;
  showAddStepModal: boolean;
  showExportModal: boolean;
  showPlaytestDrawer: boolean;
  showVaultDrawer: boolean;
  showSubmitReviewModal?: boolean;
  isAdmin?: boolean;
  onAdminPublish?: () => void;
  onSelectCourse: (id: string) => void;
  onCreateCourse: (course: ApiCourse) => void;
  onLessonCreated: (lesson: Lesson) => void;
  onSelectLesson: (lesson: Lesson) => void;
  onSelectStep: (step: LessonItem) => void;
  onStepFormChange: (updater: (previous: LessonItem) => LessonItem) => void;
  onSaveStep: () => void;
  isSavingStep?: boolean;
  onDeleteStep: (id: string) => void;
  onAddCard: (item: Omit<LessonItem, "id">, contentBankItemId?: string) => void;
  onSpeak: (text: string) => void;
  onSubmitReview: (summary?: string) => Promise<void> | void;
  onSaveCourse: (course: { title: string; level: string; price: number }) => Promise<void>;
  onDeleteCourse: () => Promise<void>;
  onSaveLesson: (id: string, title: string, subtitle: string, duration: string) => Promise<void>;
  onDeleteLesson: (id: string) => Promise<void>;
  onSavePrice: (price: number, tier?: "free" | "course" | "subscription") => Promise<void>;
  onCloseModal: (name: string) => void;
  onOpenModal: (name: string) => void;
  onSetCanvasTab: (tab: CanvasTab) => void;
  onSetSimScreen: (screen: SimScreen) => void;
  onToggleSimTier: () => void;
  onToggleSimLessonCompleted: () => void;
  onSelectSimLesson: (id: string) => void;
  onSimGameCardClick: (cardId: string, matchId: string) => void;
  onResetSimGame: () => void;
  onToast: (message: string) => void;
  onCopyExport: () => void;
  onRefresh?: () => void;
  onWithdrawReview?: () => void;
}

export function CourseBuilderWorkspace(props: CourseBuilderWorkspaceProps) {
  const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(true);

  const {
    courses, currentCourseId, currentCourse, currentLessonId, currentLesson,
    currentStepId, stepForm, isLoading, activeCanvasTab,
    simScreen, simTier, isSimLessonCompleted, simGameSelected, simGameMatched,
    showNewCourseModal, showEditCourseModal, showPricingModal, showAddLessonModal,
    editingLesson, showAddStepModal, showExportModal, showPlaytestDrawer, showVaultDrawer,
    showSubmitReviewModal,
  } = props;

  useEffect(() => {
    setIsFeedbackExpanded(true);
  }, [currentCourseId]);

  // Platform courses are edited by administrators; teacher courses belong to
  // their author. Staff may supervise a teacher course but never edit it.
  const isPlatformCourse = currentCourse?.ownerType === "platform" || (!currentCourse?.ownerType && currentCourse?.author === "Wordtap");
  const canEditContent = props.isAdmin ? isPlatformCourse : !isPlatformCourse;
  const readOnlyReason = canEditContent
    ? null
    : props.isAdmin
      ? "Los administradores supervisan los cursos de docentes pero no editan su contenido directamente."
      : "Los docentes solo pueden editar sus propios cursos.";

  return (
    <>
      <BuilderHeader
        courses={courses}
        currentCourseId={currentCourseId}
        currentCourse={currentCourse}
        isAdmin={props.isAdmin}
        canEditCourse={canEditContent}
        isLoading={isLoading}
        onRefresh={props.onRefresh}
        onSelectCourse={props.onSelectCourse}
        onOpenNewCourseModal={() => props.onOpenModal("newCourse")}
        onOpenEditCourseModal={() => props.onOpenModal("editCourse")}
        onOpenPricingModal={() => props.onOpenModal("pricing")}
        onOpenExportModal={() => props.onOpenModal("export")}
        onOpenPlaytestDrawer={() => props.onOpenModal("playtest")}
        onSubmitReview={() => props.onOpenModal("submitReview")}
        onWithdrawReview={props.onWithdrawReview}
        onAdminPublish={props.onAdminPublish}
      />

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-muted gap-3 bg-canvas">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-brand" />
          <p className="text-xs font-mono">Cargando cursos y lecciones del docente...</p>
        </div>
      ) : !currentCourse || Object.keys(courses).length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-canvas">
          <div className="max-w-md w-full bg-card border border-border-default rounded-3xl p-8 space-y-6 shadow-xl animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-brand/10 border border-emerald-brand/30 flex items-center justify-center text-emerald-brand mx-auto shadow-inner">
              <BookOpen className="w-8 h-8 stroke-[1.75]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">No tienes cursos creados todavía</h3>
              <p className="text-xs text-slate-muted leading-relaxed">
                Comienza estructurando tu primer plan formativo. Podrás añadir módulos, lecciones, vocabulario clave y ejercicios interactivos para tus alumnos.
              </p>
            </div>
            <button type="button" onClick={() => props.onOpenModal("newCourse")} className="w-full py-3 rounded-2xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-glow-emerald">
              <Plus className="w-4 h-4 stroke-[2.5]" /><span>Crear mi primer curso</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-12 overflow-hidden min-h-0">
          <CourseStructurePanel
            currentCourse={currentCourse}
            currentLessonId={currentLessonId}
            onSelectLesson={props.onSelectLesson}
            canEdit={canEditContent}
            onOpenAddLessonModal={() => props.onOpenModal("addLesson")}
            onEditLesson={(lesson) => props.onOpenModal(`editLesson:${lesson.id}`)}
            onOpenVaultDrawer={() => props.onOpenModal("vault")}
            onOpenAddStepModal={() => props.onOpenModal("addStep")}
          />
          {currentLesson ? (
            <div className="col-span-12 lg:col-span-8 xl:col-span-9 bg-canvas flex flex-col overflow-y-auto">
              <div className="px-4 py-3 border-b border-border-default bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    {currentCourse.tier === "subscription" ? (
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 flex items-center gap-1">
                        <Crown className="w-2.5 h-2.5 text-amber-400" />
                        <span>PRO SUBSCRIPTION</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono uppercase text-emerald-brand font-bold px-2 py-0.5 rounded bg-emerald-brand/10 border border-emerald-brand/20">
                        {currentCourse.price > 0 ? "PAID" : currentLesson.tier.toUpperCase()}
                      </span>
                    )}
                    <span className="text-xs text-slate-subtle font-mono">{currentLesson.duration}</span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-0.5">{currentLesson.title}</h2>
                  <p className="text-[11px] text-slate-muted">{currentLesson.subtitle}</p>
                </div>
                <div className="flex items-center gap-1 bg-card p-1 rounded-xl border border-border-default text-xs font-medium self-start sm:self-auto">
                  {(["cards", "games", "preview"] as const).map((tab) => (
                    <button key={tab} type="button" onClick={() => props.onSetCanvasTab(tab)} className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${activeCanvasTab === tab ? "bg-emerald-brand text-canvas font-bold shadow-sm" : "text-slate-muted hover:text-white"}`}>
                      <span>{tab === "cards" ? "Tarjetas Pedagógicas" : tab === "games" ? "Minijuegos" : "Simulador Móvil"}</span>
                      {tab === "cards" ? <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-canvas/30">{currentLesson.items.length}</span> : tab === "games" ? <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-canvas/30">4</span> : <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-brand/20 text-emerald-brand">Live</span>}
                    </button>
                  ))}
                </div>
              </div>
              {/* Banner de observaciones: SOLO para docentes cuando tienen correcciones pedidas */}
              {!props.isAdmin && currentCourse?.reviewStatus === "changes_requested" && currentCourse?.feedbackNotes && (
                isFeedbackExpanded ? (
                  <div className="mx-4 my-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5 shadow-sm flex-shrink-0 animate-in fade-in duration-150">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-950 dark:text-white text-xs">Correcciones Pedidas por el Revisor</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                            {currentCourse.reviewerName || "Equipo Pedagógico"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsFeedbackExpanded(false)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 hover:text-black dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold flex-shrink-0 border border-amber-500/30"
                          title="Minimizar notificación para ganar espacio de trabajo"
                        >
                          <span>Minimizar</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="bg-amber-500/5 dark:bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                        <FeedbackTextRenderer text={currentCourse.feedbackNotes} bulletColor="text-amber-600 dark:text-amber-300" />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                          Aplica las correcciones en las lecciones y pulsa &quot;Re-enviar Correcciones&quot;.
                        </p>
                        <button
                          type="button"
                          onClick={() => props.onOpenModal("submitReview")}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-canvas font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Re-enviar Correcciones</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mx-4 my-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3 shadow-sm flex-shrink-0 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 truncate">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      <span className="font-bold text-amber-950 dark:text-white text-xs">Correcciones Pedidas</span>
                      <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                        {currentCourse.reviewerName || "Equipo Pedagógico"}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 text-[11px] hidden sm:inline truncate">
                        • Observaciones minimizadas
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsFeedbackExpanded(true)}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 hover:text-black dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold flex-shrink-0 border border-amber-500/30"
                      title="Expandir observaciones del revisor"
                    >
                      <span>Ver Observaciones</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              )}
              {activeCanvasTab === "cards" && (
                <CardsTab
                  currentLesson={currentLesson}
                  currentStepId={currentStepId}
                  stepForm={stepForm}
                  isSavingStep={props.isSavingStep}
                  readOnly={!canEditContent}
                  onSelectStep={props.onSelectStep}
                  onStepFormChange={props.onStepFormChange}
                  onSaveStep={props.onSaveStep}
                  onDeleteStep={props.onDeleteStep}
                  onAddCard={props.onAddCard}
                  onOpenAddStepModal={() => props.onOpenModal("addStep")}
                  onSpeak={props.onSpeak}
                />
              )}
              {activeCanvasTab === "games" && (
                <LessonGamesTab
                  lessonId={currentLessonId}
                  canEdit={canEditContent}
                  includeMine={!props.isAdmin}
                  courseLevel={currentCourse?.level}
                  readOnlyReason={readOnlyReason}
                  onTestGames={() => props.onSetSimScreen("game")}
                  onToast={props.onToast}
                />
              )}
              {activeCanvasTab === "preview" && (
                <SimulatorTab
                  currentCourse={currentCourse} currentLesson={currentLesson} simScreen={simScreen} simTier={simTier}
                  isSimLessonCompleted={isSimLessonCompleted} simGameSelected={simGameSelected} simGameMatched={simGameMatched}
                  onSetSimScreen={props.onSetSimScreen} onToggleSimTier={props.onToggleSimTier}
                  onToggleSimLessonCompleted={props.onToggleSimLessonCompleted} onSelectSimLesson={props.onSelectSimLesson}
                  onSimGameCardClick={props.onSimGameCardClick} onResetSimGame={props.onResetSimGame} onSpeak={props.onSpeak}
                />
              )}
            </div>
          ) : (
            <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col items-center justify-center bg-canvas p-8 text-center">
              <div className="max-w-sm w-full p-8 rounded-3xl bg-card border border-border-default shadow-xl flex flex-col items-center space-y-4 animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-brand/10 border border-emerald-brand/20 flex items-center justify-center text-emerald-brand shadow-inner">
                  <BookOpen className="w-7 h-7 stroke-[1.75]" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-base font-bold text-white">Este curso no tiene lecciones todavía</h2>
                  <p className="text-xs text-slate-muted leading-relaxed">
                    Comenzá creando la primera lección para armar las tarjetas pedagógicas y ejercicios.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => props.onOpenModal("addLesson")}
                  className="px-4 py-2.5 rounded-xl bg-emerald-brand hover:bg-mint-brand text-canvas text-xs font-bold flex items-center gap-2 shadow-glow-emerald transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Añadir Primera Lección</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <NewCourseModal
        isOpen={showNewCourseModal}
        isAdmin={props.isAdmin}
        onClose={() => props.onCloseModal("newCourse")}
        onCreated={props.onCreateCourse}
      />
      {showEditCourseModal && currentCourse && <EditCourseModal isOpen course={currentCourse} onClose={() => props.onCloseModal("editCourse")} onSave={props.onSaveCourse} onDelete={props.onDeleteCourse} />}
      <AddLessonModal isOpen={showAddLessonModal} courseId={currentCourseId} onClose={() => props.onCloseModal("addLesson")} onCreated={props.onLessonCreated} />
      {editingLesson && <EditLessonModal isOpen lesson={editingLesson} onClose={() => props.onCloseModal("editLesson")} onSave={props.onSaveLesson} onDelete={props.onDeleteLesson} />}
      {showPricingModal && currentCourse && (
        <PricingModal
          isOpen
          course={currentCourse}
          isAdmin={props.isAdmin}
          onClose={() => props.onCloseModal("pricing")}
          onSavePrice={(price, tier) => {
            void props.onSavePrice(price, tier).catch((error: unknown) =>
              props.onToast(
                `No se pudo actualizar la tarifa: ${
                  error instanceof Error ? error.message : "error desconocido"
                }`
              )
            );
          }}
        />
      )}
      <ManualCardModal isOpen={showAddStepModal} onClose={() => props.onCloseModal("addStep")} onAddCard={props.onAddCard} />
      {currentCourse && <ExportJsonModal isOpen={showExportModal} course={currentCourse} onClose={() => props.onCloseModal("export")} onCopied={props.onCopyExport} />}
      {currentLesson && <VaultDrawer isOpen={showVaultDrawer} currentLesson={currentLesson} onClose={() => props.onCloseModal("vault")} onImportItem={props.onAddCard} showPrivateCollection={!props.isAdmin} />}
      {currentLesson && <PlaytestDrawer isOpen={showPlaytestDrawer} currentLesson={currentLesson} onClose={() => props.onCloseModal("playtest")} onSpeak={props.onSpeak} />}
      {showSubmitReviewModal && currentCourse && (
        <SubmitReviewModal
          isOpen
          course={currentCourse}
          onClose={() => props.onCloseModal("submitReview")}
          onSubmit={(summary) => Promise.resolve(props.onSubmitReview(summary))}
        />
      )}
    </>
  );
}
