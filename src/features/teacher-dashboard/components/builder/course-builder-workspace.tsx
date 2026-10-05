"use client";

import { BookOpen, Loader2, Plus } from "lucide-react";
import { Course, Lesson, LessonItem } from "../../types";
import { ApiCourse } from "@/services/api";
import { NewCourseModal } from "../new-course-modal";
import { AddLessonModal } from "../add-lesson-modal";
import { EditCourseModal } from "../edit-course-modal";
import { EditLessonModal } from "../edit-lesson-modal";
import { BuilderHeader } from "./builder-header";
import { CourseStructurePanel } from "./course-structure-panel";
import { CardsTab } from "./cards-tab";
import { GamesTab } from "./games-tab";
import { SimulatorTab } from "./simulator-tab";
import { PricingModal } from "./pricing-modal";
import { ManualCardModal } from "./manual-card-modal";
import { ExportJsonModal } from "./export-json-modal";
import { VaultDrawer } from "./vault-drawer";
import { PlaytestDrawer } from "./playtest-drawer";

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
  onSelectCourse: (id: string) => void;
  onCreateCourse: (course: ApiCourse) => void;
  onLessonCreated: (lesson: Lesson) => void;
  onSelectLesson: (lesson: Lesson) => void;
  onSelectStep: (step: LessonItem) => void;
  onStepFormChange: (updater: (previous: LessonItem) => LessonItem) => void;
  onSaveStep: () => void;
  onDeleteStep: (id: string) => void;
  onAddCard: (item: Omit<LessonItem, "id">) => void;
  onSpeak: (text: string) => void;
  onSubmitReview: () => void;
  onSaveCourse: (course: { title: string; level: string; price: number }) => Promise<void>;
  onDeleteCourse: () => Promise<void>;
  onSaveLesson: (id: string, title: string, subtitle: string, duration: string) => Promise<void>;
  onDeleteLesson: (id: string) => Promise<void>;
  onSavePrice: (price: number) => Promise<void>;
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
}

export function CourseBuilderWorkspace(props: CourseBuilderWorkspaceProps) {
  const {
    courses, currentCourseId, currentCourse, currentLessonId, currentLesson,
    currentStepId, stepForm, isLoading, activeCanvasTab,
    simScreen, simTier, isSimLessonCompleted, simGameSelected, simGameMatched,
    showNewCourseModal, showEditCourseModal, showPricingModal, showAddLessonModal,
    editingLesson, showAddStepModal, showExportModal, showPlaytestDrawer, showVaultDrawer,
  } = props;

  return (
    <>
      <BuilderHeader
        courses={courses}
        currentCourseId={currentCourseId}
        currentCourse={currentCourse}
        onSelectCourse={props.onSelectCourse}
        onOpenNewCourseModal={() => props.onOpenModal("newCourse")}
        onOpenEditCourseModal={() => props.onOpenModal("editCourse")}
        onOpenPricingModal={() => props.onOpenModal("pricing")}
        onOpenExportModal={() => props.onOpenModal("export")}
        onOpenPlaytestDrawer={() => props.onOpenModal("playtest")}
        onSubmitReview={props.onSubmitReview}
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
            onOpenAddLessonModal={() => props.onOpenModal("addLesson")}
            onEditLesson={(lesson) => props.onOpenModal(`editLesson:${lesson.id}`)}
            onOpenVaultDrawer={() => props.onOpenModal("vault")}
            onOpenAddStepModal={() => props.onOpenModal("addStep")}
          />
          {currentLesson ? (
            <div className="col-span-12 lg:col-span-8 xl:col-span-9 bg-canvas flex flex-col overflow-y-auto">
              <div className="p-4 border-b border-border-default bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-emerald-brand font-bold px-2 py-0.5 rounded bg-emerald-brand/10 border border-emerald-brand/20">{currentLesson.tier.toUpperCase()}</span>
                    <span className="text-xs text-slate-subtle font-mono">{currentLesson.duration}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-0.5">{currentLesson.title}</h2>
                  <p className="text-xs text-slate-muted">{currentLesson.subtitle}</p>
                </div>
                <div className="flex items-center gap-1 bg-card p-1 rounded-2xl border border-border-default text-xs font-medium self-start sm:self-auto">
                  {(["cards", "games", "preview"] as const).map((tab) => (
                    <button key={tab} type="button" onClick={() => props.onSetCanvasTab(tab)} className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${activeCanvasTab === tab ? "bg-emerald-brand text-canvas font-bold shadow-sm" : "text-slate-muted hover:text-white"}`}>
                      <span>{tab === "cards" ? "Tarjetas Pedagógicas" : tab === "games" ? "Minijuegos" : "Simulador Móvil"}</span>
                      {tab === "cards" ? <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-canvas/30">{currentLesson.items.length}</span> : tab === "games" ? <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-canvas/30">4</span> : <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-brand/20 text-emerald-brand">Live</span>}
                    </button>
                  ))}
                </div>
              </div>
              {activeCanvasTab === "cards" && <CardsTab currentLesson={currentLesson} currentStepId={currentStepId} stepForm={stepForm} onSelectStep={props.onSelectStep} onStepFormChange={props.onStepFormChange} onSaveStep={props.onSaveStep} onDeleteStep={props.onDeleteStep} onOpenAddStepModal={() => props.onOpenModal("addStep")} onSpeak={props.onSpeak} />}
              {activeCanvasTab === "games" && <GamesTab onTestGames={() => props.onSetSimScreen("game")} />}
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
              <h2 className="text-base font-bold text-white">Este curso todavía no tiene lecciones</h2>
              <p className="mt-2 text-xs text-slate-muted">Añadí una lección para comenzar a preparar el contenido.</p>
              <button type="button" onClick={() => props.onOpenModal("addLesson")} className="mt-4 px-4 py-2 rounded-xl bg-emerald-brand text-canvas text-xs font-bold flex items-center gap-2"><Plus className="w-3.5 h-3.5" />Añadir lección</button>
            </div>
          )}
        </div>
      )}

      <NewCourseModal isOpen={showNewCourseModal} onClose={() => props.onCloseModal("newCourse")} onCreated={props.onCreateCourse} />
      {showEditCourseModal && currentCourse && <EditCourseModal isOpen course={currentCourse} onClose={() => props.onCloseModal("editCourse")} onSave={props.onSaveCourse} onDelete={props.onDeleteCourse} />}
      <AddLessonModal isOpen={showAddLessonModal} courseId={currentCourseId} onClose={() => props.onCloseModal("addLesson")} onCreated={props.onLessonCreated} />
      {editingLesson && <EditLessonModal isOpen lesson={editingLesson} onClose={() => props.onCloseModal("editLesson")} onSave={props.onSaveLesson} onDelete={props.onDeleteLesson} />}
      {showPricingModal && currentCourse && <PricingModal isOpen course={currentCourse} onClose={() => props.onCloseModal("pricing")} onSavePrice={(price) => { void props.onSavePrice(price).catch((error: unknown) => props.onToast(`No se pudo actualizar el precio: ${error instanceof Error ? error.message : "error desconocido"}`)); }} />}
      <ManualCardModal isOpen={showAddStepModal} onClose={() => props.onCloseModal("addStep")} onAddCard={props.onAddCard} />
      {currentCourse && <ExportJsonModal isOpen={showExportModal} course={currentCourse} onClose={() => props.onCloseModal("export")} onCopied={props.onCopyExport} />}
      {currentLesson && <VaultDrawer isOpen={showVaultDrawer} currentLesson={currentLesson} onClose={() => props.onCloseModal("vault")} onImportItem={props.onAddCard} />}
      {currentLesson && <PlaytestDrawer isOpen={showPlaytestDrawer} currentLesson={currentLesson} onClose={() => props.onCloseModal("playtest")} onSpeak={props.onSpeak} />}
    </>
  );
}
