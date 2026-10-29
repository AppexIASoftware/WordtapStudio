"use client";

import { useRef, useState } from "react";
import { ArrowLeft, Play, Save, Loader2, Sparkles, Globe2 } from "lucide-react";
import { TeacherGameDTO } from "@/services/api/types";
import { useGameForm } from "../hooks/use-game-form";
import { GamePreviewCard } from "./game-preview-card";
import { ARCHETYPES } from "./archetypes";
import { CategoryCombobox } from "@/features/vault/components/category-combobox";
import { NewCategoryModal } from "@/features/vault/components/new-category-modal";
import { VocabSource } from "./creation/vocab-source";
import { VaultPicker } from "./creation/vault-picker";
import { AudiencePicker } from "./creation/audience-picker";

interface GameCreationWorkspaceProps {
  initialGame?: TeacherGameDTO | null;
  defaultArchetype?: string;
  isGlobal?: boolean;
  canConfigureAccessTier?: boolean;
  canCreateCategory?: boolean;
  onCancel: () => void;
  onSave: (payload: {
    course_id?: string | null;
    category_id?: string | null;
    base_archetype: string;
    title: string;
    description?: string;
    level: string;
    access_tier?: "free" | "subscription";
    time_limit_seconds: number;
    allowed_mistakes: number;
    reward_xp: number;
    item_count: number;
    source_type: string;
    custom_words_json?: string;
    is_published_standalone?: boolean;
    audience_scope?: "all_students" | "selected_courses";
    assigned_course_ids?: string[];
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
  isGlobal = false,
  canConfigureAccessTier = false,
  canCreateCategory = true,
  onCancel,
  onSave,
  onOpenSandbox,
}: GameCreationWorkspaceProps) {
  const form = useGameForm({
    initialGame,
    defaultArchetype,
    isGlobal,
    onSave,
    onCancel,
  });

  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [newCategoryInitialName, setNewCategoryInitialName] = useState("");
  const audienceEdited = useRef(false);

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
              <span>
                {initialGame
                  ? `Editar Actividad: ${initialGame.title}`
                  : isGlobal
                  ? "Diseñar Juego Global de Plataforma"
                  : "Diseñar Nueva Actividad Lúdica"}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-mint-brand/10 text-mint-brand border border-mint-brand/30">
                {form.baseArchetype.toUpperCase()}
              </span>
              {isGlobal && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1">
                  <Globe2 className="w-3 h-3" />
                  Global
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-muted">
              {isGlobal
                ? "Configura las reglas pedagógicas y vocabulario oficial para la ruta de juegos pública de la app."
                : "Personaliza reglas pedagógicas, asigna fuentes de vocabulario y prueba la experiencia antes de publicarla."}
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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

          {/* 2. Parámetros Generales y Categoría Temática */}
          <div className="p-5 rounded-2xl bg-card border border-border-default space-y-4">
            <h3 className="text-sm font-bold text-white">2. Datos Pedagógicos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-200">Título de la Actividad *</label>
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

            {/* Categoría Temática integrada */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-200">Categoría Temática:</label>
                <CategoryCombobox
                  value={form.categoryId}
                  categories={form.categories}
                  onChange={form.setCategoryId}
                  onCreateNew={canCreateCategory ? (name) => {
                    setNewCategoryInitialName(name || "");
                    setIsNewCategoryModalOpen(true);
                  } : undefined}
                  placeholder="-- Seleccionar Categoría Temática --"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-200">Objetivo o Instrucción:</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => form.setDescription(e.target.value)}
                  placeholder="Ej. Actividad para reforzar vocabulario y asociación rápida"
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border-default text-white placeholder-slate-500 focus:outline-none focus:border-mint-brand text-xs"
                />
              </div>
            </div>
          </div>

          {/* 3. Reglas Lúdicas */}
          <div className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
            <h3 className="text-sm font-bold text-white">3. Reglas de Desafío &amp; Gamificación</h3>
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

            {/* Selector de Nivel de Acceso (Solo para roles/vistas autorizadas, ej. Juegos Globales) */}
            {canConfigureAccessTier && (
              <div className="pt-2 border-t border-border-default/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-[11px] text-slate-muted block font-medium">Nivel de Acceso:</label>
                  <p className="text-[10px] text-slate-500">Define si los alumnos requieren membresía Pro para acceder a este juego.</p>
                </div>
                <div className="inline-flex p-1 rounded-xl bg-canvas border border-border-default gap-1 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => form.setAccessTier("free")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      form.accessTier === "free"
                        ? "bg-emerald-brand text-canvas shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Gratis
                  </button>
                  <button
                    type="button"
                    onClick={() => form.setAccessTier("subscription")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      form.accessTier === "subscription"
                        ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>👑</span>
                    <span>Suscripción Pro</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. Fuente de Vocabulario (Componente atómico desacoplado) */}
          {isGlobal ? <VaultPicker categoryId={form.categoryId} level={form.level} itemCount={form.itemCount} value={form.customWordsText} onChange={form.setCustomWordsText} /> : <VocabSource
            isGlobal={isGlobal}
            sourceType={form.sourceType}
            courseId={form.courseId}
            courses={form.courses}
            level={form.level}
            itemCount={form.itemCount}
            loadingSources={form.loadingSources}
            sourceMessage={form.sourceMessage}
            customWordsText={form.customWordsText}
            setCourseId={form.setCourseId}
            setCustomWordsText={form.setCustomWordsText}
            handleAutoPopulateSource={form.handleAutoPopulateSource}
          />}

          {/* 5. Publicación en App Móvil & Audiencia (Exclusivo Docente) */}
          {!isGlobal && (
            <AudiencePicker
              isPublishedStandalone={form.isPublishedStandalone}
              audienceScope={form.audienceScope}
              assignedCourseIds={form.assignedCourseIds}
              courses={form.courses}
              onTogglePublished={() => form.setIsPublishedStandalone(!form.isPublishedStandalone)}
              onAudienceScopeChange={(scope) => {
                if (scope === "selected_courses" && !initialGame && !audienceEdited.current && form.assignedCourseIds.length === 0 && form.sourceType === "course_lesson" && form.courseId) {
                  form.setAssignedCourseIds([form.courseId]);
                }
                form.setAudienceScope(scope);
              }}
              onToggleCourse={(courseId) => {
                audienceEdited.current = true;
                if (form.assignedCourseIds.includes(courseId)) {
                  form.setAssignedCourseIds(form.assignedCourseIds.filter((id) => id !== courseId));
                } else {
                  form.setAssignedCourseIds([...form.assignedCourseIds, courseId]);
                }
              }}
            />
          )}
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
              courseTitle={isGlobal ? undefined : form.selectedCourseTitle}
              categoryName={form.selectedCategoryName}
            />

            <div className="p-4 rounded-2xl bg-card border border-border-default space-y-2.5">
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
        </div>
      </div>

      {/* Modal para Crear Nueva Categoría Temática al instante */}
      <NewCategoryModal
        isOpen={isNewCategoryModalOpen}
        initialName={newCategoryInitialName}
        onClose={() => setIsNewCategoryModalOpen(false)}
        onCreated={(newCat) => {
          form.setCategories((prev) => [...prev, newCat]);
          form.setCategoryId(newCat.id);
        }}
      />
    </div>
  );
}
