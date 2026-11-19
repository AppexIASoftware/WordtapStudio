import { Suspense } from "react";
import { PageShellSkeleton } from "@/components/ui/page-skeleton";
import { RolesView } from "@/features/admin-roles/views/roles-view";

export default function RolesPage() {
  return (
    <Suspense
      fallback={<PageShellSkeleton />}
    >
      <RolesView />
    </Suspense>
  );
}
