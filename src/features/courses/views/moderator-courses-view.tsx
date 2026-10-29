"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSpeak } from "@/hooks/use-speak";
import { ModeratorCoursesHeader } from "../components/moderator/moderator-courses-header";
import { ModeratorLessonsSidebar } from "../components/moderator/moderator-lessons-sidebar";
import { ModeratorCoursesCanvas } from "../components/moderator/moderator-courses-canvas";

import { COURSES_DATA } from "@/features/courses/data/mock-courses";
import { Course, Lesson } from "@/features/courses/types";
import { getCourseDetailApi, getAdminCourseReviewsApi } from "@/services/api";
import { mapApiLessonToLesson } from "@/features/courses/utils/course-mapper";
import { PlaytestDrawer } from "@/features/games/components/playtest-drawer";
import { ToastNotification } from "@/components/ui/toast-notification";
import { useUrlParam } from "@/hooks/use-url-params";

const COURSE_TABS = ["cards", "simulator", "games"] as const;

export function ModeratorCoursesView() {
  const searchParams = useSearchParams();
  const queryCourseId = searchParams?.get("courseId");
  const queryPrId = searchParams?.get("pr");
  const fromUrl = searchParams?.get("from") || "/moderator/approvals";

  const [courseList, setCourseList] = useState<{ id: string; title: string; status?: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    queryCourseId || "c-2"
  );

  const returnUrl = useMemo(() => {
    const base = fromUrl || "/moderator/approvals";
    const params = new URLSearchParams();
    if (queryPrId) params.set("pr", queryPrId);
    if (selectedCourseId) params.set("courseId", selectedCourseId);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  }, [fromUrl, queryPrId, selectedCourseId]);
  const [currentCourse, setCurrentCourse] = useState<Course>(() => {
    if (queryCourseId && COURSES_DATA[queryCourseId]) {
      return COURSES_DATA[queryCourseId];
    }
    return {
      id: queryCourseId || "",
      title: "Cargando curso...",
      level: "",
      tier: "free",
      price: 0,
      currency: "PEN",
      author: "Cargando...",
      lessons: [],
    };
  });
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  // La pestaña activa vive en la URL para que la vista sea compartible.
  const [activeTab, setActiveTab] = useUrlParam<"cards" | "simulator" | "games">(
    "tab",
    COURSE_TABS,
    "cards"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPlaytestDrawer, setShowPlaytestDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Carga lista de cursos disponibles (cola de revisiones real de la API sin contaminar con mock)
  useEffect(() => {
    let isMounted = true;
    const loadCoursesList = async () => {
      try {
        const revsRes = await getAdminCourseReviewsApi();
        if (!isMounted) return;

        if (revsRes.data && revsRes.data.length > 0) {
          const map = new Map<string, { id: string; title: string; status?: string }>();
          for (const r of revsRes.data) {
            map.set(r.course_id, {
              id: r.course_id,
              title: r.course?.title || `Curso (${r.course_id.slice(0, 8)})`,
              status: r.status,
            });
          }
          setCourseList(Array.from(map.values()));
          return;
        }
      } catch {
        // Fallback a mock data solo si la API no está disponible
      }

      if (!isMounted) return;
      // Solo en caso de error o sin conexión a la base de datos:
      setCourseList(
        Object.values(COURSES_DATA).map((c) => ({ id: c.id, title: c.title, status: c.status }))
      );
    };

    void loadCoursesList();
    return () => {
      isMounted = false;
    };
  }, []);

  // Carga el curso seleccionado bajo demanda
  useEffect(() => {
    if (queryCourseId && queryCourseId !== selectedCourseId) {
      setSelectedCourseId(queryCourseId);
    }
  }, [queryCourseId, selectedCourseId]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchDetail = async () => {
      try {
        const res = await getCourseDetailApi(selectedCourseId);
        if (!isMounted) return;

        if (res.data) {
          const loadedLessons: Lesson[] = res.data.lessons?.map(mapApiLessonToLesson) || [];
          const c: Course = {
            id: res.data.id,
            title: res.data.title,
            level: res.data.level,
            tier: res.data.access_tier === "course" ? "course" : "free",
            price: typeof res.data.price_cents === "number" ? res.data.price_cents / 100 : 20.00,
            currency: "PEN",
            author: res.data.author?.name || res.data.author?.email || "Docente en Wordtap",
            status: res.data.status,
            lessons: loadedLessons,
          };
          setCurrentCourse(c);
          setSelectedLessonId(loadedLessons[0]?.id || "");
          setCourseList((prev) => {
            if (prev.length === 0) {
              return [{ id: c.id, title: c.title, status: c.status }];
            }
            if (prev.some((item) => item.id === c.id)) {
              return prev.map((item) => (item.id === c.id ? { ...item, title: c.title, status: c.status } : item));
            }
            return [{ id: c.id, title: c.title, status: c.status }, ...prev];
          });
        } else if (COURSES_DATA[selectedCourseId]) {
          const fallback = COURSES_DATA[selectedCourseId];
          setCurrentCourse(fallback);
          setSelectedLessonId(fallback.lessons[0]?.id || "");
        }
      } catch {
        if (!isMounted) return;
        if (COURSES_DATA[selectedCourseId]) {
          const fallback = COURSES_DATA[selectedCourseId];
          setCurrentCourse(fallback);
          setSelectedLessonId(fallback.lessons[0]?.id || "");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [selectedCourseId]);

  const currentLesson = useMemo(() => {
    return currentCourse.lessons.find((l) => l.id === selectedLessonId) || currentCourse.lessons[0] || null;
  }, [currentCourse.lessons, selectedLessonId]);

  const speak = useSpeak({
    onUnavailable: (text) => triggerToast("Pronunciando: " + text),
  });


  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden relative">
      <ToastNotification message={toastMessage} variant="blue" />

      {/* Barra Superior de Navegacion de Auditoria */}
      <ModeratorCoursesHeader
        returnUrl={returnUrl}
        queryCourseId={queryCourseId}
        currentCourse={currentCourse}
        courseList={courseList}
        selectedCourseId={selectedCourseId}
        onSelectCourseId={setSelectedCourseId}
        hasCurrentLesson={!!currentLesson}
        onOpenPlaytest={() => setShowPlaytestDrawer(true)}
      />

      {/* Espacio de Trabajo Principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel Izquierdo: Lista de Lecciones del Curso */}
        <ModeratorLessonsSidebar
          lessons={currentCourse.lessons}
          selectedLessonId={currentLesson?.id || ""}
          isLoading={isLoading}
          onSelectLessonId={setSelectedLessonId}
        />

        {/* Panel Derecho: Canvas de Inspeccion */}
        <ModeratorCoursesCanvas
          currentLesson={currentLesson}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSpeak={speak}
          onOpenPlaytestDrawer={() => setShowPlaytestDrawer(true)}
        />
      </div>

      {/* Drawer de Playtest Movil */}
      {showPlaytestDrawer && currentLesson && (
        <PlaytestDrawer
          isOpen={showPlaytestDrawer}
          currentLesson={currentLesson}
          onClose={() => setShowPlaytestDrawer(false)}
          onSpeak={speak}
        />
      )}
    </div>
  );
}
