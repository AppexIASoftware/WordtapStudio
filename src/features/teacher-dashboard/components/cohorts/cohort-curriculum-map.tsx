"use client";

import { useState, useMemo, useEffect } from "react";
import { Crown, Play, Layers, RotateCcw, BookOpen, Zap, HelpCircle } from "lucide-react";
import { Course } from "../../types";
import { CohortPedagogicalPath, StationNode } from "./cohort-pedagogical-path";
import { CohortStationDetail } from "./cohort-station-detail";
import { CohortRouteComparisonModal } from "./cohort-route-comparison-modal";
import {
  generateCurricularPath,
  generateChallengePath,
  assignCoordinates,
  GAME_NAMES,
} from "./cohort-path-generator";

interface CohortCurriculumMapProps {
  selectedCourses: Course[];
  selectedGameTypes: string[];
  weeklyGoal: number;
  selectedLessonIds?: string[];
}

export function CohortCurriculumMap({
  selectedCourses,
  selectedGameTypes,
  weeklyGoal,
  selectedLessonIds = [],
}: CohortCurriculumMapProps) {
  const [activeCourseIdx, setActiveCourseIdx] = useState(0);
  const [pathMode, setPathMode] = useState<"lessons" | "challenges">("lessons");
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [simulatedCompletedCount, setSimulatedCompletedCount] = useState(0);
  const [customStations, setCustomStations] = useState<StationNode[]>([]);

  const currentCourse = selectedCourses[activeCourseIdx] || selectedCourses[0];

  // Generador de ruta según modo pedagógico elegido (Lecciones vs. Desafíos)
  const defaultStations = useMemo(() => {
    if (!currentCourse) return [];
    if (pathMode === "lessons") {
      return generateCurricularPath(
        currentCourse,
        selectedLessonIds,
        selectedGameTypes,
        weeklyGoal
      );
    }
    return generateChallengePath(
      currentCourse,
      selectedLessonIds,
      selectedGameTypes,
      weeklyGoal
    );
  }, [currentCourse, pathMode, selectedLessonIds, selectedGameTypes, weeklyGoal]);

  // Sincronizar ruta al cambiar de curso o de modo de ruta
  useEffect(() => {
    setCustomStations(defaultStations);
    setSelectedStationId(defaultStations[0]?.id || null);
  }, [defaultStations]);

  const stations = customStations.length > 0 ? customStations : defaultStations;

  // Generar curva conector SVG incondicionalmente
  const svgPathD = useMemo(() => {
    if (stations.length < 2) return "";
    let d = `M ${stations[0].x} ${stations[0].y}`;
    for (let i = 0; i < stations.length - 1; i++) {
      const p1 = stations[i];
      const p2 = stations[i + 1];
      const dy = p2.y - p1.y;
      d += ` C ${p1.x} ${p1.y + dy * 0.5}, ${p2.x} ${p2.y - dy * 0.5}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [stations]);

  if (selectedCourses.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-card border border-border-default text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">Ruta de Aprendizaje Vacía</h4>
        <p className="text-xs text-slate-muted max-w-md mx-auto">
          Selecciona al menos un curso temático en la pestaña anterior para visualizar y personalizar la ruta didáctica interactiva.
        </p>
      </div>
    );
  }

  // Acciones de Personalización de Estaciones
  const handleUpdateStation = (updates: Partial<StationNode>) => {
    if (!selectedStationId) return;
    setCustomStations((prev) =>
      prev.map((s) => (s.id === selectedStationId ? { ...s, ...updates } : s))
    );
  };

  const handleMoveStation = (idx: number, delta: number) => {
    const targetIdx = idx + delta;
    if (targetIdx < 0 || targetIdx >= stations.length) return;
    const updated = [...stations];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    setCustomStations(assignCoordinates(updated));
  };

  const handleDeleteStation = (id: string) => {
    if (stations.length <= 3) return;
    const delIdx = stations.findIndex((s) => s.id === id);
    const filtered = stations.filter((s) => s.id !== id);

    const nextSelectedIdx = delIdx < filtered.length ? delIdx : delIdx - 1;
    const nextSelectedId = filtered[Math.max(0, nextSelectedIdx)]?.id || null;

    setCustomStations(assignCoordinates(filtered));
    setSelectedStationId(nextSelectedId);
  };

  const handleAddStation = () => {
    const selectedIdx = stations.findIndex((s) => s.id === selectedStationId);
    let insertIdx = stations.length - 1;
    if (selectedIdx >= 0) {
      if (selectedIdx >= stations.length - 1) {
        insertIdx = stations.length - 1;
      } else {
        insertIdx = selectedIdx + 1;
      }
    }

    const newStation: Omit<StationNode, "x" | "y" | "order"> = {
      id: `st-custom-${Date.now()}`,
      type: "game",
      title: "Estación de Refuerzo Extra",
      subtitle: "Actividad práctica personalizada por el docente",
      category: "Minijuego de Práctica",
      duration: "60 seg",
      xp: 20,
      gameKey: selectedGameTypes[0] || "memory",
    };
    const updated = [...stations];
    updated.splice(insertIdx, 0, newStation as StationNode);
    setCustomStations(assignCoordinates(updated));
    setSelectedStationId(newStation.id);
  };

  const handleReset = () => {
    setCustomStations(defaultStations);
    setSelectedStationId(defaultStations[0]?.id || null);
  };

  const activeIdx = stations.findIndex((s) => s.id === selectedStationId);
  const activeStation =
    stations.find((s) => s.id === selectedStationId) ||
    stations[0];

  const totalHeight = 60 + stations.length * 115;

  return (
    <div className="p-6 rounded-2xl bg-card border border-border-default space-y-6 shadow-sm">
      {/* Encabezado Principal y Selector Dual de Rutas */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-default pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-brand/20 text-emerald-brand flex items-center justify-center font-mono text-[11px] font-bold">
              2
            </span>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Mapa de Progresión Pedagógica</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/30">
                {pathMode === "lessons" ? "Modalidad Curricular" : "Modalidad Gamificada"}
              </span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-muted mt-0.5">
            Elige la estructura didáctica para tu cohorte y personaliza cada parada según tus objetivos.
          </p>
        </div>

        {/* Conmutador de Rutas Pedagógicas (2 Rutas) y Ayuda Didáctica */}
        <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-canvas rounded-xl border border-border-default">
            <button
              type="button"
              onClick={() => setPathMode("lessons")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                pathMode === "lessons"
                  ? "bg-emerald-brand text-canvas shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ruta por Lecciones</span>
            </button>
            <button
              type="button"
              onClick={() => setPathMode("challenges")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                pathMode === "challenges"
                  ? "bg-amber-400 text-canvas shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Ruta por Desafíos</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsComparisonOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand/50 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Comparar las diferencias pedagógicas entre ambas rutas"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-brand" />
            <span>¿Cuál elegir?</span>
          </button>
        </div>
      </div>

      {/* Pestañas de Cursos si hay múltiples cursos asignados */}
      {selectedCourses.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {selectedCourses.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveCourseIdx(i);
                setSelectedStationId(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCourseIdx === i
                  ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                  : "bg-canvas border border-border-default text-slate-400 hover:text-white"
              }`}
            >
              Curso {i + 1}: {c.title.split(" ")[0]}
            </button>
          ))}
        </div>
      )}

      {/* Banner de Unidad Temática y Acciones de la Ruta */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-600/20 via-teal-600/10 to-card border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-canvas flex items-center justify-center font-bold shadow-md shrink-0">
            <Crown className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
              {currentCourse.level} • {pathMode === "lessons" ? "Plan Curricular" : "Plan Gamificado"}
            </span>
            <h4 className="text-sm font-bold text-white truncate max-w-sm">
              {currentCourse.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded-lg bg-canvas border border-border-default text-slate-400 hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Restablecer estaciones a la plantilla por defecto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
          <button
            type="button"
            onClick={() =>
              setSimulatedCompletedCount((prev) => (prev >= stations.length - 1 ? 0 : prev + 1))
            }
            className="px-3 py-1.5 rounded-lg bg-canvas border border-border-default hover:border-emerald-brand text-[11px] font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3 h-3 text-emerald-brand" />
            <span>Simular Progreso ({simulatedCompletedCount}/{stations.length})</span>
          </button>
        </div>
      </div>

      {/* Grid Panorámico: Trayectoria Curva (50%) + Inspector Didáctico (50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <CohortPedagogicalPath
          stations={stations}
          svgPathD={svgPathD}
          activeStationId={activeStation.id}
          simulatedCompletedCount={simulatedCompletedCount}
          totalHeight={totalHeight}
          onSelectStation={setSelectedStationId}
        />

        <CohortStationDetail
          station={activeStation}
          totalStations={stations.length}
          weeklyGoal={weeklyGoal}
          gameNames={GAME_NAMES}
          canMoveUp={activeIdx > 0 && activeStation.type !== "milestone"}
          canMoveDown={activeIdx < stations.length - 2 && activeStation.type !== "milestone"}
          canDelete={stations.length > 3 && activeStation.type !== "milestone"}
          onMoveUp={() => handleMoveStation(activeIdx, -1)}
          onMoveDown={() => handleMoveStation(activeIdx, 1)}
          onDelete={() => handleDeleteStation(activeStation.id)}
          onUpdate={handleUpdateStation}
          onAddAfter={handleAddStation}
        />
      </div>

      {/* Modal Comparativo de Rutas Pedagógicas */}
      <CohortRouteComparisonModal
        isOpen={isComparisonOpen}
        activeMode={pathMode}
        onSelectMode={setPathMode}
        onClose={() => setIsComparisonOpen(false)}
      />
    </div>
  );
}
