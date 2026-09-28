"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, UserProfile, AuthContextValue } from "./types";
import { DEMO_ACCOUNTS } from "./hooks/use-login";
import { useRouter } from "next/navigation";
import {
  loginWithGoogleApi,
  getMeApi,
  clearStoredTokens,
  getStoredAccessToken,
  BackendUser,
} from "@/lib/api-client";

const AuthContext = createContext<AuthContextValue | null>(null);

function mapBackendUserToProfile(backendUser: BackendUser): UserProfile {
  let role: UserRole = "instructor";
  if (backendUser.email.includes("admin") || backendUser.access_tier === "admin") {
    role = "admin";
  } else if (backendUser.email.includes("moderator") || backendUser.email.includes("elena")) {
    role = "moderator";
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
  };

  const scopes: Record<UserRole, string> = {
    instructor: "Portal Docente: studio.wordtap.app",
    moderator: "Consola de Revisión: approvals.wordtap.app",
    admin: "Consola de Gobernanza: admin.wordtap.app",
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return typeof window !== "undefined" && !!getStoredAccessToken();
  });

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

  // Sincronizar sesión al iniciar si existe token guardado
  useEffect(() => {
    const token = getStoredAccessToken();
    if (token) {
      getMeApi().then(({ data, error }) => {
        if (data?.user) {
          const profile = mapBackendUserToProfile(data.user);
          setUser(profile);
          setCurrentRole(profile.role);
          setIsAuthenticated(true);
        } else if (error) {
          clearStoredTokens();
          setIsAuthenticated(false);
        }
      });
    }
  }, []);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    setUser(getProfile(role));
  };

  const login = (role: UserRole = "instructor") => {
    setIsAuthenticated(true);
    switchRole(role);
    router.push(role === "instructor" ? "/teacher" : "/dashboard");
  };

  const loginWithGoogleToken = async (idToken: string) => {
    const { data, error } = await loginWithGoogleApi(idToken);
    if (error || !data) {
      return { success: false, error: error || "Falló la autenticación con Google" };
    }

    const profile = mapBackendUserToProfile(data.user);
    setUser(profile);
    setCurrentRole(profile.role);
    setIsAuthenticated(true);

    router.push(profile.role === "instructor" ? "/teacher" : "/dashboard");
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
