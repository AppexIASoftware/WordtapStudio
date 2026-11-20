export const USER_ROLE = {
  INSTRUCTOR: "instructor",
  MODERATOR: "moderator",
  ADMIN: "admin",
  CANDIDATE: "candidate",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const ROLE_HOME_PATH: Record<UserRole, string> = {
  [USER_ROLE.INSTRUCTOR]: "/teacher",
  [USER_ROLE.MODERATOR]: "/moderator",
  [USER_ROLE.ADMIN]: "/admin/dashboard",
  [USER_ROLE.CANDIDATE]: "/pending-approval",
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatarInitials: string;
  scope: string;
  avatarUrl?: string | null;
  bio?: string | null;
  specialty?: string | null;
  applicationStatus?: "none" | "pending" | "approved" | "rejected";
}

export interface DemoAccount {
  id: UserRole;
  label: string;
  name: string;
  email: string;
  password?: string;
  roleHint: string;
  title: string;
  avatarInitials: string;
  scope: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthContextValue {
  user: UserProfile;
  currentRole: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  switchRole: (role: UserRole) => void;
  login: (role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogleToken: (idToken: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshSession: () => Promise<UserProfile | null>;
}
