"use client";

import { ToastNotification } from "@/components/ui/toast-notification";
import { useStudentsProgress } from "../hooks/use-students-progress";
import { CohortCardsGrid } from "../components/cohort-cards-grid";
import { CohortStumbleCards } from "../components/cohort-stumble-cards";
import { ClassroomsHeader } from "../components/classrooms-header";
import { CohortManagementPanel } from "../components/cohort-management-panel";
import { CohortsSkeleton } from "../components/cohorts-skeleton";
import { GlobalStudentsTable } from "../components/global-students-table";
import { CohortCreationWorkspace } from "../components/cohort-creation-workspace";
import { StumbleReinforcementDrawer } from "../components/stumble-reinforcement-drawer";
import { BroadcastClassroomModal } from "../components/broadcast-classroom-modal";

export function StudentsProgressView() {
  const s = useStudentsProgress();

  if (s.viewMode === "create" || s.viewMode === "detail") {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <ToastNotification message={s.toastMessage} variant="emerald" />
        <CohortCreationWorkspace
          initialClassroom={s.viewMode === "detail" ? s.detailClassroom : null}
          initialMode={s.viewMode === "detail" ? "view" : "create"}
          onCancel={s.handleCloseWorkspace}
          onClassroomCreated={(newCls) => {
            s.setClassrooms((prev) => [newCls, ...prev]);
            s.setSelectedClassId(newCls.id);
            s.handleCloseWorkspace();
          }}
          onClassroomUpdated={(updatedCls) => {
            s.setClassrooms((prev) =>
              prev.map((c) => (c.id === updatedCls.id ? updatedCls : c))
            );
            s.setDetailClassroom(updatedCls);
            s.triggerToast(`¡Aula "${updatedCls.name}" actualizada con éxito!`);
          }}
          triggerToast={s.triggerToast}
        />

        <BroadcastClassroomModal
          classroom={s.broadcastClassroom}
          isOpen={!!s.broadcastClassroom}
          onClose={s.handleCloseBroadcast}
          onSuccess={() => s.triggerToast("¡Aviso publicado con éxito a los alumnos!")}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <ToastNotification message={s.toastMessage} variant="emerald" />
      <ClassroomsHeader
        classroomsCount={s.classrooms.length}
        mainTab={s.mainTab}
        onTabChange={s.setMainTab}
        onCreateClassroom={s.handleOpenCreate}
        onExportCsv={s.handleExportCsv}
      />

      {s.mainTab === "cohorts" && (
        s.isLoadingClassrooms ? (
          <CohortsSkeleton />
        ) : (
          <div className="space-y-6">
            <CohortCardsGrid
              classrooms={s.classrooms}
              selectedClassId={s.selectedClassId}
              onSelectClassroom={s.setSelectedClassId}
              onCopyCode={s.copyCode}
              onShareWhatsApp={s.shareWhatsApp}
              onOpenClassroomDetail={s.handleOpenDetail}
              onBroadcast={s.handleOpenBroadcast}
            />

            {s.classrooms.length > 0 && (
              <>
                <CohortStumbleCards
                  stumbles={s.selectedClass.stumble}
                  studentsCount={s.selectedClass.studentsCount}
                  isDemo={s.selectedClass.isDemo}
                  onOpenReinforcementDrawer={() => s.setShowReinforcementDrawer(true)}
                />

                <CohortManagementPanel
                  selectedClass={s.selectedClass}
                  cohortSubTab={s.cohortSubTab}
                  onSubTabChange={s.setCohortSubTab}
                  filteredStudents={s.filteredStudents}
                  cohortFilter={s.cohortFilter}
                  onFilterChange={s.setCohortFilter}
                  cohortSearch={s.cohortSearch}
                  onSearchChange={s.setCohortSearch}
                  onAssignMoreCourses={s.handleOpenCreate}
                  onUpdateActiveGames={(games) => {
                    s.setClassrooms((prev) =>
                      prev.map((c) => (c.id === s.selectedClass.id ? { ...c, activeGames: games } : c))
                    );
                  }}
                  triggerToast={s.triggerToast}
                />
              </>
            )}
          </div>
        )
      )}

      {s.mainTab === "global" && (
        <GlobalStudentsTable
          students={s.globalStudentsState.students}
          courses={s.globalStudentsState.courses}
          total={s.globalStudentsState.total}
          page={s.globalStudentsState.page}
          pageSize={s.globalStudentsState.pageSize}
          onPageChange={s.globalStudentsState.setPage}
          searchQuery={s.globalStudentsState.searchQuery}
          onSearchChange={s.globalStudentsState.setSearchQuery}
          planFilter={s.globalStudentsState.planFilter}
          onPlanFilterChange={s.globalStudentsState.setPlanFilter}
          levelFilter={s.globalStudentsState.levelFilter}
          onLevelFilterChange={s.globalStudentsState.setLevelFilter}
          courseFilter={s.globalStudentsState.courseFilter}
          onCourseFilterChange={s.globalStudentsState.setCourseFilter}
          allowCoursePurchaseFilter
          isLoading={s.globalStudentsState.isLoading}
        />
      )}

      <StumbleReinforcementDrawer
        isOpen={s.showReinforcementDrawer}
        onClose={() => s.setShowReinforcementDrawer(false)}
        stumbles={s.selectedClass.stumble}
        classroomName={s.selectedClass.name}
        studentsCount={s.selectedClass.studentsCount}
        triggerToast={s.triggerToast}
      />

      <BroadcastClassroomModal
        classroom={s.broadcastClassroom}
        isOpen={!!s.broadcastClassroom}
        onClose={s.handleCloseBroadcast}
        onSuccess={() => s.triggerToast("¡Aviso publicado con éxito a los alumnos!")}
      />
    </div>
  );
}
