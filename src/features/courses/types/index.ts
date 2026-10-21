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
  ownerType?: "platform" | "teacher";
  reviewStatus?: "pending" | "in_review" | "approved" | "changes_requested" | "rejected";
  feedbackNotes?: string;
  reviewerName?: string;
  lessons: Lesson[];
  isDemo?: boolean;
}

export interface CoursePipelineItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeVariant: "emerald" | "amber" | "blue" | "rose";
  actionLabel?: string;
}
