"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import {
  getOfficialVaultItemsApi,
  getVaultCategoriesApi,
  ApiVaultItem,
  ApiVaultCategory,
} from "@/services/api";
import { NewVaultItemModal } from "./new-item-modal";
import { ToastNotification } from "@/components/ui/toast-notification";
import { useVaultMutations } from "../hooks/use-vault-mutations";
import { VaultAccent, VaultEditorIntent } from "../types/vault";
import { VaultItemCard } from "./item-card";

// El acento solo cambia colores; la estructura del gestor es una sola.
const MANAGER_ACCENT: Record<
  VaultAccent,
  { badge: string; button: string; search: string; spinner: string; emptyIcon: string }
> = {
  emerald: {
    badge: "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/20",
    button: "bg-emerald-brand text-canvas hover:brightness-110 shadow-emerald-brand/10",
    search: "focus:border-emerald-brand",
    spinner: "text-emerald-brand",
    emptyIcon: "text-slate-500",
  },
  blue: {
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    button: "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10",
    search: "focus:border-blue-500",
    spinner: "text-blue-400",
    emptyIcon: "text-blue-400",
  },
};

export interface VaultOfficialCopy {
  title: string;
  badge: string;
  subtitle: string;
  searchPlaceholder: string;
  newLabel: string;
  loadingLabel: string;
  emptyTitle: string;
  emptyHint: string;
}

interface VaultOfficialManagerProps {
  copy: VaultOfficialCopy;
  accent?: VaultAccent;
  showCounter?: boolean;
  emptyIcon?: "sparkles" | "shield";
  editorIntent: VaultEditorIntent;
  onRequestCreate: () => void;
  onRequestEdit: (item: ApiVaultItem) => void;
  onCloseEditor: () => void;
}

/**
 * Gestor del banco oficial global, compartido por el admin y el moderador.
 *
 * La búsqueda y los filtros viven acá porque los dos roles los comportan igual;
 * el estado del editor lo aporta cada rol (URL en el admin, estado local en el
 * moderador) como una intención, y acá se resuelve contra los datos cargados.
 */
export function VaultOfficialManager({
  copy,
  accent = "emerald",
  showCounter = false,
  emptyIcon = "sparkles",
  editorIntent,
  onRequestCreate,
  onRequestEdit,
  onCloseEditor,
}: VaultOfficialManagerProps) {
  const tone = MANAGER_ACCENT[accent];
  const [activeBank, setActiveBank] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cefrFilter, setCefrFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const { data: categories = [] } = useQuery<ApiVaultCategory[]>({
    queryKey: ["vault-categories"],
    queryFn: async () => {
      const res = await getVaultCategoriesApi();
      return res.data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  // Clave única del banco oficial: docente, admin y moderador comparten la
  // misma caché, así una edición se refleja al instante en las tres vistas.
  const queryKey = [
    "official-vault",
    activeBank,
    selectedCategory,
    cefrFilter,
    debouncedSearch,
  ];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await getOfficialVaultItemsApi({
        bank_type: activeBank,
        category: selectedCategory,
        cefr_level: cefrFilter,
        q: debouncedSearch,
        limit: 60,
      });
      return res.data?.items || [];
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const { createMutation, updateMutation, deleteMutation } = useVaultMutations({
    bank: "official",
    queryKey,
    onToast: triggerToast,
  });

  const items: ApiVaultItem[] = data || [];

  // El ítem en edición se resuelve contra los datos cargados, así la intención
  // puede venir de la URL sin duplicar la lista.
  const editingItem =
    editorIntent.mode === "edit" && editorIntent.itemId
      ? items.find((it) => it.id === editorIntent.itemId) ?? null
      : null;
  const isEditorOpen = editorIntent.mode === "create" || editingItem !== null;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      <ToastNotification
        message={toastMessage}
        variant={accent === "blue" ? "blue" : "emerald"}
      />

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {copy.title}
            </h1>
            <span
              className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${tone.badge}`}
            >
              {copy.badge}
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">{copy.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {showCounter && (
            <span className="px-3 py-1.5 rounded-xl bg-card border border-border-default text-xs font-mono text-slate-300">
              Unidades oficiales: <strong className="text-emerald-brand">{items.length}</strong>
            </span>
          )}

          <button
            type="button"
            onClick={onRequestCreate}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg transition-colors ${tone.button}`}
          >
            <Plus className="w-4 h-4" />
            <span>{copy.newLabel}</span>
          </button>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={copy.searchPlaceholder}
            className={`w-full pl-9 pr-4 py-2 bg-canvas rounded-xl border border-border-default text-xs text-white focus:outline-none ${tone.search}`}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-canvas rounded-xl border border-border-default text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={activeBank}
            onChange={(e) => setActiveBank(e.target.value)}
            className="px-3 py-2 bg-canvas rounded-xl border border-border-default text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="all">Todos los Tipos</option>
            <option value="vocabulary">Vocabulario</option>
            <option value="phrase">Oraciones</option>
            <option value="collocation">Colocaciones</option>
            <option value="dialogue">Micro-Diálogos</option>
            <option value="idioms">Modismos</option>
            <option value="slang">Jerga (Slang)</option>
            <option value="business_english">Negocios</option>
            <option value="false_friend">Falsos Amigos</option>
            <option value="minimal_pair">Pares Mínimos</option>
          </select>

          <select
            value={cefrFilter}
            onChange={(e) => setCefrFilter(e.target.value)}
            className="px-3 py-2 bg-canvas rounded-xl border border-border-default text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="all">Todos los Niveles</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
        </div>
      </div>

      {/* Grilla de Ítems */}
      {isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-muted bg-canvas rounded-2xl border border-border-default">
          <Loader2 className={`w-6 h-6 animate-spin ${tone.spinner}`} />
          <span className="text-xs font-mono">{copy.loadingLabel}</span>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-canvas rounded-2xl border border-border-default space-y-2">
          {emptyIcon === "shield" ? (
            <ShieldCheck className={`w-8 h-8 mx-auto ${tone.emptyIcon}`} />
          ) : (
            <Sparkles className={`w-8 h-8 mx-auto ${tone.emptyIcon}`} />
          )}
          <h3 className="text-sm font-bold text-white">{copy.emptyTitle}</h3>
          <p className="text-xs text-slate-muted max-w-md mx-auto">{copy.emptyHint}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <VaultItemCard
              key={item.id}
              item={item}
              accent={accent}
              canEdit
              editTitle="Editar ítem oficial"
              deleteTitle="Eliminar ítem oficial"
              onEdit={onRequestEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      {/* Modal para Crear/Editar Término Oficial */}
      <NewVaultItemModal
        isOpen={isEditorOpen}
        initialItem={editingItem}
        isOfficial={true}
        canCreateCategory
        onClose={onCloseEditor}
        onSave={async (payload, id) => {
          if (id) {
            await updateMutation.mutateAsync({ id, payload });
          } else {
            await createMutation.mutateAsync(payload);
          }
        }}
      />
    </div>
  );
}
