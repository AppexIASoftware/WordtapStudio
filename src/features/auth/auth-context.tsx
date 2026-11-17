"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserRole, UserProfile, AuthContextValue, USER_ROLE, ROLE_HOME_PATH } from "./types";
import { DEMO_ACCOUNTS } from "./hooks/use-login";
import { mapBackendUserToProfile } from "./utils/map-user-profile";
import {
  loginWithGoogleApi,
  getMeApi,
  devLoginApi,
  logoutApi,
  clearStoredTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens,
  setStoredRole,
} from "@/lib/api-client";
import { applyTeacherApi } from "@/services/api/teacher-applications";

const AuthContext = createContext<AuthContextValue | null>(null);

function buildFallbackProfile(role: UserRole): UserProfile {
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
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<UserRole>(USER_ROLE.INSTRUCTOR);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>(() => buildFallbackProfile(USER_ROLE.INSTRUCTOR));

  // Verify the stored token against GET /api/v1/users/me before trusting any client state.
  useEffect(() => {
    let cancelled = false;
    const token = getStoredAccessToken();
    if (!token) {
      queueMicrotask(() => {
        if (cancelled) return;
        clearStoredTokens();
        setIsAuthenticated(false);
        setIsLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }

    getMeApi()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (data?.user) {
          const profile = mapBackendUserToProfile(data.user);
          setUser(profile);
          setCurrentRole(profile.role);
          setStoredRole(profile.role);
          setIsAuthenticated(true);
          if (
            profile.role === USER_ROLE.CANDIDATE &&
            typeof window !== "undefined" &&
            !window.location.pathname.startsWith(ROLE_HOME_PATH[USER_ROLE.CANDIDATE])
          ) {
            router.replace(ROLE_HOME_PATH[USER_ROLE.CANDIDATE]);
          }
        } else if (error || !data?.user) {
          clearStoredTokens();
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        if (cancelled) return;
        clearStoredTokens();
        setIsAuthenticated(false);
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const applyAuthenticatedUser = (
    backendUser: Parameters<typeof mapBackendUserToProfile>[0],
    accessToken: string,
    refreshToken?: string
  ): UserProfile => {
    const profile = mapBackendUserToProfile(backendUser);
    setStoredTokens(accessToken, refreshToken);
    setStoredRole(profile.role);
    setUser(profile);
    setCurrentRole(profile.role);
    setIsAuthenticated(true);
    return profile;
  };

  // Explicit development demo role switcher (DemoLoginModal).
  const switchRole = (role: UserRole) => {
    const demoEmail = DEMO_ACCOUNTS[role]?.email;
    const apiRole = role === USER_ROLE.CANDIDATE ? "student" : role;
    void devLoginApi(apiRole, demoEmail)
      .then(({ data }) => {
        if (data?.user && data.access_token) {
          const profile = applyAuthenticatedUser(data.user, data.access_token, data.refresh_token);
          router.push(ROLE_HOME_PATH[profile.role]);
        }
      })
      .catch(() => {});
  };

  // Explicit development demo login (/login demo selector).
  const login = async (
    role: UserRole = USER_ROLE.INSTRUCTOR
  ): Promise<{ success: boolean; error?: string }> => {
    const demoEmail = DEMO_ACCOUNTS[role]?.email;
    const apiRole = role === USER_ROLE.CANDIDATE ? "student" : role;
    const { data, error } = await devLoginApi(apiRole, demoEmail);
    if (error || !data?.user || !data.access_token) {
      clearStoredTokens();
      setIsAuthenticated(false);
      return { success: false, error: error || "No se pudo iniciar la sesión de prueba." };
    }

    const profile = applyAuthenticatedUser(data.user, data.access_token, data.refresh_token);
    router.push(ROLE_HOME_PATH[profile.role]);
    return { success: true };
  };

  const loginWithGoogleToken = async (idToken: string) => {
    const { data, error } = await loginWithGoogleApi(idToken);
    if (error || !data) {
      return { success: false, error: error || "Falló la autenticación con Google" };
    }

    const profile = applyAuthenticatedUser(data.user, data.access_token, data.refresh_token);

    if (profile.role === USER_ROLE.CANDIDATE) {
      await applyTeacherApi({
        specialty: "Inglés General",
        bio: "Postulante registrado vía Google en Wordtap Studio",
      });
    }
    router.push(ROLE_HOME_PATH[profile.role]);
    return { success: true };
  };

  const logout = () => {
    const refreshToken = getStoredRefreshToken();
    clearStoredTokens();
    setIsAuthenticated(false);
    setCurrentRole(USER_ROLE.INSTRUCTOR);
    setUser(buildFallbackProfile(USER_ROLE.INSTRUCTOR));
    void logoutApi(refreshToken);
    router.replace("/login");
  };

  const refreshSession = async (): Promise<UserProfile | null> => {
    const token = getStoredAccessToken();
    if (!token) return null;
    const { data, error } = await getMeApi();
    if (data?.user) {
      const profile = mapBackendUserToProfile(data.user);
      setUser(profile);
      setCurrentRole(profile.role);
      setStoredRole(profile.role);
      setIsAuthenticated(true);
      return profile;
    }
    if (error) {
      clearStoredTokens();
      setIsAuthenticated(false);
    }
    return null;
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
        refreshSession,
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
