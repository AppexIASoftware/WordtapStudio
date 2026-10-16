"use client";

import { ArrowLeft, Play, Save, BookOpen, Layers, RefreshCw, Loader2, Sparkles } from "lucide-react";
import { TeacherGameDTO } from "@/services/api/types";
import { useGameForm } from "../hooks/use-game-form";
import { GamePreviewCard } from "./game-preview-card";
import { ARCHETYPES } from "./archetypes";

interface GameCreationWorkspaceProps {
  initialGame?: TeacherGameDTO | null;
  defaultArchetype?: string;
  onCancel: () => void;
  onSave: (payload: {
    course_id?: string | null;
    base_archetype: string;
    title: string;
    description?: string;
    level: string;
    time_limit_seconds: number;
    allowed_mistakes: number;
    reward_xp: number;
    item_count: number;
    source_type: string;
    custom_words_json?: string;
  }) => Promise<void>;
  onOpenSandbox: (mockGame: TeacherGameDTO) => void;
}

const CEFR_LEVELS = [
  "A1 Principiante",
  "A2 Elemental",
  "B1 Intermedio",
  "B2 Intermedio Alto",
  "C1 Avanzado",
];

export function GameCreationWorkspace({
  initialGame,
  defaultArchetype,
  onCancel,
  onSave,
  onOpenSandbox,
}: GameCreationWorkspaceProps) {
  const form = useGameForm({
    initialGame,
    defaultArchetype,
    onSave,
    onCancel,
  });

  return (
    <div className="space-y-6">
      {/* Barra de Navegación del Workspace */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl bg-card border border-border-default hover:border-emerald-brand text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Volver a actividades"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{initialGame ? `Editar Actividad: ${initialGame.title}` : "Diseñar Nueva Actividad Lúdica"}</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-mint-brand/10 text-mint-brand border border-mint-brand/30">
                {form.baseArchetype.toUpperCase()}
              </span>
            </h1>
            <p className="text-xs text-slate-muted">
              Personaliza reglas pedagógicas, asigna fuentes de vocabulario y prueba la experiencia antes de publicarla.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenSandbox(form.getMockForSandbox())}
            className="px-3.5 py-2 rounded-xl bg-canvas border border-mint-brand/40 hover:border-mint-brand text-mint-brand font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Probar en Sandbox</span>
          </button>
          <button
            type="button"
            onClick={form.handleSubmit}
            disabled={form.saving}
            className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 cursor-pointer shadow-glow-emerald disabled:opacity-50"
          >
            {form.saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : initialGame ? (
              <Save className="w-3.5 h-3.5" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>
              {form.saving
                ? "Guardando..."
                : initialGame
                ? "Guardar Cambios"
                : "Guardar Actividad"}
            </span>
          </button>
        </div>
      </div>

      {form.error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 font-medium text-xs">
          {form.error}
        </div>
      )}

      {/* Grid de 2 Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Formulario (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Selección de Arquetipo Base */}
          <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
            <h3 className="text-sm font-bold text-white">1. Arquetipo Base de Minijuego</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ARCHETYPES.map((arch) => (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => form.setBaseArchetype(arch.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    form.baseArchetype === arch.id
                      ? "bg-mint-brand/10 border-mint-brand text-white shadow-sm"
                      : "bg-canvas border-border-default text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <p className="font-bold text-xs text-mint-brand">{arch.name}</p>
                  <p className="text-[10px] text-slate-subtle mt-0.5">{arch.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Parámetros Generales */}
          <div className="p-5 rounded-2xl bg-card border border-border-default space-y-4">
            <h3 className="text-sm font-bold text-white">2. Datos Pedagógicos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-200">Título de la Actividad:</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => form.setTitle(e.target.value)}
                  placeholder="Ej. Desafío de Verbos Irregulares B1"
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border-default text-white placeholder-slate-500 focus:outline-none focus:border-mint-brand text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-200">Nivel Marco Común:</label>
                <select
                  value={form.level}
                  onChange={(e) => form.setLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border-default text-white focus:outline-none focus:border-mint-brand text-xs cursor-pointer"
                >
                  {CEFR_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl} className="bg-canvas text-white">
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-200">Objetivo o Instrucción:</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => form.setDescription(e.target.value)}
                placeholder="Ej. Actividad para reforzar pronunciación y asociación rápida"
                className="w-full px-3 py-2 rounded-xl bg-canvas border border-border-default text-white placeholder-slate-500 focus:outline-none focus:border-mint-brand text-xs"
              />
            </div>
          </div>

          {/* 3. Reglas Lúdicas */}
          <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
            <h3 className="text-sm font-bold text-white">3. Reglas de Desafío & Gamificación</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-slate-muted block mb-1">Tiempo Límite:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="15"
                    max="180"
                    step="5"
                    value={form.timeLimit}
                    onChange={(e) => form.setTimeLimit(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-canvas border border-border-default text-white font-mono text-center text-xs"
                  />
                  <span className="text-slate-400 font-mono text-xs">s</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-muted block mb-1">Fallos / Vidas:</label>
                <select
                  value={form.allowedMistakes}
                  onChange={(e) => form.setAllowedMistakes(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-canvas border border-border-default text-white font-mono text-xs cursor-pointer"
                >
                  <option value={0}>0 (Muerte súbita)</option>
                  <option value={1}>1 Vida</option>
                  <option value={2}>2 Vidas</option>
                  <option value={3}>3 Vidas</option>
                  <option value={5}>5 Vidas</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-muted block mb-1">Recompensa XP:</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  step="5"
                  value={form.rewardXP}
                  onChange={(e) => form.setRewardXP(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-canvas border border-border-default text-white font-mono text-center text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-muted block mb-1">Palabras en Juego:</label>
                <input
                  type="number"
                  min="4"
                  max="20"
                  value={form.itemCount}
                  onChange={(e) => form.setItemCount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-canvas border border-border-default text-white font-mono text-center text-xs"
                />
              </div>
            </div>
          </div>

          {/* 4. Fuente de Vocabulario */}
          <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white">4. Fuente de Vocabulario</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => form.handleAutoPopulateSource("course_lesson")}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer ${
                    form.sourceType === "course_lesson"
                      ? "bg-mint-brand/20 text-mint-brand border border-mint-brand/40"
                      : "bg-canvas text-slate-400"
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  Desde Curso
                </button>
                <button
                  type="button"
                  onClick={() => form.handleAutoPopulateSource("vault")}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer ${
                    form.sourceType === "vault"
                      ? "bg-mint-brand/20 text-mint-brand border border-mint-brand/40"
                      : "bg-canvas text-slate-400"
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  Desde Bóveda
                </button>
              </div>
            </div>

            {form.sourceType === "course_lesson" && form.courses.length > 0 && (
              <div className="flex items-center gap-2">
                <select
                  value={form.courseId || ""}
                  onChange={(e) => form.setCourseId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-canvas border border-border-default text-slate-200 font-mono text-[11px] cursor-pointer"
                >
                  <option value="">-- Seleccionar Curso Vinculado --</option>
                  {form.courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.level})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => form.handleAutoPopulateSource("course_lesson")}
                  disabled={form.loadingSources}
                  className="px-2.5 py-1.5 rounded-lg bg-card border border-border-default hover:text-white text-slate-300 text-[10px] flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${form.loadingSources ? "animate-spin" : ""}`} />
                  Extraer
                </button>
              </div>
            )}

            <textarea
              rows={5}
              value={form.customWordsText}
              onChange={(e) => form.setCustomWordsText(e.target.value)}
              placeholder='[{"term": "Word", "translation": "Palabra"}]'
              className="w-full p-2.5 rounded-xl bg-canvas border border-border-default text-slate-200 font-mono text-[11px] focus:outline-none focus:border-mint-brand"
            />
            <span className="text-[10px] text-slate-subtle block">
              Pares de términos y traducciones que el minijuego cargará interactivamente.
            </span>
          </div>
        </div>

        {/* Columna Derecha: Previsualización & Acciones (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-subtle font-bold">
              Previsualización en Vivo
            </h3>

            <GamePreviewCard
              archetype={form.baseArchetype}
              title={form.title}
              description={form.description}
              level={form.level}
              timeLimit={Number(form.timeLimit)}
              allowedMistakes={Number(form.allowedMistakes)}
              rewardXP={Number(form.rewardXP)}
              itemCount={Number(form.itemCount)}
              courseTitle={form.selectedCourseTitle}
            />

            <div className="p-4 rounded-2xl bg-card border border-border-default space-y-2.5">
              <span className="text-xs font-bold text-white block">Acciones Rápidas:</span>
              <button
                type="button"
                onClick={() => onOpenSandbox(form.getMockForSandbox())}
                className="w-full py-2.5 rounded-xl bg-canvas border border-mint-brand/40 hover:border-mint-brand text-mint-brand font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Ejecutar en Sandbox Interactivo</span>
              </button>

              <button
                type="button"
                onClick={form.handleSubmit}
                disabled={form.saving}
                className="w-full py-2.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-glow-emerald disabled:opacity-50"
              >
                {form.saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : initialGame ? (
                  <Save className="w-3.5 h-3.5" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>
                  {form.saving
                    ? "Guardando..."
                    : initialGame
                    ? "Guardar Cambios"
                    : "Guardar y Publicar en Mis Actividades"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
