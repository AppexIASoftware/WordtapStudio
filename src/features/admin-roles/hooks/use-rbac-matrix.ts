"use client";

import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RbacMatrixState } from "../types";
import {
  RBAC_MODULES_DATA,
  RBAC_SETTING_KEY,
  buildInitialRbacState,
  mergeRbacState,
  serializeRbacOverrides,
} from "../data/rbac-data";
import { getAllSettingsApi, updateSettingApi } from "@/services/api/settings";
import { RbacModalAction, RBAC_MODAL_ACTION } from "../components/rbac-confirm-modal";

const ROLES_ORDER = ["student", "instructor", "moderator", "admin"] as const;

export function useRbacMatrix(isAdmin: boolean, onNotify: (msg: string) => void) {
  const queryClient = useQueryClient();
  const [localEdits, setLocalEdits] = useState<RbacMatrixState | null>(null);
  const [rbacModalAction, setRbacModalAction] = useState<RbacModalAction | null>(null);
  const [isRbacSubmitting, setIsRbacSubmitting] = useState(false);
  const [rbacError, setRbacError] = useState<string | null>(null);

  const { data: platformSettings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await getAllSettingsApi();
      return res.data || [];
    },
  });

  const rbacBaseline = useMemo<RbacMatrixState>(() => {
    if (!platformSettings) return buildInitialRbacState();
    const saved = platformSettings.find((s) => s.key === RBAC_SETTING_KEY);
    return mergeRbacState(saved?.value);
  }, [platformSettings]);

  const rbacState = localEdits ?? rbacBaseline;

  const diffCount = useMemo(() => {
    let count = 0;
    for (const key in rbacState) {
      for (const r of ROLES_ORDER) {
        if (rbacState[key]?.[r]?.val !== rbacBaseline[key]?.[r]?.val) {
          count++;
        }
      }
    }
    return count;
  }, [rbacState, rbacBaseline]);

  const isDirty = diffCount > 0;

  const matrixStats = useMemo(() => {
    let totalPerms = 0;
    let invariantCount = 0;
    let toggleCount = 0;

    RBAC_MODULES_DATA.forEach((mod) => {
      mod.permissions.forEach((perm) => {
        totalPerms++;
        const state = rbacState[perm.key];
        ROLES_ORDER.forEach((r) => {
          if (state?.[r]?.locked) invariantCount++;
          else toggleCount++;
        });
      });
    });

    return { totalPerms, invariantCount, toggleCount };
  }, [rbacState]);

  const handleTogglePermission = (
    key: string,
    role: "student" | "instructor" | "moderator" | "admin",
    checked: boolean
  ) => {
    if (!isAdmin) {
      onNotify("Acceso denegado: Solo administradores pueden modificar la matriz RBAC");
      return;
    }

    setLocalEdits((prev) => {
      const base = prev ?? rbacBaseline;
      return {
        ...base,
        [key]: {
          ...base[key],
          [role]: {
            ...base[key][role],
            val: checked,
          },
        },
      };
    });
  };

  const requestReset = () => {
    if (!isAdmin) {
      onNotify("Acceso denegado: Solo administradores pueden restablecer permisos");
      return;
    }
    setRbacError(null);
    setRbacModalAction(RBAC_MODAL_ACTION.RESET);
  };

  const requestSave = () => {
    if (!isAdmin) {
      onNotify("Acceso denegado: Solo administradores pueden modificar permisos");
      return;
    }
    if (diffCount === 0) {
      onNotify("No hay cambios pendientes en la matriz de permisos");
      return;
    }
    setRbacError(null);
    setRbacModalAction(RBAC_MODAL_ACTION.SAVE);
  };

  const closeModal = () => {
    if (!isRbacSubmitting) {
      setRbacModalAction(null);
      setRbacError(null);
    }
  };

  const confirmModal = async () => {
    if (!rbacModalAction || isRbacSubmitting) return;
    setIsRbacSubmitting(true);
    setRbacError(null);

    const targetState =
      rbacModalAction === RBAC_MODAL_ACTION.RESET ? buildInitialRbacState() : rbacState;
    const res = await updateSettingApi(RBAC_SETTING_KEY, serializeRbacOverrides(targetState));
    setIsRbacSubmitting(false);

    if (res.error) {
      setRbacError(res.error);
      return;
    }

    setLocalEdits(null);
    await queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    await queryClient.invalidateQueries({ queryKey: ["rbac", "me"] });
    onNotify(
      rbacModalAction === RBAC_MODAL_ACTION.RESET
        ? "Matriz restablecida y sincronizada con el servidor."
        : `Matriz guardada en el servidor (${diffCount} cambio${diffCount === 1 ? "" : "s"}).`
    );
    setRbacModalAction(null);
  };

  return {
    rbacState,
    diffCount,
    isDirty,
    matrixStats,
    rbacModalAction,
    isRbacSubmitting,
    rbacError,
    handleTogglePermission,
    requestReset,
    requestSave,
    closeModal,
    confirmModal,
  };
}
