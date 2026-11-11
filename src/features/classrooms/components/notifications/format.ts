import {
  CLASSROOM_NOTIFICATION_ACTION,
  CLASSROOM_NOTIFICATION_STATUS,
  ClassroomNotification,
  ClassroomNotificationAction,
  ClassroomNotificationStatus,
} from "../../types";

export const STATUS_BADGE_CLASS: Record<ClassroomNotificationStatus, string> = {
  [CLASSROOM_NOTIFICATION_STATUS.SENT]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  [CLASSROOM_NOTIFICATION_STATUS.FAILED]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  [CLASSROOM_NOTIFICATION_STATUS.PARTIAL]:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

export const STATUS_LABEL: Record<ClassroomNotificationStatus, string> = {
  [CLASSROOM_NOTIFICATION_STATUS.SENT]: "Enviada",
  [CLASSROOM_NOTIFICATION_STATUS.FAILED]: "Fallida",
  [CLASSROOM_NOTIFICATION_STATUS.PARTIAL]: "Parcial",
};

export const ACTION_LABEL: Record<string, string> = {
  [CLASSROOM_NOTIFICATION_ACTION.OPEN_CLASSROOM]: "Abrir aula",
  [CLASSROOM_NOTIFICATION_ACTION.OPEN_CONTENT]: "Abrir contenido",
  announcement: "Comunicado global",
};

/**
 * Returns the clean human-readable full name of the notification sender.
 * Never displays raw UUIDs or technical keys to admins or teachers.
 */
export function formatEmitterName(notification: ClassroomNotification): string {
  const rawName = notification.teacher?.name?.trim();
  if (rawName) {
    if (rawName.includes(".") && !rawName.includes(" ")) {
      return rawName
        .split(".")
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }
    return rawName;
  }

  if (!notification.classroom_id || notification.teacher_id === "system-admin") {
    return "Administrador de la Plataforma";
  }

  return "Docente del Aula";
}

export function formatSentAt(sentAt: string): string {
  return new Date(sentAt).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatReadRate(readCount: number, recipientCount: number): string {
  if (recipientCount === 0) return "0%";
  return `${Math.round((readCount / recipientCount) * 100)}%`;
}

export function formatRelativeTime(timestamp: number, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - timestamp) / 1000));
  if (seconds < 10) return "justo ahora";
  if (seconds < 60) return `hace ${seconds} s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  return `hace ${Math.round(minutes / 60)} h`;
}

/** ISO timestamp -> local `yyyy-mm-dd` for `<input type="date">`. */
export function isoToDateInput(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Local `yyyy-mm-dd` -> ISO at start or end of that local day. */
export function dateInputToIso(value: string, edge: "start" | "end"): string | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  const date =
    edge === "start" ? new Date(y, m - 1, d, 0, 0, 0, 0) : new Date(y, m - 1, d, 23, 59, 59, 999);
  return date.toISOString();
}
