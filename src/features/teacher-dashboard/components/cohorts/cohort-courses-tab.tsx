"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Plus, Layers } from "lucide-react";
import { Course } from "../../types";
import { MOCK_COURSES_LIST } from "../../data/mock-courses";
import { getTeacherCoursesApi } from "@/services/api/courses";

interface CohortCoursesTabProps {
  assignedCourseIds: string[];
  classroomName: string;
  onAssignMore: () => void;
}

export function CohortCoursesTab({
  assignedCourseIds,
  classroomName,
  onAssignMore,
}: CohortCoursesTabProps) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function fetchRealCourses() {
      try {
        const res = await getTeacherCoursesApi();
        if (res.data && res.data.length > 0) {
          const liveCourses: Course[] = res.data
            .filter((c) => assignedCourseIds.includes(c.id))
            .map((c) => ({
              id: c.id,
              title: c.title,
              level: c.level,
              tier: c.access_tier === "free" ? "free" : "course",
              price: (c.price_cents || 0) / 100,
              currency: "USD",
              author: c.author?.name || "Docente",
              status: c.status,
              isDemo: false,
              lessons: (c.lessons || []).map((l) => ({
                id: l.id,
                title: l.title,
                subtitle: l.slug,
                duration: "15 min",
                tier: "free",
                intro: "",
                sectionTitle: "",
                isPublished: true,
                items: [],
              })),
            }));

          if (liveCourses.length > 0) {
            // Eliminar contenido demo: solo cursos reales de la DB
            setCourses(liveCourses);
            return;
          }
        }

        // El demo solo se muestra si NO hay información pedida por la API de la DB
        const fallback = MOCK_COURSES_LIST
          .filter((c) => assignedCourseIds.includes(c.id))
          .map((c) => ({ ...c, isDemo: true }));
        setCourses(fallback);
      } catch {
        const fallback = MOCK_COURSES_LIST
          .filter((c) => assignedCourseIds.includes(c.id))
          .map((c) => ({ ...c, isDemo: true }));
        setCourses(fallback);
      }
    }
    fetchRealCourses();
  }, [assignedCourseIds]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Cursos del Plan de Estudio: &apos;{classroomName}&apos;</span>
          </h3>
          <p className="text-[11px] text-slate-muted">
            Los alumnos matriculados en esta cohorte avanzan automáticamente por las lecciones y vocabulario de estos cursos.
          </p>
        </div>

        <button
          type="button"
          onClick={onAssignMore}
          className="px-3 py-1.5 rounded-xl bg-card border border-border-default hover:border-emerald-brand text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-brand" />
          <span>Vincular Otro Curso</span>
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="p-8 rounded-2xl bg-card border border-border-default text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-card-hover flex items-center justify-center text-slate-400">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-white">No hay cursos vinculados</p>
          <p className="text-[11px] text-slate-muted">
            Vincula al menos un curso del catálogo docente para activar el avance pedagógico de la cohorte.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-5 rounded-2xl bg-card border border-border-default hover:border-emerald-brand/40 transition-all space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
                    {course.level}
                  </span>
                  {course.isDemo && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Demo
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-subtle">
                  {course.lessons?.length || 0} Lecciones
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{course.title}</h4>
                <p className="text-[11px] text-slate-muted mt-0.5">
                  Acceso {course.tier === "free" ? "Gratuito" : "Premium"} • Por {course.author}
                </p>
              </div>

              <div className="pt-2 border-t border-border-default/80 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-slate-400">Contenido activo</span>
                <Link
                  href={`/teacher/builder?courseId=${course.id}`}
                  className="px-2.5 py-1 rounded-lg bg-emerald-brand/10 border border-emerald-brand/30 text-emerald-brand hover:bg-emerald-brand hover:text-canvas text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Gestionar en Creador</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
