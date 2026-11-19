import { Suspense } from "react";
import { PageShellSkeleton } from "@/components/ui/page-skeleton";
import { Metadata } from "next";
import { AdminCoursesCatalogView } from "@/features/courses/views/admin-courses-catalog-view";
import { CourseBuilderView } from "@/features/courses/views/course-builder-view";

export const metadata: Metadata = {
  title: "Gestión y Supervisión de Cursos — Wordtap Studio",
  description: "Catálogo global, creación de cursos oficiales y auditoría curricular en simulador móvil.",
};

export default async function ModeratorCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const { courseId } = await searchParams;

  return (
    <Suspense
      fallback={<PageShellSkeleton />}
    >
      {courseId ? (
        <CourseBuilderView
          initialCourseId={courseId}
          scope="admin"
          catalogBasePath="/moderator/courses"
        />
      ) : (
        <AdminCoursesCatalogView basePath="/moderator/courses" />
      )}
    </Suspense>
  );
}
