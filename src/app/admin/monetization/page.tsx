import { Suspense } from "react";
import { MonetizationView } from "@/features/admin-monetization/views/monetization-view";

export default function MonetizationPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-slate-muted">
          Cargando monetización...
        </div>
      }
    >
      <MonetizationView />
    </Suspense>
  );
}
