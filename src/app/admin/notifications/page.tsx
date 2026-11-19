import { Suspense } from "react";
import { PageShellSkeleton } from "@/components/ui/page-skeleton";
import { AdminNotificationsView } from "@/features/notifications/views/admin-notifications-view";

export default function NotificationsPage() {
  return (
    <Suspense
      fallback={<PageShellSkeleton />}
    >
      <AdminNotificationsView />
    </Suspense>
  );
}
