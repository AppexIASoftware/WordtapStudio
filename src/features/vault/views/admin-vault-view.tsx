"use client";

import { useUrlParams } from "@/hooks/use-url-params";
import { VaultOfficialManager } from "../components/vault-official-manager";

/**
 * Banco oficial para el admin: mismo gestor que usa el moderador, con el
 * estado del editor en la URL (?view=create|edit&itemId=…) para que cada
 * término sea direccionable.
 */
export function AdminVaultView() {
  const { get, setParams } = useUrlParams();
  const view = get("view");
  const itemId = get("itemId");

  return (
    <VaultOfficialManager
      accent="emerald"
      showCounter
      copy={{
        title: "Content Vault Maestro",
        badge: "Catálogo Global",
        subtitle:
          "Vocabulario, estructuras y fonética oficiales certificadas que se publican para los usuarios de la app.",
        searchPlaceholder: "Buscar en banco oficial por término, IPA o traducción...",
        newLabel: "Nuevo Término Oficial",
        loadingLabel: "Cargando unidades del catálogo...",
        emptyTitle: "No se encontraron términos en el banco oficial",
        emptyHint: "Probá ajustando los filtros o creá el primer término del catálogo.",
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
