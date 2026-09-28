"use client";

import { useState, useEffect, useCallback } from "react";
import { DemoAccount, UserRole } from "../types";
import { useAuth } from "../auth-context";

export const DEMO_ACCOUNTS: Record<UserRole, DemoAccount> = {
  instructor: {
    id: "instructor",
    label: "Docente",
    name: "Prof. Mateo Silva",
    email: "mateo.silva@wordtap.app",
    roleHint: "Docente Autorizado • Autoría de cursos, cohortes y bancos propios",
    title: "Docente Autorizado",
    avatarInitials: "MS",
    scope: "Portal Docente: studio.wordtap.app",
  },
  moderator: {
    id: "moderator",
    label: "Moderadora",
    name: "Lic. Elena Ramos",
    email: "elena.ramos@wordtap.app",
    roleHint: "Moderadora Oficial • Cola de aprobación, auditoría y calidad",
    title: "Moderadora Oficial (Calidad)",
    avatarInitials: "ER",
    scope: "Consola de Revisión: approvals.wordtap.app",
  },
  admin: {
    id: "admin",
    label: "Admin",
    name: "Carlos Morales",
    email: "admin@wordtap.app",
    roleHint: "Super Administrador • Gobernanza, Stripe, AdMob y RBAC",
    title: "Super Administrador",
    avatarInitials: "CM",
    scope: "Consola de Gobernanza: admin.wordtap.app",
  },
};

export function useLogin() {
  const auth = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>("instructor");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [googleClientReady, setGoogleClientReady] = useState(false);

  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
    setStatusMessage(null);
  };

  const loginWithDemo = (roleOverride?: UserRole) => {
    const role = roleOverride || selectedRole;
    setIsLoading(true);
    setStatusMessage(`Iniciando sesión en sandbox como ${DEMO_ACCOUNTS[role].label}...`);

    setTimeout(() => {
      setIsLoading(false);
      auth.login(role);
    }, 200);
  };

  const handleGoogleSso = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setStatusMessage("Falta configurar NEXT_PUBLIC_GOOGLE_CLIENT_ID en .env.local.");
      return;
    }

    if (typeof window === "undefined" || !window.google?.accounts?.id) {
      setStatusMessage("Cargando servicios de Google, reintenta en unos segundos...");
      return;
    }

    setIsLoading(true);
    setStatusMessage("Abriendo diálogo de Google Workspace...");

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        if (response.credential) {
          setStatusMessage("Validando credenciales con WordtapAPI...");
          const res = await auth.loginWithGoogleToken(response.credential);
          setIsLoading(false);
          if (!res.success) {
            setStatusMessage(`Error: ${res.error}`);
          }
        }
      },
    });

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setIsLoading(false);
        setStatusMessage(
          "El navegador bloqueó el prompt de Google. Permití ventanas emergentes para continuar."
        );
      }
    });
  };

  const renderGoogleButton = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || typeof window === "undefined" || !window.google?.accounts?.id) return;

    setGoogleClientReady(true);
    const container = document.getElementById("google-signin-container");
    if (!container) return;

    container.innerHTML = "";
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        if (response.credential) {
          setIsLoading(true);
          setStatusMessage("Validando credenciales con WordtapAPI...");
          const res = await auth.loginWithGoogleToken(response.credential);
          setIsLoading(false);
          if (!res.success) {
            setStatusMessage(`Error: ${res.error}`);
          }
        }
      },
    });

    window.google.accounts.id.renderButton(container, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: "100%",
    });
  }, [auth]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return;
    }

    const script = document.querySelector<HTMLScriptElement>(
      'script[src*="accounts.google.com/gsi/client"]'
    );
    if (script) {
      const handleLoad = () => renderGoogleButton();
      script.addEventListener("load", handleLoad);
      return () => script.removeEventListener("load", handleLoad);
    }
  }, [renderGoogleButton]);

  return {
    selectedRole,
    isLoading,
    statusMessage,
    googleClientReady,
    currentDemo: DEMO_ACCOUNTS[selectedRole],
    selectRole,
    loginWithDemo,
    handleGoogleSso,
  };
}
