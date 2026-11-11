export const COHORT_TAB = {
  GENERAL: "general",
  CURRICULUM: "curriculum",
  HISTORY: "history",
} as const;

export type CohortTab = (typeof COHORT_TAB)[keyof typeof COHORT_TAB];

export const CEFR_LEVEL = {
  A1: "A1",
  A2: "A2",
  B1: "B1",
  B2: "B2",
  C1: "C1",
} as const;

export type CefrLevel = (typeof CEFR_LEVEL)[keyof typeof CEFR_LEVEL];

export interface ClassroomStudent {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: "emerald" | "blue" | "purple" | "amber" | "slate";
  level: string;
  streak: string;
  words: number;
  accuracy: string;
  enrolledAt: string;
  lastActive: string;
  payStatus: "subscription" | "trial" | "free" | "course_purchased";
  payLabel: string;
  renewDate: string;
}

export interface StumbleItem {
  term: string;
  failRate: string;
  desc: string;
  isDemo?: boolean;
}

export interface Classroom {
  id: string;
  name: string;
  code: string;
  courseId: string;
  courseTitle: string;
  assignedCourses?: string[];
  assignedLessons?: string[] | null;
  activeGames?: string[];
  weeklyGoalWords?: number;
  level: string;
  created: string;
  studentsCount: number;
  stats: {
    sub: number;
    trial: number;
    free: number;
    scholar: number;
  };
  stumble: StumbleItem[];
  students: ClassroomStudent[];
  isDemo?: boolean;
}

export interface GlobalStudent {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: "emerald" | "blue" | "purple" | "amber" | "slate";
  course: string;
  cefr: string;
  registeredAt: string;
  lastActive: string;
  streak: string;
  progress: number;
  payStatus: "subscription" | "trial" | "free" | "course_purchased";
  payLabel: string;
  isDemo?: boolean;
}

// Classroom Notification History Types
export const CLASSROOM_NOTIFICATION_STATUS = {
  SENT: "sent",
  FAILED: "failed",
  PARTIAL: "partial",
} as const;

export type ClassroomNotificationStatus = (typeof CLASSROOM_NOTIFICATION_STATUS)[keyof typeof CLASSROOM_NOTIFICATION_STATUS];

export const CLASSROOM_NOTIFICATION_ACTION = {
  OPEN_CLASSROOM: "open_classroom",
  OPEN_CONTENT: "open_content",
} as const;

export type ClassroomNotificationAction = (typeof CLASSROOM_NOTIFICATION_ACTION)[keyof typeof CLASSROOM_NOTIFICATION_ACTION];

export interface ClassroomNotification {
  id: string;
  classroom_id?: string | null;
  teacher_id: string;
  title: string;
  message: string;
  action_type: ClassroomNotificationAction | string;
  target_course_id?: string;
  target_lesson_id?: string;
  sent_at: string;
  recipient_count: number;
  read_count: number;
  status: ClassroomNotificationStatus;
  created_at: string;
  classroom?: {
    id: string;
    name: string;
    code: string;
  };
  target_course?: {
    id: string;
    title: string;
  };
  target_lesson?: {
    id: string;
    title: string;
  };
  teacher?: {
    id: string;
    name: string;
  };
}

export interface ClassroomNotificationListResponse {
  notifications: ClassroomNotification[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface ClassroomNotificationFilters {
  classroom_id?: string;
  teacher_id?: string;
  course_id?: string;
  lesson_id?: string;
  status?: ClassroomNotificationStatus;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}
