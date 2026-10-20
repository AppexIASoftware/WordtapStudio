import { Suspense } from "react";
import { Metadata } from "next";
import { GamificationView } from "@/features/games/views/gamification-view";

export const metadata: Metadata = {
  title: "Gestión Global de Minijuegos — Wordtap Studio Admin",
  description: "Catálogo completo de las actividades lúdicas creadas por los docentes.",
};

export default function GamesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-slate-muted">
          Cargando el catálogo de minijuegos...
        </div>
      }
    >
      <GamificationView scope="admin" />
    </Suspense>
  );
}
