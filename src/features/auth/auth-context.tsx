"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, UserProfile, AuthContextValue } from "./types";
import { DEMO_ACCOUNTS } from "./hooks/use-login";
import { useRouter } from "next/navigation";
import {
  loginWithGoogleApi,
  getMeApi,
  devLoginApi,
  clearStoredTokens,
  getStoredAccessToken,
  setStoredTokens,
  getStoredRole,
  setStoredRole,
  BackendUser,
} from "@/lib/api-client";
import { applyTeacherApi } from "@/services/api/teacher-applications";

const AuthContext = createContext<AuthContextValue | null>(null);

function mapBackendUserToProfile(backendUser: BackendUser): UserProfile {
  let role: UserRole = "instructor";
  if (backendUser.email.includes("admin") || backendUser.access_tier === "admin" || backendUser.role === "admin") {
    role = "admin";
  } else if (backendUser.email.includes("moderator") || backendUser.email.includes("elena") || backendUser.role === "moderator") {
    role = "moderator";
  } else if (backendUser.role === "student") {
    role = "candidate";
  }

  const initials = backendUser.name
    ? backendUser.name
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() || "")
        .join("")
    : "WT";

  const titles: Record<UserRole, string> = {
    instructor: "Docente Autorizado",
    moderator: "Moderadora Oficial (Calidad)",
    admin: "Super Administrador",
    candidate: "Postulante Docente (En Revisión)",
  };

  const scopes: Record<UserRole, string> = {
    instructor: "Portal Docente: studio.wordtap.app",
    moderator: "Consola de Revisión: approvals.wordtap.app",
    admin: "Consola de Gobernanza: admin.wordtap.app",
    candidate: "En espera de Aprobación",
  };

  return {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    role,
    title: titles[role],
    avatarInitials: initials,
    scope: scopes[role],
    avatarUrl: backendUser.avatar_url,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<UserRole>("instructor");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getProfile = (role: UserRole): UserProfile => {
    const acc = DEMO_ACCOUNTS[role];
    return {
      id: acc.id,
      name: acc.name,
      email: acc.email,
      role: acc.id,
      title: acc.title,
      avatarInitials: acc.avatarInitials,
      scope: acc.scope,
    };
  };

  const [user, setUser] = useState<UserProfile>(() => getProfile("instructor"));

  // Sync session on mount when token exists (prevents SSR hydration mismatch)
  useEffect(() => {
    const saved = getStoredRole() as UserRole | null;
    if (saved && (saved === "instructor" || saved === "moderator" || saved === "admin" || saved === "candidate")) {
      setCurrentRole(saved);
      setUser(getProfile(saved));
    }

    const token = getStoredAccessToken();
    if (!token) {
      setIsLoading(false);
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);
    getMeApi().then(({ data, error }) => {
      setIsLoading(false);
      if (data?.user) {
        const profile = mapBackendUserToProfile(data.user);
        setUser(profile);
        setCurrentRole(profile.role);
        setStoredRole(profile.role);
        setIsAuthenticated(true);
        if (profile.role === "candidate" && typeof window !== "undefined" && !window.location.pathname.startsWith("/pending-approval")) {
          router.push("/pending-approval");
        }
      } else if (error) {
        clearStoredTokens();
        setIsAuthenticated(false);
      }
    });
  }, []);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    setUser(getProfile(role));
    setStoredRole(role);
    if (role === "candidate") {
      router.push("/pending-approval");
    }
  };

  const login = async (role: UserRole = "instructor"): Promise<{ success: boolean; error?: string }> => {
    const demoEmail = DEMO_ACCOUNTS[role]?.email;
    const { data, error } = await devLoginApi(role === "candidate" ? "student" : role, demoEmail);
    if (error) {
      clearStoredTokens();
      setIsAuthenticated(false);
      return { success: false, error };
    }

    if (data?.user) {
      const profile = mapBackendUserToProfile(data.user);
      setStoredTokens(data.access_token, data.refresh_token);
      setStoredRole(profile.role);
      setUser(profile);
      setCurrentRole(profile.role);
      setIsAuthenticated(true);
    } else {
      setStoredTokens(`demo-session-${role}`);
      switchRole(role);
      setIsAuthenticated(true);
    }

    if (role === "candidate") {
      router.push("/pending-approval");
    } else {
      router.push(role === "instructor" ? "/teacher" : role === "moderator" ? "/moderator" : "/dashboard");
    }
    return { success: true };
  };

  const loginWithGoogleToken = async (idToken: string) => {
    const { data, error } = await loginWithGoogleApi(idToken);
    if (error || !data) {
      return { success: false, error: error || "Falló la autenticación con Google" };
    }

    const profile = mapBackendUserToProfile(data.user);
    setStoredTokens(data.access_token, data.refresh_token);
    setStoredRole(profile.role);
    setUser(profile);
    setCurrentRole(profile.role);
    setIsAuthenticated(true);

    if (profile.role === "candidate") {
      await applyTeacherApi({
        specialty: "Inglés General",
        bio: "Postulante registrado vía Google en Wordtap Studio",
      });
      router.push("/pending-approval");
    } else {
      router.push(profile.role === "instructor" ? "/teacher" : profile.role === "moderator" ? "/moderator" : "/dashboard");
    }
    return { success: true };
  };

  const logout = () => {
    clearStoredTokens();
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        isAuthenticated,
        isLoading,
        switchRole,
        login,
        loginWithGoogleToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
