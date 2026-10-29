export const OWNER_TYPE = {
  PLATFORM: "platform",
  TEACHER: "teacher",
} as const;

export type OwnerType = (typeof OWNER_TYPE)[keyof typeof OWNER_TYPE];
