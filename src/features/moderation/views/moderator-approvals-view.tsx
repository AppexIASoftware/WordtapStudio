"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";
import {
  Smartphone,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useModeratorApprovals } from "../hooks/use-moderator-approvals";
import { ApprovalsTable } from "../components/approvals-table";
import { ApprovalAuditDrawer } from "../components/approval-audit-drawer";
import { ToastNotification } from "@/components/ui/toast-notification";

interface ModeratorApprovalsViewProps {
  isAdmin?: boolean;
}

export function ModeratorApprovalsView({ isAdmin = false }: ModeratorApprovalsViewProps = {}) {
  const { currentRole } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryPr = searchParams?.get("pr");
  const queryCourse = searchParams?.get("courseId");
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);

  useEffect(() => {
    if (currentRole === "instructor") {
      router.replace("/teacher/approvals");
    }
  }, [currentRole, router]);

  const {
    filteredPrs,
    activePr,
    selectedPrId,
    setSelectedPrId,
    activeTab,
    setActiveTab,
    counts,
    refreshReviews,
    isLoading,
    showPublishModal,
    setShowPublishModal,
    showReassignModal,
    setShowReassignModal,
    showRejectModal,
    setShowRejectModal,
    showRequestChangesModal,
    setShowRequestChangesModal,
    thread,
    toastMessage,
    handlePublishCourse,
    handleRequestChanges,
    handleRejectCourse,
    handleReassign,
  } = useModeratorApprovals({ isAdmin });

  useEffect(() => {
    if (filteredPrs.length === 0) return;
    if (queryPr || queryCourse) {
      const match = filteredPrs.find(
        (p) =>
          (queryPr && (p.id === queryPr || p.originalId === queryPr)) ||
          (queryCourse && p.courseId === queryCourse)
      );
      if (match) {
        setSelectedPrId(match.id);
        setIsAuditDrawerOpen(true);
      }
    }
  }, [filteredPrs, queryPr, queryCourse, setSelectedPrId]);

  if (currentRole === "instructor") {
    return null;
  }

  const handleOpenAudit = (prId: string) => {
    setSelectedPrId(prId);
    setIsAuditDrawerOpen(true);
  };

  return (
    <div className={isAdmin ? "space-y-6 animate-in fade-in duration-200" : "p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200"}>
      <ToastNotification message={toastMessage} variant={isAdmin ? "purple" : "blue"} />

      {/* Encabezado y Estadísticas de la Cola */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {isAdmin ? "Aprobación de Cursos de Docentes (Supervisión Admin)" : "Cola de Moderación & Aprobaciones"}
            </h1>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
              isAdmin
                ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                : "bg-blue-500/10 text-blue-400 border-blue-500/30"
            }`}>
              {isAdmin ? "Supervisión Admin" : "ADR-02 • Cola Abierta"}
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            {isAdmin
              ? "Bandeja ejecutiva de auditoría de diff pedagógico y despliegue oficial de cursos de docentes al catálogo móvil."
              : "Bandeja de verificación de precisión lingüística y cambios del docente antes de publicar en la app móvil."}
          </p>
        </div>
      </div>

      {/* Banner de Modo Operativo (Solo Moderador) */}
      {!isAdmin && (
        <div className="p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm bg-blue-500/10 border-blue-500/30 text-blue-300">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 text-blue-400" />
            <span>
              <strong>Modo Moderador / Calidad:</strong> Los moderadores auditan solicitudes docentes, dictaminan feedback pedagógico, solicitan ajustes o rechazan con observaciones.
            </span>
          </div>
          <Link
            href="/moderator/courses"
            className="px-3 py-1.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0 bg-blue-500 hover:bg-blue-600"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Simulador Playtest</span>
          </Link>
        </div>
      )}

      {/* Pestañas de Navegación de la Cola y Botón Recargar */}
      <div className="flex items-center justify-between border-b border-border-default pb-3">
        <div className="flex flex-wrap items-center gap-1 bg-card p-1 rounded-2xl border border-border-default text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("open")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "open"
                ? "bg-blue-500 text-white font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            <span>Bandeja Abierta</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === "open" ? "bg-white/20 text-white" : "bg-card-hover text-slate-400"
            }`}>
              {counts.open}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("my")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "my"
                ? "bg-blue-500 text-white font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            <span>En Revisión / Correcciones</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === "my" ? "bg-white/20 text-white" : "bg-card-hover text-slate-400"
            }`}>
              {counts.my}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("approved")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "approved"
                ? "bg-blue-500 text-white font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            <span>Aprobados</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === "approved" ? "bg-white/20 text-white" : "bg-card-hover text-slate-400"}`}>
              {counts.approved}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "history"
                ? "bg-blue-500 text-white font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            <span>Historial de Revisiones</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === "history" ? "bg-white/20 text-white" : "bg-card-hover text-slate-400"
            }`}>
              {counts.history}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => refreshReviews()}
          disabled={isLoading}
          className="p-2 rounded-xl bg-card border border-border-default hover:border-blue-500 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          title="Recargar solicitudes manualmente"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
          <span className="hidden sm:inline">Recargar</span>
        </button>
      </div>

      <ApprovalsTable items={filteredPrs} selectedId={selectedPrId} isHistory={activeTab === "history" || activeTab === "approved"} isApprovedOnly={activeTab === "approved"} onOpen={handleOpenAudit} />

      {/* Drawer Lateral de Auditoría de Solicitud */}
      <ApprovalAuditDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        activePr={activePr}
        thread={thread}
        showPublishModal={showPublishModal}
        setShowPublishModal={setShowPublishModal}
        showReassignModal={showReassignModal}
        setShowReassignModal={setShowReassignModal}
        showRejectModal={showRejectModal}
        setShowRejectModal={setShowRejectModal}
        showRequestChangesModal={showRequestChangesModal}
        setShowRequestChangesModal={setShowRequestChangesModal}
        onPublish={async () => {
          await handlePublishCourse();
          setIsAuditDrawerOpen(false);
        }}
        onRequestChanges={async (notes) => {
          await handleRequestChanges(notes);
          setIsAuditDrawerOpen(false);
        }}
        onReject={async (notes) => {
          await handleRejectCourse(notes);
          setIsAuditDrawerOpen(false);
        }}
        onReassign={async (reviewer) => {
          await handleReassign(reviewer);
        }}
      />
    </div>
  );
}
