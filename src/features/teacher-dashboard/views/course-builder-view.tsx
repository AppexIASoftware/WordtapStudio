"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  DollarSign,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Download,
  Database,
  FileEdit,
  Volume2,
  Trash2,
  Save,
  X,
  Play,
} from "lucide-react";
import { COURSES_DATA, CLASSROOMS_DATA, CONTENT_VAULT_DATA } from "../data/mock-teacher-data";
import { Course, Lesson, LessonItem } from "../types";

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

  const handleSaveStep = () => {
    setCourses((prev) => {
      const updated = { ...prev };
      const course = { ...updated[currentCourseId] };
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
    triggerToast("Tarjeta guardada exitosamente");
  };

  const handleDeleteStep = (id: string) => {
    if (currentLesson.items.length <= 1) {
      triggerToast("La lección debe conservar al menos una tarjeta.");
      return;
    }
    setCourses((prev) => {
      const updated = { ...prev };
      const course = { ...updated[currentCourseId] };
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
    triggerToast("Tarjeta eliminada");
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
      <div className="h-14 border-b border-border-default bg-card px-4 md:px-6 flex items-center justify-between flex-shrink-0 gap-3">
        <div className="flex items-center gap-2.5 overflow-x-auto">
          <span className="text-xs font-mono text-slate-muted uppercase tracking-wider flex-shrink-0">
            Curso Activo:
          </span>
          <select
            value={currentCourseId}
            onChange={(e) => {
              const id = e.target.value;
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
            className="bg-canvas border border-border-default rounded-xl px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-brand cursor-pointer flex-shrink-0"
          >
            {Object.values(courses).map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.level})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowNewCourseModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1 cursor-pointer shadow-sm flex-shrink-0"
            title="Crear un nuevo curso dentro de tu cuota de autor"
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
            <span>+ Nuevo Curso</span>
          </button>

          {/* Indicador de aula vinculada */}
          <Link
            href="/teacher/students"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono text-[11px] font-bold cursor-pointer hover:bg-purple-500/20 transition-all flex-shrink-0"
            title="Aula asociada a este curso. Haz clic para ir a Alumnos & Aulas."
          >
            <span>🏫</span>
            <span>
              {linkedClassrooms.length > 0
                ? `Aula: ${linkedClassrooms[0].name} (${totalLinkedStudents} alumnos)`
                : "Sin aula asignada (Catálogo General)"}
            </span>
          </Link>

          <span className="hidden xl:inline text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-brand/10 text-emerald-brand font-bold border border-emerald-brand/20 flex-shrink-0">
            100% Nativo Interactivo (ADR-04)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowPricingModal(true)}
            className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Configurar precio standalone del curso y split 70/30 (ADR-05)"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-brand" />
            <span>Precio:</span>
            <span className="text-emerald-brand font-mono font-bold">
              ${currentCourse.price.toFixed(2)} {currentCourse.currency}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="hidden md:flex px-3 py-1.5 rounded-xl bg-canvas border border-border-default hover:border-border-subtle text-xs font-medium text-slate-300 transition-colors items-center gap-1.5 cursor-pointer"
            title="Exportar copia de seguridad del curso"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>

          {/* Gatillador del Simulador Móvil en Drawer */}
          <button
            type="button"
            onClick={() => setShowPlaytestDrawer(true)}
            className="px-3 py-1.5 rounded-xl bg-card border border-emerald-brand/50 hover:border-emerald-brand text-emerald-brand hover:bg-emerald-brand/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Abrir Simulador de Playtest Móvil en drawer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Simulador Móvil</span>
          </button>

          <button
            type="button"
            onClick={() =>
              triggerToast(`¡Lección "${currentLesson.title}" enviada a revisión pedagógica!`)
            }
            className="px-3.5 py-1.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Publicar Lección</span>
          </button>
        </div>
      </div>

      {/* Disposición de 2 columnas de ancho completo */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden min-h-0">
        {/* COLUMNA 1: ESTRUCTURA JERÁRQUICA */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 border-r border-border-default bg-card/40 flex flex-col overflow-y-auto">
          <div className="p-3.5 border-b border-border-default flex items-center justify-between bg-card-hover/40 flex-shrink-0">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-muted font-mono">
                Estructura del Curso
              </span>
              <p className="text-[10px] text-slate-subtle">
                {currentCourse.lessons.length} lección
                {currentCourse.lessons.length === 1 ? "" : "es"} programadas
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddLessonModal(true)}
              className="px-2.5 py-1 rounded-lg bg-canvas border border-border-default hover:border-emerald-brand text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3 stroke-[2.5]" />
              <span>Lección</span>
            </button>
          </div>

          {/* Alerta de Tropiezos del Aula Vinculada */}
          {linkedClassrooms.length > 0 && linkedClassrooms[0].stumble[0] && (
            <div className="mx-3 mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1 flex-shrink-0">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Alerta de Aula Vinculada (Stumble List)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                Alumnos del <strong>Aula {linkedClassrooms[0].name}</strong> tienen{" "}
                {linkedClassrooms[0].stumble[0].failRate} de fallos en{" "}
                <em>&apos;{linkedClassrooms[0].stumble[0].term}&apos;</em>. Refuerza esta lección.
              </p>
            </div>
          )}

          {/* Árbol dinámico de lecciones */}
          <div className="p-3 space-y-2 flex-1 overflow-y-auto">
            {currentCourse.lessons.map((lesson) => {
              const isSelected = lesson.id === currentLessonId;
              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    setCurrentLessonId(lesson.id);
                    if (lesson.items[0]) {
                      handleStepSelect(lesson.items[0]);
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-card border-emerald-brand text-white shadow-sm ring-1 ring-emerald-brand/30"
                      : "bg-canvas border-border-default text-slate-300 hover:border-border-subtle"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{lesson.title}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isSelected
                          ? "bg-emerald-brand/20 text-emerald-brand"
                          : "bg-card text-slate-subtle"
                      }`}
                    >
                      {lesson.duration}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-subtle mt-1 truncate">
                    {lesson.subtitle}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-muted">
                    <span>{lesson.items.length} tarjetas</span>
                    <span className="text-emerald-brand">{lesson.tier}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Acciones inferiores de la estructura */}
          <div className="p-3 border-t border-border-default bg-card/60 space-y-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowVaultDrawer(true)}
              className="w-full py-2.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>+ Importar desde Content Vault</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddStepModal(true)}
              className="w-full py-2 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand/40 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Redactar Tarjeta Manual</span>
            </button>
          </div>
        </div>

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
                <FileEdit className="w-3.5 h-3.5" />
                <span>Tarjetas Pedagógicas</span>
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
                <Play className="w-3.5 h-3.5" />
                <span>Minijuegos de la Lección</span>
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
                <Smartphone className="w-3.5 h-3.5" />
                <span>Vista Móvil Integrada</span>
              </button>
            </div>
          </div>

          {/* CONTENIDO PESTAÑA 1: TARJETAS PEDAGÓGICAS */}
          {activeCanvasTab === "cards" && (
            <div className="p-5 md:p-6 space-y-6">
              {/* Tira horizontal de selección rápida de tarjetas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                    <span>Tarjetas en esta Lección</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-brand/10 text-emerald-brand text-[10px]">
                      {currentLesson.items.length} tarjetas
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddStepModal(true)}
                    className="text-xs text-emerald-brand hover:underline font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <span>+ Añadir Tarjeta</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {currentLesson.items.map((step, idx) => {
                    const isSelected = step.id === currentStepId;
                    return (
                      <div
                        key={step.id}
                        onClick={() => handleStepSelect(step)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                          isSelected
                            ? "bg-emerald-brand/10 border-emerald-brand text-white shadow-sm ring-1 ring-emerald-brand/30"
                            : "bg-canvas border-border-default hover:border-emerald-brand/40 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-subtle">
                            #{idx + 1}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-1 rounded ${
                              step.itemType === "grammar"
                                ? "bg-purple-500/20 text-purple-300"
                                : "bg-emerald-brand/20 text-emerald-brand"
                            }`}
                          >
                            {step.itemType || "word"}
                          </span>
                        </div>
                        <p
                          className={`font-bold text-xs truncate ${
                            isSelected ? "text-white" : "text-slate-200"
                          }`}
                        >
                          {step.en}
                        </p>
                        <p className="text-[10px] text-slate-subtle truncate">{step.es}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lienzo de edición de la tarjeta seleccionada */}
              <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border-default bg-card-hover/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center font-bold">
                      <FileEdit className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Editar {stepForm.itemType || "Elemento"}: &apos;{stepForm.en}&apos;
                      </h3>
                      <p className="text-[11px] text-slate-subtle">
                        Configuración pedagógica y fonética del elemento
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-subtle font-mono">Tipo:</span>
                    <select
                      value={stepForm.itemType || "word"}
                      onChange={(e) =>
                        setStepForm((prev) => ({
                          ...prev,
                          itemType: e.target.value as LessonItem["itemType"],
                        }))
                      }
                      className="bg-canvas border border-border-default rounded-xl px-3 py-1.5 text-xs text-mint-brand font-mono font-semibold cursor-pointer focus:outline-none focus:border-emerald-brand"
                    >
                      <option value="word">word (Vocabulario)</option>
                      <option value="phrase">phrase (Frase)</option>
                      <option value="grammar">grammar (Gramática)</option>
                      <option value="tip">tip (Consejo)</option>
                      <option value="exercise">exercise (Puzzle)</option>
                    </select>
                  </div>
                </div>

                {/* Formulario en 2 columnas */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Columna Izquierda */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Término / Palabra en Inglés (Target)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={stepForm.en}
                          onChange={(e) =>
                            setStepForm((prev) => ({ ...prev, en: e.target.value }))
                          }
                          className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-brand pr-10"
                          placeholder="Ej: be, take, have..."
                        />
                        <button
                          type="button"
                          onClick={() => speak(stepForm.en)}
                          className="absolute right-3 top-2.5 p-1 text-slate-muted hover:text-mint-brand transition-colors cursor-pointer"
                          title="Escuchar pronunciación"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Traducción al Español (Prompt)
                      </label>
                      <input
                        type="text"
                        value={stepForm.es}
                        onChange={(e) =>
                          setStepForm((prev) => ({ ...prev, es: e.target.value }))
                        }
                        className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-emerald-brand"
                        placeholder="Ej: ser/estar..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Transcripción Fonética (IPA)
                        </label>
                        <input
                          type="text"
                          value={stepForm.ipa || ""}
                          onChange={(e) =>
                            setStepForm((prev) => ({ ...prev, ipa: e.target.value }))
                          }
                          className="w-full bg-canvas border border-border-default rounded-xl px-3.5 py-2.5 text-xs font-mono text-mint-brand focus:outline-none focus:border-emerald-brand"
                          placeholder="/biː/"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Categoría Gramatical
                        </label>
                        <input
                          type="text"
                          value={stepForm.pos || ""}
                          onChange={(e) =>
                            setStepForm((prev) => ({ ...prev, pos: e.target.value }))
                          }
                          className="w-full bg-canvas border border-border-default rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-brand"
                          placeholder="Verbo irregular..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Columna Derecha */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Oración de Ejemplo en Contexto
                      </label>
                      <textarea
                        rows={3}
                        value={stepForm.example || ""}
                        onChange={(e) =>
                          setStepForm((prev) => ({ ...prev, example: e.target.value }))
                        }
                        className="w-full bg-canvas border border-border-default rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-brand italic resize-none"
                        placeholder='Ej: "I am happy today"'
                      />
                    </div>

                    {/* Nota Pedagógica / Tip */}
                    <div className="p-4 rounded-xl bg-canvas border border-border-default space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="text-amber-400">💡</span>
                          <span>Nota Pedagógica / Tip</span>
                        </span>
                        <div className="flex items-center gap-3 text-xs">
                          <label className="flex items-center gap-1.5 cursor-pointer text-slate-muted hover:text-white">
                            <input
                              type="radio"
                              name="noteType"
                              value="bulb"
                              checked={stepForm.noteType !== "pin"}
                              onChange={() =>
                                setStepForm((prev) => ({ ...prev, noteType: "bulb" }))
                              }
                              className="accent-emerald-brand"
                            />
                            <span>Foco (Tip)</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer text-slate-muted hover:text-white">
                            <input
                              type="radio"
                              name="noteType"
                              value="pin"
                              checked={stepForm.noteType === "pin"}
                              onChange={() =>
                                setStepForm((prev) => ({ ...prev, noteType: "pin" }))
                              }
                              className="accent-emerald-brand"
                            />
                            <span>Pin (Importante)</span>
                          </label>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={stepForm.note || ""}
                        onChange={(e) =>
                          setStepForm((prev) => ({ ...prev, note: e.target.value }))
                        }
                        className="w-full bg-card border border-border-default rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-brand"
                        placeholder="Nota de aprendizaje..."
                      />
                    </div>
                  </div>
                </div>

                {/* Pie de acciones de la tarjeta */}
                <div className="p-4 bg-card-hover/40 border-t border-border-default flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleDeleteStep(stepForm.id)}
                    className="px-4 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar Tarjeta</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddStepModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-canvas border border-border-default hover:text-white text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      + Nueva Tarjeta
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveStep}
                      className="px-5 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTENIDO PESTAÑA 2: MINIJUEGOS DE LA LECCIÓN */}
          {activeCanvasTab === "games" && (
            <div className="p-5 md:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Minijuegos Calibrados para esta Lección
                  </h3>
                  <p className="text-xs text-slate-muted">
                    Ejercicios interactivos generados automáticamente a partir de las tarjetas pedagógicas (RF-S11, RF-S12)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCanvasTab("preview");
                    setSimScreen("game");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs flex items-center gap-1.5 hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Probar Juegos en Simulador</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Matching */}
                <div className="p-4 rounded-2xl bg-card border border-border-default space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center font-bold text-xs">
                        M
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-xs">Matching: Parejas Rápidas</h4>
                        <span className="text-[10px] font-mono text-emerald-brand">
                          Arquetipo Emparejamiento
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-brand/10 text-emerald-brand font-bold">
                      Activo
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Empareja palabras en inglés con su traducción al español antes de que termine el temporizador.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-border-default text-xs text-slate-muted">
                    <span>3 Niveles Calibrados (L1-L3)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCanvasTab("preview");
                        setSimScreen("game");
                      }}
                      className="text-emerald-brand hover:underline font-semibold cursor-pointer"
                    >
                      Probar Juego &rarr;
                    </button>
                  </div>
                </div>

                {/* 2. Sequence */}
                <div className="p-4 rounded-2xl bg-card border border-border-default space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                        S
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-xs">Sequence: Ordena la Frase</h4>
                        <span className="text-[10px] font-mono text-blue-400">
                          Arquetipo Secuencia
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
                      Activo
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Construye oraciones completas arrastrando bloques de palabras en el orden sintáctico correcto.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-border-default text-xs text-slate-muted">
                    <span>Distractores: 4 semejantes</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCanvasTab("preview");
                        setSimScreen("game");
                      }}
                      className="text-blue-400 hover:underline font-semibold cursor-pointer"
                    >
                      Probar Juego &rarr;
                    </button>
                  </div>
                </div>

                {/* 3. Choice */}
                <div className="p-4 rounded-2xl bg-card border border-border-default space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                        C
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-xs">Choice: Traducción Rápida</h4>
                        <span className="text-[10px] font-mono text-purple-400">
                          Arquetipo Opción
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold">
                      Activo
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Selección múltiple contra reloj basada en listening neural y estímulo visual de fonética.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-border-default text-xs text-slate-muted">
                    <span>Temporizador: 15s (Nivel 2)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCanvasTab("preview");
                        setSimScreen("game");
                      }}
                      className="text-purple-400 hover:underline font-semibold cursor-pointer"
                    >
                      Probar Juego &rarr;
                    </button>
                  </div>
                </div>

                {/* 4. Slots */}
                <div className="p-4 rounded-2xl bg-card border border-border-default space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                        K
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-xs">Slots: Rellena el Espacio</h4>
                        <span className="text-[10px] font-mono text-amber-400">
                          Arquetipo Ranuras
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">
                      Activo
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Completa oraciones con la conjugación correcta o el collocate natural adecuado.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-border-default text-xs text-slate-muted">
                    <span>Pistas: Hints graduales</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCanvasTab("preview");
                        setSimScreen("game");
                      }}
                      className="text-amber-400 hover:underline font-semibold cursor-pointer"
                    >
                      Probar Juego &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTENIDO PESTAÑA 3: VISTA MÓVIL INTEGRADA (SIMULADOR EN PANTALLA) */}
          {activeCanvasTab === "preview" && (
            <div className="p-6 flex flex-col items-center justify-center">
              {/* Barra de control del simulador */}
              <div className="mb-4 flex items-center justify-between w-[340px]">
                <div className="flex items-center gap-1 p-1 bg-card rounded-xl border border-border-default text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setSimScreen("lesson")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      simScreen === "lesson"
                        ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                        : "text-slate-muted hover:text-white"
                    }`}
                  >
                    Lección
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimScreen("home")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      simScreen === "home"
                        ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                        : "text-slate-muted hover:text-white"
                    }`}
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimScreen("game")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      simScreen === "game"
                        ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                        : "text-slate-muted hover:text-white"
                    }`}
                  >
                    Juego
                  </button>
                </div>

                {/* Conmutador de plan simulado */}
                <button
                  type="button"
                  onClick={() => setSimTier((prev) => (prev === "free" ? "premium" : "free"))}
                  className="px-2.5 py-1 rounded-xl bg-card border border-border-default text-[10px] font-mono text-slate-300 hover:border-emerald-brand transition-colors cursor-pointer"
                >
                  Simular:{" "}
                  <strong
                    className={simTier === "premium" ? "text-mint-brand" : "text-emerald-brand"}
                  >
                    {simTier === "premium" ? "Premium" : "Free"}
                  </strong>
                </button>
              </div>

              {/* Marco de simulación iPhone */}
              <div className="w-[340px] h-[640px] bg-slate-950 rounded-[44px] border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-30" />

                {/* PANTALLA SIMULADA 1: DETALLE DE LECCIÓN */}
                {simScreen === "lesson" && (
                  <div className="h-full flex flex-col bg-[#EDF8F3] overflow-hidden text-slate-900">
                    {/* Header Verde Esmeralda */}
                    <div className="bg-gradient-to-b from-[#05B075] to-[#029E67] pt-8 px-5 pb-5 rounded-b-[28px] shadow-sm space-y-2 flex-shrink-0">
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => setSimScreen("home")}
                          className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-white"
                        >
                          &larr;
                        </button>
                        <span className="text-[10px] text-white/80 font-mono">WordTap Mobile</span>
                      </div>

                      <div>
                        <h2 className="text-lg font-extrabold text-white tracking-tight leading-tight">
                          {currentLesson.title}
                        </h2>
                        <p className="text-[11px] font-medium text-white/90 leading-tight mt-0.5">
                          {currentLesson.subtitle}
                        </p>
                      </div>

                      <div className="pt-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                          <span className="text-[11px]">Progreso</span>
                          <span className="font-extrabold text-[#00E5D0] text-[11px]">
                            {isSimLessonCompleted ? "100%" : "20%"}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#00E5D0] rounded-full transition-all duration-300"
                            style={{ width: isSimLessonCompleted ? "100%" : "20%" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Feed deslizable */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                      {/* Bio del Docente Acreditado */}
                      <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-[#05B075] text-white flex items-center justify-center font-bold font-mono text-xs flex-shrink-0">
                          MS
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-[11px] font-bold text-[#0F172A] truncate">
                              Prof. Mateo Silva
                            </p>
                            <span className="w-3 h-3 rounded-full bg-[#00E5D0] text-[#044E3B] flex items-center justify-center text-[8px] font-black">
                              ✓
                            </span>
                          </div>
                          <p className="text-[9px] text-[#64748B] font-medium truncate">
                            Cambridge CELTA • Autor Acreditado
                          </p>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] font-bold">
                          Docente
                        </span>
                      </div>

                      {/* Tarjeta de introducción */}
                      <div className="bg-[#044E3B] border border-[#065F46] rounded-2xl p-3 shadow-sm text-white">
                        <p className="text-[11px] font-medium leading-relaxed">
                          {currentLesson.intro}
                        </p>
                      </div>

                      <h4 className="text-xs font-extrabold text-[#0F172A] tracking-tight">
                        {currentLesson.sectionTitle}
                      </h4>

                      {/* Tarjetas de vocabulario en simulación */}
                      <div className="space-y-2">
                        {currentLesson.items.map((st) => (
                          <div
                            key={st.id}
                            className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => speak(st.en)}
                                  className="w-6 h-6 rounded-lg bg-[#ECFDF5] text-[#05B075] flex items-center justify-center"
                                >
                                  <Volume2 className="w-3 h-3" />
                                </button>
                                <span className="font-bold text-xs text-[#0F172A]">{st.en}</span>
                              </div>
                              <span className="text-[10px] font-mono text-[#00A896] font-bold">
                                {st.ipa}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#334155]">{st.es}</p>
                            {st.example && (
                              <p className="text-[10px] text-[#64748B] italic">{st.example}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsSimLessonCompleted((prev) => !prev);
                          triggerToast(
                            !isSimLessonCompleted
                              ? "¡Lección completada en simulador!"
                              : "Progreso reiniciado"
                          );
                        }}
                        className="w-full py-2.5 rounded-2xl bg-[#05B075] hover:bg-[#029E67] text-white font-bold text-xs shadow-md transition-colors text-center"
                      >
                        {isSimLessonCompleted ? "Completada ✓" : "Marcar como completada"}
                      </button>
                    </div>
                  </div>
                )}

                {/* PANTALLA SIMULADA 2: HOME FEED */}
                {simScreen === "home" && (
                  <div className="h-full flex flex-col bg-[#EDF8F3] overflow-y-auto text-slate-900">
                    <div className="bg-gradient-to-b from-[#05B075] to-[#029E67] pt-8 px-5 pb-5 rounded-b-[28px] shadow-sm space-y-3 flex-shrink-0 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-black">WordTap</h2>
                          <p className="text-[10px] text-white/90">Aprende inglés cada día</p>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                          JD
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <div className="bg-white/10 rounded-xl p-1 border border-white/15">
                          <span className="text-xs font-extrabold block">47</span>
                          <span className="text-[8px] text-white/80 block">Palabras</span>
                        </div>
                        <div className="bg-white/10 rounded-xl p-1 border border-white/15">
                          <span className="text-xs font-extrabold block">12</span>
                          <span className="text-[8px] text-white/80 block">Días</span>
                        </div>
                        <div className="bg-white/10 rounded-xl p-1 border border-white/15">
                          <span className="text-xs font-extrabold block">85%</span>
                          <span className="text-[8px] text-white/80 block">Precisión</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-3">
                      <div
                        onClick={() => setSimScreen("game")}
                        className="p-3 rounded-2xl bg-[#0D7253] text-white flex items-center gap-2.5 cursor-pointer shadow-sm"
                      >
                        <Play className="w-6 h-6 text-[#00E5D0]" />
                        <div>
                          <h4 className="text-xs font-bold">Juegos y Puzzles</h4>
                          <p className="text-[10px] text-white/80">Practica con 12 modos</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#09694F] text-white space-y-1 shadow-sm">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#00E5D0] text-[#09694F] font-mono">
                          PREMIUM
                        </span>
                        <h4 className="text-xs font-extrabold">Desbloquea el Curso Completo</h4>
                        <p className="text-[10px] text-white/80">Acceso de por vida a tips y lecciones.</p>
                      </div>

                      <h4 className="text-xs font-extrabold text-[#0F172A] pt-1">
                        Lecciones disponibles
                      </h4>

                      {currentCourse.lessons.map((les) => (
                        <div
                          key={les.id}
                          onClick={() => {
                            setCurrentLessonId(les.id);
                            setSimScreen("lesson");
                          }}
                          className="p-2.5 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between cursor-pointer hover:border-[#05B075] transition-colors"
                        >
                          <div>
                            <p className="text-xs font-bold text-[#0F172A]">{les.title}</p>
                            <p className="text-[10px] text-[#64748B]">{les.items.length} tarjetas</p>
                          </div>
                          <span className="text-xs font-bold text-[#05B075]">&rarr;</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PANTALLA SIMULADA 3: JUEGO WORD MATCH */}
                {simScreen === "game" && (
                  <div className="h-full flex flex-col bg-[#EDF8F3] overflow-hidden text-slate-900">
                    <div className="bg-gradient-to-b from-[#05B075] to-[#029E67] pt-8 px-5 pb-3 rounded-b-[28px] shadow-sm flex items-center justify-between text-white flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setSimScreen("lesson")}
                        className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center"
                      >
                        &larr;
                      </button>
                      <div className="text-center">
                        <h3 className="text-xs font-black">Word Match</h3>
                        <p className="text-[9px] text-[#00E5D0] font-mono">Empareja Español ↔ Inglés</p>
                      </div>
                      <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full font-bold">
                        {simGameMatched.length}/3
                      </span>
                    </div>

                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <p className="text-center text-[10px] text-[#64748B]">
                          Toca una palabra y luego su traducción correcta:
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          {[
                            { id: "en-1", text: "thought", matchId: "pair-1" },
                            { id: "es-1", text: "pensamiento", matchId: "pair-1" },
                            { id: "en-2", text: "through", matchId: "pair-2" },
                            { id: "es-2", text: "a través de", matchId: "pair-2" },
                            { id: "en-3", text: "schedule", matchId: "pair-3" },
                            { id: "es-3", text: "horario", matchId: "pair-3" },
                          ].map((card) => {
                            const isMatched = simGameMatched.includes(card.matchId);
                            const isSelected = simGameSelected === card.id;

                            return (
                              <button
                                key={card.id}
                                type="button"
                                disabled={isMatched}
                                onClick={() => {
                                  if (!simGameSelected) {
                                    setSimGameSelected(card.id);
                                  } else {
                                    // Check match
                                    const matchMap: Record<string, string> = {
                                      "en-1": "es-1",
                                      "es-1": "en-1",
                                      "en-2": "es-2",
                                      "es-2": "en-2",
                                      "en-3": "es-3",
                                      "es-3": "en-3",
                                    };
                                    if (matchMap[simGameSelected] === card.id) {
                                      setSimGameMatched((prev) => [...prev, card.matchId]);
                                      triggerToast("¡Pareja correcta! +15 XP");
                                    } else {
                                      triggerToast("Inténtalo de nuevo");
                                    }
                                    setSimGameSelected(null);
                                  }
                                }}
                                className={`p-3 rounded-xl text-xs font-bold text-center border transition-all ${
                                  isMatched
                                    ? "bg-[#D1FAE5] text-[#065F46] border-[#34D399] opacity-60"
                                    : isSelected
                                    ? "bg-[#05B075] text-white border-[#05B075] shadow-md"
                                    : "bg-white border-[#CBD5E1] text-[#0F172A] hover:border-[#05B075]"
                                }`}
                              >
                                {card.text}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {simGameMatched.length === 3 && (
                        <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl text-center space-y-1">
                          <p className="text-xs font-black text-[#065F46]">
                            ¡Excelente trabajo!
                          </p>
                          <p className="text-[10px] text-[#047857]">
                            Has completado la ronda de discriminación fonética.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setSimGameMatched([]);
                              setSimGameSelected(null);
                            }}
                            className="mt-1 px-3 py-1 bg-[#05B075] text-white text-[10px] font-bold rounded-lg"
                          >
                            Reiniciar Minijuego
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: NUEVO CURSO (ADR-25) */}
      {showNewCourseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Crear Nuevo Curso</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-brand/20 text-emerald-brand font-bold">
                      ADR-25
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-muted">
                    Plan formativo nativo interactivo con lecciones y minijuegos
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewCourseModal(false)}
                className="w-7 h-7 rounded-lg bg-canvas text-slate-muted hover:text-white flex items-center justify-center cursor-pointer font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-canvas border border-border-default flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">📋</span>
                <div>
                  <span className="font-bold text-white text-xs">
                    Cuota de Borradores del Docente (ADR-08)
                  </span>
                  <p className="text-[10px] text-slate-subtle">
                    Límite para garantizar capacidad en cola de moderación
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-brand/20 text-emerald-brand font-mono font-bold text-xs">
                {Object.keys(courses).length} de 5 activos
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Título del Curso
                </label>
                <input
                  type="text"
                  placeholder="Ej: Inglés Corporativo para Negocios Internacionales"
                  id="new-course-title-input"
                  className="w-full px-3.5 py-2.5 bg-canvas border border-border-default rounded-xl text-white focus:outline-none focus:border-emerald-brand text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Nivel Pedagógico CEFR
                  </label>
                  <select className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 focus:outline-none focus:border-emerald-brand text-xs cursor-pointer">
                    <option value="A1 Beginner">A1 Beginner</option>
                    <option value="A2 Elementary">A2 Elementary</option>
                    <option value="B1 Intermediate">B1 Intermediate</option>
                    <option value="B2 Upper Intermediate">B2 Upper Intermediate</option>
                    <option value="C1 Advanced">C1 Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Idioma a Enseñar (L2)
                  </label>
                  <select className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 focus:outline-none focus:border-emerald-brand text-xs cursor-pointer">
                    <option value="en">Inglés (English) • L1 Español</option>
                    <option value="fr">Francés (Français) • L1 Español</option>
                    <option value="de">Alemán (Deutsch) • L1 Español</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-canvas border border-border-default space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-white text-xs">
                    Comercialización Obligatoria (ADR-05)
                  </label>
                  <span className="text-[10px] font-mono text-emerald-brand font-bold px-2 py-0.5 rounded bg-emerald-brand/10 border border-emerald-brand/20">
                    70% Docente / 30% Plataforma
                  </span>
                </div>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Los docentes comercializan sus cursos fijando su propia tarifa. Los cursos gratuitos están reservados a la plataforma.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-300">Precio Standalone sugerido:</span>
                  <span className="font-mono text-emerald-brand font-bold text-sm">$19.99 USD</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border-default flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewCourseModal(false)}
                className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-semibold hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById(
                    "new-course-title-input"
                  ) as HTMLInputElement;
                  const newTitle = input?.value.trim() || "Nuevo Curso Docente";
                  const newId = `c-${Date.now()}`;
                  const newCourse: Course = {
                    id: newId,
                    title: newTitle,
                    level: "B1 Intermediate",
                    tier: "draft",
                    price: 19.99,
                    currency: "USD",
                    author: "Prof. Mateo Silva",
                    lessons: [
                      {
                        id: `l-${Date.now()}`,
                        title: "1. Lección Inicial",
                        subtitle: "Introducción a los conceptos clave",
                        duration: "15 min",
                        tier: "Draft",
                        isPublished: false,
                        intro: "Bienvenido a este nuevo curso interactivo.",
                        sectionTitle: "Conceptos iniciales",
                        items: [
                          {
                            id: `step-${Date.now()}`,
                            en: "hello",
                            es: "hola",
                            ipa: "/həˈloʊ/",
                            pos: "Interjección",
                            example: '"Hello world!"',
                            note: "Saludo fundamental",
                            noteType: "bulb",
                            itemType: "word",
                          },
                        ],
                      },
                    ],
                  };
                  setCourses((prev) => ({ ...prev, [newId]: newCourse }));
                  setCurrentCourseId(newId);
                  setCurrentLessonId(newCourse.lessons[0].id);
                  handleStepSelect(newCourse.lessons[0].items[0]);
                  setShowNewCourseModal(false);
                  triggerToast(`¡Curso "${newTitle}" creado en borrador!`);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-brand text-canvas font-bold hover:bg-mint-brand transition-colors shadow-glow-emerald"
              >
                Crear Curso en Borrador
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRECIO DEL CURSO */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-brand" />
                <span>Configurar Precio de Venta (ADR-05)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPricingModal(false)}
                className="text-slate-muted hover:text-white font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-1">
              <span className="text-[10px] font-mono text-slate-subtle uppercase">Curso:</span>
              <p className="font-bold text-white text-xs">{currentCourse.title}</p>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-slate-200">
                Precio de Venta Standalone (USD)
              </label>
              <input
                type="number"
                step="0.01"
                defaultValue={currentCourse.price}
                id="course-pricing-input"
                className="w-full px-3.5 py-2.5 bg-canvas border border-border-default rounded-xl text-white font-mono text-sm focus:border-emerald-brand outline-none"
              />
              <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>Regalía Docente (70%):</span>
                  <strong className="text-emerald-brand font-mono">
                    ${(currentCourse.price * 0.7).toFixed(2)} USD
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>WordTap Plataforma (30%):</span>
                  <strong className="text-slate-400 font-mono">
                    ${(currentCourse.price * 0.3).toFixed(2)} USD
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowPricingModal(false)}
                className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById(
                    "course-pricing-input"
                  ) as HTMLInputElement;
                  const newPrice = parseFloat(input?.value || "19.99");
                  setCourses((prev) => ({
                    ...prev,
                    [currentCourseId]: {
                      ...prev[currentCourseId],
                      price: isNaN(newPrice) ? 19.99 : newPrice,
                    },
                  }));
                  setShowPricingModal(false);
                  triggerToast("Precio de venta actualizado");
                }}
                className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold shadow-glow-emerald"
              >
                Guardar Tarifa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AÑADIR LECCIÓN */}
      {showAddLessonModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-brand" />
                <span>Añadir Nueva Lección</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddLessonModal(false)}
                className="text-slate-muted hover:text-white font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">Título</label>
                <input
                  type="text"
                  placeholder="Ej: 5. Adjetivos Comparativos"
                  id="add-lesson-title"
                  className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-200 mb-1">Subtítulo</label>
                <input
                  type="text"
                  placeholder="Ej: Aprende a comparar personas y cosas"
                  id="add-lesson-subtitle"
                  className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-200 mb-1">Duración</label>
                <input
                  type="text"
                  defaultValue="15 min"
                  id="add-lesson-duration"
                  className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowAddLessonModal(false)}
                className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const title =
                    (
                      document.getElementById("add-lesson-title") as HTMLInputElement
                    )?.value.trim() || "Nueva Lección";
                  const subtitle =
                    (
                      document.getElementById("add-lesson-subtitle") as HTMLInputElement
                    )?.value.trim() || "Objetivo pedagógico de la lección";
                  const duration =
                    (
                      document.getElementById("add-lesson-duration") as HTMLInputElement
                    )?.value.trim() || "15 min";

                  const newLesson: Lesson = {
                    id: `lesson-${Date.now()}`,
                    title,
                    subtitle,
                    duration,
                    tier: "Draft",
                    isPublished: false,
                    intro: subtitle,
                    sectionTitle: "Vocabulario esencial",
                    items: [
                      {
                        id: `step-${Date.now()}`,
                        en: "example",
                        es: "ejemplo",
                        ipa: "/ɪɡˈzæm.pəl/",
                        pos: "Sustantivo",
                        example: '"This is an example"',
                        note: "Tarjeta inicial",
                        noteType: "bulb",
                        itemType: "word",
                      },
                    ],
                  };

                  setCourses((prev) => ({
                    ...prev,
                    [currentCourseId]: {
                      ...prev[currentCourseId],
                      lessons: [...prev[currentCourseId].lessons, newLesson],
                    },
                  }));
                  setCurrentLessonId(newLesson.id);
                  handleStepSelect(newLesson.items[0]);
                  setShowAddLessonModal(false);
                  triggerToast(`¡Lección "${title}" añadida!`);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold shadow-glow-emerald"
              >
                Crear Lección
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AÑADIR TARJETA MANUAL */}
      {showAddStepModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-emerald-brand" />
                <span>Redactar Tarjeta Manual</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddStepModal(false)}
                className="text-slate-muted hover:text-white font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Término (Inglés)
                  </label>
                  <input
                    type="text"
                    id="new-step-en"
                    placeholder="Ej: know"
                    className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Traducción (Español)
                  </label>
                  <input
                    type="text"
                    id="new-step-es"
                    placeholder="Ej: saber / conocer"
                    className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Transcripción (IPA)
                  </label>
                  <input
                    type="text"
                    id="new-step-ipa"
                    placeholder="/noʊ/"
                    className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-mint-brand font-mono outline-none focus:border-emerald-brand"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Tipo de Elemento
                  </label>
                  <select
                    id="new-step-type"
                    className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 outline-none focus:border-emerald-brand"
                  >
                    <option value="word">word</option>
                    <option value="phrase">phrase</option>
                    <option value="grammar">grammar</option>
                    <option value="tip">tip</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Oración de Ejemplo
                </label>
                <input
                  type="text"
                  id="new-step-example"
                  placeholder='"I know the truth"'
                  className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand italic"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Nota Pedagógica
                </label>
                <input
                  type="text"
                  id="new-step-note"
                  placeholder="Indica certeza o conocimiento"
                  className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowAddStepModal(false)}
                className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const en =
                    (document.getElementById("new-step-en") as HTMLInputElement)
                      ?.value.trim() || "new term";
                  const es =
                    (document.getElementById("new-step-es") as HTMLInputElement)
                      ?.value.trim() || "nuevo término";
                  const ipa =
                    (document.getElementById("new-step-ipa") as HTMLInputElement)
                      ?.value.trim() || "/IPA/";
                  const itemType = (
                    (document.getElementById("new-step-type") as HTMLSelectElement)
                      ?.value || "word"
                  ) as LessonItem["itemType"];
                  const example =
                    (
                      document.getElementById("new-step-example") as HTMLInputElement
                    )?.value.trim() || "";
                  const note =
                    (
                      document.getElementById("new-step-note") as HTMLInputElement
                    )?.value.trim() || "";

                  const newStep: LessonItem = {
                    id: `step-${Date.now()}`,
                    en,
                    es,
                    ipa,
                    itemType,
                    example,
                    note,
                    noteType: "bulb",
                  };

                  setCourses((prev) => {
                    const updated = { ...prev };
                    const course = { ...updated[currentCourseId] };
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
                  setShowAddStepModal(false);
                  triggerToast(`Tarjeta "${en}" añadida`);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold shadow-glow-emerald"
              >
                Añadir Tarjeta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EXPORTAR JSON */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-brand" />
                <span>Exportar Copia de Seguridad JSON</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="text-slate-muted hover:text-white font-bold"
              >
                &times;
              </button>
            </div>
            <textarea
              readOnly
              rows={12}
              value={JSON.stringify(currentCourse, null, 2)}
              className="w-full p-3.5 bg-canvas font-mono text-[11px] text-emerald-brand rounded-2xl border border-border-default outline-none resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(currentCourse, null, 2));
                  triggerToast("Copia de seguridad JSON copiada al portapapeles");
                  setShowExportModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold shadow-glow-emerald"
              >
                Copiar JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: IMPORTAR DESDE CONTENT VAULT */}
      {showVaultDrawer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-card border-l border-border-default h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border-default pb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-brand" />
                  <h3 className="text-sm font-bold text-white">Importar del Content Vault</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVaultDrawer(false)}
                  className="p-1 rounded-lg bg-canvas text-slate-muted hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-muted">
                Selecciona términos y frases para inyectar directamente a esta lección ({currentLesson.title}):
              </p>

              <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
                {CONTENT_VAULT_DATA.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand/50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs">{item.target}</span>
                        <span className="text-[10px] font-mono text-mint-brand">{item.ipa}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{item.prompt}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newStep: LessonItem = {
                          id: `step-vault-${Date.now()}`,
                          en: item.target,
                          es: item.prompt,
                          ipa: item.ipa,
                          pos: item.meta?.pos || item.type,
                          example: item.meta?.example || "",
                          note: item.meta?.trap || "Importado desde Vault",
                          noteType: "bulb",
                          itemType: "word",
                        };
                        setCourses((prev) => {
                          const updated = { ...prev };
                          const course = { ...updated[currentCourseId] };
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
                        triggerToast(`¡"${item.target}" importado con éxito!`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-brand/10 text-emerald-brand hover:bg-emerald-brand hover:text-canvas font-bold text-xs transition-colors"
                    >
                      + Añadir
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowVaultDrawer(false)}
                className="w-full py-2.5 rounded-xl bg-canvas border border-border-default text-slate-300 text-xs font-semibold hover:text-white"
              >
                Cerrar Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: SIMULADOR DE PLAYTEST MÓVIL */}
      {showPlaytestDrawer && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-sm bg-card border-l border-border-default h-full p-4 flex flex-col justify-between shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-brand" />
                <h3 className="text-xs font-bold text-white">Playtest Móvil React Native</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPlaytestDrawer(false)}
                className="p-1 rounded-lg bg-canvas text-slate-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-2">
              <div className="w-[300px] h-[540px] bg-slate-950 rounded-[38px] border-[5px] border-slate-800 shadow-2xl overflow-hidden flex flex-col text-slate-900">
                <div className="bg-[#05B075] pt-6 px-4 pb-4 rounded-b-[24px] text-white space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-white/80 font-mono">
                    <span>Playtest</span>
                    <span>100% Nativo</span>
                  </div>
                  <h4 className="text-sm font-extrabold truncate">{currentLesson.title}</h4>
                  <p className="text-[10px] text-white/90 truncate">{currentLesson.subtitle}</p>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#EDF8F3]">
                  {currentLesson.items.map((it) => (
                    <div
                      key={it.id}
                      className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-xs text-[#0F172A]">{it.en}</p>
                        <p className="text-[10px] text-[#64748B]">{it.es}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => speak(it.en)}
                        className="p-1 rounded-lg bg-[#ECFDF5] text-[#05B075]"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border-default flex justify-between items-center text-xs">
              <span className="text-[11px] font-mono text-slate-subtle">Simulación táctil activa</span>
              <button
                type="button"
                onClick={() => setShowPlaytestDrawer(false)}
                className="px-3 py-1.5 bg-canvas border border-border-default rounded-xl text-slate-300 font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
