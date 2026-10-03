import React from "react";
import { Shield, RotateCcw, Check, Lock, Minus } from "lucide-react";
import { RbacMatrixState } from "../types";
import { RBAC_MODULES_DATA } from "../data/rbac-data";

interface RbacMatrixConsoleProps {
  rbacState: RbacMatrixState;
  isDirty: boolean;
  matrixStats: {
    totalPerms: number;
    invariantCount: number;
    toggleCount: number;
  };
  isAdmin: boolean;
  onTogglePermission: (
    key: string,
    role: "student" | "instructor" | "moderator" | "admin",
    checked: boolean
  ) => void;
  onResetDefaults: () => void;
}

export function RbacMatrixConsole({
  rbacState,
  isDirty,
  matrixStats,
  isAdmin,
  onTogglePermission,
  onResetDefaults,
}: RbacMatrixConsoleProps) {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield size={16} className="text-emerald-brand" />
            <span>Matriz de Permisos por Rol</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              ADR-30 • Dinámica
            </span>
          </h3>
          <p className="text-xs text-slate-muted mt-0.5">
            Políticas globales de acceso. Las invariantes estructurales de seguridad están fijadas por código (candado inmutable).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border flex items-center gap-1.5 ${
              isDirty
                ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isDirty ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
              }`}
            />
            <span>{isDirty ? "Cambios sin guardar" : "Sincronizado"}</span>
          </span>

          <button
            type="button"
            onClick={onResetDefaults}
            className="px-3 py-1.5 rounded-xl bg-card border border-border-default hover:text-white text-slate-muted text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="Restablecer a valores de seguridad recomendados"
          >
            <RotateCcw size={12} />
            <span>Restablecer</span>
          </button>
        </div>
      </div>

      {/* Barra de leyenda y estadísticas */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border-default text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-bold">
              <Check size={11} strokeWidth={2.5} />
              <Lock size={9} strokeWidth={2} />
            </span>
            <span className="text-[11px] text-slate-300">
              Invariante Estructural (Activo)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/60 text-slate-500 border border-slate-700/50 font-mono text-[10px]">
              <Minus size={10} />
              <Lock size={9} strokeWidth={2} />
            </span>
            <span className="text-[11px] text-slate-400">
              Restricción de Dominio (Denegado)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-6 h-3 bg-emerald-brand rounded-full relative">
              <div className="w-2 h-2 bg-white rounded-full absolute right-0.5 top-0.5" />
            </div>
            <span className="text-[11px] text-slate-300">
              Toggle Configurable por Admin
            </span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-subtle">
          {matrixStats.totalPerms} Permisos Mapeados • {matrixStats.invariantCount} Invariantes • {matrixStats.toggleCount} Toggles
        </div>
      </div>

      {/* Tabla de Matriz */}
      <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-card-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3.5 min-w-[280px]">Módulo / Permiso Granular</th>
                <th className="p-3.5 text-center w-28">Student</th>
                <th className="p-3.5 text-center w-36">Instructor (Docente)</th>
                <th className="p-3.5 text-center w-32">Moderator</th>
                <th className="p-3.5 text-center w-28">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default font-medium">
              {RBAC_MODULES_DATA.map((mod) => (
                <React.Fragment key={mod.moduleId}>
                  <tr className="bg-card-hover/40">
                    <td
                      colSpan={5}
                      className="p-3 bg-canvas/60 border-y border-border-default font-mono text-[11px] font-bold text-slate-300"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                            mod.badgeColor === "blue"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : mod.badgeColor === "emerald"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : mod.badgeColor === "amber"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                              : mod.badgeColor === "teal"
                              ? "bg-teal-500/20 text-teal-300 border-teal-500/30"
                              : mod.badgeColor === "purple"
                              ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                              : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                          }`}
                        >
                          {mod.badge}
                        </span>
                        <span className="text-white font-semibold">
                          {mod.moduleName}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {mod.permissions.map((perm) => {
                    const roles = [
                      "student",
                      "instructor",
                      "moderator",
                      "admin",
                    ] as const;

                    return (
                      <tr
                        key={perm.key}
                        className="hover:bg-card-hover/30 transition-colors"
                      >
                        <td className="p-3.5">
                          <div className="space-y-0.5">
                            <p className="font-bold text-white text-xs">
                              {perm.name}
                            </p>
                            <p className="text-[11px] text-slate-subtle leading-tight">
                              {perm.desc}
                            </p>
                            <span className="text-[10px] font-mono text-slate-500">
                              {perm.key}
                            </span>
                          </div>
                        </td>

                        {roles.map((r) => {
                          const cell = rbacState[perm.key]?.[r];
                          if (!cell) return <td key={r} className="p-3.5" />;

                          if (cell.locked) {
                            return (
                              <td key={r} className="p-3.5 text-center">
                                <div className="flex items-center justify-center">
                                  {cell.val ? (
                                    <span
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] font-bold"
                                      title="Invariante estructural activa"
                                    >
                                      <Check size={12} strokeWidth={2.5} />
                                      <Lock size={10} strokeWidth={2} className="opacity-70" />
                                    </span>
                                  ) : (
                                    <span
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/40 text-slate-500 border border-slate-700/40 font-mono text-[11px]"
                                      title="Restricción de seguridad del dominio"
                                    >
                                      <Minus size={11} />
                                      <Lock size={10} strokeWidth={2} className="opacity-60" />
                                    </span>
                                  )}
                                </div>
                              </td>
                            );
                          }

                          return (
                            <td key={r} className="p-3.5 text-center">
                              <div className="flex items-center justify-center">
                                <label
                                  className={`relative inline-flex items-center ${
                                    isAdmin
                                      ? "cursor-pointer"
                                      : "cursor-not-allowed opacity-60"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={cell.val}
                                    disabled={!isAdmin}
                                    onChange={(e) =>
                                      onTogglePermission(
                                        perm.key,
                                        r,
                                        e.target.checked
                                      )
                                    }
                                    className="sr-only peer"
                                  />
                                  <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-emerald-brand" />
                                </label>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
