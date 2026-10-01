"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layers, Plus, Loader2 } from "lucide-react";
import { getTeacherCoursesApi, ApiCourse } from "@/services/api";
import { COURSE_PIPELINE } from "../data/mock-teacher-data";
import { NewCourseModal } from "./new-course-modal";

interface TeacherPipelineProps {
  onNewCourse?: () => void;
}

export function TeacherPipeline({ onNewCourse }: TeacherPipelineProps) {
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getTeacherCoursesApi().then((res) => {
      if (!isMounted) return;
      if (res.data && res.data.length > 0) {
        setCourses(res.data);
      }
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return {
          label: "Publicado",
          classes: "bg-emerald-brand/20 text-emerald-brand border-emerald-brand/30",
        };
      case "in_review":
        return {
          label: "En Revisión",
          classes: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        };
      default:
        return {
          label: "Borrador",
          classes: "bg-slate-500/20 text-slate-300 border-slate-500/30",
        };
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-card border border-border-default space-y-4 shadow-sm relative">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white">Pipeline de Cursos</h4>
        <span className="text-[10px] font-mono text-emerald-brand font-semibold">
          {courses.length > 0 ? `${courses.length} Cursos` : "Catálogo"}
        </span>
      </div>

      <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
        {loading ? (
          <div className="py-8 flex justify-center items-center text-slate-muted gap-2 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-brand" />
            <span>Cargando cursos...</span>
          </div>
        ) : courses.length > 0 ? (
          courses.map((course) => {
            const badge = getStatusBadge(course.status);
            const isReview = course.status === "in_review";
            const href = isReview ? "/teacher/approvals" : `/teacher/builder?courseId=${course.id}`;

            return (
              <Link
                key={course.id}
                href={href}
                className="p-3 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand/40 flex items-center justify-between transition-colors block"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-200">{course.title}</p>
                  <p className="text-[10px] text-slate-subtle">
                    Nivel {course.level} • {course.lessons?.length || 0} lecciones
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${badge.classes}`}>
                  {badge.label}
                </span>
              </Link>
            );
          })
        ) : (
          // ponytail: fallback template when no remote courses created yet
          COURSE_PIPELINE.map((course) => (
            <Link
              key={course.id}
              href={course.badgeVariant === "amber" ? "/teacher/approvals" : "/teacher/builder"}
              className="p-3 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand/40 flex items-center justify-between transition-colors block"
            >
              <div>
                <p className="text-xs font-semibold text-slate-200">{course.title}</p>
                <p className="text-[10px] text-slate-subtle">{course.subtitle}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  course.badgeVariant === "amber"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-emerald-brand/20 text-emerald-brand border-emerald-brand/30"
                }`}
              >
                {course.badge}
              </span>
            </Link>
          ))
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <Link
          href="/teacher/builder"
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-brand to-mint-brand text-canvas font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-emerald hover:opacity-95 transition-opacity text-center cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Abrir Creador</span>
        </Link>
        <button
          type="button"
          onClick={() => (onNewCourse ? onNewCourse() : setShowModal(true))}
          className="w-full py-2.5 px-3 rounded-xl bg-card border border-emerald-brand/40 text-emerald-brand font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-brand/10 transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo Curso</span>
        </button>
      </div>

      <NewCourseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={(newCourse) => setCourses((prev) => [newCourse, ...prev])}
      />
    </div>
  );
}
