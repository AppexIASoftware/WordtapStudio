"use client";

import { ArrowRight, Crown, GraduationCap, Loader2, Plus, Sparkles } from "lucide-react";
import { ApiCourse } from "@/services/api";
import { CourseCard } from "./course-card";

interface CoursesTableProps {
  activeTab: "platform" | "teacher";
  selectedStatus: string;
  selectedLevel: string;
  searchQuery: string;
  otherTabPublishedCount: number;
  isLoading: boolean;
  totalCourses: number;
  courses: ApiCourse[];
  returnUrl: string;
  onChangeTab: (tab: "platform" | "teacher") => void;
  onCreate: () => void;
  onEditDetails: (course: ApiCourse) => void;
  onEditPricing: (course: ApiCourse) => void;
  onTogglePublish: (course: ApiCourse) => void;
}

export function CoursesTable({ activeTab, selectedStatus, selectedLevel, searchQuery, otherTabPublishedCount, isLoading, totalCourses, courses, returnUrl, onChangeTab, onCreate, onEditDetails, onEditPricing, onTogglePublish }: CoursesTableProps) {
  return (
    <>
      {selectedStatus === "published" && otherTabPublishedCount > 0 && (
        <div className="p-3 px-4 rounded-2xl bg-card border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Tenés <strong>{otherTabPublishedCount}</strong> curso{otherTabPublishedCount === 1 ? "" : "s"} publicado{otherTabPublishedCount === 1 ? "" : "s"} en la pestaña{" "}
              <strong className="text-white">{activeTab === "platform" ? "Cursos de Docentes" : "Cursos de Plataforma"}</strong>.
            </span>
          </div>
          <button type="button" onClick={() => onChangeTab(activeTab === "platform" ? "teacher" : "platform")} className="text-emerald-brand hover:underline font-bold cursor-pointer flex items-center gap-1 self-start sm:self-auto">
            <span>Ver en {activeTab === "platform" ? "Cursos de Docentes" : "Cursos de Plataforma"}</span><ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {isLoading && totalCourses === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-muted">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-brand" />
          <span className="text-xs font-mono">Cargando catálogo oficial de Wordtap...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="py-16 p-8 rounded-3xl bg-card border border-border-default flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto shadow-card-soft">
          <div className="w-14 h-14 rounded-2xl bg-emerald-brand/10 border border-emerald-brand/20 flex items-center justify-center text-emerald-brand shadow-inner">
            {activeTab === "platform" ? <Crown className="w-7 h-7 text-amber-400" /> : <GraduationCap className="w-7 h-7 text-purple-400" />}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              {selectedStatus === "published" ? "No hay más cursos publicados en esta pestaña" : searchQuery || selectedLevel || selectedStatus ? "No se encontraron cursos con estos filtros" : activeTab === "platform" ? "Aún no hay cursos de plataforma creados" : "Aún no hay cursos de docentes enviados"}
            </h3>
            <p className="text-xs text-slate-muted leading-relaxed">
              {selectedStatus === "published" ? "Podés publicar cualquiera de los otros cursos borrador con el botón 'Publicar' para activarlo en la app móvil." : searchQuery || selectedLevel || selectedStatus ? "Probá limpiando los filtros de estado o nivel." : activeTab === "platform" ? "Comenzá creando el primer curso oficial del currículo de Wordtap." : "Los cursos creados por docentes independientes aparecerán aquí para tu supervisión."}
            </p>
          </div>
          {activeTab === "platform" && !selectedStatus && (
            <button type="button" onClick={onCreate} className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors cursor-pointer flex items-center gap-1.5 shadow-glow-emerald">
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" /><span>Crear Primer Curso Oficial</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map((course) => <CourseCard key={course.id} course={course} returnUrl={returnUrl} onEditDetails={onEditDetails} onEditPricing={onEditPricing} onTogglePublish={onTogglePublish} />)}
        </div>
      )}
    </>
  );
}
