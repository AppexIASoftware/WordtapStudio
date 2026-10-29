"use client";

import { useCallback, useEffect, useState } from "react";
import { Gamepad2, Globe2 } from "lucide-react";
import { TeacherGameDTO, CreateTeacherGamePayload } from "@/services/api/types";
import { OWNER_TYPE } from "@/services/api/owner-type";
import {
  getAdminGamesApi,
  createGlobalGameApi,
  updateGlobalGameApi,
  deleteGlobalGameApi,
} from "@/services/api/games";
import { ToastNotification } from "@/components/ui/toast-notification";
import { GamificationHeader } from "../components/gamification-header";
import { GamificationAdminPanel } from "../components/gamification-admin-panel";
import { GamificationGlobalPanel } from "../components/gamification-global-panel";
import { GameCreationWorkspace } from "../components/game-creation-workspace";
import { GameSandboxModal } from "../components/game-sandbox-modal";
import { ConfirmRemoveModal } from "../components/confirm-remove-modal";

type AdminTab = "global" | "teacher";
type WorkspaceMode = "list" | "create" | "edit";

const LOAD_ERROR_COPY =
  "Vuelve a intentarlo en unos segundos o revisa la conexión con el servicio.";

/**
 * Experiencia administrativa del catálogo de minijuegos.
 *
 * Reúne las dos caras del catálogo: los juegos globales de la plataforma, que
 * el administrador crea, edita y elimina, y las actividades de los docentes,
 * que solo se supervisan y prueban.
 */
export function AdminGamificationView() {
  const [games, setGames] = useState<TeacherGameDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>("global");
  const [showArchived, setShowArchived] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("list");
  const [editingGame, setEditingGame] = useState<TeacherGameDTO | null>(null);
  const [activeSandboxGame, setActiveSandboxGame] = useState<TeacherGameDTO | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<TeacherGameDTO | null>(null);
  const [removing, setRemoving] = useState(false);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await getAdminGamesApi();
      if (res.error) {
        setGames([]);
        setErrorMessage(LOAD_ERROR_COPY);
        return;
      }
      setGames(Array.isArray(res.data) ? res.data : []);
    } catch {
      setGames([]);
      setErrorMessage(LOAD_ERROR_COPY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchGames();
  }, [fetchGames]);

  // El catálogo llega unificado: los juegos de la plataforma se separan de los
  // que pertenecen a un docente para dar a cada grupo su propio tratamiento.
  const globalGames = games.filter((game) => game.is_active && game.is_global === true && !(game.source_type === "course_lesson" && game.source_id));
  const teacherGames = games.filter((game) => game.is_active && game.owner_type !== OWNER_TYPE.PLATFORM && !game.is_global);
  const archivedGames = games.filter((game) => !game.is_active && (activeTab === "global" ? game.owner_type === OWNER_TYPE.PLATFORM && game.is_global : game.owner_type === OWNER_TYPE.TEACHER));

  const teachersCount = new Set(teacherGames.map((game) => game.teacher_id)).size;
  const coursesCount = new Set(
    teacherGames
      .map((game) => game.course_title?.trim())
      .filter((title): title is string => Boolean(title))
  ).size;
  const activeGamesCount = games.filter((game) => game.is_active).length;

  const handleOpenCreate = () => {
    setEditingGame(null);
    setWorkspaceMode("create");
  };

  const handleOpenEdit = (game: TeacherGameDTO) => {
    setEditingGame(game);
    setWorkspaceMode("edit");
  };

  const handleCloseWorkspace = () => {
    setWorkspaceMode("list");
    setEditingGame(null);
  };

  /**
   * Los juegos globales pertenecen a la plataforma, no a un curso, así que el
   * envío omite el vínculo con un curso aunque el formulario lo incluya vacío.
   */
  const handleSaveGlobalGame = async (payload: CreateTeacherGamePayload) => {
    const globalPayload: CreateTeacherGamePayload = {
      category_id: payload.category_id,
      base_archetype: payload.base_archetype,
      title: payload.title,
      description: payload.description,
      level: payload.level,
      time_limit_seconds: payload.time_limit_seconds,
      allowed_mistakes: payload.allowed_mistakes,
      reward_xp: payload.reward_xp,
      item_count: payload.item_count,
      source_type: payload.source_type,
      custom_words_json: payload.custom_words_json,
    };

    if (editingGame) {
      const res = await updateGlobalGameApi(editingGame.id, globalPayload);
      if (res.error) throw new Error(res.error);
      triggerToast("¡Juego global actualizado con éxito!");
    } else {
      const res = await createGlobalGameApi(globalPayload);
      if (res.error) throw new Error(res.error);
      triggerToast("¡Juego global creado y publicado con éxito!");
    }

    await fetchGames();
  };

  const handleDeleteGlobalGame = async (id: string) => {
    const game = games.find((item) => item.id === id);
    if (game) setPendingRemoval(game);
  };

  const confirmDeleteGlobalGame = async () => {
    if (!pendingRemoval || removing) return;
    setRemoving(true);
    try {
    const res = await deleteGlobalGameApi(pendingRemoval.id);
    if (res.error) {
      triggerToast(`Error: ${res.error}`);
      return;
    }

    if (res.data?.archived) {
      const archivedUsage = res.data.usage_count ?? 0;
      triggerToast(
        `Actividad archivada: está en uso en ${archivedUsage} lección(es).`
      );
    } else {
      triggerToast("Juego global eliminado correctamente");
    }

    setPendingRemoval(null);
    await fetchGames();
    } finally {
      setRemoving(false);
    }
  };

  const handleRestoreGlobalGame = async (id: string) => {
    const res = await updateGlobalGameApi(id, { is_active: true });
    if (res.error) {
      triggerToast(`Error al reactivar: ${res.error}`);
      return;
    }
    triggerToast("Juego global reactivado correctamente");
    await fetchGames();
  };

  // Formulario de creación y edición de un juego global.
  if (workspaceMode !== "list") {
    return (
      <div className="space-y-6">
        <ToastNotification message={toastMessage} variant="emerald" />
        <GameCreationWorkspace
          initialGame={editingGame}
          defaultArchetype={editingGame?.base_archetype ?? "match"}
          isGlobal={true}
          canCreateCategory={true}
          onCancel={handleCloseWorkspace}
          onSave={handleSaveGlobalGame}
          onOpenSandbox={(mockGame) => setActiveSandboxGame(mockGame)}
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

  const tabs: { id: AdminTab; label: string; count: number; icon: typeof Globe2 }[] = [
    { id: "global", label: "Juegos Globales", count: globalGames.length, icon: Globe2 },
    { id: "teacher", label: "Actividades de Docentes", count: teacherGames.length, icon: Gamepad2 },
  ];

  return (
    // Sin padding propio: la disposición de /admin ya lo aplica al contenido.
    <div className="space-y-6">
      <ToastNotification message={toastMessage} variant="emerald" />
      {pendingRemoval && <ConfirmRemoveModal game={pendingRemoval} busy={removing} onCancel={() => setPendingRemoval(null)} onConfirm={() => void confirmDeleteGlobalGame()} />}

      <GamificationHeader
        scope="admin"
        customGamesCount={games.length}
        globalGamesCount={globalGames.length}
        teachersCount={teachersCount}
        coursesCount={coursesCount}
        activeGamesCount={activeGamesCount}
      />

      {/* Selector de grupos del catálogo */}
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-mint-brand/10 border-mint-brand text-white"
                  : "bg-card border-border-default text-slate-400 hover:border-slate-600 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-mint-brand" : "text-slate-500"}`} />
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  isActive
                    ? "bg-mint-brand/20 text-mint-brand border-mint-brand/40"
                    : "bg-canvas text-slate-subtle border-border-default"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Estado de los juegos">
        <span className="text-xs font-semibold text-slate-400">Mostrar</span>
        <div className="inline-flex items-center gap-1 rounded-xl border border-border-default bg-card p-1">
          <button type="button" aria-pressed={!showArchived} onClick={() => setShowArchived(false)} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint-brand ${!showArchived ? "bg-emerald-brand text-canvas" : "text-slate-400 hover:text-white"}`}>Activos</button>
          <button type="button" aria-pressed={showArchived} onClick={() => setShowArchived(true)} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint-brand ${showArchived ? "bg-emerald-brand text-canvas" : "text-slate-400 hover:text-white"}`}>Archivados <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${showArchived ? "bg-black/15" : "bg-canvas text-slate-300"}`}>{archivedGames.length}</span></button>
        </div>
      </div>

      {activeTab === "global" ? (
        <GamificationGlobalPanel
          games={showArchived ? archivedGames : globalGames}
          isLoading={isLoading}
          errorMessage={errorMessage}
          isArchivedView={showArchived}
          onCreate={handleOpenCreate}
          onPlayTest={(game) => setActiveSandboxGame(game)}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteGlobalGame}
          onRestore={handleRestoreGlobalGame}
          onRefresh={() => void fetchGames()}
        />
      ) : (
        <GamificationAdminPanel
          games={showArchived ? archivedGames : teacherGames}
          isLoading={isLoading}
          errorMessage={errorMessage}
          isArchivedView={showArchived}
          onPlayTest={(game) => setActiveSandboxGame(game)}
          onRefresh={() => void fetchGames()}
        />
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
