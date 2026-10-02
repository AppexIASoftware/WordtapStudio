"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../auth-context";
import { UserRole } from "../types";
import { ShieldAlert, Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { currentRole, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Resolve allowed roles by route
  const effectiveAllowedRoles = allowedRoles || (() => {
    if (pathname.startsWith("/teacher")) {
      return ["instructor", "admin"] as UserRole[];
    }
    if (pathname.startsWith("/moderator")) {
      return ["moderator", "admin"] as UserRole[];
    }
    return ["admin"] as UserRole[];
  })();

  const isAuthorized = effectiveAllowedRoles.includes(currentRole);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!isAuthorized) {
      const fallback =
        currentRole === "instructor"
          ? "/teacher"
          : currentRole === "moderator"
          ? "/moderator"
          : "/dashboard";
      router.replace(fallback);
    }
  }, [isAuthenticated, isAuthorized, isLoading, currentRole, pathname, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-canvas text-slate-100 gap-3">
        <Loader2 className="w-7 h-7 text-emerald-brand animate-spin" />
        <span className="text-xs font-mono text-slate-muted">Verificando credenciales...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Acceso no autorizado</h2>
          <p className="text-xs text-slate-muted mt-1 max-w-sm">
            Tu rol actual ({currentRole}) no cuenta con permisos para ver este módulo. Redirigiendo a tu espacio de trabajo...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
