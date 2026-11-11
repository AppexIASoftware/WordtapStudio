const SKELETON_ROWS = [0, 1, 2, 3];

/** Mirrors the geometry of a notification row to avoid layout shift. */
export function NotificationListSkeleton() {
  return (
    <div className="divide-y divide-border-default" aria-busy="true" aria-label="Cargando historial">
      {SKELETON_ROWS.map((i) => (
        <div key={i} className="p-4 animate-pulse">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted/70" />
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div className="h-4 w-24 rounded bg-muted ml-auto" />
              <div className="h-3 w-16 rounded bg-muted/70 ml-auto" />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <div className="h-5 w-32 rounded-full bg-muted/70" />
            <div className="h-5 w-16 rounded-full bg-muted/70" />
          </div>
        </div>
      ))}
    </div>
  );
}
