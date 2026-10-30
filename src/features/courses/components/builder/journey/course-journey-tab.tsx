"use client";

import React, { useState, useMemo, useEffect } from "react";
import { BookOpen, Gamepad2, Award, Sparkles, MapPin } from "lucide-react";
import { Course, Lesson } from "@/features/courses/types";
import { getLessonGamesApi, LessonGameDTO } from "@/services/api";
import { CourseJourneyNode, JOURNEY_NODE_TYPE } from "./journey-types";
import {
  generateCourseJourneyNodes,
  generateJourneySvgPath,
  JOURNEY_Y_GAP,
  lessonGamesMemoryCache,
} from "./journey-generator";
import { JourneyPath } from "./journey-path";
import { JourneyNodeInspector } from "./journey-node-inspector";

interface CourseJourneyTabProps {
  course: Course;
  onSelectLesson: (lessonId: string) => void;
  onNavigateToCards: (lessonId: string) => void;
  onNavigateToGames: (lessonId: string) => void;
  onSpeak: (text: string) => void;
}

export function CourseJourneyTab({
  course,
  onSelectLesson,
  onNavigateToCards,
  onNavigateToGames,
  onSpeak,
}: CourseJourneyTabProps) {
  const lessonIdsKey = useMemo(
    () => (course.lessons || []).map((l) => l.id).join(","),
    [course.lessons]
  );

  // Inicialización síncrona desde caché en memoria para respuesta instantánea (0ms)
  const [gamesByLesson, setGamesByLesson] = useState<Record<string, LessonGameDTO[]>>(() => {
    const initial: Record<string, LessonGameDTO[]> = {};
    (course.lessons || []).forEach((l) => {
      if (lessonGamesMemoryCache.has(l.id)) {
        initial[l.id] = lessonGamesMemoryCache.get(l.id)!;
      }
    });
    return initial;
  });
  const [isLoadingGames, setIsLoadingGames] = useState(false);

  // Cargar o revalidar minijuegos reales de las lecciones del curso
  useEffect(() => {
    let isMounted = true;
    const lessons = course.lessons || [];
    if (lessons.length === 0) {
      setGamesByLesson({});
      setIsLoadingGames(false);
      return;
    }

    const missing = lessons.filter((l) => !lessonGamesMemoryCache.has(l.id));
    if (missing.length === 0) {
      // Todo disponible en caché: sincronizar de inmediato sin latencia
      const cachedMap: Record<string, LessonGameDTO[]> = {};
      lessons.forEach((l) => {
        cachedMap[l.id] = lessonGamesMemoryCache.get(l.id) || [];
      });
      setGamesByLesson(cachedMap);
      setIsLoadingGames(false);
      return;
    }

    setIsLoadingGames(true);
    const timeout = setTimeout(() => {
      if (isMounted) setIsLoadingGames(false);
    }, 2500);

    Promise.all(
      lessons.map(async (lesson) => {
        if (lessonGamesMemoryCache.has(lesson.id)) {
          return { lessonId: lesson.id, games: lessonGamesMemoryCache.get(lesson.id)! };
        }
        try {
          const res = await getLessonGamesApi(lesson.id);
          const games = res.data || [];
          lessonGamesMemoryCache.set(lesson.id, games);
          return { lessonId: lesson.id, games };
        } catch {
          lessonGamesMemoryCache.set(lesson.id, []);
          return { lessonId: lesson.id, games: [] };
        }
      })
    )
      .then((results) => {
        if (!isMounted) return;
        const map: Record<string, LessonGameDTO[]> = {};
        results.forEach((r) => {
          map[r.lessonId] = r.games;
        });
        setGamesByLesson(map);
      })
      .finally(() => {
        clearTimeout(timeout);
        if (isMounted) {
          setIsLoadingGames(false);
        }
      });

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [course.id, lessonIdsKey]);

  const nodes = useMemo(
    () => generateCourseJourneyNodes(course, gamesByLesson),
    [course, gamesByLesson]
  );
  const svgPathD = useMemo(() => generateJourneySvgPath(nodes), [nodes]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (nodes.length > 0 && !selectedNodeId) {
      setSelectedNodeId(nodes[0].id);
    }
  }, [nodes, selectedNodeId]);

  const activeNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || nodes[0] || null;
  }, [nodes, selectedNodeId]);

  const activeLesson: Lesson | null = useMemo(() => {
    if (!activeNode) return null;
    return (course.lessons || []).find((l) => l.id === activeNode.lessonId) || null;
  }, [course.lessons, activeNode]);

  const totalLessons = course.lessons?.length || 0;
  const totalWords = (course.lessons || []).reduce(
    (acc, l) => acc + (l.items?.length || 0),
    0
  );
  // Total real de minijuegos calculados dinámicamente según la ruta
  const totalGames = useMemo(
    () => nodes.filter((n) => n.type === JOURNEY_NODE_TYPE.GAME).length,
    [nodes]
  );

  if (totalLessons === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-canvas">
        <div className="max-w-md w-full bg-card border border-border-default rounded-3xl p-8 space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-brand/10 border border-emerald-brand/30 flex items-center justify-center text-emerald-brand mx-auto">
            <MapPin className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">Ruta del Estudiante no disponible</h3>
          <p className="text-xs text-slate-muted">
            Este curso todavía no contiene lecciones estructuradas. Agrega tu primera lección en el panel lateral para visualizar la ruta pedagógica.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-5 space-y-4 overflow-y-auto">
      {/* Banner Superior de Resumen Didáctico */}
      <div className="p-4 rounded-2xl bg-card border border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/20 uppercase">
              Mapa de Ruta del Estudiante
            </span>
            <span className="text-[11px] font-mono text-slate-muted">
              Nivel {course.level}
            </span>
          </div>
          <h2 className="text-base font-bold text-white mt-1">{course.title}</h2>
          <p className="text-xs text-slate-muted">
            Secuencia interactiva tal como la experimentará el estudiante en la app móvil.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default flex items-center gap-1.5 text-slate-200">
            <BookOpen className="w-3.5 h-3.5 text-emerald-brand" />
            <span>{totalLessons} lecciones</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default flex items-center gap-1.5 text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalWords} tarjetas</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default flex items-center gap-1.5 text-slate-200">
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            <span>{totalGames} {totalGames === 1 ? "juego" : "juegos"}</span>
          </div>
        </div>
      </div>

      {/* Grid: Trayectoria Curva Compacta (5 cols) + Inspector Didáctico Cómodo (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-5 flex justify-center">
          <JourneyPath
            nodes={nodes}
            svgPathD={svgPathD}
            activeNodeId={activeNode?.id || null}
            onSelectNode={(node) => {
              setSelectedNodeId(node.id);
              if (node.lessonId) {
                onSelectLesson(node.lessonId);
              }
            }}
          />
        </div>

        <div className="lg:col-span-7">
          <JourneyNodeInspector
            node={activeNode}
            lesson={activeLesson}
            onEditLessonCards={onNavigateToCards}
            onEditLessonGames={onNavigateToGames}
            onSpeak={onSpeak}
          />
        </div>
      </div>
    </div>
  );
}
