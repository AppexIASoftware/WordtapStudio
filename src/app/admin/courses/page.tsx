import { Suspense } from "react";
import { AdminCoursesCatalogView } from "@/features/courses/views/admin-courses-catalog-view";

export const metadata = {
  title: "Catálogo Global de Cursos — Wordtap Studio Admin",
};

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="h-full w-full bg-canvas" />}>
      <AdminCoursesCatalogView />
    </Suspense>
  );
}
