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

export interface ContentVaultItem {
  id: string;
  type:
    | "vocabulary"
    | "phrase"
    | "collocation"
    | "minimal_pair"
    | "false_friend"
    | "dialogue"
    | "idioms"
    | "slang"
    | "business_english"
    | string;
  prompt: string;
  target: string;
  ipa?: string;
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  diff: 1 | 2 | 3;
  cat?: string;
  meta?: {
    pos?: string;
    example?: string;
    pattern?: string;
    verb?: string;
    collocate?: string;
    trap?: string;
    contrast?: string;
    wordA?: string;
    wordB?: string;
    tip?: string;
    [key: string]: unknown;
  };
}
