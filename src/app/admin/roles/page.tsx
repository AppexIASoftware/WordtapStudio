import { Suspense } from "react";
import { RolesView } from "@/features/admin-roles/views/roles-view";

export default function RolesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-slate-muted">
          Cargando roles y permisos...
        </div>
      }
    >
      <RolesView />
    </Suspense>
  );
}
