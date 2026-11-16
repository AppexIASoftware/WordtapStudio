import { Suspense } from "react";
import { Metadata } from "next";
import { NotificationsAccessGate } from "@/features/notifications/views/notifications-access-gate";

export const metadata: Metadata = {
  title: "Notificaciones — Wordtap Studio",
  description: "Centro de notificaciones y anuncios según permisos configurados.",
};

export default function ModeratorNotificationsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-7 w-72 rounded-lg bg-border-default" />
          <div className="h-80 rounded-2xl bg-card border border-border-default" />
        </div>
      }
    >
      <NotificationsAccessGate />
    </Suspense>
  );
}
