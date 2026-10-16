"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Plus } from "lucide-react";
import { GAMES_DATA } from "@/features/games/data/mock-games";
import { GameModeItem } from "@/features/games/types";
import { ToastNotification } from "@/components/ui/toast-notification";
import { TeacherGameDTO } from "@/services/api/types";
import {
  getTeacherGamesApi,
  createTeacherGameApi,
  updateTeacherGameApi,
  deleteTeacherGameApi,
} from "@/services/api/games";

import { GamificationHeader } from "../components/gamification-header";
import {
  GamificationFilterBar,
  GamificationFilter,
} from "../components/gamification-filter-bar";
import { GamificationArchetypeCard } from "../components/gamification-archetype-card";
import { GamificationCustomCard } from "../components/gamification-custom-card";
import { SupermemoSimulator } from "../components/supermemo-simulator";
import { GameCreationWorkspace } from "../components/game-creation-workspace";
import { GameSandboxModal } from "../components/game-sandbox-modal";
import { useUrlParams, useUrlParam } from "@/hooks/use-url-params";

export function GamificationView() {
  const { get, setParams } = useUrlParams();

  const [baseGames] = useState<GameModeItem[]>(GAMES_DATA);
  const [customGames, setCustomGames] = useState<TeacherGameDTO[]>([]);

  const [activeFilter, setActiveFilter] = useUrlParam<GamificationFilter>(
    "tab",
    ["custom", "archetypes", "simulator"],
    "custom"
  );

  const [activeSandboxGame, setActiveSandboxGame] = useState<GameModeItem | TeacherGameDTO | null>(null);
  const presetArchetype = get("archetype") ?? "match";

  // El modo de vista se deriva de la URL (?view= create|edit) con fallback a "list".
  const urlView = get("view");
  const urlGameId = get("gameId");
  const resolvedMode: "list" | "create" | "edit" =
    urlView === "create" || (urlView === "edit" && urlGameId) ? (urlView as "create" | "edit") : "list";

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchCustomGames = useCallback(async () => {
    try {
      const res = await getTeacherGamesApi();
      if (res.data && Array.isArray(res.data)) {
        setCustomGames(res.data);
      }
    } catch {
      // Usar estado local si API no responde
    }
  }, []);

  useEffect(() => {
    fetchCustomGames();
  }, [fetchCustomGames]);

  // El juego en edición se resuelve contra la lista ya cargada (id corto de fila).
  const selectedGame: TeacherGameDTO | null =
    resolvedMode === "edit" && urlGameId
      ? customGames.find((g) => g.id === urlGameId) ?? null
      : null;

  const handleOpenCreate = (archetype = "match") => {
    setParams({ view: "create", gameId: null, archetype }, "push");
  };

  const handleOpenEdit = (game: TeacherGameDTO) => {
    setParams({ view: "edit", gameId: game.id, archetype: null }, "push");
  };

  const handleCloseWorkspace = () => {
    setParams({ view: null, gameId: null, archetype: null }, "replace");
  };

  const handleSaveGame = async (payload: {
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
  }) => {
    if (selectedGame) {
      const res = await updateTeacherGameApi(selectedGame.id, payload);
      if (res.error) throw new Error(res.error);
      triggerToast("¡Actividad actualizada con éxito!");
    } else {
      const res = await createTeacherGameApi(payload);
      if (res.error) throw new Error(res.error);
      triggerToast("¡Actividad creada y guardada con éxito!");
    }
    await fetchCustomGames();
  };

  const handleDeleteGame = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta actividad personalizada?")) return;
    const res = await deleteTeacherGameApi(id);
    if (res.error) {
      triggerToast(`Error: ${res.error}`);
    } else {
      triggerToast("Actividad eliminada correctamente");
      await fetchCustomGames();
    }
  };

  // Renderizar Workspace de Creación/Edición
  if (resolvedMode === "create" || resolvedMode === "edit") {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <ToastNotification message={toastMessage} variant="emerald" />
        <GameCreationWorkspace
          initialGame={selectedGame}
          defaultArchetype={presetArchetype}
          onCancel={handleCloseWorkspace}
          onSave={handleSaveGame}
          onOpenSandbox={(mock) => setActiveSandboxGame(mock)}
        />
        {activeSandboxGame && (
          <GameSandboxModal
            game={activeSandboxGame}
            onClose={() => setActiveSandboxGame(null)}
          />
        )}
      </div>
    );
  }

  const showCustom = activeFilter === "custom";
  const showArchetypes = activeFilter === "archetypes";
  const showSimulator = activeFilter === "simulator";

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <ToastNotification message={toastMessage} variant="emerald" />

      {/* Cabecera y KPIs */}
      <GamificationHeader
        customGamesCount={customGames.length}
        onNewGame={() => handleOpenCreate("match")}
      />

      {/* Selector de Pestañas */}
      <GamificationFilterBar
        activeFilter={activeFilter}
        onChangeFilter={(filter) =>
          setActiveFilter(filter, { clear: ["view", "gameId", "archetype"] })
        }
        customCount={customGames.length}
      />

      {/* Pestaña: Mis Actividades en Base de Datos */}
      {showCustom && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Tus Actividades Personalizadas</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-mint-brand/20 text-mint-brand border border-mint-brand/40">
                {customGames.length} {customGames.length === 1 ? "guardada" : "guardadas"}
              </span>
            </h3>
          </div>

          {customGames.length === 0 ? (
            <div className="p-8 rounded-2xl bg-card border border-border-default text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-mint-brand/10 text-mint-brand flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">No tienes actividades personalizadas creadas</h4>
              <p className="text-xs text-slate-muted max-w-md mx-auto">
                Crea tu primera dinámica pedagógica con vocabulario propio o deriva una desde las plantillas base del catálogo.
              </p>
              <button
                type="button"
                onClick={() => handleOpenCreate("match")}
                className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-glow-emerald"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Crear Primera Actividad</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {customGames.map((game) => (
                <GamificationCustomCard
                  key={game.id}
                  game={game}
                  onPlayTest={(g) => setActiveSandboxGame(g)}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteGame}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pestaña: Plantillas de Demostración del Catálogo */}
      {showArchetypes && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Plantillas & Arquetipos Base de Demostración
              </h3>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Demo
              </span>
            </div>
            <span className="text-xs text-slate-subtle">
              Modelos listos para derivar y personalizar con vocabulario real
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {baseGames.map((game) => (
              <GamificationArchetypeCard
                key={game.id}
                game={game}
                onPlayTest={(g) => setActiveSandboxGame(g)}
                onCreateDerived={(arch) => handleOpenCreate(arch)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Calibrador SuperMemo (SM-2) */}
      {showSimulator && (
        <div className="pt-2">
          <SupermemoSimulator
            onSaveConfig={() => triggerToast("¡Parámetros pedagógicos calibrados con éxito!")}
          />
        </div>
      )}

      {/* Modal de Sandbox Jugable */}
      {activeSandboxGame && (
        <GameSandboxModal
          game={activeSandboxGame}
          onClose={() => setActiveSandboxGame(null)}
        />
      )}
    </div>
  );
}
