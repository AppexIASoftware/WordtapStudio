"use client";

import { useState } from "react";
import {
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Smartphone,
  RotateCcw,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  broadcastAnnouncementApi,
  getNotificationStatsApi,
  BroadcastAnnouncementResult,
  NotificationStatsResult,
} from "@/services/api";
import { NOTIFICATION_HISTORY_KEY } from "@/features/classrooms/hooks/use-notification-history";
import { ActionTargetPicker } from "./action-target-picker";

interface AnnouncementFormProps {
  title: string;
  body: string;
  actionUrl: string;
  type: "system" | "promotion";
  audience: string;
  onTitleChange: (val: string) => void;
  onBodyChange: (val: string) => void;
  onActionUrlChange: (val: string) => void;
  onActionLabelChange?: (label: string) => void;
  onTypeChange: (val: "system" | "promotion") => void;
  onAudienceChange: (val: string) => void;
  onSuccess: (result: BroadcastAnnouncementResult) => void;
}

const FIELD_BASE_CLASS =
  "w-full bg-background border border-border-default rounded-xl px-3.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all";

export function AnnouncementForm({
  title,
  body,
  actionUrl,
  type,
  audience,
  onTitleChange,
  onBodyChange,
  onActionUrlChange,
  onActionLabelChange,
  onTypeChange,
  onAudienceChange,
  onSuccess,
}: AnnouncementFormProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<BroadcastAnnouncementResult | null>(null);

  // Active device telemetry ready for push notifications
  const { data: stats } = useQuery<NotificationStatsResult | null>({
    queryKey: ["admin", "notification-stats"],
    queryFn: async () => {
      const res = await getNotificationStatsApi();
      return res.data;
    },
    staleTime: 60_000,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setLastResult(null);

    const res = await broadcastAnnouncementApi({
      title: title.trim(),
      body: body.trim(),
      action_url: actionUrl.trim() || undefined,
      type,
      target_cefr_level: audience !== "all" ? audience : undefined,
    });

    setIsSubmitting(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else if (res.data) {
      setLastResult(res.data);
      onSuccess(res.data);
      // Invalidate notification history query to surface newest dispatch immediately
      void queryClient.invalidateQueries({ queryKey: [NOTIFICATION_HISTORY_KEY] });
    }
  };

  const handleReset = () => {
    onTitleChange("");
    onBodyChange("");
    onActionUrlChange("");
    onActionLabelChange?.("");
    setLastResult(null);
    setErrorMessage(null);
  };

  const handleActionChange = (url: string, label: string) => {
    onActionUrlChange(url);
    onActionLabelChange?.(label);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border-default rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border-default/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold shrink-0">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Redactar Comunicado Global</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Se enviará como push a los celulares y quedará registrado en la bandeja in-app de los alumnos.
            </p>
          </div>
        </div>

        {stats && (
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/40 border border-border-default text-[11px] text-muted-foreground"
            title="Total de dispositivos móviles registrados para push"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-semibold text-foreground">{stats.active_devices_count}</span>
            <span>dispositivos</span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {lastResult && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>
              Comunicado despachado a {lastResult.recipients_count} alumnos ({lastResult.devices_count} dispositivos notificados vía push).
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold underline hover:text-emerald-300 flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Redactar otro</span>
          </button>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-foreground">
          Título del Aviso <span className="text-emerald-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Ej: ¡Nuevo desafío semanal de Phrasal Verbs!"
          maxLength={180}
          className={`${FIELD_BASE_CLASS} h-10`}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-foreground">
          Mensaje <span className="text-emerald-500">*</span>
        </label>
        <textarea
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          placeholder="Escribe el contenido detallado del aviso..."
          rows={3}
          className={`${FIELD_BASE_CLASS} py-2.5 resize-none leading-relaxed`}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-foreground">Tipo de Notificación</label>
          <div className="relative">
            <select
              value={type}
              onChange={(e) => onTypeChange(e.target.value as "system" | "promotion")}
              className={`${FIELD_BASE_CLASS} h-10 appearance-none pr-9 cursor-pointer`}
            >
              <option value="system">Sistema / Institucional</option>
              <option value="promotion">Novedad / Promoción</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-foreground">Audiencia Destinataria</label>
          <div className="relative">
            <select
              value={audience}
              onChange={(e) => onAudienceChange(e.target.value)}
              className={`${FIELD_BASE_CLASS} h-10 appearance-none pr-9 cursor-pointer`}
            >
              <option value="all">Todos los Estudiantes</option>
              <option value="A1">Nivel A1 (Principiante)</option>
              <option value="A2">Nivel A2 (Básico)</option>
              <option value="B1">Nivel B1 (Intermedio)</option>
              <option value="B2">Nivel B2 (Intermedio Alto)</option>
              <option value="C1">Nivel C1 (Avanzado)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Selector Asistido de Curso, Lección o Enlace Opcional */}
      <ActionTargetPicker value={actionUrl} onChange={handleActionChange} />

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !body.trim()}
          className="w-full h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Despachando Comunicado a la Plataforma...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Despachar Notificación Push y Guardar en Bandeja</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
