"use client";

import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";
import { RoleGuard } from "@/features/auth/components/role-guard";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <RoleGuard>
      <div className="flex h-screen w-screen overflow-hidden bg-canvas text-slate-100 font-sans antialiased selection:bg-emerald-brand selection:text-white">
        <AppSidebar
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AppTopbar onToggleMobile={() => setMobileMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto relative bg-canvas">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
