import { Metadata } from "next";
import { StudentsAccessGate } from "@/features/admin-students/views/students-access-gate";

export const metadata: Metadata = {
  title: "Alumnos — Wordtap Studio",
  description: "Supervisión del directorio de estudiantes según permisos configurados.",
};

export default function ModeratorStudentsPage() {
  return <StudentsAccessGate />;
}
