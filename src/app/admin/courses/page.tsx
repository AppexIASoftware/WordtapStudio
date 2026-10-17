import { Suspense } from "react";
import { CourseBuilderView } from "@/features/courses/views/course-builder-view";

export const metadata = {
  title: "Gestión Global de Cursos — Wordtap Studio Admin",
};

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="h-full w-full bg-canvas" />}>
      <CourseBuilderView scope="admin" />
    </Suspense>
  );
}
