import { Course, Lesson } from "@/features/courses/types";
import { LessonGameDTO } from "@/services/api/types";
import { CourseJourneyNode, JOURNEY_NODE_TYPE } from "./journey-types";

export const JOURNEY_Y_START = 90;
export const JOURNEY_Y_GAP = 145;

// Caché en memoria a nivel módulo para respuesta instantánea (0ms) al alternar pestañas
export const lessonGamesMemoryCache = new Map<string, LessonGameDTO[]>();

export function invalidateLessonGamesCache(lessonId?: string) {
  if (lessonId) {
    lessonGamesMemoryCache.delete(lessonId);
  } else {
    lessonGamesMemoryCache.clear();
  }
}

export function assignCoordinates(
  items: Omit<CourseJourneyNode, "x" | "y" | "order">[]
): CourseJourneyNode[] {
  const total = items.length;
  return items.map((item, idx) => {
    let x = 180;
    if (idx > 0 && idx < total - 1) {
      // Alternancia serpenteante armónica (izquierda / derecha)
      const isLeft = idx % 2 === 1;
      x = isLeft ? (idx % 4 === 1 ? 95 : 105) : (idx % 4 === 2 ? 265 : 255);
    }
    const y = JOURNEY_Y_START + idx * JOURNEY_Y_GAP;
    return {
      ...item,
      order: idx + 1,
      x,
      y,
    };
  });
}

export function generateCourseJourneyNodes(
  course: Course,
  gamesByLesson: Record<string, LessonGameDTO[]> = {}
): CourseJourneyNode[] {
  const lessons: Lesson[] = course.lessons && course.lessons.length > 0 ? course.lessons : [];
  if (lessons.length === 0) return [];

  const raw: Omit<CourseJourneyNode, "x" | "y" | "order">[] = [];

  lessons.forEach((lesson, idx) => {
    const words = (lesson.items || [])
      .map((it) => it.en?.trim())
      .filter((w): w is string => Boolean(w && w.length > 0));

    // Nodo 1: Lección Teórica
    raw.push({
      id: `node-lesson-${lesson.id || idx}`,
      type: JOURNEY_NODE_TYPE.LESSON,
      title: lesson.title || `Lección ${idx + 1}`,
      subtitle:
        words.length > 0
          ? `${words.length} tarjetas didácticas (${words.slice(0, 3).join(", ")})`
          : "Contenido pedagógico y pronunciación",
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      cardsCount: words.length,
      words,
      duration: lesson.duration || "15 min",
      xp: 25,
    });

    // Minijuegos vinculados a esta lección (únicamente si existen minijuegos creados en la BD)
    const linkedGames = gamesByLesson[lesson.id] || [];
    if (linkedGames.length > 0) {
      linkedGames.forEach((game, gIdx) => {
        raw.push({
          id: `node-game-${lesson.id}-${game.id || game.game_id || gIdx}`,
          type: JOURNEY_NODE_TYPE.GAME,
          title: game.title || `Minijuego: ${lesson.title}`,
          subtitle:
            game.description ||
            `Dinámica: ${game.base_archetype || "WordMatch"} • Nivel ${game.level || course.level}`,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          cardsCount: words.length,
          words,
          gameId: game.id || game.game_id,
          gameArchetype: game.base_archetype || "WordMatch",
          gameLevel: game.level || course.level,
          timeLimitSeconds: game.time_limit_seconds || 60,
          allowedMistakes: game.allowed_mistakes,
          isRequired: game.is_required,
          isCustom: Boolean(game.owner_type && game.owner_type !== "platform"),
          duration: game.time_limit_seconds ? `${game.time_limit_seconds} seg` : "60 seg",
          xp: game.reward_xp || 20,
        });
      });
    }

    // Cada 3 lecciones, agregar un Checkpoint de consolidación
    if ((idx + 1) % 3 === 0 && idx + 1 < lessons.length) {
      raw.push({
        id: `node-checkpoint-${idx}`,
        type: JOURNEY_NODE_TYPE.CHECKPOINT,
        title: `Checkpoint de Consolidación ${Math.floor((idx + 1) / 3)}`,
        subtitle: "Repaso espaciado de módulos anteriores",
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        cardsCount: 0,
        words: [],
        duration: "5 min",
        xp: 35,
      });
    }
  });

  // Hito final de cierre y acreditación del curso
  const totalCards = lessons.reduce((acc, l) => acc + (l.items?.length || 0), 0);
  raw.push({
    id: "node-milestone-final",
    type: JOURNEY_NODE_TYPE.MILESTONE,
    title: `Meta y Certificación: ${course.title}`,
    subtitle: `Acredita el dominio de ${totalCards} palabras y ${lessons.length} lecciones`,
    lessonId: lessons[lessons.length - 1]?.id || "end",
    lessonTitle: "Meta Final",
    cardsCount: totalCards,
    words: [],
    duration: "Evaluación Final",
    xp: 100,
  });

  return assignCoordinates(raw);
}

export function generateJourneySvgPath(nodes: CourseJourneyNode[]): string {
  if (nodes.length < 2) return "";
  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 0; i < nodes.length - 1; i++) {
    const p1 = nodes[i];
    const p2 = nodes[i + 1];
    const cy = (p1.y + p2.y) / 2;
    d += ` C ${p1.x} ${cy}, ${p2.x} ${cy}, ${p2.x} ${p2.y}`;
  }
  return d;
}
