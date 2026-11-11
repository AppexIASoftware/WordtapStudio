"use client";

import { useState } from "react";
import { Bell, Clock } from "lucide-react";
import { BroadcastAnnouncementResult } from "@/services/api";
import { AnnouncementForm } from "../components/announcement-form";
import { DevicePreview } from "../components/device-preview";
import {
  NotificationHistoryPanel,
  NOTIFICATION_DETAIL_PARAM,
} from "@/features/classrooms/components/notifications/panel";
import { useUrlParam } from "@/hooks/use-url-params";

const ADMIN_NOTIFICATION_TAB = {
  COMPOSE: "compose",
  HISTORY: "history",
} as const;

type AdminNotificationTab = (typeof ADMIN_NOTIFICATION_TAB)[keyof typeof ADMIN_NOTIFICATION_TAB];

const ADMIN_NOTIFICATION_TABS: readonly AdminNotificationTab[] = Object.values(ADMIN_NOTIFICATION_TAB);

export function AdminNotificationsView() {
  // Active tab persists in URL (?tab=history) making each view directly addressable.
  const [activeTab, setActiveTab] = useUrlParam<AdminNotificationTab>(
    "tab",
    ADMIN_NOTIFICATION_TABS,
    ADMIN_NOTIFICATION_TAB.COMPOSE
  );

  // Form state for preview synchronization (compose tab)
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [actionLabel, setActionLabel] = useState("");
  const [type, setType] = useState<"system" | "promotion">("system");
  const [audience, setAudience] = useState("all");

  const handleSuccess = (_result: BroadcastAnnouncementResult) => {
    // Could refresh stats here if needed
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-default">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-brand/10 border border-emerald-brand/20 flex items-center justify-center text-emerald-brand font-bold">
                <Bell className="w-4 h-4" />
              </div>
              Centro de Notificaciones & Anuncios
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
              Push & In-App
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1 leading-relaxed">
            Despacho de notificaciones push a la aplicación móvil y avisos en bandeja de entrada
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border-default pb-3">
        <button
          type="button"
          onClick={() =>
            setActiveTab(ADMIN_NOTIFICATION_TAB.COMPOSE, { mode: "push", clear: [NOTIFICATION_DETAIL_PARAM] })
          }
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === ADMIN_NOTIFICATION_TAB.COMPOSE
              ? "bg-emerald-brand text-canvas shadow-sm"
              : "bg-card border border-border-default text-slate-400 hover:text-white"
          }`}
        >
          <span>Redactar Anuncio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab(ADMIN_NOTIFICATION_TAB.HISTORY, { mode: "push" })}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === ADMIN_NOTIFICATION_TAB.HISTORY
              ? "bg-emerald-brand text-canvas shadow-sm"
              : "bg-card border border-border-default text-slate-400 hover:text-white"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Historial Global</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === ADMIN_NOTIFICATION_TAB.COMPOSE ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <AnnouncementForm
              title={title}
              body={body}
              actionUrl={actionUrl}
              type={type}
              audience={audience}
              onTitleChange={setTitle}
              onBodyChange={setBody}
              onActionUrlChange={setActionUrl}
              onActionLabelChange={setActionLabel}
              onTypeChange={setType}
              onAudienceChange={setAudience}
              onSuccess={handleSuccess}
            />
          </div>

          <div className="lg:col-span-5">
            <DevicePreview
              title={title}
              body={body}
              actionUrl={actionUrl}
              actionLabel={actionLabel}
              type={type}
            />
          </div>
        </div>
      ) : (
        <NotificationHistoryPanel
          scope="admin"
          title="Historial Global de Notificaciones"
        />
      )}
    </div>
  );
}