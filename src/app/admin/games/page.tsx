import { Suspense } from "react";
import { PageShellSkeleton } from "@/components/ui/page-skeleton";
import { Metadata } from "next";
import { GamificationView } from "@/features/games/views/gamification-view";

export const metadata: Metadata = {
  title: "Gestión Global de Minijuegos — Wordtap Studio Admin",
  description: "Catálogo completo de las actividades lúdicas creadas por los docentes.",
};

export default function GamesPage() {
  return (
    <Suspense
      fallback={<PageShellSkeleton />}
    >
      <GamificationView scope="admin" />
    </Suspense>
  );
}
