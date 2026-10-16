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
