import { Suspense } from "react";
import { TeacherCoursesCatalogView } from "@/features/courses/views/teacher-courses-catalog-view";

export const metadata = {
  title: "Catálogo de Mis Cursos — Wordtap Studio Docente",
};

export default function TeacherCoursesPage() {
  return (
    <Suspense fallback={<div className="h-full w-full bg-canvas" />}>
      <TeacherCoursesCatalogView />
    </Suspense>
  );
}
