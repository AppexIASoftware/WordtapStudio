"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

export interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: "emerald" | "purple" | "blue" | "amber" | "orange" | "slate";
  collapsed?: boolean;
  roleTheme?: "admin" | "instructor" | "moderator";
}

const BADGE_STYLES = {
  emerald: "bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/30",
  purple: "bg-purple-500/25 text-purple-300 border border-purple-500/30",
  blue: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  amber: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  orange: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  slate: "bg-card border border-border-default text-slate-subtle",
};

const ACTIVE_THEMES = {
  admin: "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold shadow-sm",
  moderator: "bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold",
  instructor: "bg-emerald-dark/30 text-emerald-brand border border-emerald-brand/30 font-semibold",
};

export function NavItem({
  href,
  label,
  icon: Icon,
  badge,
  badgeColor = "slate",
  collapsed = false,
  roleTheme = "instructor",
}: NavItemProps) {
  const pathname = usePathname();

  const isExactMatch = href === "/teacher" || href === "/moderator" || href === "/admin/dashboard";
  const isActive = isExactMatch ? pathname === href : pathname.startsWith(href);

  const containerClasses = collapsed
    ? "w-full flex items-center justify-center p-2 rounded-xl text-xs transition-all cursor-pointer"
    : "w-full flex items-center justify-between px-2 py-1.5 rounded-xl text-xs transition-all cursor-pointer";

  const stateClasses = isActive
    ? ACTIVE_THEMES[roleTheme]
    : "text-slate-muted hover:bg-card-hover hover:text-slate-100 font-medium";

  return (
    <Link href={href} className={`${containerClasses} ${stateClasses}`} title={label}>
      <div className={`flex items-center ${collapsed ? "justify-center" : "gap-2"}`}>
        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
        {!collapsed && <span className="whitespace-nowrap">{label}</span>}
      </div>

      {!collapsed && badge && (
        <span
          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 ml-1 ${BADGE_STYLES[badgeColor]}`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
