"use client";

import {
  Download,
  Smartphone,
  CheckCircle2,
  Plus,
  Settings,
  DollarSign,
  Award,
  Clock,
  FileText,
  AlertTriangle,
  Eye,
  RefreshCw,
  RotateCcw,
  Crown,
} from "lucide-react";
import { Course } from "@/features/courses/types";
import { CourseSelectorDropdown } from "./course-selector-dropdown";

interface BuilderHeaderProps {
  courses: Record<string, Course>;
  currentCourseId: string;
  currentCourse: Course | null;
  isAdmin?: boolean;
  canEditCourse?: boolean;
  isLoading?: boolean;
  onRefresh?: () => void;
  onSelectCourse: (id: string) => void;
  onOpenNewCourseModal: () => void;
  onOpenEditCourseModal: () => void;
  onOpenPricingModal: () => void;
  onOpenExportModal: () => void;
  onOpenPlaytestDrawer: () => void;
  onSubmitReview: () => void;
  onWithdrawReview?: () => void;
  onAdminPublish?: () => void;
}

export function BuilderHeader({
  courses,
  currentCourseId,
  currentCourse,
  isAdmin = false,
  canEditCourse = true,
  isLoading = false,
  onRefresh,
  onSelectCourse,
  onOpenNewCourseModal,
  onOpenEditCourseModal,
  onOpenPricingModal,
  onOpenExportModal,
  onOpenPlaytestDrawer,
  onSubmitReview,
  onWithdrawReview,
  onAdminPublish,
}: BuilderHeaderProps) {
  const courseList = Object.values(courses);
  const isApproved = currentCourse?.status === "published" || currentCourse?.reviewStatus === "approved";
  const isChangesRequested = currentCourse?.reviewStatus === "changes_requested";
  const isInReview = currentCourse?.reviewStatus === "pending" || (!isChangesRequested && !isApproved && currentCourse?.status === "in_review");

  return (
    <div className="h-13 border-b border-border-default bg-card px-3 md:px-4 flex items-center justify-between flex-shrink-0 gap-2 text-xs">
      {/* Lado Izquierdo: Selector de Curso y Estado */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[11px] font-mono text-slate-muted uppercase tracking-wider flex-shrink-0 hidden xl:inline">
          Curso:
        </span>
        <CourseSelectorDropdown
          courses={courseList}
          currentCourseId={currentCourseId}
          isAdmin={isAdmin}
          onSelectCourse={onSelectCourse}
          disabled={courseList.length === 0}
        />

        {/* Insignia Oficial Según Estado de Aprobación.
            El estado "correcciones pedidas" pertenece al flujo del docente: el
            admin ve el estado de publicación del curso (Borrador), no la tarea
            pendiente del autor. */}
        {currentCourse && (
          isApproved ? (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold shadow-sm flex-shrink-0"
              title="Insignia oficial: Curso auditado y aprobado en el catálogo de Wordtap"
            >
              <Award className="w-3 h-3 text-emerald-400" />
              <span className="hidden xl:inline">Aprobado</span>
            </span>
          ) : isChangesRequested && !isAdmin ? (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold flex-shrink-0"
              title="El revisor solicitó correcciones antes de publicar"
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span className="hidden xl:inline">Cambios Pedidos</span>
            </span>
          ) : isInReview ? (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-[11px] font-bold flex-shrink-0"
              title="Solicitud pendiente en cola de moderación"
            >
              <Clock className="w-3 h-3 text-blue-400" />
              <span className="hidden xl:inline">En Revisión</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 font-mono text-[10px] font-semibold flex-shrink-0"
              title="Borrador en edición privada"
            >
              <FileText className="w-2.5 h-2.5 text-slate-400" />
              <span className="hidden xl:inline">Borrador</span>
            </span>
          )
        )}

        {currentCourse && !canEditCourse && (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 font-mono text-[10px] font-semibold flex-shrink-0"
            title="Curso de docente: podés revisar y aprobar, pero no editar su contenido"
          >
            <Eye className="w-2.5 h-2.5 text-slate-400" />
            <span className="hidden xl:inline">Solo supervisión</span>
          </span>
        )}

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-canvas border border-border-default hover:border-emerald-brand text-slate-400 hover:text-white transition-colors hidden md:flex items-center justify-center cursor-pointer flex-shrink-0 disabled:opacity-50"
            title="Recargar datos del curso manualmente"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-brand" : ""}`} />
          </button>
        )}

        {currentCourse && canEditCourse && (
          <button
            type="button"
            onClick={onOpenEditCourseModal}
            className="p-1.5 rounded-lg bg-canvas border border-border-default hover:border-emerald-brand text-slate-300 hover:text-white transition-colors hidden md:flex items-center justify-center cursor-pointer flex-shrink-0"
            title="Editar nombre, nivel o precio del curso"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenNewCourseModal}
          className="px-2 py-1.5 rounded-lg bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1 cursor-pointer shadow-sm flex-shrink-0"
          title="Crear un nuevo curso"
        >
          <Plus className="w-3 h-3 stroke-[2.5]" />
          <span className="hidden sm:inline">Nuevo</span>
        </button>
      </div>

      {/* Lado Derecho: Acciones de Curso */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {currentCourse && canEditCourse && (
          <button
            type="button"
            onClick={onOpenPricingModal}
            className={`px-2.5 py-1.5 rounded-lg bg-canvas border text-xs font-semibold hover:text-white transition-colors hidden xl:flex items-center gap-1.5 cursor-pointer ${
              currentCourse.tier === "subscription"
                ? "border-amber-500/40 text-amber-300 hover:border-amber-400 bg-amber-500/10"
                : "border-border-default hover:border-emerald-brand text-slate-200"
            }`}
            title="Configurar precio de venta o modelo de suscripción"
          >
            {currentCourse.tier === "subscription" ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300 font-mono font-bold">
                  Suscripción Pro
                </span>
              </>
            ) : (
              <>
                <DollarSign className="w-3 h-3 text-emerald-brand" />
                <span className="text-emerald-brand font-mono font-bold">
                  {currentCourse.price > 0 ? `$${currentCourse.price.toFixed(2)}` : "Gratis"}
                </span>
              </>
            )}
          </button>
        )}

        {currentCourse && (
          <button
            type="button"
            onClick={onOpenExportModal}
            className="hidden xl:flex px-2.5 py-1.5 rounded-lg bg-canvas border border-border-default hover:border-border-subtle text-xs font-medium text-slate-300 transition-colors items-center gap-1 cursor-pointer"
            title="Exportar copia de seguridad"
          >
            <Download className="w-3 h-3" />
            <span>Exportar</span>
          </button>
        )}

        {currentCourse && (
          <button
            type="button"
            onClick={onOpenPlaytestDrawer}
            className="px-2.5 py-1.5 rounded-lg bg-card border border-emerald-brand/50 hover:border-emerald-brand text-emerald-brand hover:bg-emerald-brand/10 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
            title="Abrir Simulador Móvil"
          >
            <Smartphone className="w-3 h-3" />
            <span className="hidden 2xl:inline">Simulador</span>
          </button>
        )}

        {currentCourse && isInReview && onWithdrawReview && (
          <button
            type="button"
            onClick={onWithdrawReview}
            className="px-2.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer bg-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-700 border border-amber-500/30"
            title="Cancelar solicitud y devolver a borrador"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retirar</span>
          </button>
        )}

        {currentCourse && (
          isApproved ? (
            <span className="px-2.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>{isAdmin ? "Publicado" : "Aprobado"}</span>
            </span>
          ) : isAdmin ? (
            <button
              type="button"
              onClick={onAdminPublish}
              className="px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer bg-emerald-brand text-canvas hover:bg-mint-brand shadow-glow-emerald"
              title="Aprobar y publicar curso directamente en el catálogo oficial de Wordtap"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Aprobar & Publicar</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmitReview}
              disabled={isInReview}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                isInReview
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 cursor-not-allowed"
                  : isChangesRequested
                  ? "bg-amber-500 text-canvas hover:bg-amber-400 font-extrabold shadow-sm"
                  : "bg-emerald-brand text-canvas hover:bg-mint-brand shadow-glow-emerald"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>
                {isInReview
                  ? "En Revisión"
                  : isChangesRequested
                  ? "Re-enviar Correcciones"
                  : "Enviar a Revisión"}
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
