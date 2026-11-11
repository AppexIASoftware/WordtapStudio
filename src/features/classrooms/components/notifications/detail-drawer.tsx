import {
  AcademicCapIcon,
  ArrowTopRightOnSquareIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  EyeIcon,
  GlobeAltIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ClassroomNotification } from "../../types";
import {
  ACTION_LABEL,
  STATUS_BADGE_CLASS,
  STATUS_LABEL,
  formatEmitterName,
  formatReadRate,
  formatSentAt,
} from "./format";

interface DetailDrawerProps {
  notification: ClassroomNotification;
  onClose: () => void;
}

export function NotificationDetailDrawer({ notification, onClose }: DetailDrawerProps) {
  const readPercentage =
    notification.recipient_count > 0
      ? Math.min(100, Math.round((notification.read_count / notification.recipient_count) * 100))
      : 0;

  const isGlobal = !notification.classroom_id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-card border border-border-default rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in zoom-in-95 duration-200">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default/80 bg-muted/20">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE_CLASS[notification.status]}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {STATUS_LABEL[notification.status]}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground border border-border-default/60">
              {isGlobal ? (
                <>
                  <GlobeAltIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Plataforma / Global</span>
                </>
              ) : (
                <>
                  <AcademicCapIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span className="truncate max-w-[160px]">
                    {notification.classroom?.name || "Aula"}
                  </span>
                </>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Título de la Notificación */}
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight leading-snug">
              {notification.title}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-mono">
              <ClockIcon className="w-3.5 h-3.5" />
              <span>Despachado: {formatSentAt(notification.sent_at)}</span>
            </p>
          </div>

          {/* Cuerpo del Mensaje */}
          <div className="rounded-xl bg-background border border-border-default/80 p-4 shadow-inner">
            <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Contenido del Mensaje
            </span>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {notification.message}
            </p>
          </div>

          {/* Tarjetas KPI de Métricas de Entrega y Lecturas */}
          <div>
            <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Métricas de Rendimiento & Lectura
            </span>
            <div className="grid grid-cols-3 gap-3">
              {/* Destinatarios */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border-default/70 flex flex-col justify-between">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px] font-medium">Alcanzados</span>
                  <UsersIcon className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-xl font-bold text-foreground">
                  {notification.recipient_count}
                </div>
                <span className="text-[10px] text-muted-foreground">Alumnos notificados</span>
              </div>

              {/* Leídas confirmadas */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border-default/70 flex flex-col justify-between">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px] font-medium">Leídas</span>
                  <EyeIcon className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl font-bold text-foreground">
                  {notification.read_count}
                </div>
                <span className="text-[10px] text-muted-foreground">En app móvil</span>
              </div>

              {/* Tasa de Lectura con barra */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border-default/70 flex flex-col justify-between">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px] font-medium">Tasa</span>
                  <ChartBarIcon className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl font-bold text-foreground">
                  {readPercentage}%
                </div>
                {/* Barra de progreso */}
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${readPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Información Contextual y Destino */}
          <div className="rounded-xl bg-muted/20 border border-border-default/60 p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5" />
                Emisor:
              </span>
              <span className="font-semibold text-foreground">
                {formatEmitterName(notification)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tipo de Acción:</span>
              <span className="font-medium text-foreground">
                {ACTION_LABEL[notification.action_type] || notification.action_type}
              </span>
            </div>

            {notification.target_course && (
              <div className="flex items-center justify-between pt-2 border-t border-border-default/50">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <AcademicCapIcon className="w-3.5 h-3.5 text-emerald-400" />
                  Curso vinculado:
                </span>
                <span className="font-semibold text-foreground">
                  {notification.target_course.title}
                </span>
              </div>
            )}

            {notification.target_lesson && (
              <div className="flex items-center justify-between pt-2 border-t border-border-default/50">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <DocumentTextIcon className="w-3.5 h-3.5 text-purple-400" />
                  Lección vinculada:
                </span>
                <span className="font-semibold text-foreground">
                  {notification.target_lesson.title}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="px-6 py-3.5 border-t border-border-default/80 bg-muted/10 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
