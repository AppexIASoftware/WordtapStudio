interface PageShellSkeletonProps {
  fullScreen?: boolean;
}

export function PageShellSkeleton({ fullScreen = false }: PageShellSkeletonProps) {
  return (
    <div
      className={`${fullScreen ? "min-h-screen w-full p-6 md:p-8" : "p-6 md:p-8"} max-w-7xl mx-auto space-y-6 animate-pulse`}
      aria-busy="true"
      aria-label="Cargando contenido"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-lg bg-slate-800" />
          <div className="h-4 w-80 max-w-full rounded bg-slate-800/70" />
        </div>
        <div className="h-9 w-36 rounded-xl bg-slate-800/80 shrink-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
            <div className="h-4 w-24 rounded bg-slate-800/80" />
            <div className="h-7 w-16 rounded bg-slate-800" />
            <div className="h-3 w-40 rounded bg-slate-800/60" />
          </div>
        ))}
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-12 rounded-xl bg-slate-800/60" />
        ))}
      </div>
    </div>
  );
}
