"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/auth-context";
import { getMyRbacPermissionsApi } from "@/services/api/settings";

export const RBAC_PERMISSION = {
  STUDENTS_VIEW_DIRECTORY: "students:view_directory",
  STUDENTS_MANAGE_STATUS: "students:manage_status",
  NOTIFICATIONS_CLASSROOM_BROADCAST: "notifications:classroom_broadcast",
  NOTIFICATIONS_GLOBAL_ANNOUNCEMENTS: "notifications:global_announcements",
} as const;

export type RbacPermissionKey =
  (typeof RBAC_PERMISSION)[keyof typeof RBAC_PERMISSION];

/**
 * Resolves the authenticated user's effective dynamic RBAC permissions from WordtapAPI.
 */
export function useMyPermissions() {
  const { isAuthenticated, currentRole } = useAuth();

  const query = useQuery({
    queryKey: ["rbac", "me", currentRole],
    enabled: isAuthenticated,
    staleTime: 60_000,
    queryFn: async () => {
      const res = await getMyRbacPermissionsApi();
      if (res.error) throw new Error(res.error);
      return res.data?.permissions ?? {};
    },
  });

  const hasPermission = (perm: RbacPermissionKey): boolean => {
    if (currentRole === "admin") return true;
    return Boolean(query.data?.[perm]);
  };

  return {
    permissions: query.data ?? {},
    isLoading: query.isLoading,
    hasPermission,
    refetch: query.refetch,
  };
}
