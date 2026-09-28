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

export interface ModeratorPR {
  id: string;
  title: string;
  author: string;
  authorEmail: string;
  authorAvatar: string;
  submittedAt: string;
  waitHours: string;
  changesCount: string;
  reviewer: string;
  status: "open" | "in_review" | "approved" | "changes_requested";
  statusLabel: string;
  summary: string;
  feedback?: string;
  diffItems: {
    field: string;
    original: string;
    proposed: string;
    note?: string;
  }[];
}

export interface ContentReport {
  id: string;
  reporterName: string;
  reporterEmail: string;
  lessonId: string;
  lessonTitle: string;
  itemAffected: string;
  reason: string;
  badgeColor: "rose" | "amber" | "purple" | "blue";
  description: string;
  date: string;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  resolvedBy?: string | null;
}
