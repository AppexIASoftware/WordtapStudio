"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Globe, Lock, Loader2, Sparkles } from "lucide-react";
import { getOfficialVaultItemsApi, getTeacherPrivateVaultApi, ApiVaultItem } from "@/services/api";
import { NewVaultItemModal } from "@/features/vault/components/new-vault-item-modal";
import { ToastNotification } from "@/components/ui/toast-notification";
import { useUrlParams, useUrlParam } from "@/hooks/use-url-params";
import { VaultItemCard } from "@/features/vault/components/vault-item-card";
import { useVaultMutations } from "@/features/vault/hooks/use-vault-mutations";

const TEACHER_VAULT_TABS = ["official", "private"] as const;

export function VaultView() {
  const { get, setParams } = useUrlParams();
  // El banco activo vive en la URL para que la pestaña sea compartible.
  const [activeTab, setActiveTab] = useUrlParam<"official" | "private">(
    "tab",
    TEACHER_VAULT_TABS,
    "official"
  );
  // El docente edita su biblioteca privada; el banco oficial es de solo lectura.
  const canEdit = activeTab === "private";

  // Filtros y búsqueda viven locales; el resto del estado de vista vive en la URL.
  const [activeBank, setActiveBank] = useState<string>("all");
  const [cefrFilter, setCefrFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Estado de vista derivado de la URL (misma convención que juegos y aulas).
  const view = get("view");
  const itemId = get("itemId");

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

  const { data: officialData, isLoading: loadingOfficial } = useQuery({
    queryKey: ["official-vault", activeBank, cefrFilter, debouncedSearch],
    queryFn: async () => {
      const res = await getOfficialVaultItemsApi({
        bank_type: activeBank,
        cefr_level: cefrFilter,
        q: debouncedSearch,
        limit: 60,
      });
      return res.data?.items || [];
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
    enabled: activeTab === "official",
  });

  const { data: privateData, isLoading: loadingPrivate } = useQuery({
    queryKey: ["private-vault", activeBank, cefrFilter, debouncedSearch],
    queryFn: async () => {
      const res = await getTeacherPrivateVaultApi({
        bank_type: activeBank,
        cefr_level: cefrFilter,
        q: debouncedSearch,
        limit: 50,
      });
      return res.data?.items || [];
    },
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
    enabled: activeTab === "private",
  });

  // Las mutaciones del docente apuntan siempre a su biblioteca privada.
  const { createMutation, updateMutation, deleteMutation } = useVaultMutations({
    bank: "private",
    queryKey: ["private-vault", activeBank, cefrFilter, debouncedSearch],
    onToast: triggerToast,
  });

  const items: ApiVaultItem[] = activeTab === "official" ? officialData || [] : privateData || [];
  const isLoading = activeTab === "official" ? loadingOfficial : loadingPrivate;

  // El ítem en edición se resuelve desde la URL contra los datos ya cargados.
  const editingItem: ApiVaultItem | null =
    view === "edit" && itemId ? items.find((it) => it.id === itemId) ?? null : null;
  const isEditorOpen = canEdit && (view === "create" || editingItem !== null);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      <ToastNotification message={toastMessage} />

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Content Vault</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/20">
              {activeTab === "official" ? "Catálogo Wordtap" : "Mi Colección Privada"}
            </span>
          </h1>
          <p className="text-xs text-slate-muted mt-1">
            {activeTab === "official"
              ? "Vocabulario, estructuras y fonética oficiales certificadas listas para usar en tus cursos."
              : "Tu repositorio exclusivo de términos pedagógicos personales para tus cursos."}
          </p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => setParams({ view: "create", itemId: null }, "push")}
            className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs flex items-center gap-2 hover:brightness-110 cursor-pointer shadow-lg shadow-emerald-brand/10"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Término Privado</span>
          </button>
        )}
      </div>

      {/* Selector de Pestañas */}
      <div className="flex items-center gap-3 border-b border-border-default pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("official", { clear: ["view", "itemId"] })}
          className={`flex items-center gap-2 pb-1.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
            activeTab === "official"
              ? "border-emerald-brand text-white"
              : "border-transparent text-slate-muted hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-brand" />
          <span>Banco Oficial Wordtap</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("private", { clear: ["view", "itemId"] })}
          className={`flex items-center gap-2 pb-1.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
            activeTab === "private"
              ? "border-blue-500 text-white"
              : "border-transparent text-slate-muted hover:text-white"
          }`}
        >
          <Lock className="w-4 h-4 text-blue-400" />
          <span>Mi Biblioteca Privada</span>
        </button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "official"
                ? "Buscar en banco oficial por término, IPA o traducción..."
                : "Buscar en mis términos personales..."
            }
            className="w-full pl-9 pr-4 py-2 bg-canvas rounded-xl border border-border-default text-xs text-white focus:border-emerald-brand focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeBank}
            onChange={(e) => setActiveBank(e.target.value)}
            className="px-3 py-2 bg-canvas rounded-xl border border-border-default text-xs text-white focus:outline-none"
          >
            <option value="all">Todos los Tipos</option>
            <option value="vocabulary">Vocabulario</option>
            <option value="phrase">Oraciones</option>
            <option value="collocation">Colocaciones</option>
            <option value="idioms">Modismos</option>
            <option value="false_friend">Falsos Amigos</option>
            <option value="minimal_pair">Pares Mínimos</option>
          </select>

          <select
            value={cefrFilter}
            onChange={(e) => setCefrFilter(e.target.value)}
            className="px-3 py-2 bg-canvas rounded-xl border border-border-default text-xs text-white focus:outline-none"
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

      {/* Grilla de Tarjetas */}
      {isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-muted bg-canvas rounded-2xl border border-border-default">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-brand" />
          <span className="text-xs font-mono">Cargando unidades del catálogo...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-canvas rounded-2xl border border-border-default space-y-3">
          <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">
            {activeTab === "official"
              ? "No se encontraron términos en el banco oficial"
              : "Tu biblioteca privada todavía está vacía"}
          </h3>
          <p className="text-xs text-slate-muted max-w-md mx-auto">
            {activeTab === "official"
              ? "Probá ajustando los filtros de búsqueda o nivel CEFR."
              : "Podés añadir términos exclusivos para utilizarlos más tarde en tus cursos."}
          </p>
          {canEdit && (
            <button
              type="button"
              onClick={() => setParams({ view: "create", itemId: null }, "push")}
              className="mt-2 px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Crear mi primer término</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <VaultItemCard
              key={item.id}
              item={item}
              canEdit={canEdit}
              deleteTitle="Eliminar de mi biblioteca"
              onEdit={(it) => setParams({ view: "edit", itemId: it.id }, "push")}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      {/* Modal para crear o editar el término del banco activo */}
      <NewVaultItemModal
        isOpen={isEditorOpen}
        initialItem={editingItem}
        isOfficial={activeTab === "official"}
        onClose={() => setParams({ view: null, itemId: null }, "replace")}
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
