"use client";

import { useState, useRef, useEffect } from "react";
import { BookOpen, Check, ChevronDown, Search, X } from "lucide-react";
import { Course } from "@/features/courses/types";

interface CourseSelectorDropdownProps {
  courses: Course[];
  currentCourseId: string;
  isAdmin?: boolean;
  onSelectCourse: (id: string) => void;
  disabled?: boolean;
}

export function CourseSelectorDropdown({
  courses,
  currentCourseId,
  isAdmin = false,
  onSelectCourse,
  disabled = false,
}: CourseSelectorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [includeTeachers, setIncludeTeachers] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCourse = courses.find((c) => c.id === currentCourseId) || courses[0] || null;

  // The admin works on Wordtap platform courses by default. Courses authored by
  // teachers are only listed when the admin asks for them, or when one is the
  // current selection and must stay visible.
  const visibleCourses = !isAdmin || includeTeachers
    ? courses
    : courses.filter((c) => c.ownerType === "platform" || c.id === currentCourseId || c.author === "Wordtap");

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      // Autoenfoque en búsqueda al abrir
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const filteredCourses = visibleCourses.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return c.title.toLowerCase().includes(q) || (c.level && c.level.toLowerCase().includes(q));
  });

  const handleSelect = (id: string) => {
    onSelectCourse(id);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={dropdownRef} className="relative flex-shrink-0">
      {/* Botón Disparador */}
      <button
        type="button"
        disabled={disabled || courses.length === 0}
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-8.5 bg-canvas border border-border-default hover:border-emerald-brand/50 rounded-xl px-3 text-xs text-white font-semibold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group"
      >
        <BookOpen className="w-3.5 h-3.5 text-emerald-brand group-hover:scale-105 transition-transform flex-shrink-0" />
        <span className="max-w-[180px] sm:max-w-[240px] md:max-w-[280px] truncate">
          {selectedCourse ? selectedCourse.title : "Sin cursos disponibles"}
        </span>
        {selectedCourse?.level && (
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-card border border-border-default text-emerald-brand font-bold uppercase">
            {selectedCourse.level}
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-muted transition-transform duration-200 ${
            isOpen ? "rotate-180 text-emerald-brand" : "group-hover:text-white"
          }`}
        />
      </button>

      {/* Menú Desplegable Personalizado */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-80 sm:w-96 bg-card/98 backdrop-blur-xl border border-border-default rounded-2xl shadow-2xl p-2 space-y-2 animate-in fade-in zoom-in-95 duration-150">
          {/* Cabecera / Buscador */}
          {courses.length >= 4 && (
            <div className="relative px-1 pt-1">
              <Search className="w-3.5 h-3.5 text-slate-muted absolute left-3.5 top-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título o nivel..."
                className="w-full pl-8 pr-7 py-1.5 bg-canvas rounded-xl border border-border-default text-xs text-white placeholder:text-slate-muted focus:outline-none focus:border-emerald-brand font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 p-0.5 rounded text-slate-muted hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Lista de Cursos */}
          <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
            {filteredCourses.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-muted font-medium">
                No se encontraron cursos
              </div>
            ) : (
              filteredCourses.map((c) => {
                const isSelected = c.id === currentCourseId;
                const lessonCount = c.lessons?.length ?? 0;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelect(c.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-brand/15 text-white border border-emerald-brand/30 shadow-sm"
                        : "hover:bg-canvas text-slate-300 hover:text-white border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? "bg-emerald-brand text-canvas"
                            : "border border-border-default bg-canvas"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate text-white leading-tight">
                          {c.title}
                        </div>
                        <div className="text-[10px] text-slate-muted flex items-center gap-2 mt-0.5 font-mono">
                          <span>{lessonCount} lecciones</span>
                          {c.author && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[120px]">{c.author}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {c.level && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-canvas border border-border-default text-emerald-brand uppercase">
                          {c.level}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
