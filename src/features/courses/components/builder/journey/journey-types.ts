export const JOURNEY_NODE_TYPE = {
  LESSON: "lesson",
  GAME: "game",
  CHECKPOINT: "checkpoint",
  MILESTONE: "milestone",
} as const;

export type JourneyNodeType =
  (typeof JOURNEY_NODE_TYPE)[keyof typeof JOURNEY_NODE_TYPE];

export interface CourseJourneyNode {
  id: string;
  order: number;
  type: JourneyNodeType;
  title: string;
  subtitle: string;
  lessonId: string;
  lessonTitle: string;
  cardsCount: number;
  words: string[];
  gameId?: string;
  gameArchetype?: string;
  gameLevel?: string;
  allowedMistakes?: number;
  timeLimitSeconds?: number;
  isRequired?: boolean;
  isCustom?: boolean;
  duration?: string;
  xp: number;
  x: number;
  y: number;
}
