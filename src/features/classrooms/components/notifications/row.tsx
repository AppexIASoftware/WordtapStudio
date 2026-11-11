import {
  AcademicCapIcon,
  ChevronRightIcon,
  ClockIcon,
  DocumentTextIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { CLASSROOM_NOTIFICATION_ACTION, ClassroomNotification } from "../../types";
import {
  STATUS_BADGE_CLASS,
  STATUS_LABEL,
  formatEmitterName,
  formatReadRate,
  formatSentAt,
} from "./format";

interface RowProps {
  notification: ClassroomNotification;
  onClick: () => void;
}

export function NotificationRow({ notification, onClick }: RowProps) {
  const isContentAction = notification.action_type === CLASSROOM_NOTIFICATION_ACTION.OPEN_CONTENT;
  const ActionIcon = isContentAction ? AcademicCapIcon : UserCircleIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full p-4 hover:bg-muted/50 transition-colors text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset"
      aria-label={`Ver detalle de: ${notification.title}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <ActionIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-foreground truncate">{notification.title}</h4>
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 px-2 py-0.5 bg-muted rounded-full">
              <ClockIcon className="w-3 h-3" />
              {formatSentAt(notification.sent_at)}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 bg-muted rounded-full font-medium text-foreground/80">
              <UserCircleIcon className="w-3 h-3 text-emerald-500" />
              {formatEmitterName(notification)}
            </span>
            {!notification.classroom_id && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full font-medium">
                Global
              </span>
            )}
            {notification.target_course && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-emerald-700 dark:text-emerald-300">
                <AcademicCapIcon className="w-3 h-3" />
                {notification.target_course.title}
              </span>
            )}
            {notification.target_lesson && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-700 dark:text-purple-300">
                <DocumentTextIcon className="w-3 h-3" />
                {notification.target_lesson.title}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-full ${STATUS_BADGE_CLASS[notification.status]}`}>
              {STATUS_LABEL[notification.status]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              {notification.recipient_count} destinatarios
            </div>
            <div className="text-xs text-muted-foreground">
              {formatReadRate(notification.read_count, notification.recipient_count)} leídas
            </div>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-muted-foreground shrink-0" />
        </div>
      </div>
    </button>
  );
}
