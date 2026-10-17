"use client";

import { Users, BookOpen, Gamepad2 } from "lucide-react";
import { Classroom, ClassroomStudent } from "@/features/classrooms/types";
import { CohortStudentTable } from "./cohort-student-table";
import { CohortCoursesTab } from "./cohort-courses-tab";
import { CohortGamesTab } from "./cohort-games-tab";

interface CohortManagementPanelProps {
  selectedClass: Classroom;
  cohortSubTab: "students" | "courses" | "games";
  onSubTabChange: (tab: "students" | "courses" | "games") => void;
  filteredStudents: ClassroomStudent[];
  cohortFilter: "all" | "subscription" | "trial" | "free" | "stumbled";
  onFilterChange: (filter: "all" | "subscription" | "trial" | "free" | "stumbled") => void;
  cohortSearch: string;
  onSearchChange: (query: string) => void;
  onAssignMoreCourses: () => void;
  onUpdateActiveGames: (games: string[]) => void;
  triggerToast: (msg: string) => void;
}

/** Panel con sub-pestañas para gestionar estudiantes, cursos y juegos de la cohorte seleccionada. */
export function CohortManagementPanel({
  selectedClass,
  cohortSubTab,
  onSubTabChange,
  filteredStudents,
  cohortFilter,
  onFilterChange,
  cohortSearch,
  onSearchChange,
  onAssignMoreCourses,
  onUpdateActiveGames,
  triggerToast,
}: CohortManagementPanelProps) {
  return (
    <>
      {/* Sub-Pestañas de Gestión de la Cohorte Seleccionada */}
      <div id="cohort-management-tabs" className="flex items-center gap-2 border-b border-border-default pb-2">
        {[
          {
            id: "students",
            label: "Estudiantes & Rendimiento",
            icon: Users,
            badge: selectedClass.students.length,
          },
          {
            id: "courses",
            label: "Cursos Vinculados",
            icon: BookOpen,
            badge: selectedClass.assignedCourses?.length || (selectedClass.courseId ? 1 : 0),
          },
          {
            id: "games",
            label: "Minijuegos Habilitados",
            icon: Gamepad2,
            badge: selectedClass.activeGames?.length || 6,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = cohortSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSubTabChange(tab.id as "students" | "courses" | "games")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-emerald-brand/15 text-emerald-brand border border-emerald-brand/40 shadow-sm"
                  : "text-slate-400 hover:text-white bg-card border border-border-default"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-canvas text-slate-300">
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {cohortSubTab === "students" && (
        <CohortStudentTable
          students={filteredStudents}
          totalStudents={selectedClass.students.length}
          stats={selectedClass.stats}
          classroomName={selectedClass.name}
          isDemo={selectedClass.isDemo}
          filter={cohortFilter}
          onFilterChange={onFilterChange}
          searchQuery={cohortSearch}
          onSearchChange={onSearchChange}
        />
      )}

      {cohortSubTab === "courses" && (
        <CohortCoursesTab
          assignedCourseIds={
            selectedClass.assignedCourses && selectedClass.assignedCourses.length > 0
              ? selectedClass.assignedCourses
              : selectedClass.courseId
              ? [selectedClass.courseId]
              : ["c-3"]
          }
          classroomName={selectedClass.name}
          onAssignMore={onAssignMoreCourses}
        />
      )}

      {cohortSubTab === "games" && (
        <CohortGamesTab
          activeGameSlugs={selectedClass.activeGames}
          classroomName={selectedClass.name}
          classroomId={selectedClass.id}
          isDemo={selectedClass.isDemo}
          onUpdateActiveGames={onUpdateActiveGames}
          triggerToast={triggerToast}
        />
      )}
    </>
  );
}
