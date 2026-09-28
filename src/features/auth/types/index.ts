export type UserRole = "instructor" | "moderator" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatarInitials: string;
  scope: string;
  avatarUrl?: string | null;
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
  switchRole: (role: UserRole) => void;
  login: (role?: UserRole) => void;
  loginWithGoogleToken: (idToken: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}
