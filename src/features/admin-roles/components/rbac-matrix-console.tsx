"use client";

import React, { useMemo, useState } from "react";
import { Shield, RotateCcw, Check, Lock, Minus, Search, ChevronDown } from "lucide-react";
import { RbacMatrixState, RbacModule } from "../types";
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

const BADGE_STYLES: Record<RbacModule["badgeColor"], string> = {
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  teal: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  indigo: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
};

const ROLES_ORDER = ["student", "instructor", "moderator", "admin"] as const;

export function RbacMatrixConsole({
  rbacState,
  isDirty,
  matrixStats,
  isAdmin,
  onTogglePermission,
  onResetDefaults,
}: RbacMatrixConsoleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

  const filteredModules = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return RBAC_MODULES_DATA;
    return RBAC_MODULES_DATA.map((mod) => ({
      ...mod,
      permissions: mod.permissions.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.desc.toLowerCase().includes(query) ||
          mod.moduleName.toLowerCase().includes(query)
      ),
    })).filter((mod) => mod.permissions.length > 0);
  }, [searchTerm]);

  const toggleModule = (moduleId: string) => {
    setCollapsedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield size={16} className="text-emerald-brand" />
            <span>Matriz de Permisos por Rol</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Políticas del Ecosistema
            </span>
          </h3>
          <p className="text-xs text-slate-muted mt-0.5">
            Mapa real de capacidades por rol. Los permisos con candado están protegidos por reglas de seguridad del sistema.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border flex items-center gap-1.5 ${
              isDirty
                ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                : "bg-slate-800/60 text-slate-300 border-border-default"
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
            disabled={!isAdmin}
            className="px-3 py-1.5 rounded-xl bg-card border border-border-default hover:text-white text-slate-muted text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Restablecer a valores recomendados"
          >
            <RotateCcw size={12} />
            <span>Restablecer</span>
          </button>
        </div>
      </div>

      {/* Buscador, leyenda y estadísticas */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border-default text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-bold">
              <Check size={11} strokeWidth={2.5} />
              <Lock size={9} strokeWidth={2} />
            </span>
            <span className="text-[11px]">Permitido fijo</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/60 text-slate-500 border border-slate-700/50 font-mono text-[10px]">
              <Minus size={10} />
              <Lock size={9} strokeWidth={2} />
            </span>
            <span className="text-[11px] text-slate-400">Restringido</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-6 h-3 bg-emerald-brand rounded-full relative">
              <div className="w-2 h-2 bg-white rounded-full absolute right-0.5 top-0.5" />
            </div>
            <span className="text-[11px]">Configurable</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar permiso o módulo..."
              className="pl-8 pr-3 py-1.5 bg-canvas border border-border-default rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-brand w-52"
            />
          </div>
          <span className="text-[11px] font-mono text-slate-subtle">
            {matrixStats.totalPerms} permisos • {matrixStats.toggleCount} configurables
          </span>
        </div>
      </div>

      {/* Tabla con cabecera sticky */}
      <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-card-soft">
        <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-card-hover text-slate-subtle border-b border-border-default font-mono uppercase text-[10px] backdrop-blur-md">
              <tr>
                <th className="p-3.5 min-w-[280px]">Módulo / Permiso</th>
                <th className="p-3.5 text-center w-28">Estudiante</th>
                <th className="p-3.5 text-center w-32">Docente</th>
                <th className="p-3.5 text-center w-32">Moderador</th>
                <th className="p-3.5 text-center w-28">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default font-medium">
              {filteredModules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-muted">
                    No se encontraron permisos que coincidan con &ldquo;{searchTerm}&rdquo;.
                  </td>
                </tr>
              ) : (
                filteredModules.map((mod) => {
                  const isCollapsed = Boolean(collapsedModules[mod.moduleId]) && !searchTerm.trim();
                  return (
                    <React.Fragment key={mod.moduleId}>
                      <tr className="bg-card-hover/40">
                        <td
                          colSpan={5}
                          className="p-0 bg-canvas/70 border-y border-border-default"
                        >
                          <button
                            type="button"
                            onClick={() => toggleModule(mod.moduleId)}
                            className="w-full p-3 flex items-center justify-between text-left cursor-pointer hover:bg-card-hover/40 transition-colors"
                          >
                            <div className="flex items-center gap-2 font-mono text-[11px] font-bold">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                                  BADGE_STYLES[mod.badgeColor]
                                }`}
                              >
                                {mod.badge}
                              </span>
                              <span className="text-white font-semibold">{mod.moduleName}</span>
                              <span className="text-[10px] text-slate-500">
                                ({mod.permissions.length})
                              </span>
                            </div>
                            <ChevronDown
                              size={14}
                              className={`text-slate-400 transition-transform ${
                                isCollapsed ? "-rotate-90" : ""
                              }`}
                            />
                          </button>
                        </td>
                      </tr>

                      {!isCollapsed &&
                        mod.permissions.map((perm) => (
                          <tr
                            key={perm.key}
                            className="hover:bg-card-hover/30 transition-colors"
                          >
                            <td className="p-3.5">
                              <div className="space-y-0.5">
                                <p className="font-bold text-white text-xs">{perm.name}</p>
                                <p className="text-[11px] text-slate-subtle leading-tight">
                                  {perm.desc}
                                </p>
                              </div>
                            </td>

                            {ROLES_ORDER.map((r) => {
                              const cell = rbacState[perm.key]?.[r];
                              if (!cell) return <td key={r} className="p-3.5" />;

                              if (cell.locked) {
                                return (
                                  <td key={r} className="p-3.5 text-center">
                                    <div className="flex items-center justify-center">
                                      {cell.val ? (
                                        <span
                                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] font-bold"
                                          title="Permitido por regla del sistema"
                                        >
                                          <Check size={12} strokeWidth={2.5} />
                                          <Lock size={10} strokeWidth={2} className="opacity-70" />
                                        </span>
                                      ) : (
                                        <span
                                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/40 text-slate-500 border border-slate-700/40 font-mono text-[11px]"
                                          title="Restringido por seguridad"
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
                                          onTogglePermission(perm.key, r, e.target.checked)
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
                        ))}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
