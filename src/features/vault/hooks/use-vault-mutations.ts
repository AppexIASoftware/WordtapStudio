"use client";

// CRUD del banco editable del vault. Un solo lugar resuelve endpoint, caché y
// avisos: el docente gestiona su biblioteca privada y el admin y el moderador
// el banco oficial, así la vista no ramifica por rol.
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ApiVaultItem,
  CreateVaultItemPayload,
  UpdateVaultItemPayload,
  createOfficialVaultItemApi,
  updateOfficialVaultItemApi,
  deleteOfficialVaultItemApi,
  createTeacherPrivateVaultApi,
  updateTeacherPrivateVaultApi,
  deleteTeacherPrivateVaultApi,
} from "@/services/api";

export type VaultBank = "official" | "private";

interface UseVaultMutationsOptions {
  bank: VaultBank;
  queryKey: QueryKey;
  onToast: (message: string) => void;
}

export function useVaultMutations({ bank, queryKey, onToast }: UseVaultMutationsOptions) {
  const queryClient = useQueryClient();
  const baseKey = queryKey.slice(0, 1);
  const isOfficial = bank === "official";
  const bankLabel = isOfficial ? "el banco oficial" : "tu colección privada";

  const createMutation = useMutation({
    mutationFn: async (payload: CreateVaultItemPayload) => {
      const res = isOfficial
        ? await createOfficialVaultItemApi(payload)
        : await createTeacherPrivateVaultApi(payload);
      if (res.error || !res.data) throw new Error(res.error || "Error al crear término");
      return res.data;
    },
    onSuccess: (item) => {
      // Inserción optimista en caché para visualización instantánea (0 ms)
      queryClient.setQueryData(queryKey, (old: ApiVaultItem[] | undefined) =>
        old ? [item, ...old] : [item]
      );
      queryClient.invalidateQueries({ queryKey: baseKey });
      onToast(`¡"${item.target_text}" guardado en ${bankLabel}!`);
    },
    onError: (err: unknown) => {
      onToast(err instanceof Error ? err.message : "Error al guardar término");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateVaultItemPayload }) => {
      const res = isOfficial
        ? await updateOfficialVaultItemApi(id, payload)
        : await updateTeacherPrivateVaultApi(id, payload);
      if (res.error || !res.data) throw new Error(res.error || "Error al actualizar término");
      return res.data;
    },
    onSuccess: (item) => {
      // Actualización optimista en caché (0 ms)
      queryClient.setQueryData(queryKey, (old: ApiVaultItem[] | undefined) =>
        old ? old.map((it) => (it.id === item.id ? item : it)) : [item]
      );
      queryClient.invalidateQueries({ queryKey: baseKey });
      onToast(`¡"${item.target_text}" actualizado en ${bankLabel}!`);
    },
    onError: (err: unknown) => {
      onToast(err instanceof Error ? err.message : "Error al actualizar término");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = isOfficial
        ? await deleteOfficialVaultItemApi(id)
        : await deleteTeacherPrivateVaultApi(id);
      if (res.error) throw new Error(res.error);
      return id;
    },
    onSuccess: (_, deletedId) => {
      // Remoción optimista de la lista en 0 ms
      queryClient.setQueryData(queryKey, (old: ApiVaultItem[] | undefined) =>
        old ? old.filter((it) => it.id !== deletedId) : []
      );
      queryClient.invalidateQueries({ queryKey: baseKey });
      onToast(
        isOfficial ? "Término eliminado del banco oficial" : "Término eliminado de tu colección privada"
      );
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
