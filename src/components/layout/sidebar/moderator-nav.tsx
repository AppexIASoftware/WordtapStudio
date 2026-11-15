"use client";

import { useQuery } from "@tanstack/react-query";
import {
  GitPullRequest,
  LayoutDashboard,
  Boxes,
  Layers,
  AlertTriangle,
} from "lucide-react";
import {
  getAdminContentReportsApi,
  getAdminCourseReviewsApi,
} from "@/services/api";
import { NavItem } from "./nav-item";

interface ModeratorNavProps {
  collapsed?: boolean;
}

export function ModeratorNav({ collapsed = false }: ModeratorNavProps) {
  const { data: reviewsCount = 0 } = useQuery({
    queryKey: ["moderator", "nav", "reviews-count"],
    queryFn: async () => {
      const res = await getAdminCourseReviewsApi();
      return res.data?.length ?? 0;
    },
    staleTime: 60_000,
  });

  const { data: openReportsCount = 0 } = useQuery({
    queryKey: ["moderator", "nav", "reports-count"],
    queryFn: async () => {
      const res = await getAdminContentReportsApi({ status: "open", limit: 1, offset: 0 });
      return res.data?.total ?? 0;
    },
    staleTime: 60_000,
  });

  return (
    <div className="space-y-4">
      <div>
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-blue-400 font-mono mb-1.5">
            Auditoría & Calidad
          </p>
        )}
        <nav className="space-y-0.5">
          <NavItem
            href="/moderator"
            label="Métricas de Calidad"
            icon={LayoutDashboard}
            collapsed={collapsed}
            roleTheme="moderator"
          />
          <NavItem
            href="/moderator/approvals"
            label="Cola de Revisiones"
            icon={GitPullRequest}
            badge={reviewsCount > 0 ? String(reviewsCount) : undefined}
            badgeColor="amber"
            collapsed={collapsed}
            roleTheme="moderator"
          />
          <NavItem
            href="/moderator/reports"
            label="Reportes"
            icon={AlertTriangle}
            badge={openReportsCount > 0 ? String(openReportsCount) : undefined}
            badgeColor="amber"
            collapsed={collapsed}
            roleTheme="moderator"
          />
        </nav>
      </div>

      <div>
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-subtle mb-1.5 font-mono">
            Contenido & Cursos
          </p>
        )}
        <nav className="space-y-0.5">
          <NavItem
            href="/moderator/courses"
            label="Supervisión de Cursos"
            icon={Layers}
            collapsed={collapsed}
            roleTheme="moderator"
          />
          <NavItem
            href="/moderator/vault"
            label="Content Vault"
            icon={Boxes}
            collapsed={collapsed}
            roleTheme="moderator"
          />
        </nav>
      </div>
    </div>
  );
}
