import { Course } from "../../types";
import { StationNode } from "./cohort-pedagogical-path";

export const GAME_NAMES: Record<string, string> = {
  listening: "Listening Lab",
  memory: "Memorama Fonético",
  word_scramble: "Descifrar Palabras",
  match: "WordMatch Express",
  speed_translation: "Traducción Rápida",
  multiple_choice: "Quiz de Reto",
};

const X_OFFSETS = [180, 105, 90, 150, 230, 270, 220];

export function assignCoordinates(
  items: Omit<StationNode, "x" | "y" | "order">[]
): StationNode[] {
  const total = items.length;
  return items.map((item, idx) => ({
    ...item,
    order: idx + 1,
    x: idx === total - 1 ? 180 : X_OFFSETS[idx % X_OFFSETS.length],
    y: 50 + idx * 115,
  }));
}

/**
 * Genera la Ruta 1: Curricular (Por Lecciones)
 * Mapea 1:1 las lecciones seleccionadas por el docente y sus juegos de fijación.
 */
export function generateCurricularPath(
  course: Course,
  selectedLessonIds: string[],
  selectedGameTypes: string[],
  weeklyGoal: number
): StationNode[] {
  const games = selectedGameTypes.length > 0 ? selectedGameTypes : ["match", "memory"];
  const allLessons = course.lessons && course.lessons.length > 0 ? course.lessons : [];

  // Filtrar solo las lecciones que el docente activó
  const activeLessons =
    selectedLessonIds.length > 0
      ? allLessons.filter((l) => selectedLessonIds.includes(l.id))
      : allLessons;

  const effectiveLessons =
    activeLessons.length > 0
      ? activeLessons
      : [{ id: "l-def", title: course.title, subtitle: "Módulo Inicial", items: [] }];

  const raw: Omit<StationNode, "x" | "y" | "order">[] = [];

  effectiveLessons.forEach((lesson, idx) => {
    const words = lesson.items?.map((it) => it.en).filter(Boolean) || [];
    const gameKey = games[idx % games.length] || "match";

    // Nodo 1: Lección Teórica / Conceptual
    raw.push({
      id: `lesson-node-${lesson.id || idx}`,
      type: "lesson",
      title: lesson.title,
      subtitle:
        words.length > 0
          ? `Vocabulario: ${words.slice(0, 4).join(", ")}`
          : "Comprensión conceptual y reconocimiento sonoro",
      category: "Lección Curricular",
      duration: "15 min",
      xp: 25,
    });

    // Nodo 2: Minijuego de Fijación de esa lección
    raw.push({
      id: `game-node-${lesson.id || idx}`,
      type: "game",
      title: `${GAME_NAMES[gameKey]} • L${idx + 1}`,
      subtitle:
        words.length > 0
          ? `Práctica de: ${words.slice(0, 3).join(", ")}`
          : "Fijación interactiva del contenido",
      category: "Minijuego de Fijación",
      duration: "60 seg",
      xp: 20,
      gameKey,
    });
  });

  // Hito de Refuerzo Adaptativo y Cofre Semanal
  raw.push({
    id: "speed-checkpoint",
    type: "speed",
    title: "Checkpoint de Repaso Adaptativo",
    subtitle: "Refuerzo inteligente enfocado en los tropiezos de la cohorte",
    category: "Refuerzo Guiado",
    duration: "5 min",
    xp: 35,
  });

  raw.push({
    id: "milestone-chest",
    type: "milestone",
    title: "Cofre de la Meta Semanal",
    subtitle: `Acredita ${weeklyGoal} palabras aprendidas por alumno`,
    category: "Hito Pedagógico",
    duration: "Acreditación",
    xp: 100,
  });

  return assignCoordinates(raw);
}

/**
 * Genera la Ruta 2: Gamificada (Por Desafíos)
 * Descompone las palabras de todas las lecciones en retos ágiles de alta frecuencia.
 */
export function generateChallengePath(
  course: Course,
  selectedLessonIds: string[],
  selectedGameTypes: string[],
  weeklyGoal: number
): StationNode[] {
  const games = selectedGameTypes.length > 0 ? selectedGameTypes : ["match", "memory", "speed_translation"];
  const allLessons = course.lessons && course.lessons.length > 0 ? course.lessons : [];
  const activeLessons =
    selectedLessonIds.length > 0
      ? allLessons.filter((l) => selectedLessonIds.includes(l.id))
      : allLessons;

  const allWords = activeLessons.flatMap((l) => l.items?.map((it) => it.en) || []).filter(Boolean);

  const raw: Omit<StationNode, "x" | "y" | "order">[] = [
    {
      id: "ch-st-0",
      type: "lesson",
      title: "Activación Fonética Rápida",
      subtitle:
        allWords.length > 0
          ? `Términos: ${allWords.slice(0, 3).join(", ")}`
          : "Reconocimiento sonoro acelerado",
      category: "Laboratorio Fonético",
      duration: "5 min",
      xp: 15,
    },
    {
      id: "ch-st-1",
      type: "game",
      title: GAME_NAMES[games[0] || "match"] || "WordMatch Express",
      subtitle: "Reflejos léxicos y velocidad de asociación",
      category: "Desafío de Velocidad",
      duration: "45 seg",
      xp: 20,
      gameKey: games[0] || "match",
    },
    {
      id: "ch-st-2",
      type: "game",
      title: GAME_NAMES[games[1 % games.length] || "memory"] || "Memorama Auditivo",
      subtitle: "Fijación por pares fonéticos",
      category: "Reto de Memoria",
      duration: "60 seg",
      xp: 25,
      gameKey: games[1 % games.length] || "memory",
    },
    {
      id: "ch-st-3",
      type: "speed",
      title: "Desafío Tropiezos Spaced Repetition",
      subtitle: "Algoritmo SM-2 enfocado en palabras de vacilación",
      category: "Práctica Adaptativa",
      duration: "3 min",
      xp: 30,
    },
    {
      id: "ch-st-4",
      type: "game",
      title: GAME_NAMES[games[2 % games.length] || "word_scramble"] || "Descifrar Palabras",
      subtitle: "Construcción ortográfica bajo presión",
      category: "Reto Ortográfico",
      duration: "60 seg",
      xp: 30,
      gameKey: games[2 % games.length] || "word_scramble",
    },
    {
      id: "ch-st-5",
      type: "game",
      title: GAME_NAMES[games[3 % games.length] || "multiple_choice"] || "Quiz de Reto Exprés",
      subtitle: "Evaluación lúdica de respuestas rápidas",
      category: "Duelo de Preguntas",
      duration: "90 seg",
      xp: 40,
      gameKey: games[3 % games.length] || "multiple_choice",
    },
    {
      id: "ch-st-6",
      type: "milestone",
      title: "Cofre de Conquista Semanal",
      subtitle: `Meta: Dominar ${weeklyGoal} palabras para la insignia`,
      category: "Hito Gamificado",
      duration: "Acreditación",
      xp: 100,
    },
  ];

  return assignCoordinates(raw);
}
