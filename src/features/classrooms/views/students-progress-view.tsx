"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, Download, Users, BookOpen, Gamepad2 } from "lucide-react";
import { CLASSROOMS_DATA, GLOBAL_STUDENTS_DATA } from "@/features/classrooms/data/mock-classrooms";
import { Classroom } from "@/features/classrooms/types";
import { ToastNotification } from "@/components/ui/toast-notification";
import { getTeacherClassroomsApi } from "@/services/api/classroom";
import { CohortCardsGrid } from "../components/cohort-cards-grid";
import { CohortStumbleCards } from "../components/cohort-stumble-cards";
import { ClassroomsHeader } from "../components/classrooms-header";
import { CohortManagementPanel } from "../components/cohort-management-panel";
import { GlobalStudentsTable } from "../components/global-students-table";
import { CohortCreationWorkspace } from "../components/cohort-creation-workspace";
import { StumbleReinforcementDrawer } from "../components/stumble-reinforcement-drawer";

export function StudentsProgressView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "create" | "detail">(
    searchParams.get("view") === "create"
      ? "create"
      : searchParams.get("view") === "detail"
      ? "detail"
      : "list"
  );
  const [detailClassroom, setDetailClassroom] = useState<Classroom | null>(null);
  const [mainTab, setMainTab] = useState<"cohorts" | "global">("cohorts");
  const [cohortSubTab, setCohortSubTab] = useState<"students" | "courses" | "games">("students");
  const [cohortFilter, setCohortFilter] = useState<
    "all" | "subscription" | "trial" | "free" | "stumbled"
  >("all");
  const [cohortSearch, setCohortSearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [showReinforcementDrawer, setShowReinforcementDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "create") {
      setDetailClassroom(null);
      setViewMode("create");
    } else if (view === "detail") {
      const classId = searchParams.get("classId");
      if (classId) {
        const found = classrooms.find((c) => c.id === classId);
        if (found) {
          setDetailClassroom(found);
        }
      }
      setViewMode("detail");
    } else {
      setViewMode("list");
    }
  }, [searchParams, classrooms]);

  const handleOpenCreate = () => {
    setDetailClassroom(null);
    setViewMode("create");
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "create");
    params.set("tab", "general");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleOpenDetail = (cls: Classroom) => {
    setSelectedClassId(cls.id);
    setDetailClassroom(cls);
    setViewMode("detail");
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "detail");
    params.set("classId", cls.id);
    params.set("tab", "general");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCloseWorkspace = () => {
    setDetailClassroom(null);
    setViewMode("list");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("view");
    params.delete("classId");
    params.delete("tab");
    params.delete("step");
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    async function loadClassrooms() {
      try {
        const res = await getTeacherClassroomsApi();
        if (res.data && res.data.length > 0) {
          // Datos reales de la API (DB): ELIMINAR todo contenido demo
          const liveData: Classroom[] = res.data.map((c) => ({
            ...c,
            isDemo: false,
            stumble: (c.stumble || []).map((s) => ({ ...s, isDemo: false })),
            students: (c.students || []).map((st) => ({ ...st, isDemo: false })),
          }));
          setClassrooms(liveData);
          setSelectedClassId(liveData[0].id);
        } else {
          // El demo SOLO se muestra si NO hay información pedida por la API de la DB
          const demoData = CLASSROOMS_DATA.map((c) => ({ ...c, isDemo: true }));
          setClassrooms(demoData);
          setSelectedClassId(demoData[0].id);
        }
      } catch {
        // En caso de fallo o desconexión del backend
        const demoData = CLASSROOMS_DATA.map((c) => ({ ...c, isDemo: true }));
        setClassrooms(demoData);
        setSelectedClassId(demoData[0].id);
      }
    }
    loadClassrooms();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedClass =
    classrooms.find((c) => c.id === selectedClassId) ||
    classrooms[0] || {
      id: "empty",
      name: "Sin Aula",
      code: "WT-0000",
      courseId: "",
      courseTitle: "Sin Curso",
      assignedCourses: ["c-3"],
      activeGames: ["match", "memory", "listening", "multiple_choice"],
      level: "B1 Intermediate",
      created: "Hoy",
      studentsCount: 0,
      stats: { sub: 0, trial: 0, free: 0, scholar: 0 },
      stumble: [],
      students: [],
    };

  const copyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      triggerToast(`¡Código ${code} copiado al portapapeles!`);
    } else {
      triggerToast(`Código: ${code}`);
    }
  };

  const shareWhatsApp = (name: string, code: string) => {
    const text = `¡Hola! Únete a mi aula privada "${name}" en WordTap con el código: ${code}`;
    if (typeof window !== "undefined") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const filteredStudents = selectedClass.students.filter((st) => {
    if (cohortFilter === "subscription" && st.payStatus !== "subscription") return false;
    if (cohortFilter === "trial" && st.payStatus !== "trial") return false;
    if (cohortFilter === "free" && st.payStatus !== "free") return false;
    if (cohortFilter === "stumbled" && parseInt(st.accuracy) >= 75) return false;

    if (cohortSearch.trim()) {
      const q = cohortSearch.toLowerCase();
      return st.name.toLowerCase().includes(q) || st.email.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredGlobalStudents = GLOBAL_STUDENTS_DATA.filter((st) => {
    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      return (
        st.name.toLowerCase().includes(q) ||
        st.email.toLowerCase().includes(q) ||
        st.course.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (viewMode === "create" || viewMode === "detail") {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <ToastNotification message={toastMessage} variant="emerald" />
        <CohortCreationWorkspace
          initialClassroom={viewMode === "detail" ? detailClassroom : null}
          initialMode={viewMode === "detail" ? "view" : "create"}
          onCancel={handleCloseWorkspace}
          onClassroomCreated={(newCls) => {
            setClassrooms((prev) => {
              // Si la lista contenía aulas demo por estar la DB vacía, eliminarlas por completo
              const realClassrooms = prev.filter((c) => !c.isDemo);
              return [newCls, ...realClassrooms];
            });
            setSelectedClassId(newCls.id);
            handleCloseWorkspace();
          }}
          onClassroomUpdated={(updatedCls) => {
            setClassrooms((prev) =>
              prev.map((c) => (c.id === updatedCls.id ? updatedCls : c))
            );
            setDetailClassroom(updatedCls);
            triggerToast(`¡Aula "${updatedCls.name}" actualizada con éxito!`);
          }}
          triggerToast={triggerToast}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <ToastNotification message={toastMessage} variant="emerald" />
      <ClassroomsHeader
        classroomsCount={classrooms.length}
        mainTab={mainTab}
        onTabChange={setMainTab}
        onCreateClassroom={handleOpenCreate}
        onExportCsv={() => triggerToast("Exportando lista de estudiantes en formato CSV...")}
      />

      {/* Contenido según pestaña */}
      {mainTab === "cohorts" && (
        <div className="space-y-6">
          <CohortCardsGrid
            classrooms={classrooms}
            selectedClassId={selectedClassId}
            onSelectClassroom={(id) => setSelectedClassId(id)}
            onCopyCode={copyCode}
            onShareWhatsApp={shareWhatsApp}
            onOpenClassroomDetail={handleOpenDetail}
          />

          <CohortStumbleCards
            stumbles={selectedClass.stumble}
            studentsCount={selectedClass.studentsCount}
            isDemo={selectedClass.isDemo}
            onOpenReinforcementDrawer={() => setShowReinforcementDrawer(true)}
          />


          <CohortManagementPanel
            selectedClass={selectedClass}
            cohortSubTab={cohortSubTab}
            onSubTabChange={setCohortSubTab}
            filteredStudents={filteredStudents}
            cohortFilter={cohortFilter}
            onFilterChange={setCohortFilter}
            cohortSearch={cohortSearch}
            onSearchChange={setCohortSearch}
            onAssignMoreCourses={handleOpenCreate}
            onUpdateActiveGames={(games) => {
              setClassrooms((prev) =>
                prev.map((c) => (c.id === selectedClass.id ? { ...c, activeGames: games } : c))
              );
            }}
            triggerToast={triggerToast}
          />
        </div>
      )}

      {mainTab === "global" && (
        <GlobalStudentsTable
          students={filteredGlobalStudents}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
        />
      )}

      <StumbleReinforcementDrawer
        isOpen={showReinforcementDrawer}
        onClose={() => setShowReinforcementDrawer(false)}
        stumbles={selectedClass.stumble}
        classroomName={selectedClass.name}
        studentsCount={selectedClass.studentsCount}
        triggerToast={triggerToast}
      />
    </div>
  );
}
