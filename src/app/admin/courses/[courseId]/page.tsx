import { Suspense } from "react";
import { CourseBuilderView } from "@/features/courses/views/course-builder-view";

export const metadata = {
  title: "Editor de Curso — Wordtap Studio Admin",
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return (
    <Suspense fallback={<div className="min-h-[400px]" />}>
      <CourseBuilderView initialCourseId={courseId} scope="admin" />
    </Suspense>
  );
}
