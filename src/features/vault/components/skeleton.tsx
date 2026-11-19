"use client";

interface VaultSkeletonProps {
  variant?: "grid" | "list";
  count?: number;
}

export function VaultSkeleton({ variant = "grid", count = 6 }: VaultSkeletonProps) {
  if (variant === "list") {
    return (
      <div className="space-y-2 animate-pulse" aria-busy="true" aria-label="Cargando unidades del catálogo">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-canvas border border-border-default flex items-center justify-between gap-3"
          >
            <div className="space-y-2 flex-1">
              <div className="h-3.5 w-2/5 rounded bg-slate-800" />
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-pulse"
      aria-busy="true"
      aria-label="Cargando unidades del catálogo"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 rounded-2xl bg-card border border-border-default space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 rounded bg-slate-800/80" />
            <div className="h-4 w-10 rounded bg-slate-800" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-slate-800" />
            <div className="h-3 w-1/2 rounded bg-slate-800/70" />
          </div>
          <div className="h-3 w-2/3 rounded bg-slate-800/60" />
        </div>
      ))}
    </div>
  );
}
