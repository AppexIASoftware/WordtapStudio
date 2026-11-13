"use client";

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-card border border-border-default space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-32 rounded bg-slate-200/15" />
              <div className="w-8 h-8 rounded-xl bg-slate-200/15" />
            </div>
            <div className="h-7 w-24 rounded bg-slate-200/15" />
            <div className="h-3 w-40 rounded bg-slate-200/10" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border-default space-y-5">
          <div className="flex items-center justify-between">
            <div className="h-4 w-64 rounded bg-slate-200/15" />
            <div className="h-3.5 w-28 rounded bg-slate-200/15" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="p-3.5 bg-canvas rounded-xl border border-border-default space-y-2"
              >
                <div className="h-3 w-20 mx-auto rounded bg-slate-200/10" />
                <div className="h-6 w-12 mx-auto rounded bg-slate-200/15" />
                <div className="h-2.5 w-16 mx-auto rounded bg-slate-200/10" />
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border-default/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-canvas border border-border-default space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-32 rounded bg-slate-200/15" />
                <div className="h-3 w-14 rounded bg-slate-200/10" />
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200/15" />
              <div className="flex items-center justify-between">
                <div className="h-2.5 w-16 rounded bg-slate-200/10" />
                <div className="h-2.5 w-14 rounded bg-slate-200/10" />
                <div className="h-2.5 w-16 rounded bg-slate-200/10" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-canvas border border-border-default space-y-2.5">
              <div className="h-3.5 w-28 rounded bg-slate-200/15" />
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    className="h-7 rounded-lg bg-card border border-border-default"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border-default space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-44 rounded bg-slate-200/15" />
            <div className="h-3.5 w-14 rounded bg-slate-200/15" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-canvas border border-border-default space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="h-2.5 w-28 rounded bg-slate-200/10" />
                  <div className="h-2.5 w-12 rounded bg-slate-200/10" />
                </div>
                <div className="h-3 w-full rounded bg-slate-200/15" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
