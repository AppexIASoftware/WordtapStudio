// Contratos compartidos del vault.
//
// `VaultAccent` distingue la presentación por rol (esmeralda para el docente y
// el admin, azul para el moderador) y `VaultEditorIntent` desacopla la fuente
// del estado del editor (URL en el admin, estado local en el moderador) de la
// vista que lo renderiza.

export type VaultAccent = "emerald" | "blue";

export interface VaultEditorIntent {
  mode: "create" | "edit" | null;
  itemId: string | null;
}
