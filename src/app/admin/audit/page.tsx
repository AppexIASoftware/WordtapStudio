import { Suspense } from "react";
import { PageShellSkeleton } from "@/components/ui/page-skeleton";
import { AuditView } from "@/features/admin-audit/views/audit-view";

export default function AuditPage() {
  return (
    <Suspense
      fallback={<PageShellSkeleton />}
    >
      <AuditView />
    </Suspense>
  );
}
