"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Layers, Plus, Loader2, Award, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import {
  getTeacherCoursesApi,
  getTeacherCourseReviewsApi,
  getSyncedReviews,
  subscribeSyncedReviews,
  ApiCourse,
} from "@/services/api";
import { COURSE_PIPELINE } from "../data/mock-courses";
import { NewCourseModal } from "./new-course-modal";

interface TeacherPipelineProps {
  onNewCourse?: () => void;
}

interface PipelineCourseItem extends ApiCourse {
  reviewStatus?: string;
}

export function TeacherPipeline({ onNewCourse }: TeacherPipelineProps) {
  const [courses, setCourses] = useState<PipelineCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchPipeline = useCallback(async () => {
    setLoading(true);
    const [res, reviewsRes] = await Promise.all([
      getTeacherCoursesApi(),
      getTeacherCourseReviewsApi(),
    ]);
    const synced = getSyncedReviews();

    if (res.data && res.data.length > 0) {
      const items: PipelineCourseItem[] = res.data.map((c) => {
        const rev = reviewsRes.data?.find((r) => r.course_id === c.id);
        const syncRev = synced.find((s) => s.courseId === c.id || s.originalId === c.id);
        return {
          ...c,
          reviewStatus: rev?.status || syncRev?.status,
        };
      });
      setCourses(items);
    } else {
      const fallback: PipelineCourseItem[] = COURSE_PIPELINE.map((p) => {
        const syncRev = synced.find((s) => s.courseId === p.id || s.originalId === p.id);
        return {
          id: p.id,
          title: p.title,
          slug: p.id,
          level: p.subtitle.split("•")[0]?.trim() || "A1",
          status:
            p.badge === "Publicado" || p.badge === "Activo" || p.badge === "Aprobado & Verificado"
              ? "published"
              : p.badge === "En Revisión" || p.badge === "Revisar"
              ? "in_review"
              : "draft",
          reviewStatus: syncRev?.status,
          access_tier: "free",
          sort_order: 0,
          source_lang: "es",
          target_lang: "en",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });
      setCourses(fallback);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPipeline();
    const unsub = subscribeSyncedReviews(() => {
      fetchPipeline();
    });
    return unsub;
  }, [fetchPipeline]);

  const getStatusBadge = (course: PipelineCourseItem) => {
    if (course.reviewStatus === "changes_requested") {
      return {
        label: "Cambios Solicitados",
        classes: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        isApproved: false,
        isChanges: true,
      };
    }
    switch (course.status) {
      case "published":
        return {
          label: "Aprobado",
          classes: "bg-emerald-brand/20 text-emerald-brand border-emerald-brand/40 shadow-sm",
          isApproved: true,
          isChanges: false,
        };
      case "in_review":
        return {
          label: "En Revisión",
          classes: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          isApproved: false,
          isChanges: false,
        };
      default:
        return {
          label: "Borrador",
          classes: "bg-slate-500/20 text-slate-300 border-slate-500/30",
          isApproved: false,
          isChanges: false,
        };
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-card border border-border-default space-y-4 shadow-sm relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-white">Pipeline de Cursos</h4>
          <button
            type="button"
            onClick={() => fetchPipeline()}
            disabled={loading}
            className="p-1 rounded-lg hover:bg-card-hover text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Recargar pipeline de cursos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-brand" : ""}`} />
          </button>
        </div>
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
            const badge = getStatusBadge(course);
            const isReview = course.status === "in_review" || course.reviewStatus === "pending";
            const href = badge.isChanges || isReview ? "/teacher/approvals" : `/teacher/builder?courseId=${course.id}`;

            return (
              <Link
                key={course.id}
                href={href}
                className="p-3 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand/40 flex items-center justify-between transition-colors block group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {course.title}
                    </p>
                    {badge.isApproved && (
                      <span title="Insignia oficial: Curso auditado y aprobado">
                        <Award className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-subtle">
                    Nivel {course.level} • {course.lessons?.length || 0} lecciones
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badge.classes}`}>
                  {badge.isApproved && <Award className="w-3 h-3 text-emerald-brand" />}
                  {badge.isChanges && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                  {isReview && !badge.isChanges && <Clock className="w-3 h-3 text-blue-400" />}
                  {badge.label}
                </span>
              </Link>
            );
          })
        ) : (
          <div className="py-6 px-4 rounded-xl bg-canvas border border-border-default text-center space-y-3">
            <p className="text-xs text-slate-muted">No tienes cursos creados en el pipeline.</p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Crear mi primer curso</span>
            </button>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-border-default flex items-center justify-between text-xs">
        <Link
          href="/teacher/approvals"
          className="text-slate-muted hover:text-emerald-brand transition-colors text-[11px] font-medium flex items-center gap-1"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Ver estado de aprobaciones (PRs)</span>
        </Link>
        <button
          type="button"
          onClick={() => {
            if (onNewCourse) onNewCourse();
            else setShowModal(true);
          }}
          className="text-emerald-brand hover:underline text-[11px] font-bold flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>Nuevo curso</span>
        </button>
      </div>

      {showModal && (
        <NewCourseModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            fetchPipeline();
          }}
        />
      )}
    </div>
  );
}