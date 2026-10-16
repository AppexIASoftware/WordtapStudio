"use client";

import React from "react";
import { useAuth } from "@/features/auth/auth-context";
import { InstructorDashboard } from "@/features/dashboard/components/instructor-dashboard";
import { ModeratorDashboard } from "@/features/dashboard/components/moderator-dashboard";
import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard";

export default function DashboardPage() {
  const { currentRole } = useAuth();

  if (currentRole === "moderator") {
    return <ModeratorDashboard />;
  }

  if (currentRole === "admin") {
    return <AdminDashboard />;
  }

  return <InstructorDashboard />;
}
