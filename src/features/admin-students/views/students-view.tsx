"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, RefreshCw, AlertCircle, GraduationCap } from "lucide-react";
import { getAdminDashboardApi } from "@/services/api";
import { useGlobalStudents } from "@/features/classrooms/hooks/use-global-students";
import { GlobalStudentsTable } from "@/features/classrooms/components/global-students-table";
import { ToastNotification } from "@/components/ui/toast-notification";
import { StudentKpis } from "../components/kpis";

export function AdminStudentsView() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    data: dashboardData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["admin", "dashboard", "students-kpis"],
    queryFn: async () => {
      const res = await getAdminDashboardApi();
      if (res.error) throw new Error(res.error);
      return res.data;
    },
  });

  const globalStudentsState = useGlobalStudents(true);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefresh = () => {
    void refetchStats();
    void globalStudentsState.refresh();
  };

  const handleExportCsv = () => {
    const rows = [
      ["Nombre", "Correo", "Curso", "Nivel", "Racha", "Progreso", "Plan", "Última Sesión"],
      ...globalStudentsState.students.map((st) => [
        st.name,
        st.email,
        st.course,
        st.cefr,
        st.streak,
        `${st.progress}%`,
        st.payLabel,
        st.lastActive,
      ]),
    ];

    const csv = rows
      .map((line) => line.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wordtap-admin-alumnos.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    triggerToast("Descarga iniciada: Directorio de alumnos en CSV");
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <ToastNotification message={toastMessage} variant="emerald" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Directorio de Alumnos</h1>
            <p className="text-xs text-slate-muted">
              Supervisión global de estudiantes registrados en Wordtap, su plan de acceso y progreso.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={globalStudentsState.isLoading || isStatsLoading}
            className="px-3.5 py-2 rounded-xl bg-card border border-border-default hover:border-purple-500/40 text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualizar</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={globalStudentsState.students.length === 0}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      <StudentKpis stats={dashboardData?.users} isLoading={isStatsLoading} />

      {globalStudentsState.error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{globalStudentsState.error}</span>
        </div>
      )}

      <GlobalStudentsTable
        students={globalStudentsState.students}
        courses={globalStudentsState.courses}
        total={globalStudentsState.total}
        page={globalStudentsState.page}
        pageSize={globalStudentsState.pageSize}
        onPageChange={globalStudentsState.setPage}
        searchQuery={globalStudentsState.searchQuery}
        onSearchChange={globalStudentsState.setSearchQuery}
        planFilter={globalStudentsState.planFilter}
        onPlanFilterChange={globalStudentsState.setPlanFilter}
        levelFilter={globalStudentsState.levelFilter}
        onLevelFilterChange={globalStudentsState.setLevelFilter}
        courseFilter={globalStudentsState.courseFilter}
        onCourseFilterChange={globalStudentsState.setCourseFilter}
        isLoading={globalStudentsState.isLoading}
      />
    </div>
  );
}
