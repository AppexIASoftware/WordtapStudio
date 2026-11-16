"use client";

import { ShieldOff } from "lucide-react";
import { RBAC_PERMISSION, useMyPermissions } from "@/hooks/use-my-permissions";
import { AdminNotificationsView } from "./admin-notifications-view";

/**
 * Capability-gated wrapper for the notifications center based on dynamic RBAC policy.
 */
export function NotificationsAccessGate() {
  const { isLoading, hasPermission } = useMyPermissions();
  const canGlobal = hasPermission(RBAC_PERMISSION.NOTIFICATIONS_GLOBAL_ANNOUNCEMENTS);
  const canClassroom = hasPermission(RBAC_PERMISSION.NOTIFICATIONS_CLASSROOM_BROADCAST);
  const canAccess = canGlobal || canClassroom;

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-7 w-72 rounded-lg bg-border-default" />
          <div className="h-4 w-96 rounded-lg bg-card-hover" />
        </div>
        <div className="h-10 w-64 rounded-xl bg-border-default" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 rounded-2xl bg-card border border-border-default" />
          <div className="h-80 rounded-2xl bg-card border border-border-default" />
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto">
        <div className="p-8 rounded-2xl bg-card border border-border-default text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <ShieldOff className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-white">
            Acceso a notificaciones deshabilitado
          </h1>
          <p className="text-xs text-slate-muted max-w-md mx-auto">
            Tu rol no tiene habilitado el envío de notificaciones actualmente. Un administrador puede activarlo desde la matriz de permisos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-150">
      <AdminNotificationsView />
    </div>
  );
}
