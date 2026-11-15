import { Suspense } from "react";
import { CourseBuilderView } from "@/features/courses/views/course-builder-view";

export const metadata = {
  title: "Editor de Curso — Wordtap Studio Moderación",
};

export default async function ModeratorCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return (
    <Suspense fallback={<div className="h-full w-full bg-canvas" />}>
      <CourseBuilderView
        initialCourseId={courseId}
        scope="admin"
        catalogBasePath="/moderator/courses"
      />
    </Suspense>
  );
}
