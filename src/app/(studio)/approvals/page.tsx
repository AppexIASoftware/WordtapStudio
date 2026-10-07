import { Suspense } from "react";
import { Metadata } from "next";
import { ModeratorApprovalsView } from "@/features/moderator-dashboard/views/moderator-approvals-view";

export const metadata: Metadata = {
  title: "Aprobación de Cursos — Wordtap Studio (Admin)",
  description: "Auditoría de solicitudes de cursos de docentes y despliegue a producción.",
};

export default function ApprovalsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-slate-muted">
          Cargando cola de aprobaciones...
        </div>
      }
    >
      <ModeratorApprovalsView isAdmin={true} />
    </Suspense>
  );
}
