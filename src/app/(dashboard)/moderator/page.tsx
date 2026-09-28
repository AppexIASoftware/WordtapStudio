import { Metadata } from "next";
import { ModeratorMetricsView } from "@/features/moderator-dashboard/views/moderator-metrics-view";

export const metadata: Metadata = {
  title: "Consola de Calidad & Moderación — Wordtap Studio",
  description: "Métricas de aprobación, tiempo de revisión y auditoría pedagógica oficial.",
};

export default function ModeratorDashboardPage() {
  return <ModeratorMetricsView />;
}
