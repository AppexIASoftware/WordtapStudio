export const COURSE_GROUP = {
  AVAILABLE: "available",
  PENDING: "pending",
} as const;

export type CourseGroup = (typeof COURSE_GROUP)[keyof typeof COURSE_GROUP];

export const COURSE_PUBLICATION = {
  PUBLISHED: "published",
  DRAFT: "draft",
  IN_REVIEW: "in_review",
  ARCHIVED: "archived",
} as const;

export function courseGroup(status: string | undefined): CourseGroup {
  return status === COURSE_PUBLICATION.PUBLISHED ? COURSE_GROUP.AVAILABLE : COURSE_GROUP.PENDING;
}

export function pendingCourseLabel(status: string | undefined): string {
  const labels: Record<string, string> = {
    [COURSE_PUBLICATION.DRAFT]: "Borrador",
    [COURSE_PUBLICATION.IN_REVIEW]: "En revisión",
    [COURSE_PUBLICATION.ARCHIVED]: "Archivado",
  };
  return status ? labels[status] || "No disponible" : "No disponible";
}
