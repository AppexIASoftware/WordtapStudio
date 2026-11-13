const CARD_PLACEHOLDERS = [0, 1, 2];
const STUMBLE_PLACEHOLDERS = [0, 1];
const STUDENT_ROW_PLACEHOLDERS = [0, 1, 2, 3];

/** Mirrors the geometry of the cohorts grid, diagnostic banner, and student table to prevent layout shift. */
export function CohortsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Cargando aulas y estudiantes">
      {/* Classroom cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CARD_PLACEHOLDERS.map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-card border border-border-default shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-24 rounded bg-muted" />
              <div className="h-3 w-16 rounded bg-muted/60" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted/60" />
            </div>
            <div className="p-3 rounded-xl border border-border-default bg-background/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="h-3 w-28 rounded bg-muted/60" />
                <div className="h-4 w-20 rounded bg-muted" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-8 rounded-lg bg-muted/70" />
                <div className="h-8 rounded-lg bg-muted/70" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 rounded bg-muted/60" />
              <div className="flex gap-2">
                <div className="h-3 w-12 rounded bg-muted/60" />
                <div className="h-3 w-12 rounded bg-muted/60" />
              </div>
            </div>
            <div className="pt-3 border-t border-border-default flex items-center justify-between">
              <div className="h-3 w-32 rounded bg-muted/60" />
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-muted/70" />
                <div className="h-7 w-24 rounded-lg bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Diagnostic banner */}
      <div className="p-5 rounded-2xl bg-card border border-border-default shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-muted shrink-0" />
            <div className="space-y-1.5">
              <div className="h-4 w-64 rounded bg-muted" />
              <div className="h-3 w-80 max-w-full rounded bg-muted/60" />
            </div>
          </div>
          <div className="h-9 w-48 rounded-xl bg-muted/80" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {STUMBLE_PLACEHOLDERS.map((i) => (
            <div key={i} className="p-3.5 rounded-xl border border-border-default space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-4 w-16 rounded bg-muted/70" />
              </div>
              <div className="h-3 w-3/4 rounded bg-muted/60" />
            </div>
          ))}
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-border-default pb-2">
        <div className="h-9 w-48 rounded-xl bg-muted" />
        <div className="h-9 w-40 rounded-xl bg-muted/70" />
        <div className="h-9 w-44 rounded-xl bg-muted/70" />
      </div>

      {/* Students table */}
      <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border-default flex flex-wrap items-center justify-between gap-3">
          <div className="h-4 w-56 rounded bg-muted" />
          <div className="flex flex-wrap gap-2">
            <div className="h-7 w-16 rounded-lg bg-muted" />
            <div className="h-7 w-28 rounded-lg bg-muted/60" />
            <div className="h-7 w-24 rounded-lg bg-muted/60" />
            <div className="h-7 w-24 rounded-lg bg-muted/60" />
          </div>
        </div>
        <div className="p-4 border-b border-border-default flex items-center justify-between gap-3">
          <div className="h-9 w-full max-w-sm rounded-xl bg-muted/70" />
          <div className="h-3 w-32 rounded bg-muted/60 hidden sm:block" />
        </div>
        <div className="divide-y divide-border-default">
          {STUDENT_ROW_PLACEHOLDERS.map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 rounded bg-muted" />
                  <div className="h-3 w-40 rounded bg-muted/60" />
                </div>
              </div>
              <div className="h-6 w-20 rounded bg-muted/70 hidden sm:block" />
              <div className="h-3.5 w-24 rounded bg-muted/60 hidden md:block" />
              <div className="h-2.5 w-24 rounded-full bg-muted/70 hidden md:block" />
              <div className="h-6 w-24 rounded-lg bg-muted/70 hidden lg:block" />
              <div className="h-3.5 w-12 rounded bg-muted/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
