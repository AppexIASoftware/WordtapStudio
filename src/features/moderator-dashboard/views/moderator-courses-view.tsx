"use client";

import { useState } from "react";
import {
  Smartphone,
  Layers,
  Volume2,
  X,
  Play,
} from "lucide-react";
import { COURSES_DATA } from "@/features/teacher-dashboard/data/mock-teacher-data";
import { Course, Lesson } from "@/features/teacher-dashboard/types";
import { ToastNotification } from "@/components/ui/toast-notification";

export function ModeratorCoursesView() {
  const [courses] = useState<Record<string, Course>>(COURSES_DATA);
  const [selectedCourseId, setSelectedCourseId] = useState("c-2");
  const [showPlaytest, setShowPlaytest] = useState(false);

  // Lección activa para playtest
  const selectedCourse = courses[selectedCourseId] || courses["c-2"];
  const [playtestLesson, setPlaytestLesson] = useState<Lesson>(
    selectedCourse.lessons[0]
  );

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Toast flotante */}
      <ToastNotification message={toastMessage} variant="blue" />

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Supervisión Curricular & Playtest Móvil
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Control de Calidad
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            Supervisa el árbol pedagógico de los cursos y ejecuta playtests interactivos para asegurar la experiencia del estudiante.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPlaytest(true)}
          className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold text-xs hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Abrir Playtest Móvil</span>
        </button>
      </div>

      {/* Cuadrícula de Cursos en Supervisión */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {Object.values(courses).map((course) => {
          const isSelected = course.id === selectedCourseId;
          return (
            <div
              key={course.id}
              onClick={() => {
                setSelectedCourseId(course.id);
                if (course.lessons[0]) setPlaytestLesson(course.lessons[0]);
              }}
              className={`p-5 rounded-2xl bg-card border space-y-4 shadow-sm cursor-pointer transition-all ${
                isSelected
                  ? "border-2 border-blue-500/50 ring-1 ring-blue-500/30"
                  : "border-border-default hover:border-blue-500/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    course.tier === "free"
                      ? "bg-emerald-brand/20 text-emerald-brand border-emerald-brand/30"
                      : course.tier === "course"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}
                >
                  {course.level}
                </span>
                <span className="text-[10px] text-slate-subtle font-mono">
                  {course.lessons.length} lecciones
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{course.title}</h3>
                <p className="text-xs text-slate-muted mt-0.5">Autor: {course.author}</p>
              </div>

              <div className="p-3 rounded-xl bg-canvas border border-border-default flex items-center justify-between text-xs">
                <span className="text-slate-muted">Precio standalone:</span>
                <strong className="text-emerald-brand font-mono font-bold">
                  ${course.price.toFixed(2)} USD
                </strong>
              </div>

              <div className="pt-2 border-t border-border-default flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-slate-subtle">
                  Estado: {course.tier === "draft" ? "Borrador Docente" : "Catálogo Oficial"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (course.lessons[0]) setPlaytestLesson(course.lessons[0]);
                    setShowPlaytest(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 hover:bg-blue-500 hover:text-white font-bold text-[11px] transition-colors flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Playtest</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detalle de Lecciones del Curso Seleccionado */}
      <div className="p-6 rounded-2xl bg-card border border-border-default space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Lecciones de &apos;{selectedCourse.title}&apos;</span>
            </h3>
            <p className="text-xs text-slate-muted mt-0.5">
              Haz clic en cualquier lección para ejecutar el testeo en el simulador móvil.
            </p>
          </div>
          <span className="text-xs font-mono text-blue-400 font-bold">
            {selectedCourse.lessons.length} unidades activas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {selectedCourse.lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              className="p-4 rounded-xl bg-canvas border border-border-default flex items-center justify-between hover:border-blue-500/40 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-subtle">#{idx + 1}</span>
                  <h4 className="text-xs font-bold text-white">{lesson.title}</h4>
                </div>
                <p className="text-[11px] text-slate-subtle mt-0.5">{lesson.subtitle}</p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-muted mt-1.5">
                  <span>⏱ {lesson.duration}</span>
                  <span>•</span>
                  <span>{lesson.items.length} tarjetas</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPlaytestLesson(lesson);
                  setShowPlaytest(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Testear</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* DRAWER DE PLAYTEST MÓVIL */}
      {showPlaytest && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-sm bg-card border-l border-border-default h-full p-4 flex flex-col justify-between shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white">Simulador de Calidad (Playtest)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPlaytest(false)}
                className="p-1 rounded-lg bg-canvas text-slate-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-2">
              <div className="w-[300px] h-[540px] bg-slate-950 rounded-[38px] border-[5px] border-slate-800 shadow-2xl overflow-hidden flex flex-col text-slate-900">
                <div className="bg-[#05B075] pt-6 px-4 pb-4 rounded-b-[24px] text-white space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-white/80 font-mono">
                    <span>WordTap Mobile</span>
                    <span>Modo Calidad</span>
                  </div>
                  <h4 className="text-sm font-extrabold truncate">{playtestLesson.title}</h4>
                  <p className="text-[10px] text-white/90 truncate">{playtestLesson.subtitle}</p>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#EDF8F3]">
                  {playtestLesson.items.map((it) => (
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
              <span className="text-[11px] font-mono text-slate-subtle">
                Auditoría móvil activa
              </span>
              <button
                type="button"
                onClick={() => setShowPlaytest(false)}
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
