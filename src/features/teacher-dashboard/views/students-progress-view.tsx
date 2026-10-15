"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, Download, Users, BookOpen, Gamepad2 } from "lucide-react";
import { CLASSROOMS_DATA, GLOBAL_STUDENTS_DATA } from "../data/mock-teacher-data";
import { Classroom } from "../types";
import { ToastNotification } from "@/components/ui/toast-notification";
import { getTeacherClassroomsApi } from "@/services/api/classroom";
import { CohortCardsGrid } from "../components/cohorts/cohort-cards-grid";
import { CohortStumbleCards } from "../components/cohorts/cohort-stumble-cards";
import { CohortStudentTable } from "../components/cohorts/cohort-student-table";
import { CohortCoursesTab } from "../components/cohorts/cohort-courses-tab";
import { CohortGamesTab } from "../components/cohorts/cohort-games-tab";
import { GlobalStudentsTable } from "../components/cohorts/global-students-table";
import { CohortCreationWorkspace } from "../components/cohorts/cohort-creation-workspace";
import { StumbleReinforcementDrawer } from "../components/cohorts/stumble-reinforcement-drawer";

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

      {/* Encabezado Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Aulas & Estudiantes
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
              Cohortes & Telemetría
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            Gestión de cohortes privadas mediante códigos de invitación y seguimiento del aprendizaje.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Crear Nueva Aula</span>
          </button>

          <button
            type="button"
            onClick={() => triggerToast("Exportando lista de estudiantes en formato CSV...")}
            className="px-3.5 py-2 rounded-xl bg-card border border-border-default hover:border-border-subtle text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Pestañas de Navegación Principal */}
      <div className="flex items-center justify-between border-b border-border-default pb-3">
        <div className="flex items-center gap-1 bg-card p-1 rounded-2xl border border-border-default text-xs font-medium">
          <button
            type="button"
            onClick={() => setMainTab("cohorts")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              mainTab === "cohorts"
                ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Aulas Privadas & Cohortes{" "}
            <span
              className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                mainTab === "cohorts" ? "bg-black/20 text-white" : "bg-card text-slate-300"
              }`}
            >
              {classrooms.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMainTab("global")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              mainTab === "global"
                ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Alumnos del Catálogo Global{" "}
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 ml-1">
              Demo
            </span>
          </button>
        </div>
      </div>

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
                  onClick={() => setCohortSubTab(tab.id as "students" | "courses" | "games")}
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
              onFilterChange={setCohortFilter}
              searchQuery={cohortSearch}
              onSearchChange={setCohortSearch}
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
              onAssignMore={handleOpenCreate}
            />
          )}

          {cohortSubTab === "games" && (
            <CohortGamesTab
              activeGameSlugs={selectedClass.activeGames}
              classroomName={selectedClass.name}
              onUpdateActiveGames={(games) => {
                setClassrooms((prev) =>
                  prev.map((c) => (c.id === selectedClass.id ? { ...c, activeGames: games } : c))
                );
              }}
              triggerToast={triggerToast}
            />
          )}
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
