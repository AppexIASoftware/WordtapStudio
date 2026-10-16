"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getAdminCourseReviewsApi,
  decideCourseReviewApi,
  ApiCourseReviewRequest,
  getSyncedReviews,
  updateSyncedReview,
  subscribeSyncedReviews,
} from "@/services/api";
import { ModeratorPR } from "@/features/moderation/types";;

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
    rejected: "changes_requested",
  };

  const statusLabelMap: Record<string, string> = {
    pending: "Pendiente",
    in_review: "En Revisión",
    approved: "Aprobado & Publicado",
    changes_requested: "Correcciones Pedidas",
    rejected: "Rechazado",
  };

  return {
    id: shortId,
    originalId: req.id,
    title: req.course?.title || `Curso (${req.course_id.slice(0, 8)})`,
    author:
      req.instructor?.name ||
      req.course?.author?.name ||
      (req.course as { author?: string })?.author ||
      "Prof. Mateo Silva",
    authorEmail:
      req.instructor?.email ||
      req.course?.author?.email ||
      "docente@wordtap.app",
    authorAvatar: (req.instructor?.name || req.course?.author?.name || "MS")
      .slice(0, 2)
      .toUpperCase(),
    submittedAt: submitted.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
    waitHours: `${diffHours}h`,
    changesCount: `${diffItems.length} cambios`,
    reviewer: req.reviewer_admin_id ? `Admin (${req.reviewer_admin_id.slice(0, 6)})` : "Sin Asignar",
    status: statusMap[req.status] || "open",
    statusLabel: statusLabelMap[req.status] || "Pendiente",
    summary: req.change_summary || "Actualización de contenido pedagógico",
    feedback: req.feedback_notes || undefined,
    courseId: req.course_id,
    diffItems,
  };
}

export function useModeratorApprovals(options?: { isAdmin?: boolean }) {
  const isAdmin = options?.isAdmin ?? false;
  const senderName = isAdmin ? "Admin Principal (Tú)" : "Lic. Elena Ramos (Tú)";

  const [prs, setPrs] = useState<ModeratorPR[]>([]);
  const [activeTab, setActiveTab] = useState<"open" | "my" | "history">("open");
  const [selectedPrId, setSelectedPrId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Modales
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);

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
    const synced = getSyncedReviews();
    const syncedAsPrs: ModeratorPR[] = synced.map((s) => ({
      id: s.id,
      originalId: s.originalId,
      courseId: s.courseId,
      title: s.title,
      author: s.author,
      authorEmail: s.authorEmail,
      authorAvatar: s.authorAvatar || s.author.slice(0, 2).toUpperCase(),
      submittedAt: s.submittedAt,
      waitHours: s.waitHours || "0.1h",
      changesCount: s.changesCount || "Versión enviada",
      reviewer: s.reviewer || "Bandeja Abierta",
      status: (s.status as string) === "pending" ? "open" : s.status,
      statusLabel: s.statusLabel,
      summary: s.summary,
      feedback: s.feedback,
      diffItems: s.diffItems || [
        {
          field: "Estructura pedagógica",
          original: "Borrador inicial",
          proposed: "Contenido enviado para revisión docente",
        },
      ],
    }));

    const res = await getAdminCourseReviewsApi();
    const combined = [...syncedAsPrs];
    if (res.data && res.data.length > 0) {
      const mapped = res.data.map(mapApiToModeratorPr);
      for (const m of mapped) {
        if (!combined.some((c) => c.originalId === m.originalId || c.id === m.id)) {
          combined.push(m);
        }
      }
    }
    setPrs(combined);
    if (combined.length > 0) {
      setSelectedPrId((prev) => (combined.some((c) => c.id === prev) ? prev : combined[0].id));
    } else {
      setSelectedPrId("");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshReviews();
    const unsubscribe = subscribeSyncedReviews(() => {
      refreshReviews();
    });
    return unsubscribe;
  }, [refreshReviews]);

  const filteredPrs = useMemo(() => {
    return prs.filter((p) => {
      if (activeTab === "open") return p.status === "open" || (p.status as string) === "pending";
      if (activeTab === "my")
        return (
          p.status === "in_review" ||
          p.status === "changes_requested" ||
          p.status === "rejected"
        );
      return p.status === "approved";
    });
  }, [prs, activeTab]);

  const activePr = useMemo(() => {
    if (filteredPrs.length === 0) return null;
    const inFiltered = filteredPrs.find((p) => p.id === selectedPrId);
    if (inFiltered) return inFiltered;
    return filteredPrs[0] || null;
  }, [filteredPrs, selectedPrId]);

  useEffect(() => {
    if (filteredPrs.length > 0 && !filteredPrs.some((p) => p.id === selectedPrId)) {
      setSelectedPrId(filteredPrs[0].id);
    }
  }, [filteredPrs, selectedPrId]);

  useEffect(() => {
    if (!activePr) return;
    if (activePr.feedback) {
      setThread([
        {
          sender: `${activePr.reviewer} (Revisor Oficial)`,
          text: activePr.feedback,
          time: activePr.submittedAt,
          isMod: true,
        },
      ]);
    } else {
      setThread([
        {
          sender: "Equipo Pedagógico",
          text: "Sin observaciones previas registradas. Utiliza 'Pedir Cambios' o 'Rechazar' para emitir dictamen pedagógico oficial.",
          time: activePr.submittedAt,
          isMod: true,
        },
      ]);
    }
  }, [activePr]);

  const handlePublishCourse = async () => {
    if (!activePr) return;
    const targetId = activePr.originalId || activePr.courseId || activePr.id.replace("PR-", "");
    await decideCourseReviewApi(targetId, { status: "approved" });
    updateSyncedReview(activePr.id, {
      status: "approved",
      statusLabel: "Aprobado & Publicado",
      reviewer: senderName,
      courseId: activePr.courseId,
      title: activePr.title,
      author: activePr.author,
    });
    setPrs((prev) =>
      prev.map((p) =>
        p.id === activePr.id
          ? { ...p, status: "approved", statusLabel: "Aprobado & Publicado", reviewer: senderName }
          : p
      )
    );
    setShowPublishModal(false);
    setActiveTab("history");
    triggerToast(`¡Curso "${activePr.title}" aprobado y publicado en App Móvil!`);
  };

  const handleRequestChanges = async (notes: string) => {
    if (!activePr) return;
    const targetId = activePr.originalId || activePr.courseId || activePr.id.replace("PR-", "");
    await decideCourseReviewApi(targetId, {
      status: "changes_requested",
      feedback_notes: notes,
    });
    updateSyncedReview(activePr.id, {
      status: "changes_requested",
      statusLabel: "Correcciones Pedidas",
      feedback: notes,
      reviewer: senderName,
      courseId: activePr.courseId,
      title: activePr.title,
      author: activePr.author,
    });
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
  };

  const handleRejectCourse = async (notes: string) => {
    if (!activePr) return;
    const targetId = activePr.originalId || activePr.courseId || activePr.id.replace("PR-", "");
    await decideCourseReviewApi(targetId, {
      status: "rejected",
      feedback_notes: notes,
    });
    updateSyncedReview(activePr.id, {
      status: "rejected",
      statusLabel: "Rechazado",
      feedback: notes,
      reviewer: senderName,
      courseId: activePr.courseId,
      title: activePr.title,
      author: activePr.author,
    });
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
  };

  const handleReassign = (newReviewer: string) => {
    if (!activePr) return;
    setPrs((prev) =>
      prev.map((p) => (p.id === activePr.id ? { ...p, reviewer: newReviewer } : p))
    );
    setShowReassignModal(false);
    triggerToast(`Solicitud reasignada a: ${newReviewer}`);
  };

  const counts = useMemo(() => {
    return {
      open: prs.filter((p) => p.status === "open" || (p.status as string) === "pending").length,
      my: prs.filter((p) => p.status === "in_review" || p.status === "changes_requested" || p.status === "rejected").length,
      history: prs.filter((p) => p.status === "approved").length,
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
    thread,
    toastMessage,
    triggerToast,
    handlePublishCourse,
    handleRequestChanges,
    handleRejectCourse,
    handleReassign,
  };
}
