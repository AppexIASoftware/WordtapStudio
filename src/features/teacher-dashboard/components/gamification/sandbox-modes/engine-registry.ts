"use client";

import { ComponentType } from "react";
import { ArchetypeId } from "../archetypes";
import { SandboxEngineProps } from "./sandbox-types";
import { SandboxMatch } from "./sandbox-match";
import { SandboxMemory } from "./sandbox-memory";
import { SandboxListening } from "./sandbox-listening";
import { SandboxScramble } from "./sandbox-scramble";
import { SandboxTrivia } from "./sandbox-trivia";
import { SandboxSpeed } from "./sandbox-speed";
import { SandboxHangman } from "./sandbox-hangman";
import { SandboxSentence } from "./sandbox-sentence";
import { SandboxPhrasal } from "./sandbox-phrasal";
import { SandboxFillin } from "./sandbox-fillin";
import { SandboxCrossword } from "./sandbox-crossword";
import { SandboxWordSearch } from "./sandbox-wordsearch";

/**
 * Registro de motores de sandbox por arquetipo.
 *
 * El tipo Record<ArchetypeId, ...> ata este registro al catalogo de
 * arquetipos: agregar uno nuevo rompe la compilacion hasta registrar su motor.
 */
export const SANDBOX_ENGINES: Record<ArchetypeId, ComponentType<SandboxEngineProps>> = {
  match: SandboxMatch,
  memory: SandboxMemory,
  word_scramble: SandboxScramble,
  multiple_choice: SandboxTrivia,
  listening: SandboxListening,
  speed_translation: SandboxSpeed,
  hangman: SandboxHangman,
  sentence_builder: SandboxSentence,
  fill_in: SandboxFillin,
  phrasal_verbs: SandboxPhrasal,
  crossword: SandboxCrossword,
  word_search: SandboxWordSearch,
};
