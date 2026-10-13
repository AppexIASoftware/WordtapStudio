"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Volume2,
  Trash2,
  Edit3,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import {
  getOfficialVaultItemsApi,
  createOfficialVaultItemApi,
  updateOfficialVaultItemApi,
  deleteOfficialVaultItemApi,
  CreateVaultItemPayload,
  UpdateVaultItemPayload,
  ApiVaultItem,
} from "@/services/api";
import { NewVaultItemModal } from "@/features/teacher-dashboard/components/new-vault-item-modal";
import { ToastNotification } from "@/components/ui/toast-notification";

export function ModeratorVaultView() {
  const queryClient = useQueryClient();
  const [activeBank, setActiveBank] = useState<string>("all");
  const [cefrFilter, setCefrFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiVaultItem | null>(null);

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

  const { data: officialData, isLoading } = useQuery({
    queryKey: ["moderator-official-vault", activeBank, cefrFilter, debouncedSearch],
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
  });

  const createMutation = useMutation({
    mutationFn: async (payload: CreateVaultItemPayload) => {
      const res = await createOfficialVaultItemApi(payload);
      if (res.error || !res.data) throw new Error(res.error || "Error al crear término oficial");
      return res.data;
    },
    onSuccess: (item) => {
      queryClient.setQueryData(
        ["moderator-official-vault", activeBank, cefrFilter, debouncedSearch],
        (old: ApiVaultItem[] | undefined) => (old ? [item, ...old] : [item])
      );
      queryClient.invalidateQueries({ queryKey: ["moderator-official-vault"] });
      queryClient.invalidateQueries({ queryKey: ["official-vault"] });
      triggerToast(`¡"${item.target_text}" incorporado al catálogo oficial de Wordtap!`);
    },
    onError: (err: unknown) => {
      triggerToast(err instanceof Error ? err.message : "Error al crear término");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateVaultItemPayload }) => {
      const res = await updateOfficialVaultItemApi(id, payload);
      if (res.error || !res.data) throw new Error(res.error || "Error al actualizar término oficial");
      return res.data;
    },
    onSuccess: (item) => {
      queryClient.setQueryData(
        ["moderator-official-vault", activeBank, cefrFilter, debouncedSearch],
        (old: ApiVaultItem[] | undefined) =>
          old ? old.map((it) => (it.id === item.id ? item : it)) : [item]
      );
      queryClient.invalidateQueries({ queryKey: ["moderator-official-vault"] });
      queryClient.invalidateQueries({ queryKey: ["official-vault"] });
      triggerToast(`¡"${item.target_text}" actualizado en el catálogo oficial!`);
    },
    onError: (err: unknown) => {
      triggerToast(err instanceof Error ? err.message : "Error al actualizar término");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteOfficialVaultItemApi(id);
      if (res.error) throw new Error(res.error);
      return id;
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(
        ["moderator-official-vault", activeBank, cefrFilter, debouncedSearch],
        (old: ApiVaultItem[] | undefined) =>
          old ? old.filter((it) => it.id !== deletedId) : []
      );
      queryClient.invalidateQueries({ queryKey: ["moderator-official-vault"] });
      queryClient.invalidateQueries({ queryKey: ["official-vault"] });
      triggerToast("Término eliminado del catálogo oficial");
    },
  });

  const items: ApiVaultItem[] = officialData || [];

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && text) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      <ToastNotification message={toastMessage} variant="blue" />

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Content Vault Maestro (Supervisión Global)
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Certificación Oficial
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            Gestión y auditoría del banco lingüístico universal de Wordtap. Todo ítem aquí es accesible por docentes en sus cursos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-card border border-border-default text-xs font-mono text-slate-300">
            Unidades oficiales: <strong className="text-emerald-brand">{items.length}</strong>
          </span>

          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setShowNewModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Término Oficial</span>
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
            placeholder="Buscar en el banco oficial por término, IPA o traducción..."
            className="w-full pl-9 pr-4 py-2 bg-canvas rounded-xl border border-border-default text-xs text-white focus:border-blue-500 focus:outline-none"
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

      {/* Grilla de Ítems */}
      {isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-muted bg-canvas rounded-2xl border border-border-default">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span className="text-xs font-mono">Cargando catálogo oficial...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-canvas rounded-2xl border border-border-default space-y-2">
          <ShieldCheck className="w-8 h-8 text-blue-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">No hay términos con estos filtros</h3>
          <p className="text-xs text-slate-muted max-w-md mx-auto">
            Podés añadir nuevos términos o ajustar los filtros de búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-card border border-border-default hover:border-blue-500/40 transition-all space-y-2.5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">{item.target_text}</span>
                    {item.ipa && (
                      <span className="text-[10px] font-mono text-mint-brand bg-mint-brand/10 px-1.5 py-0.5 rounded border border-mint-brand/20">
                        {item.ipa}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{item.prompt_text}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => speak(item.target_text)}
                    className="p-1.5 rounded-lg bg-canvas hover:bg-canvas-hover text-slate-400 hover:text-white cursor-pointer"
                    title="Escuchar audio nativo"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    className="p-1.5 rounded-lg bg-canvas hover:bg-canvas-hover text-slate-400 hover:text-blue-400 cursor-pointer"
                    title="Editar ítem oficial"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="p-1.5 rounded-lg bg-canvas hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 cursor-pointer"
                    title="Eliminar ítem oficial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border-default/60 text-[10px] font-mono text-slate-subtle">
                <span className="uppercase px-1.5 py-0.5 rounded bg-canvas border border-border-default">
                  {item.bank_type}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/25 font-bold">
                  Nivel {item.cefr_level}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para Crear/Editar Término Oficial */}
      <NewVaultItemModal
        isOpen={showNewModal || Boolean(editingItem)}
        initialItem={editingItem}
        isOfficial={true}
        onClose={() => {
          setShowNewModal(false);
          setEditingItem(null);
        }}
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
