"use client";

export interface SyncedReviewRequest {
  id: string;
  originalId: string;
  courseId: string;
  title: string;
  author: string;
  authorEmail: string;
  authorAvatar?: string;
  submittedAt: string;
  waitHours?: string;
  changesCount?: string;
  status: "open" | "in_review" | "approved" | "changes_requested" | "rejected";
  statusLabel: string;
  summary: string;
  feedback?: string;
  reviewer?: string;
  diffItems?: { field: string; original: string; proposed: string; note?: string }[];
}

const STORAGE_KEY = "wordtap_synced_reviews";
const SYNC_EVENT = "wordtap_synced_reviews_updated";

export function getSyncedReviews(): SyncedReviewRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSyncedReview(review: SyncedReviewRequest): void {
  if (typeof window === "undefined") return;
  try {
    const current = getSyncedReviews();
    const existingIndex = current.findIndex(
      (r) => r.id === review.id || r.courseId === review.courseId || r.originalId === review.originalId
    );
    let updated: SyncedReviewRequest[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], ...review };
    } else {
      updated = [review, ...current];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: review }));
  } catch (err) {
    console.warn("Failed to persist synced review:", err);
  }
}

export function updateSyncedReview(
  idOrCourseId: string,
  updates: Partial<SyncedReviewRequest>
): void {
  if (typeof window === "undefined") return;
  try {
    const current = getSyncedReviews();
    let found = false;
    const updated = current.map((r) => {
      if (
        r.id === idOrCourseId ||
        r.courseId === idOrCourseId ||
        r.originalId === idOrCourseId ||
        (updates.courseId && r.courseId === updates.courseId)
      ) {
        found = true;
        return { ...r, ...updates };
      }
      return r;
    });
    if (!found) {
      updated.unshift({
        id: idOrCourseId.startsWith("PR-") ? idOrCourseId : `PR-${idOrCourseId.slice(0, 6).toUpperCase()}`,
        originalId: idOrCourseId,
        courseId: updates.courseId || idOrCourseId,
        title: updates.title || "Curso en Revisión",
        author: updates.author || "Profesor",
        authorEmail: updates.authorEmail || "",
        submittedAt: new Date().toLocaleDateString("es-ES"),
        status: updates.status || "changes_requested",
        statusLabel: updates.statusLabel || "Cambios Solicitados",
        summary: updates.summary || "Solicitud de revisión docente",
        feedback: updates.feedback,
        reviewer: updates.reviewer,
      });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: updates }));
  } catch (err) {
    console.warn("Failed to update synced review:", err);
  }
}

export function removeSyncedReview(idOrCourseId: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getSyncedReviews();
    const updated = current.filter(
      (r) => r.id !== idOrCourseId && r.courseId !== idOrCourseId && r.originalId !== idOrCourseId
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { removedId: idOrCourseId } }));
  } catch (err) {
    console.warn("Failed to remove synced review:", err);
  }
}

export function subscribeSyncedReviews(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(SYNC_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(SYNC_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
