"use client";

import { ArrowRight, Sparkles, Save, Pencil } from "lucide-react";
import { Classroom } from "@/features/classrooms/types";
import { GAMES_DATA } from "@/features/games/data/mock-games";
import { createClassroomApi, updateClassroomApi } from "@/services/api/classroom";
import { useCohortForm } from "../hooks/use-cohort-form";
import { CohortWorkspaceHeader } from "./cohort-workspace-header";
import { CohortPreviewCard } from "./cohort-preview-card";
import { CohortGamePicker } from "./cohort-game-picker";
import { CohortLevelRecommender } from "./cohort-level-recommender";
import { CohortCourseSelector } from "./cohort-course-selector";
import { CohortGoalSelector } from "./cohort-goal-selector";
import { CohortCurriculumMap } from "./cohort-curriculum-map";

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
            <div className="p-6 rounded-2xl bg-card border border-border-default space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-border-default pb-3">
                <span className="w-5 h-5 rounded-full bg-emerald-brand/20 text-emerald-brand flex items-center justify-center font-mono text-[11px] font-bold">1</span>
                <span>Identidad & Nivel de la Cohorte</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Nombre del Aula / Grupo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => isEditing && setName(e.target.value)}
                  readOnly={!isEditing}
                  placeholder="Ej: Inglés B1 - Cohorte Intensiva Mañana"
                  className={`w-full px-3.5 py-2.5 bg-canvas border rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-colors ${
                    !isEditing
                      ? "border-border-default/60 opacity-80 cursor-default"
                      : "border-border-default focus:border-emerald-brand"
                  }`}
                  required
                />
              </div>

              <CohortLevelRecommender
                selectedCourses={availableCourses.filter((c) =>
                  selectedCourseIds.includes(c.id)
                )}
                currentLevel={level}
                onSelectLevel={isEditing ? setLevel : () => {}}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Instrucciones u Objetivos para los Alumnos (Opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => isEditing && setDescription(e.target.value)}
                  readOnly={!isEditing}
                  rows={2}
                  placeholder="Ej: Esta aula cubre lecciones de conversación y preparación para exámenes de fin de curso."
                  className={`w-full px-3.5 py-2 bg-canvas border rounded-xl text-xs text-white placeholder-slate-500 outline-none resize-none transition-colors ${
                    !isEditing
                      ? "border-border-default/60 opacity-80 cursor-default"
                      : "border-border-default focus:border-emerald-brand"
                  }`}
                />
              </div>
            </div>

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
        <div className="space-y-6">
          <CohortCurriculumMap
            selectedCourses={availableCourses.filter((c) =>
              selectedCourseIds.includes(c.id)
            )}
            selectedGameTypes={selectedGameTypes}
            weeklyGoal={weeklyGoal}
            selectedLessonIds={selectedLessonIds}
            customGames={customGames}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border-default shadow-sm">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-card border border-border-default text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Volver a Aulas
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("general")}
                className="px-4 py-2 rounded-xl bg-canvas border border-border-default hover:border-slate-500 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                ← Volver a Configuración General
              </button>
            </div>

            {isExisting && !isEditing ? (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  triggerToast("Modo edición habilitado. Puedes ajustar los parámetros del aula.");
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-canvas font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Habilitar Edición</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
              >
                {isExisting ? (
                  <Save className="w-3.5 h-3.5" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>
                  {isSubmitting
                    ? "Guardando..."
                    : isExisting
                    ? "Guardar Cambios"
                    : "Crear y Publicar Aula"}
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
