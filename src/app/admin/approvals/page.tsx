import { Suspense } from "react";
import { PageShellSkeleton } from "@/components/ui/page-skeleton";
import { Metadata } from "next";
import { ModeratorApprovalsView } from "@/features/moderation/views/moderator-approvals-view";

export const metadata: Metadata = {
  title: "Aprobación de Cursos — Wordtap Studio (Admin)",
  description: "Auditoría de solicitudes de cursos de docentes y despliegue a producción.",
};

export default function ApprovalsPage() {
  return (
    <Suspense
      fallback={<PageShellSkeleton />}
    >
      <ModeratorApprovalsView isAdmin={true} />
    </Suspense>
  );
}
