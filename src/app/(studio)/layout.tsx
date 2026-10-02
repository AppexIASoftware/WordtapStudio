"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { DemoLoginModal } from "@/components/layout/demo-login-modal";
import { RoleGuard } from "@/features/auth/components/role-guard";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="flex h-screen w-screen overflow-hidden bg-canvas text-slate-100">
        {/* Barra lateral de navegación */}
        <Sidebar
          onOpenDemoModal={() => setIsDemoModalOpen(true)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Columna principal */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Barra superior */}
          <Topbar
            onOpenDemoModal={() => setIsDemoModalOpen(true)}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

          {/* Contenido principal de la vista */}
          <main className="flex-1 overflow-y-auto relative bg-canvas p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
              {children}
            </div>
          </main>
        </div>

        {/* Modal de conmutación de cuentas demo */}
        <DemoLoginModal
          isOpen={isDemoModalOpen}
          onClose={() => setIsDemoModalOpen(false)}
        />
      </div>
    </RoleGuard>
  );
}
