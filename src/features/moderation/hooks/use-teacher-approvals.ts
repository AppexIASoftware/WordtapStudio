"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getTeacherCourseReviewsApi,
  withdrawCourseReviewApi,
  ApiCourseReviewRequest,
  getSyncedReviews,
  removeSyncedReview,
  subscribeSyncedReviews,
} from "@/services/api";
import { ApprovalRequest } from "@/features/teacher-dashboard/types";
import { useUrlParams, useUrlParam } from "@/hooks/use-url-params";

function mapApiToApproval(req: ApiCourseReviewRequest): ApprovalRequest {
  const shortId = `PR-${req.id.length > 8 ? req.id.slice(0, 6).toUpperCase() : req.id}`;
  const submitted = new Date(req.submitted_at);
  const diffHours = Math.max(1, Math.round((Date.now() - submitted.getTime()) / (1000 * 60 * 60)));

  const statusLabels: Record<string, string> = {
    pending: "Pendiente",
    in_review: "En Revisión",
    approved: "Aprobada & Publicada",
    rejected: "Rechazada",
    changes_requested: "Cambios Solicitados",
  };

  const isResub = Boolean(
    req.change_summary &&
      (req.change_summary.toLowerCase().includes("correcc") ||
        req.change_summary.toLowerCase().includes("ajuste") ||
        req.change_summary.toLowerCase().includes("observac"))
  );

  return {
    id: shortId,
    courseId: req.course_id,
    title: req.course?.title || `Curso (${req.course_id.slice(0, 8)})`,
    submittedDate: submitted.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
    reviewer: req.reviewer_admin_id ? `Moderador (${req.reviewer_admin_id.slice(0, 6)})` : "Pendiente de Asignación",
    author: "Prof. (Tú)",
    waitHours: `${diffHours}h`,
    changesCount: isResub ? "Versión corregida" : req.change_summary ? "Actualización" : "Versión inicial",
    status: req.status,
    statusLabel: statusLabels[req.status] || "Pendiente",
    changes: req.change_summary || "Actualización de contenido pedagógico",
    notes: req.feedback_notes || undefined,
    changeSummary: req.change_summary || undefined,
    diffSummary: req.diff_summary || undefined,
    isResubmission: isResub || undefined,
  };
}

export type ApprovalTab = "all" | "corrections" | "pending" | "approved" | "rejected" | "attention";

const APPROVAL_TABS: ApprovalTab[] = [
  "all",
  "corrections",
  "pending",
  "approved",
  "rejected",
  "attention",
];

export function useTeacherApprovals() {
  const [prs, setPrs] = useState<ApprovalRequest[]>([]);
  const { get } = useUrlParams();
  const [activeTab, setActiveTab] = useUrlParam<ApprovalTab>("tab", APPROVAL_TABS, "all");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [feedbackThread, setFeedbackThread] = useState<
    { sender: string; text: string; time: string; isTeacher: boolean }[]
  >([]);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const refreshApprovals = useCallback(async () => {
    setIsLoading(true);
    const synced = getSyncedReviews();
    const statusLabels: Record<string, string> = {
      open: "En Revisión",
      pending: "En Revisión",
      in_review: "En Revisión",
      approved: "Aprobada & Publicada",
      rejected: "Rechazada",
      changes_requested: "Cambios Solicitados",
    };

    const syncedAsTeacher: ApprovalRequest[] = synced.map((s) => ({
      id: s.id,
      courseId: s.courseId,
      title: s.title,
      submittedDate: s.submittedAt,
      reviewer:
        !s.reviewer || s.reviewer === "Bandeja Abierta"
          ? "Pendiente de Asignación"
          : s.reviewer,
      author: s.author,
      waitHours: s.waitHours || "0.1h",
      changesCount: s.changesCount || "Versión enviada",
      status: s.status === "open" ? "pending" : s.status,
      statusLabel:
        statusLabels[s.status] ||
        (s.statusLabel.includes("Bandeja Abierta") ? "En Revisión" : s.statusLabel),
      changes: s.summary,
      notes: s.feedback,
      changeSummary: s.summary,
    }));

    const res = await getTeacherCourseReviewsApi();
    const courseMap = new Map<string, ApprovalRequest>();

    // 1. Procesar primero los registros de la API (ordenados por MySQL con submitted_at DESC)
    // El primer registro para cada curso siempre es la versión activa más reciente.
    if (res.data && res.data.length > 0) {
      for (const item of res.data) {
        const approval = mapApiToApproval(item);
        const key = item.course_id;

        if (!courseMap.has(key)) {
          courseMap.set(key, approval);
        } else {
          // Historial de revisión anterior para el mismo curso
          const active = courseMap.get(key)!;
          if (item.status === "changes_requested" || item.feedback_notes) {
            active.isResubmission = true;
            if (!active.previousNotes && item.feedback_notes) {
              active.previousNotes = item.feedback_notes;
            }
          }
        }
      }
    }

    // 2. Consolidar con envíos locales sincronizados
    for (const s of syncedAsTeacher) {
      const key = s.courseId || s.id;
      const existing = courseMap.get(key);
      if (!existing) {
        courseMap.set(key, s);
      } else {
        if (s.changeSummary && !existing.changeSummary) {
          existing.changeSummary = s.changeSummary;
          existing.changes = s.changeSummary;
        }
        if (s.notes && !existing.notes && !existing.previousNotes) {
          existing.previousNotes = s.notes;
        }
        if (s.changesCount && s.changesCount.includes("lecciones")) {
          existing.changesCount = s.changesCount;
        }
      }
    }

    const combined = Array.from(courseMap.values());
    setPrs(combined);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshApprovals();
    const unsubscribe = subscribeSyncedReviews(() => {
      refreshApprovals();
    });
    return unsubscribe;
  }, [refreshApprovals]);

  // Dynamic filter according to review status
  const filteredPrs = useMemo(() => {
    switch (activeTab) {
      case "corrections":
        return prs.filter((p) => p.status === "changes_requested");
      case "pending":
        return prs.filter((p) => p.status === "pending" || p.status === "in_review");
      case "approved":
        return prs.filter((p) => p.status === "approved");
      case "rejected":
        return prs.filter((p) => p.status === "rejected");
      case "attention":
        return prs.filter((p) => p.status === "rejected" || p.status === "changes_requested");
      default:
        return prs;
    }
  }, [prs, activeTab]);

  // El PR seleccionado vive en la URL (?pr=) y cae a la primera fila cuando no existe.
  const urlPrId = get("pr") ?? "";
  const selectedPrId = useMemo(() => {
    return filteredPrs.some((p) => p.id === urlPrId) ? urlPrId : filteredPrs[0]?.id ?? "";
  }, [filteredPrs, urlPrId]);

  const activePr = useMemo(() => {
    return filteredPrs.find((p) => p.id === selectedPrId) || null;
  }, [filteredPrs, selectedPrId]);

  // Sync feedback thread when active PR changes
  useEffect(() => {
    if (!activePr) return;
    const initialMessages: { sender: string; text: string; time: string; isTeacher: boolean }[] = [];

    if (activePr.notes) {
      let roleLabel = "Feedback Pedagógico del Revisor";
      if (activePr.status === "rejected") {
        roleLabel = "Feedback Pedagógico del Revisor • Motivo de Rechazo";
      } else if (activePr.status === "changes_requested") {
        roleLabel = "Feedback Pedagógico del Revisor • Correcciones Requeridas";
      } else if (activePr.status === "approved") {
        roleLabel = "Feedback Pedagógico del Revisor • Aprobación";
      }

      initialMessages.push({
        sender: `${activePr.reviewer} (${roleLabel})`,
        text: activePr.notes,
        time: activePr.submittedDate,
        isTeacher: false,
      });
    } else {
      let defaultMsg = "Solicitud en espera de revisión por el equipo pedagógico.";
      if (activePr.status === "approved") {
        defaultMsg = "Curso auditado y aprobado. Desplegado en la app móvil.";
      } else if (activePr.status === "rejected") {
        defaultMsg = "La solicitud fue rechazada. Por favor revisa los requerimientos pedagógicos y normativos.";
      } else if (activePr.status === "changes_requested") {
        defaultMsg = "Se solicitaron ajustes menores antes de poder publicar en Wordtap.";
      }
      initialMessages.push({
        sender: activePr.reviewer,
        text: defaultMsg,
        time: activePr.submittedDate,
        isTeacher: false,
      });
    }

    setFeedbackThread(initialMessages);
  }, [activePr]);

  const counts = useMemo(() => {
    const corrections = prs.filter((p) => p.status === "changes_requested").length;
    const pending = prs.filter((p) => p.status === "pending" || p.status === "in_review").length;
    const approved = prs.filter((p) => p.status === "approved").length;
    const rejected = prs.filter((p) => p.status === "rejected").length;
    return {
      total: prs.length,
      corrections,
      pending,
      approved,
      rejected,
      changesRequested: corrections,
      attention: corrections + rejected,
    };
  }, [prs]);

  const handleWithdrawReview = async (pr: ApprovalRequest) => {
    try {
      const targetId = pr.courseId || pr.id.replace("PR-", "");
      await withdrawCourseReviewApi(targetId);
      removeSyncedReview(pr.id);
      if (pr.courseId) removeSyncedReview(pr.courseId);
      setPrs((prev) => prev.filter((p) => p.id !== pr.id));
      triggerToast(`Solicitud de "${pr.title}" retirada. El curso volvió a Borrador.`);
    } catch {
      triggerToast("No se pudo retirar la solicitud de revisión");
    }
  };

  return {
    prs: filteredPrs,
    allPrs: prs,
    activePr,
    selectedPrId,
    activeTab,
    setActiveTab,
    isLoading,
    toastMessage,
    counts,
    feedbackThread,
    handleWithdrawReview,
    triggerToast,
    refreshApprovals,
  };
}
