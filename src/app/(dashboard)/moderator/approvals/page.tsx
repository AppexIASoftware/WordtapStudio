import { Metadata } from "next";
import { ModeratorApprovalsView } from "@/features/moderator-dashboard/views/moderator-approvals-view";

export const metadata: Metadata = {
  title: "Cola de Aprobaciones (PRs) — Wordtap Studio",
  description: "Auditoría de diff pedagógico y despliegue a producción en app móvil.",
};

export default function ModeratorApprovalsPage() {
  return <ModeratorApprovalsView />;
}
