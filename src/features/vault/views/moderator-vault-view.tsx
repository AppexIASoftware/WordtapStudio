"use client";

import { useUrlParams } from "@/hooks/use-url-params";
import { VaultOfficialManager } from "@/features/vault/components/official-manager";

/**
 * Banco oficial para el moderador: mismo gestor y mismo comportamiento que el
 * adaptador del admin, con el estado del editor en la URL
 * (?view=create|edit&itemId=…) para que cada término sea direccionable.
 */
export function ModeratorVaultView() {
  const { get, setParams } = useUrlParams();
  const view = get("view");
  const itemId = get("itemId");

  return (
    <VaultOfficialManager
      accent="blue"
      showCounter
      emptyIcon="shield"
      copy={{
        title: "Content Vault Maestro (Supervisión Global)",
        badge: "Certificación Oficial",
        subtitle:
          "Gestión y auditoría del banco lingüístico universal de Wordtap. Todo ítem aquí es accesible por docentes en sus cursos.",
        searchPlaceholder: "Buscar en banco oficial por término, IPA o traducción...",
        newLabel: "Nuevo Término Oficial",
        loadingLabel: "Cargando catálogo oficial...",
        emptyTitle: "No hay términos con estos filtros",
        emptyHint: "Podés añadir nuevos términos o ajustar los filtros de búsqueda.",
      }}
      editorIntent={{
        mode: view === "create" ? "create" : view === "edit" ? "edit" : null,
        itemId,
      }}
      onRequestCreate={() => setParams({ view: "create", itemId: null }, "push")}
      onRequestEdit={(item) => setParams({ view: "edit", itemId: item.id }, "push")}
      onCloseEditor={() => setParams({ view: null, itemId: null }, "replace")}
    />
  );
}
