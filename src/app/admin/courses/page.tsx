import { Suspense } from "react";
import { CourseBuilderView } from "@/features/courses/views/course-builder-view";

export const metadata = {
  title: "Gestión Global de Cursos — Wordtap Studio Admin",
};

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="min-h-[400px]" />}>
      <CourseBuilderView scope="admin" />
    </Suspense>
  );
}
