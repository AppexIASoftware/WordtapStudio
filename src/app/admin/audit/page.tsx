import { Suspense } from "react";
import { AuditView } from "@/features/admin-audit/views/audit-view";

export default function AuditPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-slate-muted">
          Cargando auditoría...
        </div>
      }
    >
      <AuditView />
    </Suspense>
  );
}
