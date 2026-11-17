import type { BackendUser } from "@/services/api/types";
import { USER_ROLE, type UserProfile, type UserRole } from "../types";

const VALID_ROLES = new Set<string>(Object.values(USER_ROLE));

const ROLE_TITLES: Record<UserRole, string> = {
  [USER_ROLE.INSTRUCTOR]: "Docente Autorizado",
  [USER_ROLE.MODERATOR]: "Moderadora Oficial (Calidad)",
  [USER_ROLE.ADMIN]: "Super Administrador",
  [USER_ROLE.CANDIDATE]: "Postulante Docente (En Revisión)",
};

const ROLE_SCOPES: Record<UserRole, string> = {
  [USER_ROLE.INSTRUCTOR]: "Portal Docente: studio.wordtap.app",
  [USER_ROLE.MODERATOR]: "Consola de Revisión: approvals.wordtap.app",
  [USER_ROLE.ADMIN]: "Consola de Gobernanza: admin.wordtap.app",
  [USER_ROLE.CANDIDATE]: "En espera de Aprobación",
};

const BACKEND_ROLE_MAP: Record<string, UserRole> = {
  admin: USER_ROLE.ADMIN,
  moderator: USER_ROLE.MODERATOR,
  instructor: USER_ROLE.INSTRUCTOR,
  student: USER_ROLE.CANDIDATE,
};

export function isValidUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && VALID_ROLES.has(value);
}

/**
 * Deriva el rol de la sesión exclusivamente del campo autoritativo `role` enviado
 * por WordtapAPI. Valores de alumno o desconocidos degradan a `candidate`.
 */
export function resolveUserRoleFromBackend(rawRole?: string | null): UserRole {
  const normalized = (rawRole ?? "").trim().toLowerCase();
  return BACKEND_ROLE_MAP[normalized] ?? USER_ROLE.CANDIDATE;
}

export function mapBackendUserToProfile(backendUser: BackendUser): UserProfile {
  const role = resolveUserRoleFromBackend(backendUser.role);
  const initials = backendUser.name
    ? backendUser.name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("")
    : "WT";

  return {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    role,
    title: ROLE_TITLES[role],
    avatarInitials: initials || "WT",
    scope: ROLE_SCOPES[role],
    avatarUrl: backendUser.avatar_url,
  };
}
