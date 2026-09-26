import Link from "next/link";
import { TEACHER_KPIS } from "../data/mock-teacher-data";

export function TeacherKpiGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {TEACHER_KPIS.map((kpi) => {
        const content = (
          <div
            className={`p-5 rounded-2xl bg-card border transition-all shadow-sm h-full flex flex-col justify-between ${
              kpi.href
                ? "border-border-default hover:border-emerald-brand/50 cursor-pointer group"
                : "border-border-default hover:border-border-subtle"
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-slate-muted text-xs font-medium">
                <span
                  className={
                    kpi.href
                      ? "group-hover:text-emerald-brand font-semibold transition-colors"
                      : ""
                  }
                >
                  {kpi.title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    kpi.badgeVariant === "mint"
                      ? "text-mint-brand bg-mint-brand/10"
                      : "text-emerald-brand bg-emerald-brand/10"
                  }`}
                >
                  {kpi.badgeText}
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-white tabular-nums">
                  {kpi.value}
                </span>
                <span
                  className={`text-xs font-mono ${
                    kpi.badgeVariant === "mint"
                      ? "text-emerald-brand font-medium"
                      : "text-slate-subtle"
                  }`}
                >
                  {kpi.subValue}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-muted">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    kpi.footerDotColor || "bg-emerald-brand"
                  }`}
                />
                <span>{kpi.footerText}</span>
              </div>
              {kpi.actionText && (
                <span className="text-emerald-brand font-bold group-hover:underline">
                  {kpi.actionText}
                </span>
              )}
            </div>
          </div>
        );

        if (kpi.href) {
          return (
            <Link key={kpi.id} href={kpi.href} className="block">
              {content}
            </Link>
          );
        }

        return <div key={kpi.id}>{content}</div>;
      })}
    </div>
  );
}

