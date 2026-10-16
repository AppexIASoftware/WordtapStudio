import { ModeratorKPI } from "@/features/dashboard/types";

export const MODERATOR_KPIS: ModeratorKPI[] = [
  {
    id: "kpi-approval-rate",
    title: "Tasa de Aprobación de Calidad",
    value: "94.2%",
    subValue: "↑ 2.1% mes anterior",
    badgeText: "SLA Cumplido",
    badgeVariant: "emerald",
    footerText: "Meta de calidad: 90% superada",
    footerDotColor: "bg-emerald-brand",
  },
  {
    id: "kpi-review-time",
    title: "Tiempo Medio de Revisión",
    value: "3.4h",
    subValue: "SLA < 24h",
    badgeText: "Óptimo",
    badgeVariant: "blue",
    footerText: "Tiempo promedio por PR",
    footerDotColor: "bg-blue-400",
  },
  {
    id: "kpi-audited-items",
    title: "Contenidos Auditados",
    value: "1,280",
    subValue: "unidades",
    badgeText: "Certificado",
    badgeVariant: "mint",
    footerText: "Tarjetas y minijuegos en app",
    footerDotColor: "bg-mint-brand",
  },
  {
    id: "kpi-resolved-reports",
    title: "Incidencias Resueltas",
    value: "98.6%",
    subValue: "Resolución < 48h",
    badgeText: "ADR-21",
    badgeVariant: "amber",
    footerText: "Reportes de alumnos cerrados",
    footerDotColor: "bg-amber-400",
  },
];
