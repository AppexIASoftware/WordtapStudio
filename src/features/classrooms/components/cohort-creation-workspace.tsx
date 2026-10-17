"use client";

import { ArrowRight, Sparkles, Save, Pencil } from "lucide-react";
import { Classroom } from "@/features/classrooms/types";
import { GAMES_DATA } from "@/features/games/data/mock-games";
import { createClassroomApi, updateClassroomApi } from "@/services/api/classroom";
import { useCohortForm } from "../hooks/use-cohort-form";
import { CohortWorkspaceHeader } from "./cohort-workspace-header";
import { CohortPreviewCard } from "./cohort-preview-card";
import { CohortIdentityCard } from "./cohort-identity-card";
import { CohortCurriculumPanel } from "./cohort-curriculum-panel";
import { CohortGamePicker } from "./cohort-game-picker";
import { CohortCourseSelector } from "./cohort-course-selector";
import { CohortGoalSelector } from "./cohort-goal-selector";

interface CohortCreationWorkspaceProps {
  onCancel: () => void;
  onClassroomCreated: (classroom: Classroom) => void;
  onClassroomUpdated?: (classroom: Classroom) => void;
  triggerToast: (msg: string) => void;
  initialClassroom?: Classroom | null;
  initialMode?: "create" | "view";
}

export function CohortCreationWorkspace({
  onCancel,
  onClassroomCreated,
  onClassroomUpdated,
  triggerToast,
  initialClassroom,
  initialMode = "create",
}: CohortCreationWorkspaceProps) {
  const {
    isExisting,
    isEditing,
    setIsEditing,
    name,
    setName,
    level,
    setLevel,
    description,
    setDescription,
    availableCourses,
    selectedCourseIds,
    selectedLessonIds,
    selectedGameTypes,
    customGames,
    weeklyGoal,
    setWeeklyGoal,
    activeTab,
    isSubmitting,
    setIsSubmitting,
    toggleCourse,
    toggleLesson,
    toggleAllLessonsForCourse,
    toggleGame,
    handleCancelEdit,
    handleTabChange,
    levelPrefix,
    simulatedCode,
    primaryCourse,
  } = useCohortForm({ initialClassroom, initialMode });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      triggerToast("El nombre del aula es obligatorio.");
      return;
    }

    if (selectedCourseIds.length === 0) {
      triggerToast("Debes seleccionar al menos un curso temático.");
      return;
    }

    if (selectedLessonIds.length === 0) {
      triggerToast("Debes seleccionar al menos una lección para estructurar el plan de estudio.");
      return;
    }

    if (selectedGameTypes.length === 0) {
      triggerToast("Debes habilitar al menos un minijuego interactivo.");
      return;
    }

    setIsSubmitting(true);
    const primaryTitle = primaryCourse ? primaryCourse.title : "Curso Asignado";

    // Actualización de aula existente en API
    if (isExisting && initialClassroom) {
      const fallbackUpdated: Classroom = {
        ...initialClassroom,
        name: trimmedName,
        level,
        courseId: selectedCourseIds[0] || initialClassroom.courseId,
        courseTitle: primaryTitle,
        assignedCourses: selectedCourseIds,
        activeGames: selectedGameTypes,
        weeklyGoalWords: weeklyGoal,
      };

      try {
        const res = await updateClassroomApi(initialClassroom.id, {
          name: trimmedName,
          level,
          course_id: selectedCourseIds[0] || initialClassroom.courseId,
          course_ids: selectedCourseIds,
          game_ids: selectedGameTypes,
          weekly_goal_words: weeklyGoal,
          description: description.trim() || undefined,
        });

        if (res.data) {
          const apiUpdated: Classroom = {
            ...fallbackUpdated,
            ...res.data,
            courseTitle: res.data.courseTitle || primaryTitle,
          };
          if (onClassroomUpdated) {
            onClassroomUpdated(apiUpdated);
          }
          triggerToast(`¡Aula "${trimmedName}" actualizada con éxito!`);
          setIsSubmitting(false);
          setIsEditing(false);
          return;
        }
      } catch {
        // Fallback local seguro ante desconexión
      }

      if (onClassroomUpdated) {
        onClassroomUpdated(fallbackUpdated);
      }
      triggerToast(`¡Aula "${trimmedName}" actualizada con éxito!`);
      setIsSubmitting(false);
      setIsEditing(false);
      return;
    }

    // Creación de nueva aula en API
    try {
      const res = await createClassroomApi({
        name: trimmedName,
        level,
        course_id: selectedCourseIds[0],
        course_ids: selectedCourseIds,
        game_ids: selectedGameTypes,
        weekly_goal_words: weeklyGoal,
        description: description.trim() || undefined,
      });

      if (res.data) {
        onClassroomCreated({
          id: res.data.id,
          name: res.data.name,
          code: res.data.code,
          courseId: res.data.courseId || selectedCourseIds[0] || "c-1",
          courseTitle: res.data.courseTitle || primaryTitle,
          assignedCourses: selectedCourseIds,
          activeGames: selectedGameTypes,
          weeklyGoalWords: weeklyGoal,
          level: res.data.level || level,
          created: res.data.created || "Hoy",
          studentsCount: res.data.studentsCount || 0,
          stats: res.data.stats || { sub: 0, trial: 0, free: 0, scholar: 0 },
          stumble: res.data.stumble || [],
          students: res.data.students || [],
          isDemo: false,
        });
        triggerToast(`¡Aula "${res.data.name}" creada con código ${res.data.code}!`);
        setIsSubmitting(false);
        return;
      }
    } catch {
      // Fallback local seguro
    }

    const fallbackCode = `WT-${levelPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fallbackClassroom: Classroom = {
      id: `cls-${Date.now()}`,
      name: trimmedName,
      code: fallbackCode,
      courseId: selectedCourseIds[0] || "c-1",
      courseTitle: primaryTitle,
      assignedCourses: selectedCourseIds,
      activeGames: selectedGameTypes,
      weeklyGoalWords: weeklyGoal,
      level,
      created: "Hoy",
      studentsCount: 0,
      stats: { sub: 0, trial: 0, free: 0, scholar: 0 },
      stumble: [],
      students: [],
      isDemo: true,
    };

    onClassroomCreated(fallbackClassroom);
    triggerToast(`¡Aula "${trimmedName}" creada con código ${fallbackCode}!`);
    setIsSubmitting(false);
  };

  return (
    <div id="cohort-workspace-top" className="space-y-6">
      <CohortWorkspaceHeader
        name={name || initialClassroom?.name || "Nueva Cohorte"}
        code={initialClassroom?.code}
        isExisting={isExisting}
        isEditing={isEditing}
        activeTab={activeTab}
        selectedCourseCount={selectedCourseIds.length}
        selectedActivityCount={selectedGameTypes.length}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onEnableEdit={() => {
          setIsEditing(true);
          triggerToast("Modo edición habilitado. Puedes ajustar los parámetros del aula.");
        }}
        onCancelEdit={handleCancelEdit}
        onSubmit={handleSubmit}
        onTabChange={handleTabChange}
      />

      {activeTab === "general" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <CohortIdentityCard
              name={name}
              isEditing={isEditing}
              onNameChange={setName}
              description={description}
              onDescriptionChange={setDescription}
              level={level}
              onSelectLevel={isEditing ? setLevel : () => {}}
              selectedCourses={availableCourses.filter((c) =>
                selectedCourseIds.includes(c.id)
              )}
            />


                <CohortCourseSelector
                  availableCourses={availableCourses}
                  selectedCourseIds={selectedCourseIds}
                  selectedLessonIds={selectedLessonIds}
                  onToggleCourse={toggleCourse}
                  onToggleLesson={toggleLesson}
                  onToggleAllLessonsForCourse={toggleAllLessonsForCourse}
                />

                <CohortGamePicker
                  selectedGameTypes={selectedGameTypes}
                  onToggleGame={toggleGame}
                  customGames={customGames}
                  isReadOnly={!isEditing}
                />

                <CohortGoalSelector
                  weeklyGoal={weeklyGoal}
                  onSelectGoal={isEditing ? setWeeklyGoal : () => {}}
                />

                <div className="p-4 rounded-2xl bg-card border border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                  <div>
                    <p className="text-xs font-bold text-white">¿Deseas inspeccionar la ruta pedagógica?</p>
                    <p className="text-[11px] text-slate-muted">
                      Visualiza las estaciones de aprendizaje, retos y minijuegos secuenciados.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabChange("curriculum")}
                    className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm whitespace-nowrap self-start sm:self-auto"
                  >
                    <span>Ver Mapa Pedagógico</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 sticky top-6 space-y-4">
                <CohortPreviewCard
                  name={name}
                  level={level}
                  simulatedCode={simulatedCode}
                  selectedCourseCount={selectedCourseIds.length}
                  selectedGameCount={selectedGameTypes.length}
                  totalGamesCount={GAMES_DATA.length}
                  weeklyGoal={weeklyGoal}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                  onCancel={onCancel}
                  isViewOnly={isExisting && !isEditing}
                  onEnableEdit={() => {
                    setIsEditing(true);
                    triggerToast("Modo edición habilitado. Puedes ajustar los parámetros del aula.");
                  }}
                  submitLabel={isExisting ? "Guardar Cambios" : "Confirmar y Crear Aula"}
                  cancelLabel={isExisting && !isEditing ? "Volver a Aulas" : "Cancelar"}
                />
              </div>
            </div>
          ) : (
        <CohortCurriculumPanel
          selectedCourses={availableCourses.filter((c) =>
            selectedCourseIds.includes(c.id)
          )}
          selectedGameTypes={selectedGameTypes}
          weeklyGoal={weeklyGoal}
          selectedLessonIds={selectedLessonIds}
          customGames={customGames}
          isExisting={isExisting}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
          onBackToGeneral={() => handleTabChange("general")}
          onEnableEdit={() => {
            setIsEditing(true);
            triggerToast("Modo edición habilitado. Puedes ajustar los parámetros del aula.");
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
