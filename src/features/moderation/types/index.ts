export interface ApprovalRequest {
  id: string;
  courseId?: string;
  title: string;
  submittedDate: string;
  reviewer: string;
  author: string;
  waitHours: string;
  changesCount: string;
  status: "pending" | "in_review" | "approved" | "rejected" | "changes_requested";
  statusLabel: string;
  changes: string;
  notes?: string;
  diffSummary?: string;
  changeSummary?: string;
  isResubmission?: boolean;
  previousNotes?: string;
}

export interface ModeratorPR {
  id: string;
  originalId?: string;
  courseId?: string;
  title: string;
  author: string;
  authorEmail: string;
  authorAvatar: string;
  submittedAt: string;
  waitHours: string;
  changesCount: string;
  reviewer: string;
  status: "open" | "in_review" | "approved" | "changes_requested" | "rejected";
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
