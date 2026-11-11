"use client";

import { ClockIcon, DocumentTextIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { ClassroomNotificationFilters } from "../../types";
import { useUrlParams } from "@/hooks/use-url-params";
import { useNotificationHistory } from "../../hooks/use-notification-history";
import { NotificationFilterBar } from "./filter-bar";
import { NotificationRow } from "./row";
import { NotificationDetailDrawer } from "./detail-drawer";
import { NotificationListSkeleton } from "./skeleton";
import { RefreshButton } from "./refresh-button";

interface NotificationHistoryPanelProps {
  scope: "teacher" | "admin";
  classroomId?: string;
  title?: string;
  onClose?: () => void;
}

// Query param que identifica la notificación abierta en el historial.
export const NOTIFICATION_DETAIL_PARAM = "notification";

const CLEARED_FILTERS: Partial<ClassroomNotificationFilters> = {
  status: undefined,
  date_from: undefined,
  date_to: undefined,
  classroom_id: undefined,
  teacher_id: undefined,
  course_id: undefined,
  lesson_id: undefined,
};

export function NotificationHistoryPanel({ scope, classroomId, title }: NotificationHistoryPanelProps) {
  const {
    notifications,
    pagination,
    isLoading,
    isFetching,
    isFetchingMore,
    hasMore,
    error,
    filters,
    lastUpdatedAt,
    setFilters,
    loadMore,
    refetch,
  } = useNotificationHistory({ scope, classroomId });

  // La notificación abierta vive en la URL (?notification=<id>) para poder compartir el detalle.
  const { get, setParams } = useUrlParams();
  const selectedId = get(NOTIFICATION_DETAIL_PARAM);
  const selected = notifications.find((notification) => notification.id === selectedId) ?? null;

  return (
    <div className="bg-card border border-border-default rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 p-4 border-b border-border-default">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-semibold text-foreground">{title || "Historial de Notificaciones"}</h2>
        </div>
        <div className="flex items-center gap-2">
          {scope === "teacher" && classroomId && (
            <button
              type="button"
              onClick={() => setParams({ action: "broadcast" })}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Publicar nuevo aviso a esta aula"
            >
              <PaperAirplaneIcon className="w-3.5 h-3.5 -rotate-45" />
              <span>Publicar Aviso</span>
            </button>
          )}
          <RefreshButton onRefresh={() => void refetch()} isFetching={isFetching} lastUpdatedAt={lastUpdatedAt} />
        </div>
      </div>

      <NotificationFilterBar
        scope={scope}
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(CLEARED_FILTERS)}
      />

      <div className="flex-1 overflow-auto">
        {error && notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <DocumentTextIcon className="w-12 h-12 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No se pudo cargar el historial</h3>
            <p className="text-muted-foreground text-sm mb-4">{error}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        ) : isLoading ? (
          <NotificationListSkeleton />
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <DocumentTextIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">Sin notificaciones</h3>
            <p className="text-muted-foreground text-sm">
              {scope === "teacher"
                ? "Esta aula aún no tiene avisos enviados."
                : "No hay notificaciones que coincidan con los filtros."}
            </p>
          </div>
        ) : (
          <div className={`divide-y divide-border-default transition-opacity ${isFetching && !isFetchingMore ? "opacity-60" : ""}`}>
            {notifications.map((notification) => (
              <NotificationRow key={notification.id} notification={notification} onClick={() => setParams({ [NOTIFICATION_DETAIL_PARAM]: notification.id }, "push")} />
            ))}
            {hasMore && (
              <button
                type="button"
                onClick={() => void loadMore()}
                disabled={isFetchingMore}
                className="w-full py-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isFetchingMore ? "Cargando..." : `Cargar más (${pagination.total - notifications.length} restantes)`}
              </button>
            )}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-border-default text-sm text-muted-foreground">
          Mostrando {notifications.length} de {pagination.total} notificaciones
        </div>
      )}

      {selected && <NotificationDetailDrawer notification={selected} onClose={() => setParams({ [NOTIFICATION_DETAIL_PARAM]: null }, "replace")} />}
    </div>
  );
}
