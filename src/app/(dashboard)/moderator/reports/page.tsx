import { Metadata } from "next";
import { ModeratorReportsView } from "@/features/moderator-dashboard/views/moderator-reports-view";

export const metadata: Metadata = {
  title: "Mesa de Resolución de Incidencias (ADR-21) — Wordtap Studio",
  description: "Triaje y resolución de reportes de calidad enviados por alumnos desde la app.",
};

export default function ModeratorReportsPage() {
  return <ModeratorReportsView />;
}
