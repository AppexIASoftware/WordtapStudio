"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { RoleGuard } from "@/features/auth/components/role-guard";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <RoleGuard>
      <div
        className="flex h-screen w-screen overflow-hidden bg-canvas text-slate-100 font-sans antialiased selection:bg-emerald-brand selection:text-white"
        style={{ "--sidebar-offset": sidebarCollapsed ? "4rem" : "12rem" } as React.CSSProperties}
      >
        <Sidebar
          isMobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto relative bg-canvas">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
