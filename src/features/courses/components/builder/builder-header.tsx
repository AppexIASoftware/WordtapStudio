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
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { Course } from "@/features/teacher-dashboard/types";

interface BuilderHeaderProps {
  courses: Record<string, Course>;
  currentCourseId: string;
  currentCourse: Course | null;
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
}

export function BuilderHeader({
  courses,
  currentCourseId,
  currentCourse,
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
}: BuilderHeaderProps) {
  const courseList = Object.values(courses);
  const isApproved = currentCourse?.status === "published" || currentCourse?.reviewStatus === "approved";
  const isChangesRequested = currentCourse?.reviewStatus === "changes_requested";
  const isInReview = currentCourse?.reviewStatus === "pending" || (!isChangesRequested && !isApproved && currentCourse?.status === "in_review");

  return (
    <div className="h-14 border-b border-border-default bg-card px-4 md:px-6 flex items-center justify-between flex-shrink-0 gap-3">
      <div className="flex items-center gap-2.5 overflow-x-auto">
        <span className="text-xs font-mono text-slate-muted uppercase tracking-wider flex-shrink-0">
          Curso Activo:
        </span>
        <select
          value={currentCourseId}
          onChange={(e) => onSelectCourse(e.target.value)}
          disabled={courseList.length === 0}
          className="bg-canvas border border-border-default rounded-xl px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-brand cursor-pointer flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {courseList.length === 0 ? (
            <option value="">Sin cursos disponibles</option>
          ) : (
            courseList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.level})
              </option>
            ))
          )}
        </select>

        {/* Insignia Oficial Según Estado de Aprobación */}
        {currentCourse && (
          isApproved ? (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold shadow-sm flex-shrink-0"
              title="Insignia oficial: Curso auditado y aprobado en el catálogo de Wordtap"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Aprobado & Verificado</span>
            </span>
          ) : isChangesRequested ? (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold flex-shrink-0"
              title="El revisor solicitó correcciones antes de publicar"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Cambios Solicitados</span>
            </span>
          ) : isInReview ? (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold flex-shrink-0"
              title="Solicitud pendiente en cola de moderación"
            >
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>En Revisión</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 font-mono text-[11px] font-semibold flex-shrink-0"
              title="Borrador en edición privada"
            >
              <FileText className="w-3 h-3 text-slate-400" />
              <span>Borrador</span>
            </span>
          )
        )}

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand text-slate-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer flex-shrink-0 disabled:opacity-50"
            title="Recargar datos del curso manualmente"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-brand" : ""}`} />
          </button>
        )}

        {currentCourse && (
          <button
            type="button"
            onClick={onOpenEditCourseModal}
            className="p-1.5 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand text-slate-300 hover:text-white transition-colors flex items-center justify-center cursor-pointer flex-shrink-0"
            title="Editar nombre, nivel o precio del curso"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenNewCourseModal}
          className="px-2.5 py-1.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1 cursor-pointer shadow-sm flex-shrink-0"
          title="Crear un nuevo curso dentro de tu cuota de autor"
        >
          <Plus className="w-3 h-3 stroke-[2.5]" />
          <span>Nuevo Curso</span>
        </button>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {currentCourse && (
          <button
            type="button"
            onClick={onOpenPricingModal}
            className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Configurar el precio de venta del curso y el reparto de ingresos"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-brand" />
            <span>Precio:</span>
            <span className="text-emerald-brand font-mono font-bold">
              {currentCourse.price > 0 ? `$${currentCourse.price.toFixed(2)}` : "Gratis"}
            </span>
          </button>
        )}

        {currentCourse && (
          <button
            type="button"
            onClick={onOpenExportModal}
            className="hidden md:flex px-3 py-1.5 rounded-xl bg-canvas border border-border-default hover:border-border-subtle text-xs font-medium text-slate-300 transition-colors items-center gap-1.5 cursor-pointer"
            title="Exportar copia de seguridad del curso"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>
        )}

        {currentCourse && (
          <button
            type="button"
            onClick={onOpenPlaytestDrawer}
            className="px-3 py-1.5 rounded-xl bg-card border border-emerald-brand/50 hover:border-emerald-brand text-emerald-brand hover:bg-emerald-brand/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Abrir Simulador de Playtest Móvil en drawer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Simulador Móvil</span>
          </button>
        )}

        {currentCourse && isInReview && onWithdrawReview && (
          <button
            type="button"
            onClick={onWithdrawReview}
            className="px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer bg-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-700 border border-amber-500/30"
            title="Cancelar solicitud y devolver curso a borrador para continuar editándolo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retirar a Borrador</span>
          </button>
        )}

        {currentCourse && (
          <button
            type="button"
            onClick={onSubmitReview}
            disabled={isInReview}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isInReview
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 cursor-not-allowed"
                : isChangesRequested
                ? "bg-amber-500 text-canvas hover:bg-amber-400 font-extrabold shadow-sm"
                : "bg-emerald-brand text-canvas hover:bg-mint-brand shadow-glow-emerald"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {isInReview
                ? "En Revisión"
                : isChangesRequested
                ? "Re-enviar Correcciones"
                : isApproved
                ? "Re-enviar a Revisión"
                : "Enviar a Revisión"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
