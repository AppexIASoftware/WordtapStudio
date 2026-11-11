"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Link2,
  Ban,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAdminCoursesApi } from "@/services/api/admin";
import { getCourseLessonsApi } from "@/services/api/lessons";
import { ApiCourse, ApiLesson } from "@/services/api/types";
import { OWNER_TYPE } from "@/services/api/owner-type";

const PUBLISHED_COURSE_STATUS: ApiCourse["status"] = "published";

export type ActionTargetMode = "none" | "course" | "lesson" | "vault" | "custom";

interface ActionTargetPickerProps {
  value: string;
  onChange: (url: string, label: string) => void;
}

const FIELD_BASE_CLASS =
  "w-full bg-background border border-border-default rounded-xl px-3.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all h-10";

export function ActionTargetPicker({ value, onChange }: ActionTargetPickerProps) {
  const [mode, setMode] = useState<ActionTargetMode>(() => {
    if (!value) return "none";
    if (value === "/vault" || value === "/vocabulary") return "vault";
    if (value.startsWith("/courses/")) return "course";
    if (value.startsWith("/lessons/")) return "lesson";
    return "custom";
  });

  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [customUrl, setCustomUrl] = useState<string>(value);

  // Query catalog courses for target selection
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery<ApiCourse[]>({
    queryKey: ["admin", "courses-for-announcements", PUBLISHED_COURSE_STATUS, OWNER_TYPE.PLATFORM],
    queryFn: async () => {
      const res = await getAdminCoursesApi({ status: PUBLISHED_COURSE_STATUS, ownerType: OWNER_TYPE.PLATFORM });
      return res.data ?? [];
    },
    staleTime: 60_000,
    enabled: mode === "course" || mode === "lesson",
  });

  // Consulta de lecciones del curso seleccionado
  const { data: lessons = [], isLoading: isLoadingLessons } = useQuery<ApiLesson[]>({
    queryKey: ["admin", "course-lessons-for-announcements", selectedCourseId],
    queryFn: async () => {
      if (!selectedCourseId) return [];
      const res = await getCourseLessonsApi(selectedCourseId);
      return res.data ?? [];
    },
    staleTime: 60_000,
    enabled: mode === "lesson" && Boolean(selectedCourseId),
  });

  // Manejador del cambio de modo
  const handleModeChange = (newMode: ActionTargetMode) => {
    setMode(newMode);
    if (newMode === "none") {
      onChange("", "");
    } else if (newMode === "vault") {
      onChange("/vault", "Vocabulario (Content Vault)");
    } else if (newMode === "custom") {
      onChange(customUrl, "Enlace personalizado");
    } else if (newMode === "course") {
      if (selectedCourseId) {
        const course = courses.find((c) => c.id === selectedCourseId);
        onChange(`/courses/${selectedCourseId}`, course ? `Curso: ${course.title}` : "Curso");
      } else {
        onChange("", "");
      }
    } else if (newMode === "lesson") {
      if (selectedLessonId) {
        const lesson = lessons.find((l) => l.id === selectedLessonId);
        onChange(`/lessons/${selectedLessonId}`, lesson ? `Lección: ${lesson.title}` : "Lección");
      } else {
        onChange("", "");
      }
    }
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedLessonId("");
    const course = courses.find((c) => c.id === courseId);
    if (mode === "course") {
      if (courseId) {
        onChange(`/courses/${courseId}`, course ? `Curso: ${course.title}` : "Curso");
      } else {
        onChange("", "");
      }
    }
  };

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    const lesson = lessons.find((l) => l.id === lessonId);
    if (lessonId) {
      onChange(`/lessons/${lessonId}`, lesson ? `Lección: ${lesson.title}` : "Lección");
    } else {
      onChange("", "");
    }
  };

  const handleCustomChange = (text: string) => {
    setCustomUrl(text);
    onChange(text.trim(), text.trim() ? "Enlace personalizado" : "");
  };

  return (
    <div className="space-y-3 p-4 rounded-xl bg-muted/20 border border-border-default/80">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-foreground">
          Acción al Pulsar la Notificación <span className="text-muted-foreground font-normal">(Opcional)</span>
        </label>
        <span className="text-[11px] text-muted-foreground font-mono">
          {mode === "none" ? "Sin acción" : mode}
        </span>
      </div>

      {/* Selector de Modo */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        <button
          type="button"
          onClick={() => handleModeChange("none")}
          className={`h-8 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
            mode === "none"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold"
              : "bg-background border-border-default text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Ban className="w-3.5 h-3.5" />
          <span>Ninguna</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("course")}
          className={`h-8 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
            mode === "course"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold"
              : "bg-background border-border-default text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Curso</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("lesson")}
          className={`h-8 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
            mode === "lesson"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold"
              : "bg-background border-border-default text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Lección</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("vault")}
          className={`h-8 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
            mode === "vault"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold"
              : "bg-background border-border-default text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vocabulario</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("custom")}
          className={`col-span-2 sm:col-span-1 h-8 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
            mode === "custom"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold"
              : "bg-background border-border-default text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Manual</span>
        </button>
      </div>

      {/* Inputs condicionales según el modo */}
      {mode === "course" && (
        <div className="pt-1 space-y-1">
          <label className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            Seleccionar Curso de Destino
          </label>
          <div className="relative">
            <select
              value={selectedCourseId}
              onChange={(e) => handleCourseSelect(e.target.value)}
              disabled={isLoadingCourses}
              className={`${FIELD_BASE_CLASS} appearance-none pr-9 cursor-pointer disabled:opacity-50`}
            >
              <option value="">Elige un curso</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.level || "General"})
                </option>
              ))}
            </select>
            {isLoadingCourses ? (
              <Loader2 className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-spin" />
            ) : (
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      )}

      {mode === "lesson" && (
        <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              1. Seleccionar Curso
            </label>
            <div className="relative">
              <select
                value={selectedCourseId}
                onChange={(e) => handleCourseSelect(e.target.value)}
                disabled={isLoadingCourses}
                className={`${FIELD_BASE_CLASS} appearance-none pr-9 cursor-pointer disabled:opacity-50`}
              >
                <option value="">Elige un curso</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              2. Seleccionar Lección
            </label>
            <div className="relative">
              <select
                value={selectedLessonId}
                onChange={(e) => handleLessonSelect(e.target.value)}
                disabled={!selectedCourseId || isLoadingLessons}
                className={`${FIELD_BASE_CLASS} appearance-none pr-9 cursor-pointer disabled:opacity-50`}
              >
                <option value="">
                  {!selectedCourseId
                    ? "Primero elige un curso..."
                    : isLoadingLessons
                    ? "Cargando lecciones..."
                    : lessons.length === 0
                    ? "Sin lecciones disponibles"
                    : "Elige una lección"}
                </option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
              {isLoadingLessons ? (
                <Loader2 className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-spin" />
              ) : (
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      )}

      {mode === "custom" && (
        <div className="pt-1 space-y-1">
          <label className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            Enlace o Ruta Personalizada
          </label>
          <input
            type="text"
            value={customUrl}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="Ej: /catalog o /classrooms o https://..."
            className={`${FIELD_BASE_CLASS} font-mono text-xs`}
          />
        </div>
      )}

      {mode === "vault" && (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          Al pulsar, la app móvil abrirá directamente el buscador de vocabulario (Content Vault).
        </p>
      )}
    </div>
  );
}
