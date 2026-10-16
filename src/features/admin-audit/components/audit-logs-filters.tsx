"use client";

import { Search } from "lucide-react";
import { AuditCategory } from "../types";

interface AuditLogsFiltersProps {
  selectedCat: AuditCategory;
  onCategoryChange: (cat: AuditCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

/** Pills de categoria y buscador de la bitacora. */
export function AuditLogsFilters({ selectedCat, onCategoryChange, searchQuery, onSearchChange }: AuditLogsFiltersProps) {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border-default space-y-3 shadow-card-soft">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`px-3 py-1 rounded-xl cursor-pointer font-bold border transition-colors ${
              selectedCat === "all"
                ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                : "bg-canvas text-slate-muted hover:text-white border-border-default"
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => onCategoryChange("review")}
            className={`px-3 py-1 rounded-xl cursor-pointer font-bold border transition-colors ${
              selectedCat === "review"
                ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                : "bg-canvas text-slate-muted hover:text-white border-border-default"
            }`}
          >
            Moderación
          </button>
          <button
            type="button"
            onClick={() => onCategoryChange("staff")}
            className={`px-3 py-1 rounded-xl cursor-pointer font-bold border transition-colors ${
              selectedCat === "staff"
                ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                : "bg-canvas text-slate-muted hover:text-white border-border-default"
            }`}
          >
            Personal & Roles
          </button>
          <button
            type="button"
            onClick={() => onCategoryChange("admob")}
            className={`px-3 py-1 rounded-xl cursor-pointer font-bold border transition-colors ${
              selectedCat === "admob"
                ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                : "bg-canvas text-slate-muted hover:text-white border-border-default"
            }`}
          >
            Monetización & AdMob
          </button>
          <button
            type="button"
            onClick={() => onCategoryChange("vault")}
            className={`px-3 py-1 rounded-xl cursor-pointer font-bold border transition-colors ${
              selectedCat === "vault"
                ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                : "bg-canvas text-slate-muted hover:text-white border-border-default"
            }`}
          >
            Content Vault
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Buscar por actor, email o IP..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-canvas border border-border-default rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
            <Search
              size={13}
              className="absolute left-2.5 top-2 text-slate-subtle"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
