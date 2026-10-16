"use client";

import { useState } from "react";
import { ApiVaultItem } from "@/services/api";
import { VaultOfficialManager } from "@/features/vault/components/vault-official-manager";

/**
 * Banco oficial para el moderador: configura el gestor compartido con su copy,
 * su acento y el estado del editor en memoria local.
 */
export function ModeratorVaultView() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiVaultItem | null>(null);

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
        searchPlaceholder: "Buscar en el banco oficial por término, IPA o traducción...",
        newLabel: "Nuevo Término Oficial",
        loadingLabel: "Cargando catálogo oficial...",
        emptyTitle: "No hay términos con estos filtros",
        emptyHint: "Podés añadir nuevos términos o ajustar los filtros de búsqueda.",
      }}
      editorIntent={{
        mode: isCreating ? "create" : editingItem ? "edit" : null,
        itemId: editingItem?.id ?? null,
      }}
      onRequestCreate={() => {
        setEditingItem(null);
        setIsCreating(true);
      }}
      onRequestEdit={(item) => {
        setIsCreating(false);
        setEditingItem(item);
      }}
      onCloseEditor={() => {
        setIsCreating(false);
        setEditingItem(null);
      }}
    />
  );
}
