"use client";

import { useState, useEffect } from "react";
import { COURSES_DATA, CLASSROOMS_DATA } from "../data/mock-teacher-data";
import { Course, Lesson, LessonItem } from "../types";
import {
  getTeacherCoursesApi,
  submitCourseReviewApi,
  getCourseLessonsApi,
  saveLessonItemApi,
  deleteLessonItemApi,
  ApiCourse,
  ApiLesson,
} from "@/services/api";
import { NewCourseModal } from "../components/new-course-modal";
import { AddLessonModal } from "../components/add-lesson-modal";
import { BuilderHeader } from "../components/builder/builder-header";
import { CourseStructurePanel } from "../components/builder/course-structure-panel";
import { CardsTab } from "../components/builder/cards-tab";
import { GamesTab } from "../components/builder/games-tab";
import { SimulatorTab } from "../components/builder/simulator-tab";
import { PricingModal } from "../components/builder/pricing-modal";
import { ManualCardModal } from "../components/builder/manual-card-modal";
import { ExportJsonModal } from "../components/builder/export-json-modal";
import { VaultDrawer } from "../components/builder/vault-drawer";
import { PlaytestDrawer } from "../components/builder/playtest-drawer";

function mapApiLessonToLesson(apiLesson: ApiLesson): Lesson {
  const items: LessonItem[] = (apiLesson.items && apiLesson.items.length > 0)
    ? apiLesson.items.map((it) => {
        if (it.content_text) {
          try {
            const parsed = JSON.parse(it.content_text);
            return {
              id: it.id,
              en: parsed.en || "Term",
              es: parsed.es || "Significado",
              ipa: parsed.ipa || "",
              pos: parsed.pos || "",
              example: parsed.example || "",
              note: parsed.note || "",
              noteType: parsed.noteType || "bulb",
              itemType: parsed.itemType || it.item_type || "word",
            };
          } catch {
            const parts = it.content_text.split("-");
            return {
              id: it.id,
              en: parts[0]?.trim() || it.content_text,
              es: parts[1]?.trim() || "",
              itemType: it.item_type || "word",
            };
          }
        }
        return {
          id: it.id,
          en: "Vocabulary",
          es: "Traducción",
          itemType: it.item_type || "word",
        };
      })
    : [
        {
          id: `step-${apiLesson.id}-1`,
          en: "learn",
          es: "aprender",
          ipa: "/lɜːrn/",
          pos: "Verbo",
          example: '"I learn English"',
          note: "Verbo esencial",
          noteType: "bulb",
          itemType: "word",
        },
      ];

  return {
    id: apiLesson.id,
    title: apiLesson.title,
    subtitle: apiLesson.description || "Objetivo pedagógico de la lección",
    duration: `${apiLesson.estimated_minutes || 10} min`,
    tier: apiLesson.access_tier || "Draft",
    isPublished: apiLesson.status === "published",
    intro: apiLesson.description || "Bienvenido a esta lección.",
    sectionTitle: "Vocabulario clave",
    items,
  };
}

export function CourseBuilderView() {
  const [courses, setCourses] = useState<Record<string, Course>>(COURSES_DATA);
  const [currentCourseId, setCurrentCourseId] = useState("c-1");
  const currentCourse = courses[currentCourseId] || courses["c-1"];

  const [currentLessonId, setCurrentLessonId] = useState(
    currentCourse.lessons[0]?.id || "lesson-1"
  );
  const currentLesson: Lesson =
    currentCourse.lessons.find((l) => l.id === currentLessonId) ||
    currentCourse.lessons[0];

  const [currentStepId, setCurrentStepId] = useState(
    currentLesson?.items[0]?.id || "step-1"
  );
  const currentStep: LessonItem =
    currentLesson?.items.find((s) => s.id === currentStepId) ||
    currentLesson?.items[0] || {
      id: "step-1",
      en: "be",
      es: "ser/estar",
      ipa: "/biː/",
      pos: "Verbo irregular",
      example: '"I am happy"',
      note: "El verbo más importante",
      noteType: "bulb",
      itemType: "word",
    };

  // Pestaña activa en el lienzo: cards | games | preview
  const [activeCanvasTab, setActiveCanvasTab] = useState<"cards" | "games" | "preview">("cards");

  // Estado del simulador móvil
  const [simScreen, setSimScreen] = useState<"lesson" | "home" | "game">("lesson");
  const [simTier, setSimTier] = useState<"free" | "premium">("free");
  const [isSimLessonCompleted, setIsSimLessonCompleted] = useState(false);
  const [simGameMatched, setSimGameMatched] = useState<string[]>([]);
  const [simGameSelected, setSimGameSelected] = useState<string | null>(null);

  // Modales y Drawers
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPlaytestDrawer, setShowPlaytestDrawer] = useState(false);
  const [showVaultDrawer, setShowVaultDrawer] = useState(false);

  // Notificación tipo toast interna
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    let isMounted = true;
    getTeacherCoursesApi().then(async (res) => {
      if (!isMounted) return;
      if (res.data && res.data.length > 0) {
        const mapped: Record<string, Course> = {};
        for (const c of res.data) {
          let courseLessons: Lesson[] = [];
          if (c.lessons && c.lessons.length > 0) {
            courseLessons = c.lessons.map(mapApiLessonToLesson);
          } else {
            const lessonsRes = await getCourseLessonsApi(c.id);
            if (lessonsRes.data && lessonsRes.data.length > 0) {
              courseLessons = lessonsRes.data.map(mapApiLessonToLesson);
            }
          }

          if (courseLessons.length === 0) {
            courseLessons = [
              {
                id: `l-${c.id}-1`,
                title: "1. Lección Inicial",
                subtitle: "Introducción al curso",
                duration: "10 min",
                tier: "Draft",
                isPublished: false,
                intro: "Bienvenido a este curso interactivo.",
                sectionTitle: "Vocabulario clave",
                items: [
                  {
                    id: `step-${c.id}-1`,
                    en: "learn",
                    es: "aprender",
                    ipa: "/lɜːrn/",
                    pos: "Verbo",
                    example: '"I learn English"',
                    note: "Verbo esencial",
                    noteType: "bulb",
                    itemType: "word",
                  },
                ],
              },
            ];
          }

          mapped[c.id] = {
            id: c.id,
            title: c.title,
            level: c.level,
            tier: c.status === "draft" ? "draft" : "free",
            price: 19.99,
            currency: "USD",
            author: "Docente",
            lessons: courseLessons,
          };
        }

        if (isMounted) {
          setCourses((prev) => ({ ...mapped, ...prev }));
          if (res.data[0]) {
            const firstId = res.data[0].id;
            setCurrentCourseId((prev) => (prev === "c-1" ? firstId : prev));
            const firstLessons = mapped[firstId]?.lessons;
            if (firstLessons && firstLessons[0]) {
              setCurrentLessonId(firstLessons[0].id);
              if (firstLessons[0].items[0]) {
                setCurrentStepId(firstLessons[0].items[0].id);
              }
            }
          }
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCourseCreated = (newApiCourse: ApiCourse) => {
    const defaultLesson: Lesson = {
      id: `l-${newApiCourse.id}-1`,
      title: "1. Lección Inicial",
      subtitle: "Introducción al curso",
      duration: "10 min",
      tier: "Draft",
      isPublished: false,
      intro: "Bienvenido a este curso interactivo.",
      sectionTitle: "Vocabulario esencial",
      items: [
        {
          id: `step-${newApiCourse.id}-1`,
          en: "learn",
          es: "aprender",
          ipa: "/lɜːrn/",
          pos: "Verbo",
          example: '"I learn English"',
          note: "Verbo esencial",
          noteType: "bulb",
          itemType: "word",
        },
      ],
    };

    const createdCourse: Course = {
      id: newApiCourse.id,
      title: newApiCourse.title,
      level: newApiCourse.level,
      tier: "draft",
      price: 19.99,
      currency: "USD",
      author: "Docente",
      lessons: [defaultLesson],
    };

    setCourses((prev) => ({ [newApiCourse.id]: createdCourse, ...prev }));
    setCurrentCourseId(newApiCourse.id);
    setCurrentLessonId(defaultLesson.id);
    handleStepSelect(defaultLesson.items[0]);
    triggerToast(`¡Curso "${newApiCourse.title}" creado con éxito!`);
  };

  const handleLessonCreated = (newLesson: Lesson) => {
    setCourses((prev) => {
      const updated = { ...prev };
      const course = { ...updated[currentCourseId] };
      if (!course) return prev;
      course.lessons = [...course.lessons, newLesson];
      updated[currentCourseId] = course;
      return updated;
    });
    setCurrentLessonId(newLesson.id);
    if (newLesson.items[0]) {
      handleStepSelect(newLesson.items[0]);
    }
    triggerToast(`¡Lección "${newLesson.title}" creada con éxito!`);
  };

  // Reproductor de pronunciación TTS
  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      triggerToast("Pronunciando: " + text);
    }
  };

  // Formulario local del paso seleccionado
  const [stepForm, setStepForm] = useState<LessonItem>({ ...currentStep });

  const handleStepSelect = (step: LessonItem) => {
    setCurrentStepId(step.id);
    setStepForm({ ...step });
  };

  const handleSaveStep = async () => {
    setCourses((prev) => {
      const updated = { ...prev };
      const course = { ...updated[currentCourseId] };
      if (!course) return prev;
      course.lessons = course.lessons.map((les) => {
        if (les.id === currentLessonId) {
          return {
            ...les,
            items: les.items.map((st) => (st.id === stepForm.id ? { ...stepForm } : st)),
          };
        }
        return les;
      });
      updated[currentCourseId] = course;
      return updated;
    });

    const isMock = currentLessonId.startsWith("l-") || currentLessonId.startsWith("lesson-");
    if (!isMock) {
      const isMockStep = stepForm.id.startsWith("step-");
      await saveLessonItemApi(currentLessonId, {
        id: isMockStep ? undefined : stepForm.id,
        item_type: stepForm.itemType || "word",
        content_text: JSON.stringify(stepForm),
        sort_order: 1,
        is_required: true,
      });
    }

    triggerToast("Tarjeta guardada exitosamente");
  };

  const handleDeleteStep = async (id: string) => {
    if (currentLesson.items.length <= 1) {
      triggerToast("La lección debe conservar al menos una tarjeta.");
      return;
    }
    setCourses((prev) => {
      const updated = { ...prev };
      const course = { ...updated[currentCourseId] };
      if (!course) return prev;
      course.lessons = course.lessons.map((les) => {
        if (les.id === currentLessonId) {
          const remaining = les.items.filter((st) => st.id !== id);
          return { ...les, items: remaining };
        }
        return les;
      });
      updated[currentCourseId] = course;
      return updated;
    });
    const remaining = currentLesson.items.filter((st) => st.id !== id);
    if (remaining[0]) {
      handleStepSelect(remaining[0]);
    }

    const isMock = currentLessonId.startsWith("l-") || currentLessonId.startsWith("lesson-");
    const isMockStep = id.startsWith("step-");
    if (!isMock && !isMockStep) {
      await deleteLessonItemApi(currentLessonId, id);
    }
    triggerToast("Tarjeta eliminada");
  };

  const handleAddCard = (stepData: Omit<LessonItem, "id">) => {
    const assignedId = `step-${Date.now()}`;
    const isMockLesson = currentLessonId.startsWith("l-") || currentLessonId.startsWith("lesson-");
    if (!isMockLesson) {
      saveLessonItemApi(currentLessonId, {
        item_type: stepData.itemType || "word",
        content_text: JSON.stringify(stepData),
        sort_order: (currentLesson?.items?.length || 0) + 1,
        is_required: true,
      }).then((res) => {
        if (res.data?.id) {
          setCourses((prev) => {
            const updated = { ...prev };
            const course = { ...updated[currentCourseId] };
            if (!course) return prev;
            course.lessons = course.lessons.map((les) => {
              if (les.id === currentLessonId) {
                return {
                  ...les,
                  items: les.items.map((st) => (st.id === assignedId ? { ...st, id: res.data!.id } : st)),
                };
              }
              return les;
            });
            updated[currentCourseId] = course;
            return updated;
          });
        }
      });
    }

    const newStep: LessonItem = {
      id: assignedId,
      ...stepData,
    };

    setCourses((prev) => {
      const updated = { ...prev };
      const course = { ...updated[currentCourseId] };
      if (!course) return prev;
      course.lessons = course.lessons.map((les) => {
        if (les.id === currentLessonId) {
          return { ...les, items: [...les.items, newStep] };
        }
        return les;
      });
      updated[currentCourseId] = course;
      return updated;
    });

    handleStepSelect(newStep);
    triggerToast(`Tarjeta "${stepData.en}" añadida`);
  };

  const handleSavePrice = (newPrice: number) => {
    setCourses((prev) => {
      const updated = { ...prev };
      const course = { ...updated[currentCourseId] };
      if (!course) return prev;
      course.price = newPrice;
      updated[currentCourseId] = course;
      return updated;
    });
    triggerToast(`Precio actualizado a $${newPrice.toFixed(2)} USD`);
  };

  const handleSubmitReview = async () => {
    const res = await submitCourseReviewApi(currentCourseId);
    if (res.error) {
      triggerToast(`Error: ${res.error}`);
    } else {
      triggerToast("Curso enviado a revisión con éxito (ADR-25).");
    }
  };

  // Aula vinculada al curso actual
  const linkedClassrooms = CLASSROOMS_DATA.filter((c) => c.courseId === currentCourseId);
  const totalLinkedStudents = linkedClassrooms.reduce((acc, c) => acc + c.studentsCount, 0);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden relative">
      {/* Toast flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-2.5 rounded-xl bg-slate-900 text-white border border-slate-700/80 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-brand flex-shrink-0 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-Header / Barra superior de acciones */}
      <BuilderHeader
        courses={courses}
        currentCourseId={currentCourseId}
        currentCourse={currentCourse}
        linkedClassroomName={linkedClassrooms[0]?.name}
        totalLinkedStudents={totalLinkedStudents}
        onSelectCourse={(id) => {
          setCurrentCourseId(id);
          const targetCourse = courses[id];
          if (targetCourse?.lessons[0]) {
            setCurrentLessonId(targetCourse.lessons[0].id);
            if (targetCourse.lessons[0].items[0]) {
              handleStepSelect(targetCourse.lessons[0].items[0]);
            }
          }
          triggerToast(`Curso activo: ${targetCourse?.title}`);
        }}
        onOpenNewCourseModal={() => setShowNewCourseModal(true)}
        onOpenPricingModal={() => setShowPricingModal(true)}
        onOpenExportModal={() => setShowExportModal(true)}
        onOpenPlaytestDrawer={() => setShowPlaytestDrawer(true)}
        onSubmitReview={handleSubmitReview}
      />

      {/* Disposición de 2 columnas de ancho completo */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden min-h-0">
        {/* COLUMNA 1: ESTRUCTURA JERÁRQUICA */}
        <CourseStructurePanel
          currentCourse={currentCourse}
          currentLessonId={currentLessonId}
          linkedClassroom={
            linkedClassrooms[0]
              ? {
                  name: linkedClassrooms[0].name,
                  stumble: linkedClassrooms[0].stumble,
                }
              : undefined
          }
          onSelectLesson={(lesson) => {
            setCurrentLessonId(lesson.id);
            if (lesson.items[0]) {
              handleStepSelect(lesson.items[0]);
            }
            triggerToast(`Lección activa: ${lesson.title}`);
          }}
          onOpenAddLessonModal={() => setShowAddLessonModal(true)}
          onOpenVaultDrawer={() => setShowVaultDrawer(true)}
          onOpenAddStepModal={() => setShowAddStepModal(true)}
        />

        {/* COLUMNA 2: LIENZO PRINCIPAL DE TRABAJO */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 bg-canvas flex flex-col overflow-y-auto">
          {/* Encabezado de la lección & selector de pestañas */}
          <div className="p-4 border-b border-border-default bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-emerald-brand font-bold px-2 py-0.5 rounded bg-emerald-brand/10 border border-emerald-brand/20">
                  {currentLesson.tier.toUpperCase()}
                </span>
                <span className="text-xs text-slate-subtle font-mono">
                  {currentLesson.duration}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {currentLesson.title}
              </h2>
              <p className="text-xs text-slate-muted">{currentLesson.subtitle}</p>
            </div>

            {/* Pestañas: Tarjetas vs Minijuegos vs Simulador */}
            <div className="flex items-center gap-1 bg-card p-1 rounded-2xl border border-border-default text-xs font-medium self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveCanvasTab("cards")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCanvasTab === "cards"
                    ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                    : "text-slate-muted hover:text-white"
                }`}
              >
                <span>Tarjetas Pedagógicas</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-canvas/30">
                  {currentLesson.items.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCanvasTab("games")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCanvasTab === "games"
                    ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                    : "text-slate-muted hover:text-white"
                }`}
              >
                <span>Minijuegos</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-canvas/30">
                  4
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCanvasTab("preview")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCanvasTab === "preview"
                    ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                    : "text-slate-muted hover:text-white"
                }`}
              >
                <span>Simulador Móvil</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-brand/20 text-emerald-brand">
                  Live
                </span>
              </button>
            </div>
          </div>

          {/* CONTENIDO PESTAÑA 1: TARJETAS PEDAGÓGICAS */}
          {activeCanvasTab === "cards" && (
            <CardsTab
              currentLesson={currentLesson}
              currentStepId={currentStepId}
              stepForm={stepForm}
              onSelectStep={handleStepSelect}
              onStepFormChange={setStepForm}
              onSaveStep={handleSaveStep}
              onDeleteStep={handleDeleteStep}
              onOpenAddStepModal={() => setShowAddStepModal(true)}
              onSpeak={speak}
            />
          )}

          {/* CONTENIDO PESTAÑA 2: MINIJUEGOS */}
          {activeCanvasTab === "games" && (
            <GamesTab
              onTestGames={() => {
                setActiveCanvasTab("preview");
                setSimScreen("game");
              }}
            />
          )}

          {/* CONTENIDO PESTAÑA 3: SIMULADOR MÓVIL */}
          {activeCanvasTab === "preview" && (
            <SimulatorTab
              currentCourse={currentCourse}
              currentLesson={currentLesson}
              simScreen={simScreen}
              simTier={simTier}
              isSimLessonCompleted={isSimLessonCompleted}
              simGameSelected={simGameSelected}
              simGameMatched={simGameMatched}
              onSetSimScreen={setSimScreen}
              onToggleSimTier={() => setSimTier((prev) => (prev === "free" ? "premium" : "free"))}
              onToggleSimLessonCompleted={() => {
                setIsSimLessonCompleted((prev) => !prev);
                triggerToast(
                  !isSimLessonCompleted
                    ? "¡Lección completada en simulador!"
                    : "Progreso reiniciado"
                );
              }}
              onSelectSimLesson={(lessonId) => {
                setCurrentLessonId(lessonId);
                setSimScreen("lesson");
              }}
              onSimGameCardClick={(cardId, matchId) => {
                if (!simGameSelected) {
                  setSimGameSelected(cardId);
                } else {
                  const matchMap: Record<string, string> = {
                    "en-1": "es-1",
                    "es-1": "en-1",
                    "en-2": "es-2",
                    "es-2": "en-2",
                    "en-3": "es-3",
                    "es-3": "en-3",
                  };
                  if (matchMap[simGameSelected] === cardId) {
                    setSimGameMatched((prev) => [...prev, matchId]);
                    triggerToast("¡Pareja correcta! +15 XP");
                  } else {
                    triggerToast("Inténtalo de nuevo");
                  }
                  setSimGameSelected(null);
                }
              }}
              onResetSimGame={() => {
                setSimGameMatched([]);
                setSimGameSelected(null);
              }}
              onSpeak={speak}
            />
          )}
        </div>
      </div>

      {/* MODAL: NUEVO CURSO (ADR-25) */}
      <NewCourseModal
        isOpen={showNewCourseModal}
        onClose={() => setShowNewCourseModal(false)}
        onCreated={handleCourseCreated}
      />

      {/* MODAL: AGREGAR LECCIÓN */}
      <AddLessonModal
        isOpen={showAddLessonModal}
        courseId={currentCourseId}
        onClose={() => setShowAddLessonModal(false)}
        onCreated={handleLessonCreated}
      />

      {/* MODAL: CONFIGURAR PRECIO (ADR-05) */}
      <PricingModal
        isOpen={showPricingModal}
        course={currentCourse}
        onClose={() => setShowPricingModal(false)}
        onSavePrice={handleSavePrice}
      />

      {/* MODAL: REDACTAR TARJETA MANUAL */}
      <ManualCardModal
        isOpen={showAddStepModal}
        onClose={() => setShowAddStepModal(false)}
        onAddCard={handleAddCard}
      />

      {/* MODAL: EXPORTAR JSON */}
      <ExportJsonModal
        isOpen={showExportModal}
        course={currentCourse}
        onClose={() => setShowExportModal(false)}
        onCopied={() => triggerToast("¡JSON copiado al portapapeles!")}
      />

      {/* DRAWER: CONTENT VAULT */}
      <VaultDrawer
        isOpen={showVaultDrawer}
        currentLesson={currentLesson}
        onClose={() => setShowVaultDrawer(false)}
        onImportItem={handleAddCard}
      />

      {/* DRAWER: SIMULADOR DE PLAYTEST MÓVIL */}
      <PlaytestDrawer
        isOpen={showPlaytestDrawer}
        currentLesson={currentLesson}
        onClose={() => setShowPlaytestDrawer(false)}
        onSpeak={speak}
      />
    </div>
  );
}
