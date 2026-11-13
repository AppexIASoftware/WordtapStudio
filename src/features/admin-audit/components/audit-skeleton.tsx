"use client";

/** Skeleton loader solo para el cuerpo de tabla al cambiar de tab o filtro. */
export function AuditTableSkeleton() {
  return (
    <div className="rounded-2xl bg-card border border-border-default overflow-hidden animate-pulse">
      <div className="h-10 bg-card-hover/60 border-b border-border-default" />
      <div className="divide-y divide-border-default">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between gap-4">
            <div className="h-4 w-24 rounded bg-slate-800/80" />
            <div className="h-4 w-40 rounded bg-slate-800/70" />
            <div className="h-4 w-28 rounded bg-slate-800/60" />
            <div className="h-4 w-56 rounded bg-slate-800/70" />
            <div className="h-7 w-24 rounded-xl bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton loader inicial para KPIs y tabla de Auditoria. */
export function AuditSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-card border border-border-default space-y-2.5"
          >
            <div className="h-3 w-28 rounded bg-slate-800/80" />
            <div className="h-7 w-20 rounded bg-slate-800" />
            <div className="h-3 w-36 rounded bg-slate-800/60" />
          </div>
        ))}
      </div>

      <AuditTableSkeleton />
    </div>
  );
}
