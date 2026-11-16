"use client";

import { ShieldOff } from "lucide-react";
import { RBAC_PERMISSION, useMyPermissions } from "@/hooks/use-my-permissions";
import { AdminStudentsView } from "./students-view";

/**
 * Capability-gated wrapper for the global students directory based on dynamic RBAC policy.
 */
export function StudentsAccessGate() {
  const { isLoading, hasPermission } = useMyPermissions();
  const canView = hasPermission(RBAC_PERMISSION.STUDENTS_VIEW_DIRECTORY);
  const canManage = hasPermission(RBAC_PERMISSION.STUDENTS_MANAGE_STATUS);

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-56 rounded-lg bg-border-default" />
            <div className="h-4 w-80 rounded-lg bg-card-hover" />
          </div>
          <div className="h-9 w-36 rounded-xl bg-border-default" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-card border border-border-default"
            />
          ))}
        </div>
        <div className="h-96 rounded-2xl bg-card border border-border-default" />
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto">
        <div className="p-8 rounded-2xl bg-card border border-border-default text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <ShieldOff className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-white">
            Acceso al directorio de alumnos deshabilitado
          </h1>
          <p className="text-xs text-slate-muted max-w-md mx-auto">
            Tu rol no tiene habilitado este módulo actualmente. Un administrador puede activarlo desde la matriz de permisos.
          </p>
        </div>
      </div>
    );
  }

  return <AdminStudentsView canManageStatus={canManage} />;
}
