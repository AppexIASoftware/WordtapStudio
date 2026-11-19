"use client";

interface GamesSkeletonProps {
  count?: number;
}

export function GamesSkeleton({ count = 6 }: GamesSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse"
      aria-busy="true"
      aria-label="Cargando catálogo de juegos"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 rounded-2xl bg-card border border-border-default space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-slate-800/80" />
            <div className="h-4 w-12 rounded bg-slate-800" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-slate-800" />
            <div className="h-3 w-full rounded bg-slate-800/70" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="h-6 w-16 rounded-lg bg-slate-800/80" />
            <div className="h-6 w-16 rounded-lg bg-slate-800/60" />
          </div>
        </div>
      ))}
    </div>
  );
}
