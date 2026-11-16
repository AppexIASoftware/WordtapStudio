"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, RefreshCw, AlertCircle, GraduationCap } from "lucide-react";
import {
  getAdminDashboardApi,
  getTeacherGlobalStudentsApi,
} from "@/services/api";
import { useGlobalStudents } from "@/features/classrooms/hooks/use-global-students";
import { GlobalStudentsTable } from "@/features/classrooms/components/global-students-table";
import { ToastNotification } from "@/components/ui/toast-notification";
import { StudentKpis } from "../components/kpis";
import { StudentDetailDrawer } from "../components/detail-drawer";

interface AdminStudentsViewProps {
  canManageStatus?: boolean;
}

export function AdminStudentsView({
  canManageStatus = true,
}: AdminStudentsViewProps = {}) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [isExporting, setIsExporting] = useState(false);

  const {
    data: dashboardData,
    isLoading: isStatsLoading,
    isError: isStatsError,
    error: statsError,
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

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const allRows: Array<string[]> = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const res = await getTeacherGlobalStudentsApi({
          q: globalStudentsState.searchQuery,
          plan: globalStudentsState.planFilter,
          level: globalStudentsState.levelFilter,
          course_id: globalStudentsState.courseFilter,
          status: globalStudentsState.statusFilter,
          limit,
          offset,
        });
        if (res.error || !res.data) {
          throw new Error(res.error || "No se pudo exportar el directorio.");
        }
        const batch = res.data.items ?? [];
        for (const st of batch) {
          allRows.push([
            st.name,
            st.email,
            st.course_title || "Catálogo General",
            st.learning_level,
            `${st.current_streak_days ?? 0} días`,
            `${st.progress_percent ?? 0}%`,
            st.access_tier,
            st.is_active === false ? "Suspendido" : "Activo",
            st.last_activity_date || "Sin actividad",
          ]);
        }
        offset += batch.length;
        if (batch.length < limit || offset >= (res.data.total ?? 0)) break;
      }

      const header = [
        "Nombre",
        "Correo",
        "Curso",
        "Nivel",
        "Racha",
        "Progreso",
        "Plan",
        "Estado",
        "Última Sesión",
      ];
      const csv = [header, ...allRows]
        .map((line) =>
          line.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
        )
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
      triggerToast(`Exportados ${allRows.length} alumnos en CSV`);
    } catch (err) {
      triggerToast(
        err instanceof Error ? err.message : "Error al exportar el CSV"
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <ToastNotification message={toastMessage} variant="emerald" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              Directorio de Alumnos
            </h1>
            <p className="text-xs text-slate-muted">
              Supervisión global de estudiantes registrados en Wordtap, su plan
              de acceso y progreso.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={globalStudentsState.isLoading || isStatsLoading}
            className="px-3.5 py-2 rounded-xl bg-card border border-border-default hover:border-purple-500/40 text-xs font-semibold text-slate-light flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualizar</span>
          </button>
          <button
            type="button"
            onClick={() => void handleExportCsv()}
            disabled={globalStudentsState.total === 0 || isExporting}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? "Exportando..." : "Exportar CSV"}</span>
          </button>
        </div>
      </div>

      {isStatsError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            {statsError instanceof Error
              ? statsError.message
              : "No se pudieron cargar las métricas de alumnos."}
          </span>
        </div>
      )}

      <StudentKpis stats={dashboardData?.users} isLoading={isStatsLoading} />

      {globalStudentsState.error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
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
        showStatusColumn
        statusFilter={globalStudentsState.statusFilter}
        onStatusFilterChange={globalStudentsState.setStatusFilter}
        onSelectStudent={(st) => setSelectedStudentId(st.id)}
        isLoading={globalStudentsState.isLoading}
      />

      <StudentDetailDrawer
        studentId={selectedStudentId}
        canManageStatus={canManageStatus}
        onClose={() => setSelectedStudentId(null)}
        onStatusUpdated={(msg) => {
          triggerToast(msg);
          void globalStudentsState.refresh();
          void refetchStats();
        }}
      />
    </div>
  );
}
