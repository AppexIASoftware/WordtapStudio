import { Suspense } from "react";
import { AdminNotificationsView } from "@/features/notifications/views/admin-notifications-view";

export default function NotificationsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-slate-500">
          Cargando centro de notificaciones...
        </div>
      }
    >
      <AdminNotificationsView />
    </Suspense>
  );
}
