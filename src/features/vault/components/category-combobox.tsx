"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, Check, Plus, X } from "lucide-react";
import { ApiVaultCategory } from "@/services/api";

interface CategoryComboboxProps {
  value?: string;
  categories: ApiVaultCategory[];
  onChange: (categoryId: string) => void;
  onCreateNew?: (initialName?: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CategoryCombobox({
  value,
  categories = [],
  onChange,
  onCreateNew,
  placeholder = "-- Sin categoría temática asignada --",
  className = "",
  disabled = false,
}: CategoryComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Categoría seleccionada actualmente
  const selectedCategory = useMemo(
    () => categories.find((cat) => cat.id === value),
    [categories, value]
  );

  // Filtrado reactivo en memoria
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((cat) => cat.name.toLowerCase().includes(q));
  }, [categories, search]);

  // Si lo que se escribe coincide exactamente con una categoría existente
  const exactMatch = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return categories.some((cat) => cat.name.toLowerCase() === q);
  }, [categories, search]);

  // Cerrar al hacer clic fuera o presionar Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      // Autofocus en el input de búsqueda
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
    setSearch("");
  };

  const handleCreate = () => {
    const query = search.trim();
    onCreateNew?.(query || undefined);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Botón Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-3 py-2 text-xs rounded-xl bg-canvas border border-border-default hover:border-slate-600 focus:border-emerald-brand text-left flex items-center justify-between gap-2 cursor-pointer transition-colors"
      >
        <span className={selectedCategory ? "text-white font-medium truncate" : "text-slate-400 truncate"}>
          {selectedCategory ? selectedCategory.name : value ? "Categoría no disponible" : placeholder}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform duration-150 ${
            isOpen ? "rotate-180 text-emerald-brand" : ""
          }`}
        />
      </button>

      {/* Popover Desplegable */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-2xl bg-card border border-border-default shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Input de Búsqueda */}
          <div className="p-2 border-b border-border-default bg-canvas/60">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar o filtrar categoría..."
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg bg-card border border-border-default text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-brand font-sans"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 p-0.5 rounded text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Lista de Resultados */}
          <div className="max-h-52 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin">
            {/* Opción Sin Categoría */}
            <button
              type="button"
              onClick={() => handleSelect("")}
              className={`w-full px-2.5 py-1.5 text-xs rounded-lg text-left flex items-center justify-between cursor-pointer transition-colors ${
                !value
                  ? "bg-emerald-brand/10 text-emerald-brand font-semibold"
                  : "text-slate-400 hover:bg-canvas hover:text-white"
              }`}
            >
              <span>(Sin categoría temática)</span>
              {!value && <Check className="w-3.5 h-3.5 text-emerald-brand" />}
            </button>

            {/* Categorías Filtradas */}
            {filtered.map((cat) => {
              const isSelected = cat.id === value;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelect(cat.id)}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg text-left flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-emerald-brand/10 text-emerald-brand font-semibold"
                      : "text-white hover:bg-canvas"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-brand flex-shrink-0" />}
                </button>
              );
            })}

            {filtered.length === 0 && (
              <div className="px-3 py-3 text-center text-xs text-slate-500">
                No se encontraron categorías con &quot;{search}&quot;
              </div>
            )}
          </div>

          {/* Footer de Creación Rápida Inline */}
          {onCreateNew && (
            <div className="p-1.5 border-t border-border-default bg-canvas/40">
              <button
                type="button"
                onClick={handleCreate}
                className="w-full px-2.5 py-1.5 rounded-lg bg-emerald-brand/10 hover:bg-emerald-brand/20 border border-emerald-brand/30 text-emerald-brand font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="truncate">
                  {search.trim() && !exactMatch
                    ? `Crear "${search.trim()}"`
                    : "Crear nueva categoría..."}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
