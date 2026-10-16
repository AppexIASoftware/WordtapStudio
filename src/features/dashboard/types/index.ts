export interface TeacherKPI {
  id: string;
  title: string;
  badgeText: string;
  badgeVariant?: "emerald" | "mint" | "default";
  value: string;
  subValue: string;
  footerDotColor?: string;
  footerText: string;
  actionText?: string;
  href?: string;
}

export interface HeatmapItem {
  term: string;
  errorRate: number;
  phonetics: string;
  grammarType: string;
  translation?: string;
  note: string;
  status: "critical" | "warning" | "moderate";
}

export interface CoursePipelineItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeVariant: "emerald" | "amber" | "blue" | "rose";
  actionLabel?: string;
}

export interface ModeratorKPI {
  id: string;
  title: string;
  value: string;
  subValue: string;
  badgeText: string;
  badgeVariant: "emerald" | "mint" | "amber" | "blue";
  footerText: string;
  footerDotColor: string;
}
