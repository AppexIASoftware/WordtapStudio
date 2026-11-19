"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getAdminCourseReviewsApi,
  getAdminCourseReviewHistoryApi,
  decideCourseReviewApi,
  suspendCourseReviewApi,
  ApiCourseReviewRequest,
} from "@/services/api";
import { ModeratorPR } from "@/features/moderation/types";
import { belongsToReviewTab, latestReviewIds, type ReviewTab } from "./review-selection";

function mapApiToModeratorPr(req: ApiCourseReviewRequest): ModeratorPR {
  const shortId = `PR-${req.id.length > 8 ? req.id.slice(0, 6).toUpperCase() : req.id}`;
  const submitted = new Date(req.submitted_at);
  const diffHours = Math.max(1, Math.round((Date.now() - submitted.getTime()) / (1000 * 60 * 60)));

  let diffItems: ModeratorPR["diffItems"] = [];
  if (req.diff_summary) {
    try {
      const parsed = JSON.parse(req.diff_summary);
      if (parsed && Array.isArray(parsed.fields_changed)) {
        diffItems = parsed.fields_changed.map((f: string) => ({
          field: "Modificación",
          original: "Versión anterior",
          proposed: f,
        }));
      }
    } catch {
      // Non-JSON fallback
    }
  }

  if (diffItems.length === 0 && req.change_summary) {
    diffItems = [
      {
        field: "Resumen de cambios",
        original: "Versión anterior",
        proposed: req.change_summary,
      },
    ];
  }

  if (diffItems.length === 0) {
    diffItems = [
      {
        field: "Contenido del curso",
        original: "v1.0.0",
        proposed: "Nueva versión sometida para revisión",
      },
    ];
  }

  const statusMap: Record<string, ModeratorPR["status"]> = {
    pending: "open",
    in_review: "in_review",
    approved: "approved",
    changes_requested: "changes_requested",
    rejected: "rejected",
    withdrawn: "withdrawn",
  };

  const statusLabelMap: Record<string, string> = {
    pending: "Pendiente",
    in_review: "En Revisión",
    approved: "Aprobado & Publicado",
    changes_requested: "Correcciones Pedidas",
    rejected: "Rechazado",
    withdrawn: "Retirado",
  };

  return {
    id: shortId,
    originalId: req.id,
    title: req.course?.title || `Curso (${req.course_id.slice(0, 8)})`,
    author:
      req.instructor?.name ||
      req.course?.author?.name ||
      (req.course as { author?: string })?.author ||
      "Docente",
    authorEmail:
      req.instructor?.email ||
      req.course?.author?.email ||
      "",
    authorAvatar: (req.instructor?.name || req.course?.author?.name || "MS")
      .slice(0, 2)
      .toUpperCase(),
    submittedAt: submitted.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
    reviewedAt: req.reviewed_at ? new Date(req.reviewed_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }) : undefined,
    waitHours: `${diffHours}h`,
    changesCount: `${diffItems.length} cambios`,
    reviewer: req.reviewer_admin?.name || (req.reviewer_admin_id ? "Revisor" : "Sin asignar"),
    status: statusMap[req.status] || "open",
    statusLabel: statusLabelMap[req.status] || "Pendiente",
    summary: req.change_summary || "Actualización de contenido pedagógico",
    feedback: req.feedback_notes || undefined,
    courseId: req.course_id,
    diffItems,
  };
}

export function useModeratorApprovals(options?: { isAdmin?: boolean }) {
  const queryClient = useQueryClient();
  const isAdmin = options?.isAdmin ?? false;
  const senderName = isAdmin ? "Admin Principal (Tú)" : "Lic. Elena Ramos (Tú)";

  const [prs, setPrs] = useState<ModeratorPR[]>([]);
  const [activeTab, setActiveTab] = useState<ReviewTab>("open");
  const [selectedPrId, setSelectedPrId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Modales
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  // Hilo de feedback pedagógico oficial
  const [thread, setThread] = useState<
    { sender: string; text: string; time: string; isMod: boolean }[]
  >([]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const refreshReviews = useCallback(async () => {
    setIsLoading(true);
    const [res, history] = await Promise.all([
      getAdminCourseReviewsApi(),
      getAdminCourseReviewHistoryApi(),
    ]);
    if (res.error || !res.data || history.error || !history.data) {
      setIsLoading(false);
      triggerToast(res.error || history.error || "No se pudieron cargar las solicitudes.");
      return;
    }
    const reviews = [...res.data, ...history.data];
    const latest = latestReviewIds(reviews);
    const combined = reviews.map((review) => ({ ...mapApiToModeratorPr(review), isCurrent: latest.has(review.id) }));
    setPrs(combined);
    if (combined.length > 0) {
      setSelectedPrId((prev) => (combined.some((c) => c.id === prev) ? prev : combined[0].id));
    } else {
      setSelectedPrId("");
    }
    setIsLoading(false);
  }, [triggerToast]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!active) return;
      await refreshReviews();
    })();
    return () => {
      active = false;
    };
  }, [refreshReviews]);

  const filteredPrs = useMemo(() => {
    return prs.filter((p) => belongsToReviewTab(p, activeTab));
  }, [prs, activeTab]);

  const activePr = useMemo(() => {
    if (filteredPrs.length === 0) return null;
    const inFiltered = filteredPrs.find((p) => p.id === selectedPrId);
    if (inFiltered) return inFiltered;
    return filteredPrs[0] || null;
  }, [filteredPrs, selectedPrId]);

  const activePrKey = activePr ? `${activePr.id}:${activePr.feedback ?? ""}:${activePr.reviewer}` : "";
  const [prevActivePrKey, setPrevActivePrKey] = useState("");
  if (prevActivePrKey !== activePrKey) {
    setPrevActivePrKey(activePrKey);
    if (activePr) {
      setThread([
        activePr.feedback
          ? {
              sender: `${activePr.reviewer} (Revisor Oficial)`,
              text: activePr.feedback,
              time: activePr.submittedAt,
              isMod: true,
            }
          : {
              sender: "Equipo Pedagógico",
              text: "Sin observaciones previas registradas. Utiliza 'Pedir Cambios' o 'Rechazar' para emitir dictamen pedagógico oficial.",
              time: activePr.submittedAt,
              isMod: true,
            },
      ]);
    }
  }

  const handlePublishCourse = async () => {
    if (!activePr) return;
    const targetId = activePr.originalId || activePr.courseId || activePr.id.replace("PR-", "");
    const result = await decideCourseReviewApi(targetId, { status: "approved" });
    if (result.error || !result.data) {
      triggerToast(result.error || "No se pudo registrar la aprobación.");
      return;
    }
    setPrs((prev) =>
      prev.map((p) =>
        p.id === activePr.id
          ? { ...p, status: "approved", statusLabel: "Aprobado & Publicado", reviewer: senderName }
          : p
      )
    );
    setShowPublishModal(false);
    setActiveTab("approved");
    triggerToast(`¡Curso "${activePr.title}" aprobado y publicado en App Móvil!`);
    queryClient.invalidateQueries({ queryKey: ["teacher", "courses"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    void refreshReviews();
  };

  const handleRequestChanges = async (notes: string) => {
    if (!activePr) return;
    const targetId = activePr.originalId || activePr.courseId || activePr.id.replace("PR-", "");
    const result = await decideCourseReviewApi(targetId, {
      status: "changes_requested",
      feedback_notes: notes,
    });
    if (result.error || !result.data) {
      triggerToast(result.error || "No se pudieron solicitar correcciones.");
      return;
    }
    setPrs((prev) =>
      prev.map((p) =>
        p.id === activePr.id
          ? {
              ...p,
              status: "changes_requested",
              statusLabel: "Correcciones Pedidas",
              feedback: notes,
              reviewer: senderName,
            }
          : p
      )
    );
    setShowRequestChangesModal(false);
    setActiveTab("my");
    triggerToast("Correcciones solicitadas y feedback pedagógico enviado al docente");
    queryClient.invalidateQueries({ queryKey: ["teacher", "courses"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    void refreshReviews();
  };

  const handleRejectCourse = async (notes: string) => {
    if (!activePr) return;
    const targetId = activePr.originalId || activePr.courseId || activePr.id.replace("PR-", "");
    const result = await decideCourseReviewApi(targetId, {
      status: "rejected",
      feedback_notes: notes,
    });
    if (result.error || !result.data) {
      triggerToast(result.error || "No se pudo registrar el rechazo.");
      return;
    }
    setPrs((prev) =>
      prev.map((p) =>
        p.id === activePr.id
          ? {
              ...p,
              status: "rejected",
              statusLabel: "Rechazado",
              feedback: notes,
              reviewer: senderName,
            }
          : p
      )
    );
    setShowRejectModal(false);
    setActiveTab("my");
    triggerToast("Curso rechazado y feedback pedagógico enviado al docente");
    void refreshReviews();
  };

  const handleReassign = (newReviewer: string) => {
    if (!activePr) return;
    setPrs((prev) =>
      prev.map((p) => (p.id === activePr.id ? { ...p, reviewer: newReviewer } : p))
    );
    setShowReassignModal(false);
    triggerToast(`Solicitud reasignada a: ${newReviewer}`);
  };

  const handleSuspendToReview = async (
    reason: string
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!activePr?.courseId) {
      return { ok: false, error: "No se encontró el identificador del curso." };
    }
    const res = await suspendCourseReviewApi(activePr.courseId, reason);
    if (res.error || !res.data) {
      return {
        ok: false,
        error: res.error || "No se pudo suspender la publicación del curso.",
      };
    }

    queryClient.invalidateQueries({ queryKey: ["courses"] });
    queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
    await refreshReviews();
    if (res.data.request?.id) {
      setSelectedPrId(res.data.request.id);
      setActiveTab("open");
    }
    setShowSuspendModal(false);
    triggerToast("Publicación suspendida: el curso volvió a En Revisión");
    return { ok: true };
  };

  const counts = useMemo(() => {
    return {
      open: prs.filter((p) => belongsToReviewTab(p, "open")).length,
      my: prs.filter((p) => belongsToReviewTab(p, "my")).length,
      approved: prs.filter((p) => belongsToReviewTab(p, "approved")).length,
      history: prs.filter((p) => belongsToReviewTab(p, "history")).length,
    };
  }, [prs]);

  return {
    prs,
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
    showSuspendModal,
    setShowSuspendModal,
    thread,
    toastMessage,
    triggerToast,
    handlePublishCourse,
    handleRequestChanges,
    handleRejectCourse,
    handleReassign,
    handleSuspendToReview,
  };
}
