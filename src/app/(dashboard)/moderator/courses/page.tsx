import { Metadata } from "next";
import { ModeratorCoursesView } from "@/features/moderator-dashboard/views/moderator-courses-view";

export const metadata: Metadata = {
  title: "Supervisión de Cursos & Playtest — Wordtap Studio",
  description: "Supervisión curricular y auditoría de lecciones en simulador móvil.",
};

export default function ModeratorCoursesPage() {
  return <ModeratorCoursesView />;
}
