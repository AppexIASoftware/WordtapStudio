"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Classroom } from "@/features/classrooms/types";
import { getTeacherClassroomsApi } from "@/services/api/classroom";
import { useUrlParam } from "@/hooks/use-url-params";
import { useGlobalStudents } from "./use-global-students";
import { filterClassroomStudents } from "../components/cohort-student-table";

const STUDENT_MAIN_TABS = ["cohorts", "global"] as const;

const EMPTY_CLASSROOM: Classroom = {
  id: "empty",
  name: "Sin Aula",
  code: "WT-0000",
  courseId: "",
  courseTitle: "Sin Curso",
  assignedCourses: [],
  activeGames: [],
  level: "B1 Intermediate",
  created: "Hoy",
  studentsCount: 0,
  stats: { sub: 0, trial: 0, free: 0, scholar: 0 },
  stumble: [],
  students: [],
};

export function useStudentsProgress() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoadingClassrooms, setIsLoadingClassrooms] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "create" | "detail">(
    searchParams.get("view") === "create"
      ? "create"
      : searchParams.get("view") === "detail"
      ? "detail"
      : "list"
  );
  const [detailClassroom, setDetailClassroom] = useState<Classroom | null>(null);
  const [mainTab, setMainTab] = useUrlParam<"cohorts" | "global">(
    "tab",
    STUDENT_MAIN_TABS,
    "cohorts"
  );
  const [cohortSubTab, setCohortSubTab] = useState<"students" | "courses" | "games">("students");
  const [cohortFilter, setCohortFilter] = useState<
    "all" | "subscription" | "trial" | "free" | "stumbled"
  >("all");
  const [cohortSearch, setCohortSearch] = useState("");
  const [showReinforcementDrawer, setShowReinforcementDrawer] = useState(false);
  const [broadcastClassroom, setBroadcastClassroom] = useState<Classroom | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const globalStudentsState = useGlobalStudents(mainTab === "global");

  const urlView = searchParams.get("view");
  const urlClassId = searchParams.get("classId");
  const urlAction = searchParams.get("action") || searchParams.get("modal");
  const urlTab = searchParams.get("tab");
  const urlBroadcast = searchParams.get("broadcast");
  const routeSyncKey = `${urlView ?? ""}|${urlClassId ?? ""}|${urlAction ?? ""}|${urlTab ?? ""}|${urlBroadcast ?? ""}|${classrooms.length}|${detailClassroom?.id ?? ""}`;
  const [prevRouteSyncKey, setPrevRouteSyncKey] = useState(routeSyncKey);

  if (prevRouteSyncKey !== routeSyncKey) {
    setPrevRouteSyncKey(routeSyncKey);
    if (urlView === "create") {
      setDetailClassroom(null);
      setViewMode("create");
    } else if (urlView === "detail") {
      if (urlClassId) {
        const found = classrooms.find((c) => c.id === urlClassId);
        if (found) setDetailClassroom(found);
      }
      setViewMode("detail");
    } else {
      setViewMode("list");
    }

    const isBroadcast = urlAction === "broadcast" || urlTab === "broadcast";
    const targetClassId = urlClassId || urlBroadcast;
    if (isBroadcast) {
      if (targetClassId && classrooms.length > 0) {
        const found = classrooms.find((c) => c.id === targetClassId);
        if (found) setBroadcastClassroom(found);
      } else if (detailClassroom) {
        setBroadcastClassroom(detailClassroom);
      }
    } else if (broadcastClassroom) {
      setBroadcastClassroom(null);
    }
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    async function loadClassrooms() {
      setIsLoadingClassrooms(true);
      try {
        const res = await getTeacherClassroomsApi();
        if (res.data && res.data.length > 0) {
          const liveData: Classroom[] = res.data.map((c) => ({
            ...c,
            isDemo: false,
            stumble: (c.stumble || []).map((s) => ({ ...s, isDemo: false })),
            students: (c.students || []).map((st) => ({ ...st, isDemo: false })),
          }));
          setClassrooms(liveData);
          setSelectedClassId(liveData[0].id);
        } else {
          setClassrooms([]);
          setSelectedClassId("");
        }
      } catch {
        setClassrooms([]);
        setSelectedClassId("");
        triggerToast("No se pudieron cargar tus aulas. Verifica tu conexión.");
      } finally {
        setIsLoadingClassrooms(false);
      }
    }
    loadClassrooms();
  }, []);

  const handleOpenBroadcast = (cls: Classroom) => {
    setBroadcastClassroom(cls);
    const params = new URLSearchParams(searchParams.toString());
    params.set("action", "broadcast");
    params.set("classId", cls.id);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCloseBroadcast = () => {
    setBroadcastClassroom(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    params.delete("modal");
    if (params.get("tab") === "broadcast") params.set("tab", "history");
    if (viewMode === "list") params.delete("classId");
    router.push(`${pathname}?${params.toString()}`);
  };

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

  const selectedClass =
    classrooms.find((c) => c.id === selectedClassId) ||
    classrooms[0] ||
    EMPTY_CLASSROOM;

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

  const filteredStudents = filterClassroomStudents(
    selectedClass.students,
    cohortFilter,
    cohortSearch
  );

  const handleExportCsv = () => {
    const rows =
      mainTab === "global"
        ? [
            ["Nombre", "Correo", "Curso", "Nivel", "Racha", "Progreso", "Plan", "Ultima Sesion"],
            ...globalStudentsState.students.map((st) => [
              st.name, st.email, st.course, st.cefr, st.streak, `${st.progress}%`, st.payLabel, st.lastActive,
            ]),
          ]
        : [
            ["Nombre", "Correo", "Nivel", "Racha", "Precision", "Plan", "Ultima Actividad"],
            ...filteredStudents.map((st) => [
              st.name, st.email, st.level, st.streak, st.accuracy, st.payLabel, st.lastActive,
            ]),
          ];
    const csv = rows
      .map((line) => line.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = mainTab === "global" ? "wordtap-global-students.csv" : "wordtap-cohort-students.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    triggerToast("Descarga iniciada: Lista de estudiantes en formato CSV");
  };

  return {
    classrooms,
    setClassrooms,
    isLoadingClassrooms,
    selectedClassId,
    setSelectedClassId,
    selectedClass,
    viewMode,
    detailClassroom,
    setDetailClassroom,
    mainTab,
    setMainTab,
    cohortSubTab,
    setCohortSubTab,
    cohortFilter,
    setCohortFilter,
    cohortSearch,
    setCohortSearch,
    filteredStudents,
    showReinforcementDrawer,
    setShowReinforcementDrawer,
    broadcastClassroom,
    toastMessage,
    globalStudentsState,
    triggerToast,
    handleOpenBroadcast,
    handleCloseBroadcast,
    handleOpenCreate,
    handleOpenDetail,
    handleCloseWorkspace,
    copyCode,
    shareWhatsApp,
    handleExportCsv,
  };
}
