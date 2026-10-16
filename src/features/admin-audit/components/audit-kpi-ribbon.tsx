"use client";



/** Los 4 indicadores ejecutivos de la bitacora. */
export function AuditKpiRibbon() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1 shadow-card-soft">
        <span className="text-[10px] font-mono uppercase text-slate-subtle">
          Eventos Registrados Hoy
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white font-mono">142</span>
          <span className="text-xs text-purple-400 font-mono">100% Inmutables</span>
        </div>
        <p className="text-[10px] text-slate-muted">Trazabilidad completa con IP</p>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-amber-500/30 space-y-1 shadow-card-soft">
        <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
          Incidencias de Alumnos
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-400 font-mono">3</span>
          <span className="text-xs text-slate-subtle font-mono">Pendientes</span>
        </div>
        <p className="text-[10px] text-slate-muted">2 en revisión • 1 resuelta hoy</p>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1 shadow-card-soft">
        <span className="text-[10px] font-mono uppercase text-slate-subtle">
          Acciones de Moderación
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-brand font-mono">28</span>
          <span className="text-xs text-emerald-brand font-mono">Aprobaciones</span>
        </div>
        <p className="text-[10px] text-slate-muted">Este mes en catálogo móvil</p>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border-default space-y-1 shadow-card-soft">
        <span className="text-[10px] font-mono uppercase text-slate-subtle">
          IPs Distintas Auditadas
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white font-mono">6</span>
          <span className="text-xs text-mint-brand font-mono">Sesiones Seguras</span>
        </div>
        <p className="text-[10px] text-slate-muted">Cero intentos no autorizados</p>
      </div>
    </div>
  );
}
