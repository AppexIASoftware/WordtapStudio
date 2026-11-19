import { Suspense } from "react";
import { PageShellSkeleton } from "@/components/ui/page-skeleton";
import { MonetizationView } from "@/features/admin-monetization/views/monetization-view";

export default function MonetizationPage() {
  return (
    <Suspense
      fallback={<PageShellSkeleton />}
    >
      <MonetizationView />
    </Suspense>
  );
}
