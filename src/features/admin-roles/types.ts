export type StaffRole = "Docente" | "Moderador" | "Admin";
export type StaffStatus = "Activo" | "Invitación Pendiente" | "Suspendido";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  scope: string;
  quota: string;
  status: StaffStatus;
  avatar: string;
  avatarBg: string;
}

export interface PermissionCell {
  val: boolean;
  locked: boolean;
}

export interface PermissionItem {
  key: string;
  name: string;
  desc: string;
  student: PermissionCell;
  instructor: PermissionCell;
  moderator: PermissionCell;
  admin: PermissionCell;
}

export interface RbacModule {
  moduleId: string;
  moduleName: string;
  badge: string;
  badgeColor: "blue" | "emerald" | "amber" | "teal" | "purple" | "indigo";
  permissions: PermissionItem[];
}

export type RbacMatrixState = Record<
  string,
  {
    student: PermissionCell;
    instructor: PermissionCell;
    moderator: PermissionCell;
    admin: PermissionCell;
  }
>;
