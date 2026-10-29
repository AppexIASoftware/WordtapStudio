"use client";

import { ApiVaultCategory } from "@/services/api";
import { CategoryCombobox } from "./category-combobox";

interface VaultDrawerConfigBarProps {
  bankType: string;
  categoryId?: string;
  categories?: ApiVaultCategory[];
  cefrLevel: string;
  difficulty: number;
  onBankTypeChange: (val: string) => void;
  onCategoryIdChange?: (val: string) => void;
  onCefrLevelChange: (val: string) => void;
  onDifficultyChange: (val: number) => void;
  onAddCategory?: (initialName?: string) => void;
}

export function VaultDrawerConfigBar({
  bankType,
  categoryId,
  categories = [],
  cefrLevel,
  difficulty,
  onBankTypeChange,
  onCategoryIdChange,
  onCefrLevelChange,
  onDifficultyChange,
  onAddCategory,
}: VaultDrawerConfigBarProps) {
  return (
    <div className="p-4 rounded-2xl bg-canvas border border-border-default grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Tipo de Contenido
        </label>
        <select
          value={bankType}
          onChange={(e) => onBankTypeChange(e.target.value)}
          className="w-full bg-card border border-border-default rounded-xl px-3 py-2 text-xs text-mint-brand font-semibold focus:outline-none focus:border-emerald-brand cursor-pointer"
        >
          <option value="vocabulary">word (Vocabulario)</option>
          <option value="phrase">phrase (Oraciones)</option>
          <option value="collocation">collocation (Colocaciones)</option>
          <option value="dialogue">dialogue (Micro-Diálogos)</option>
          <option value="idioms">idioms (Modismos)</option>
          <option value="slang">slang (Jerga)</option>
          <option value="business_english">business (Negocios)</option>
          <option value="false_friend">false_friend (Falsos Amigos)</option>
          <option value="minimal_pair">minimal_pair (Pares Mínimos)</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Categoría Temática
        </label>
        <CategoryCombobox
          value={categoryId}
          categories={categories}
          onChange={(id) => onCategoryIdChange?.(id)}
          onCreateNew={onAddCategory}
          placeholder="(Sin Categoría)"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Nivel CEFR
        </label>
        <select
          value={cefrLevel}
          onChange={(e) => onCefrLevelChange(e.target.value)}
          className="w-full bg-card border border-border-default rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-brand cursor-pointer"
        >
          <option value="A1">A1 — Principiante</option>
          <option value="A2">A2 — Elemental</option>
          <option value="B1">B1 — Intermedio</option>
          <option value="B2">B2 — Intermedio Alto</option>
          <option value="C1">C1 — Avanzado</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Dificultad Pedagógica
        </label>
        <select
          value={difficulty}
          onChange={(e) => onDifficultyChange(Number(e.target.value))}
          className="w-full bg-card border border-border-default rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-brand cursor-pointer"
        >
          <option value={1}>1 — Básico</option>
          <option value={2}>2 — Intermedio</option>
          <option value={3}>3 — Desafío</option>
        </select>
      </div>
    </div>
  );
}
