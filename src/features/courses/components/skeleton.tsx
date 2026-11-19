"use client";

interface CoursesSkeletonProps {
  variant?: "catalog" | "workspace" | "list";
  count?: number;
}

export function CoursesSkeleton({ variant = "catalog", count = 6 }: CoursesSkeletonProps) {
  if (variant === "workspace") {
    return (
      <div
        className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-6 bg-canvas animate-pulse"
        aria-busy="true"
        aria-label="Cargando constructor de cursos"
      >
        <div className="lg:col-span-4 space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-card border border-border-default space-y-2">
              <div className="h-4 w-2/3 rounded bg-slate-800" />
              <div className="h-3 w-1/2 rounded bg-slate-800/70" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-8 p-6 rounded-2xl bg-card border border-border-default space-y-4">
          <div className="h-5 w-1/3 rounded bg-slate-800" />
          <div className="h-24 rounded-xl bg-slate-800/60" />
          <div className="h-24 rounded-xl bg-slate-800/60" />
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-2.5 animate-pulse" aria-busy="true" aria-label="Cargando contenido del curso">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-card border border-border-default flex items-center justify-between gap-3"
          >
            <div className="space-y-2 flex-1">
              <div className="h-4 w-2/5 rounded bg-slate-800" />
              <div className="h-3 w-3/5 rounded bg-slate-800/70" />
            </div>
            <div className="h-7 w-20 rounded-lg bg-slate-800/80 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse"
      aria-busy="true"
      aria-label="Cargando catálogo de cursos"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl bg-card border border-border-default space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 rounded bg-slate-800/80" />
            <div className="h-4 w-14 rounded bg-slate-800" />
          </div>
          <div className="h-5 w-3/4 rounded bg-slate-800" />
          <div className="h-3 w-full rounded bg-slate-800/70" />
          <div className="h-3 w-1/2 rounded bg-slate-800/60" />
        </div>
      ))}
    </div>
  );
}
