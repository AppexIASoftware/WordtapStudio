"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Classroom, Course } from "../../types";
import { MOCK_COURSES_LIST, GAMES_DATA } from "../../data/mock-teacher-data";
import { createClassroomApi } from "@/services/api/classroom";
import { getTeacherCoursesApi } from "@/services/api/courses";
import { mapApiLessonToLesson } from "../../utils/course-mapper";
import { CohortPreviewCard } from "./cohort-preview-card";
import { CohortGamePicker } from "./cohort-game-picker";
import { CohortLevelRecommender } from "./cohort-level-recommender";
import { CohortCourseSelector } from "./cohort-course-selector";
import { CohortGoalSelector } from "./cohort-goal-selector";
import { CohortCurriculumMap } from "./cohort-curriculum-map";

interface CohortCreationWorkspaceProps {
  onCancel: () => void;
  onClassroomCreated: (classroom: Classroom) => void;
  triggerToast: (msg: string) => void;
}

export function CohortCreationWorkspace({
  onCancel,
  onClassroomCreated,
  triggerToast,
}: CohortCreationWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [name, setName] = useState("");
  const [level, setLevel] = useState("B1 Intermediate");
  const [description, setDescription] = useState("");
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [selectedGameTypes, setSelectedGameTypes] = useState<string[]>([
    "match",
    "memory",
    "listening",
    "multiple_choice",
    "speed_translation",
    "word_scramble",
  ]);
  const [weeklyGoal, setWeeklyGoal] = useState(50);
  const [activeTab, setActiveTab] = useState<"general" | "curriculum">(
    searchParams.get("tab") === "curriculum" ? "curriculum" : "general"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || searchParams.get("step");
    if (tabFromUrl === "curriculum") {
      setActiveTab("curriculum");
    } else if (tabFromUrl === "general") {
      setActiveTab("general");
    }
  }, [searchParams]);

  const resetScroll = () => {
    if (typeof window === "undefined") return;
    const performReset = () => {
      const topEl = document.getElementById("cohort-workspace-top");
      if (topEl) {
        topEl.scrollIntoView({ behavior: "instant", block: "start" });
      }
      const mainEl = document.querySelector("main");
      if (mainEl) {
        mainEl.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    };

    performReset();
    requestAnimationFrame(performReset);
    setTimeout(performReset, 50);
  };

  const handleTabChange = (tab: "general" | "curriculum") => {
    setActiveTab(tab);
    resetScroll();
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "create");
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    resetScroll();
  }, [activeTab]);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await getTeacherCoursesApi();
        if (res.data && res.data.length > 0) {
          // Datos reales de la API (DB): preservar lecciones y palabras reales del docente
          const mapped: Course[] = res.data.map((c) => ({
            id: c.id,
            title: c.title,
            level: c.level,
            tier: c.access_tier === "free" ? "free" : "course",
            price: (c.price_cents || 0) / 100,
            currency: "USD",
            author: c.author?.name || "Docente",
            status: c.status,
            isDemo: false,
            lessons: (c.lessons || []).map((l) => mapApiLessonToLesson(l)),
          }));
          setAvailableCourses(mapped);
          setSelectedCourseIds([mapped[0].id]);
          setSelectedLessonIds(mapped[0]?.lessons?.map((l) => l.id) || []);
        } else {
          // El demo SOLO se muestra si no hay información de la API de la DB
          const demoCourses = MOCK_COURSES_LIST.map((c) => ({ ...c, isDemo: true }));
          setAvailableCourses(demoCourses);
          setSelectedCourseIds([demoCourses[0].id]);
          setSelectedLessonIds(demoCourses[0]?.lessons?.map((l) => l.id) || []);
        }
      } catch {
        // En caso de fallo de conexión a la API
        const demoCourses = MOCK_COURSES_LIST.map((c) => ({ ...c, isDemo: true }));
        setAvailableCourses(demoCourses);
        setSelectedCourseIds([demoCourses[0].id]);
        setSelectedLessonIds(demoCourses[0]?.lessons?.map((l) => l.id) || []);
      }
    }
    loadCourses();
  }, []);

  const toggleCourse = (id: string) => {
    const course = availableCourses.find((c) => c.id === id);
    const courseLessonIds = course?.lessons?.map((l) => l.id) || [];

    setSelectedCourseIds((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        setSelectedLessonIds((prevLessons) =>
          prevLessons.filter((lId) => !courseLessonIds.includes(lId))
        );
        return prev.filter((c) => c !== id);
      } else {
        setSelectedLessonIds((prevLessons) => [
          ...prevLessons,
          ...courseLessonIds.filter((lId) => !prevLessons.includes(lId)),
        ]);
        return [...prev, id];
      }
    });
  };

  const toggleLesson = (lessonId: string, courseId: string) => {
    if (!selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds((prev) => [...prev, courseId]);
    }
    setSelectedLessonIds((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const toggleAllLessonsForCourse = (courseId: string) => {
    const course = availableCourses.find((c) => c.id === courseId);
    const courseLessonIds = course?.lessons?.map((l) => l.id) || [];
    const allActive = courseLessonIds.every((id) => selectedLessonIds.includes(id));

    if (allActive) {
      setSelectedLessonIds((prev) => prev.filter((id) => !courseLessonIds.includes(id)));
    } else {
      setSelectedLessonIds((prev) => [
        ...prev,
        ...courseLessonIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const toggleGame = (type: string) => {
    setSelectedGameTypes((prev) =>
      prev.includes(type) ? prev.filter((g) => g !== type) : [...prev, type]
    );
  };

  const levelPrefix = level.substring(0, 2).toUpperCase();
  const simulatedCode = `WT-${levelPrefix}-9420`;
  const primaryCourse =
    availableCourses.find((c) => c.id === selectedCourseIds[0]) || availableCourses[0];

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
      {/* Barra de Navegación del Workspace */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl bg-card border border-border-default hover:border-emerald-brand text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Configuración de Nueva Cohorte Pedagógica</span>
            </h1>
            <p className="text-xs text-slate-muted">
              Define los cursos temáticos, mecánicas interactivas y metas de aprendizaje para tu aula privada.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Creando..." : "Crear y Publicar Aula"}</span>
          </button>
        </div>
      </div>

      {/* Navegación por Pestañas del Workspace */}
      <div className="flex items-center gap-2 border-b border-border-default pb-3">
        <button
          type="button"
          onClick={() => handleTabChange("general")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "general"
              ? "bg-emerald-brand text-canvas shadow-sm"
              : "bg-card border border-border-default text-slate-400 hover:text-white"
          }`}
        >
          <span>1. Configuración General & Cursos</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20">
            {selectedCourseIds.length} cursos
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("curriculum")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "curriculum"
              ? "bg-emerald-brand text-canvas shadow-sm"
              : "bg-card border border-border-default text-slate-400 hover:text-white"
          }`}
        >
          <span>2. Mapa de Progresión Pedagógica</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/30">
            {selectedGameTypes.length} actividades
          </span>
        </button>
      </div>

      {activeTab === "general" ? (
        /* Vista de Configuración General: 2 Columnas (65% / 35% Live Preview) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda: Pasos 1 a 4 */}
          <div className="lg:col-span-8 space-y-6">
            {/* Paso 1: Identidad del Aula */}
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
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Inglés B1 - Cohorte Intensiva Mañana"
                  className="w-full px-3.5 py-2.5 bg-canvas border border-border-default rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-brand"
                  required
                />
              </div>

              <CohortLevelRecommender
                selectedCourses={availableCourses.filter((c) =>
                  selectedCourseIds.includes(c.id)
                )}
                currentLevel={level}
                onSelectLevel={setLevel}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Instrucciones u Objetivos para los Alumnos (Opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Ej: Esta aula cubre lecciones de conversación y preparación para exámenes de fin de curso."
                  className="w-full px-3.5 py-2 bg-canvas border border-border-default rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-brand resize-none"
                />
              </div>
            </div>

            {/* Paso 2: Cursos del Plan de Estudio */}
            <CohortCourseSelector
              availableCourses={availableCourses}
              selectedCourseIds={selectedCourseIds}
              selectedLessonIds={selectedLessonIds}
              onToggleCourse={toggleCourse}
              onToggleLesson={toggleLesson}
              onToggleAllLessonsForCourse={toggleAllLessonsForCourse}
            />

            {/* Paso 3: Minijuegos Habilitados */}
            <CohortGamePicker
              selectedGameTypes={selectedGameTypes}
              onToggleGame={toggleGame}
            />

            {/* Paso 4: Metas Pedagógicas */}
            <CohortGoalSelector
              weeklyGoal={weeklyGoal}
              onSelectGoal={setWeeklyGoal}
            />

            {/* Banner de Avance al Paso 2 */}
            <div className="p-4 rounded-2xl bg-card border border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div>
                <p className="text-xs font-bold text-white">¿Listo con los cursos y actividades?</p>
                <p className="text-[11px] text-slate-muted">
                  Personaliza la secuencia didáctica y el orden de las estaciones pedagógicas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleTabChange("curriculum")}
                className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm whitespace-nowrap self-start sm:self-auto"
              >
                <span>Personalizar Mapa Pedagógico</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Columna Derecha: Live Preview Sticky */}
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
            />
          </div>
        </div>
      ) : (
        /* Vista Panorámica: Mapa de Progresión Pedagógica (Ancho Completo) */
        <div className="space-y-6">
          <CohortCurriculumMap
            selectedCourses={availableCourses.filter((c) =>
              selectedCourseIds.includes(c.id)
            )}
            selectedGameTypes={selectedGameTypes}
            weeklyGoal={weeklyGoal}
            selectedLessonIds={selectedLessonIds}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border-default shadow-sm">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("general")}
                className="px-4 py-2 rounded-xl bg-canvas border border-border-default hover:border-slate-500 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                ← Volver a Configuración General
              </button>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Creando..." : "Crear y Publicar Aula"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
