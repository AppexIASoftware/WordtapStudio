import { Suspense } from "react";
import { Metadata } from "next";
import { ModeratorCoursesView } from "@/features/courses/views/moderator-courses-view";

export const metadata: Metadata = {
  title: "Supervisión de Cursos & Playtest — Wordtap Studio",
  description: "Supervisión curricular y auditoría de lecciones en simulador móvil.",
};

export default function ModeratorCoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-slate-muted">
          Cargando supervisión curricular...
        </div>
      }
    >
      <ModeratorCoursesView />
    </Suspense>
  );
}
