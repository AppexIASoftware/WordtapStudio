"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSpeak } from "@/hooks/use-speak";
import Link from "next/link";
import {
  Smartphone,
  Layers,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Gamepad2,
  ShieldCheck,
} from "lucide-react";
import { COURSES_DATA } from "@/features/courses/data/mock-courses";
import { Course, Lesson } from "@/features/courses/types";;
import { getCourseDetailApi, getAdminCourseReviewsApi } from "@/services/api";
import { mapApiLessonToLesson } from "@/features/courses/utils/course-mapper";
import { PlaytestDrawer } from "@/features/games/components/playtest-drawer";
import { ToastNotification } from "@/components/ui/toast-notification";
import { ModeratorLessonInspector } from "@/features/moderation/components/moderator-lesson-inspector";

export function ModeratorCoursesView() {
  const searchParams = useSearchParams();
  const queryCourseId = searchParams?.get("courseId");
  const queryPrId = searchParams?.get("pr");
  const fromUrl = searchParams?.get("from") || "/approvals";

  const [courseList, setCourseList] = useState<{ id: string; title: string; status?: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    queryCourseId || "c-2"
  );

  const returnUrl = useMemo(() => {
    const base = fromUrl || "/approvals";
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
      currency: "USD",
      author: "Cargando...",
      lessons: [],
    };
  });
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"cards" | "simulator" | "games">("cards");
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
            price: typeof res.data.price_cents === "number" ? res.data.price_cents / 100 : 19.99,
            currency: "USD",
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

      {/* Barra Superior de Navegación de Auditoría */}
      <div className="h-14 border-b border-border-default bg-card px-4 md:px-6 flex items-center justify-between flex-shrink-0 gap-3">
        <div className="flex items-center gap-2.5 overflow-x-auto min-w-0">
          <Link
            href={returnUrl}
            className="p-1.5 rounded-xl bg-canvas border border-border-default hover:border-blue-400 text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
            title="Volver a la cola de revisiones y solicitudes"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {queryCourseId ? (
            <div className="flex items-center gap-2 max-w-[260px] md:max-w-sm truncate">
              <span className="text-xs font-mono text-slate-muted uppercase tracking-wider flex-shrink-0 hidden sm:inline">
                Curso:
              </span>
              <span className="text-xs font-bold text-white bg-canvas px-3 py-1.5 rounded-xl border border-border-default truncate">
                {currentCourse.title}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-300 font-bold flex-shrink-0">
                {(currentCourse.status as string) === "in_review" || (currentCourse.status as string) === "pending"
                  ? "• En Revisión"
                  : (currentCourse.status as string) === "changes_requested"
                  ? "• Correcciones"
                  : "• Auditoría"}
              </span>
            </div>
          ) : (
            <>
              <span className="text-xs font-mono text-slate-muted uppercase tracking-wider flex-shrink-0 hidden sm:inline">
                Curso:
              </span>

              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default text-xs font-semibold text-white focus:border-blue-500 outline-none cursor-pointer truncate max-w-[220px] md:max-w-xs"
              >
                {courseList.map((c) => (
                  <option key={c.id} value={c.id} className="bg-canvas text-white">
                    {c.title}{" "}
                    {c.status === "in_review" || c.status === "pending"
                      ? "• [En Revisión]"
                      : c.status === "changes_requested"
                      ? "• [Correcciones Pedidas]"
                      : ""}
                  </option>
                ))}
              </select>
            </>
          )}

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Auditoría Solo Lectura</span>
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-slate-muted hidden md:inline truncate">
            Docente: <strong className="text-slate-200">{currentCourse.author}</strong>
          </span>

          {currentLesson && (
            <button
              type="button"
              onClick={() => setShowPlaytestDrawer(true)}
              className="px-3 py-1.5 rounded-xl bg-card border border-emerald-brand/50 hover:border-emerald-brand text-emerald-brand hover:bg-emerald-brand/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Abrir Simulador Móvil React Native en Drawer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Playtest Móvil</span>
            </button>
          )}

          <Link
            href={returnUrl}
            className="px-3.5 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Emitir Dictamen</span>
          </Link>
        </div>
      </div>

      {/* Espacio de Trabajo Principal (Visual Parity con el Creador de Cursos) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel Izquierdo: Lista de Lecciones del Curso */}
        <div className="w-72 lg:w-80 border-r border-border-default bg-canvas/60 flex flex-col flex-shrink-0">
          <div className="p-3.5 border-b border-border-default bg-card/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Unidades Curriculares
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {currentCourse.lessons.length} unidades
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
            {isLoading ? (
              <div className="p-8 text-center text-slate-muted flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                <span className="text-xs font-mono">Cargando lecciones...</span>
              </div>
            ) : currentCourse.lessons.length === 0 ? (
              <div className="p-6 text-center text-slate-muted text-xs">
                No hay lecciones registradas en este curso.
              </div>
            ) : (
              currentCourse.lessons.map((lesson, idx) => {
                const isSelected = lesson.id === currentLesson?.id;
                return (
                  <div
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-500/15 border-blue-500/50 text-white shadow-sm"
                        : "bg-card border-border-default hover:border-slate-500 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-mint-brand font-bold">
                        Unidad #{idx + 1}
                      </span>
                      <span className="text-[10px] text-slate-muted font-mono">
                        {lesson.items?.length === 1 ? "1 ficha" : `${lesson.items?.length || 0} fichas`}
                      </span>
                    </div>
                    <h5 className="font-bold text-white text-xs mt-1 truncate">{lesson.title}</h5>
                    {lesson.subtitle && (
                      <p className="text-[11px] text-slate-muted truncate mt-0.5">
                        {lesson.subtitle}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel Derecho: Canvas de Inspección */}
        <div className="flex-1 flex flex-col bg-canvas overflow-hidden">
          {/* Barra de Pestañas del Canvas */}
          <div className="h-12 border-b border-border-default bg-card px-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("cards")}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === "cards"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Tarjetas Pedagógicas</span>
                {currentLesson && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
                    {currentLesson.items?.length || 0}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("simulator")}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === "simulator"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Simulador Playtest</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("games")}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === "games"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Juegos Didácticos</span>
              </button>
            </div>

            {currentLesson && (
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                Lección Activa: <strong className="text-white">{currentLesson.title}</strong>
              </span>
            )}
          </div>

          {/* Contenido Modular del Inspector */}
          <div className="flex-1 overflow-y-auto p-5">
            <ModeratorLessonInspector
              currentLesson={currentLesson}
              activeTab={activeTab}
              onSpeak={speak}
              onOpenPlaytestDrawer={() => setShowPlaytestDrawer(true)}
            />
          </div>
        </div>
      </div>

      {/* Drawer de Playtest Móvil */}
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
