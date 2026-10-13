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

export interface LessonItem {
  id: string;
  contentBankItemId?: string | null;
  en: string;
  es: string;
  ipa?: string;
  pos?: string;
  example?: string;
  note?: string;
  noteType?: "bulb" | "pin";
  itemType?: "word" | "phrase" | "grammar" | "tip" | "exercise";
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  tier: string;
  focus?: string;
  isPublished: boolean;
  intro: string;
  sectionTitle: string;
  items: LessonItem[];
}

export interface Course {
  id: string;
  title: string;
  level: string;
  tier: "free" | "course" | "draft";
  price: number;
  currency: string;
  author: string;
  status?: "draft" | "in_review" | "published" | "archived";
  reviewStatus?: "pending" | "in_review" | "approved" | "changes_requested" | "rejected";
  feedbackNotes?: string;
  reviewerName?: string;
  lessons: Lesson[];
  isDemo?: boolean;
}

export interface GameModeItem {
  id: string;
  type: string;
  title: string;
  desc: string;
  level: number;
  unlockStars: number;
  timeLimit: number;
  points: number;
  status: "active" | "fase2" | "fase3";
  phase: "active" | "fase2" | "fase3";
}

export interface ContentVaultItem {
  id: string;
  type:
    | "vocabulary"
    | "phrase"
    | "collocation"
    | "minimal_pair"
    | "false_friend"
    | "dialogue"
    | "idioms"
    | "slang"
    | "business_english"
    | string;
  prompt: string;
  target: string;
  ipa?: string;
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  diff: 1 | 2 | 3;
  cat?: string;
  meta?: {
    pos?: string;
    example?: string;
    pattern?: string;
    verb?: string;
    collocate?: string;
    trap?: string;
    contrast?: string;
    wordA?: string;
    wordB?: string;
    tip?: string;
    [key: string]: unknown;
  };
}

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

