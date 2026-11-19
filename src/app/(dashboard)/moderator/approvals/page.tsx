import { Suspense } from "react";
import { PageShellSkeleton } from "@/components/ui/page-skeleton";
import { Metadata } from "next";
import { ModeratorApprovalsView } from "@/features/moderation/views/moderator-approvals-view";

export const metadata: Metadata = {
  title: "Cola de Aprobaciones (PRs) — Wordtap Studio",
  description: "Auditoría de diff pedagógico y despliegue a producción en app móvil.",
};

export default function ModeratorApprovalsPage() {
  return (
    <Suspense
      fallback={<PageShellSkeleton />}
    >
      <ModeratorApprovalsView />
    </Suspense>
  );
}
