"use client";

/**
 * Catalogo unico de arquetipos base de minijuego.
 *
 * Es la fuente de verdad compartida por el formulario de creacion, el router
 * del sandbox interactivo y la tarjeta de previsualizacion. Declarar un
 * arquetipo aqui obliga al compilador a exigir su motor de sandbox y su
 * maqueta de previsualizacion.
 */

export type ArchetypeId =
  | "match"
  | "memory"
  | "word_scramble"
  | "multiple_choice"
  | "listening"
  | "speed_translation"
  | "hangman"
  | "sentence_builder"
  | "fill_in"
  | "phrasal_verbs"
  | "crossword"
  | "word_search";

export interface ArchetypeMeta {
  id: ArchetypeId;
  name: string;
  desc: string;
}

export const ARCHETYPES: readonly ArchetypeMeta[] = [
  { id: "match", name: "WordMatch", desc: "Emparejar pares de términos y definiciones" },
  { id: "memory", name: "Memory Cards", desc: "Encontrar parejas volteando cartas" },
  { id: "word_scramble", name: "Word Scramble", desc: "Reordenar letras desordenadas" },
  { id: "multiple_choice", name: "Trivia Quiz", desc: "Preguntas de opción múltiple contra reloj" },
  { id: "listening", name: "Listening Challenge", desc: "Identificar pronunciación auditiva correcta" },
  { id: "speed_translation", name: "Speed Translation", desc: "Verificación de traducción contra reloj" },
  { id: "hangman", name: "Ahorcado Fonético", desc: "Descubrir la palabra letra por letra" },
  { id: "sentence_builder", name: "Sentence Builder", desc: "Construir oraciones gramaticales ordenando bloques" },
  { id: "fill_in", name: "Fill-in the Blank", desc: "Rellenar espacios vacíos en diálogos conversacionales" },
  { id: "phrasal_verbs", name: "Phrasal Verbs Challenge", desc: "Dominar verbos compuestos y sus partículas" },
  { id: "crossword", name: "Crucigrama Temático", desc: "Crucigramas interactivos con vocabulario de la unidad" },
  { id: "word_search", name: "Sopa de Letras", desc: "Buscar palabras en cuadrícula bidireccional" },
];

export const ARCHETYPE_LABELS: Record<ArchetypeId, string> = ARCHETYPES.reduce(
  (acc, archetype) => ({ ...acc, [archetype.id]: archetype.name }),
  {} as Record<ArchetypeId, string>
);

/**
 * Normaliza un valor crudo del backend a un arquetipo valido.
 * Ante cualquier valor vacio o desconocido, cae a "match".
 */
export function normalizeArchetype(raw?: string | null): ArchetypeId {
  const value = (raw || "").trim().toLowerCase();
  return ARCHETYPES.some((archetype) => archetype.id === value)
    ? (value as ArchetypeId)
    : "match";
}
