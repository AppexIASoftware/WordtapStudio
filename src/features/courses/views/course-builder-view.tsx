"use client";

import { useCourseBuilder } from "../hooks/use-course-builder";
import { CourseBuilderWorkspace } from "../components/builder/course-builder-workspace";
import { ToastNotification } from "@/components/ui/toast-notification";

interface CourseBuilderViewProps {
  initialCourseId?: string;
  scope?: "teacher" | "admin";
}

export function CourseBuilderView({
  initialCourseId,
  scope = "teacher",
}: CourseBuilderViewProps = {}) {
  const b = useCourseBuilder(initialCourseId, { scope });

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden relative">
      <ToastNotification message={b.toastMessage} variant="emerald" />
      <CourseBuilderWorkspace
        courses={b.courses}
        currentCourseId={b.currentCourseId}
        currentCourse={b.currentCourse}
        currentLessonId={b.currentLessonId}
        currentLesson={b.currentLesson}
        currentStepId={b.currentStepId}
        stepForm={b.stepForm}
        isLoading={b.isLoading}
        activeCanvasTab={b.activeCanvasTab}
        simScreen={b.simScreen}
        simTier={b.simTier}
        isSimLessonCompleted={b.isSimLessonCompleted}
        simGameSelected={b.simGameSelected}
        simGameMatched={b.simGameMatched}
        showNewCourseModal={b.showNewCourseModal}
        showEditCourseModal={b.showEditCourseModal}
        showPricingModal={b.showPricingModal}
        showAddLessonModal={b.showAddLessonModal}
        editingLesson={b.editingLesson}
        showAddStepModal={b.showAddStepModal}
        showExportModal={b.showExportModal}
        showPlaytestDrawer={b.showPlaytestDrawer}
        showVaultDrawer={b.showVaultDrawer}
        showSubmitReviewModal={b.showSubmitReviewModal}
        onSelectCourse={b.handleSelectCourse}
        onCreateCourse={b.handleCourseCreated}
        onLessonCreated={b.handleLessonCreated}
        onSelectLesson={b.handleSelectLesson}
        onSelectStep={b.handleStepSelect}
        onStepFormChange={b.setStepForm}
        onSaveStep={b.handleSaveStep}
        isSavingStep={b.isSavingStep}
        onDeleteStep={b.handleDeleteStep}
        onAddCard={b.handleAddCard}
        onSpeak={b.speak}
        onSubmitReview={b.handleSubmitReview}
        onWithdrawReview={b.handleWithdrawReview}
        onRefresh={b.handleRefreshCourses}
        onSaveCourse={b.handleEditCourse}
        onDeleteCourse={b.handleDeleteCourse}
        onSaveLesson={b.handleSaveLesson}
        onDeleteLesson={b.handleDeleteLesson}
        onSavePrice={b.handleSavePrice}
        onOpenModal={b.handleOpenModal}
        onCloseModal={b.handleCloseModal}
        onSetCanvasTab={b.setActiveCanvasTab}
        onSetSimScreen={b.setSimScreen}
        onToggleSimTier={b.toggleSimTier}
        onToggleSimLessonCompleted={b.toggleSimLessonCompleted}
        onSelectSimLesson={b.handleSelectSimLesson}
        onSimGameCardClick={b.handleSimGameCardClick}
        onResetSimGame={b.handleResetSimGame}
        onToast={b.triggerToast}
        onCopyExport={() => b.triggerToast("¡Copia de seguridad copiada al portapapeles!")}
      />
    </div>
  );
}
