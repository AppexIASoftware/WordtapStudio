"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPublicSettingsApi,
  updateSettingApi,
  PublicSettings,
} from "@/services/api/settings";
import { Building2, Mail, Save, Globe, AlertTriangle, X, Pencil } from "lucide-react";

interface PlatformSettingsCardProps {
  onNotify: (msg: string) => void;
  isAdmin: boolean;
}

const DEFAULT_SETTINGS: PublicSettings = {
  contact_email: "soporte@wordtap.app",
  company_name: "Wordtap Studio",
  support_url: "https://wordtap.app/soporte",
};

function PlatformSettingsSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border-default space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-52 rounded bg-slate-700/40" />
        <div className="h-3 w-36 rounded bg-slate-700/30" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="h-3 w-32 rounded bg-slate-700/30" />
            <div className="h-9 w-full rounded-xl bg-slate-700/40" />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <div className="h-8 w-44 rounded-xl bg-slate-700/40" />
      </div>
    </div>
  );
}

export function PlatformSettingsCard({ onNotify, isAdmin }: PlatformSettingsCardProps) {
  const queryClient = useQueryClient();
  const [draftSettings, setDraftSettings] = useState<PublicSettings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data: remoteSettings, isLoading } = useQuery<PublicSettings>({
    queryKey: ["public-settings"],
    queryFn: async () => {
      const { data } = await getPublicSettingsApi();
      return data || DEFAULT_SETTINGS;
    },
  });

  const formSettings = draftSettings ?? remoteSettings ?? DEFAULT_SETTINGS;
  const setFormSettings = (next: PublicSettings) => setDraftSettings(next);

  const handleRequestSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      onNotify("Solo administradores pueden modificar los datos institucionales");
      return;
    }
    setSaveError(null);
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!isAdmin || isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const [resEmail, resName, resUrl] = await Promise.all([
        updateSettingApi("contact_email", formSettings.contact_email),
        updateSettingApi("company_name", formSettings.company_name),
        updateSettingApi("support_url", formSettings.support_url),
      ]);

      const firstError = resEmail.error || resName.error || resUrl.error;
      if (firstError) {
        setSaveError(firstError);
        return;
      }

      onNotify("Datos institucionales actualizados correctamente.");
      queryClient.invalidateQueries({ queryKey: ["public-settings"] });
      setDraftSettings(null);
      setIsConfirmOpen(false);
      setIsEditing(false);
    } catch {
      setSaveError("No fue posible comunicarse con el servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <PlatformSettingsSkeleton />;
  }

  return (
    <>
      <form
        onSubmit={handleRequestSave}
        className="p-5 rounded-2xl bg-card border border-border-default space-y-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-emerald-brand" />
            <h4 className="text-sm font-bold text-white">Datos Institucionales & Soporte</h4>
          </div>
          <span className="text-[11px] font-mono text-slate-subtle">
            Visible en /pending-approval
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-subtle block">
              Correo de Contacto / Soporte
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-muted absolute left-3 top-3" />
              <input
                type="email"
                required
                disabled={!isAdmin || !isEditing || isSaving}
                value={formSettings.contact_email}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, contact_email: e.target.value })
                }
                placeholder="soporte@wordtap.app"
                className="w-full pl-9 pr-3 py-2 text-xs bg-canvas rounded-xl border border-border-default focus:border-emerald-brand focus:outline-none text-white font-mono disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-subtle block">
              Nombre de la Empresa
            </label>
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 text-slate-muted absolute left-3 top-3" />
              <input
                type="text"
                required
                disabled={!isAdmin || !isEditing || isSaving}
                value={formSettings.company_name}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, company_name: e.target.value })
                }
                placeholder="Wordtap Studio"
                className="w-full pl-9 pr-3 py-2 text-xs bg-canvas rounded-xl border border-border-default focus:border-emerald-brand focus:outline-none text-white disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-subtle block">
              Enlace de Ayuda (URL)
            </label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-slate-muted absolute left-3 top-3" />
              <input
                type="url"
                disabled={!isAdmin || !isEditing || isSaving}
                value={formSettings.support_url}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, support_url: e.target.value })
                }
                placeholder="https://wordtap.app/soporte"
                className="w-full pl-9 pr-3 py-2 text-xs bg-canvas rounded-xl border border-border-default focus:border-emerald-brand focus:outline-none text-white font-mono disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          {!isEditing ? (
            <button
              type="button"
              disabled={!isAdmin}
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-200 hover:text-white hover:border-emerald-brand/60 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Pencil size={13} />
              <span>Habilitar edición</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => {
                  setDraftSettings(null);
                  setIsEditing(false);
                }}
                className="px-3.5 py-2 rounded-xl text-slate-muted hover:text-white font-semibold text-xs cursor-pointer transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isAdmin || isSaving}
                className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 cursor-pointer shadow-glow-emerald disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={13} />
                <span>Guardar Datos Institucionales</span>
              </button>
            </>
          )}
        </div>
      </form>

      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center">
                  <Save size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Actualizar datos institucionales</h3>
                  <p className="text-[11px] text-slate-muted">Confirmación de cambios públicos</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isSaving && setIsConfirmOpen(false)}
                disabled={isSaving}
                className="w-7 h-7 rounded-lg bg-canvas text-slate-muted hover:text-white flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-1 text-[11px]">
              <p className="font-bold text-white">{formSettings.company_name}</p>
              <p className="font-mono text-slate-subtle">{formSettings.contact_email}</p>
              <p className="font-mono text-slate-subtle truncate">{formSettings.support_url}</p>
            </div>

            <p className="text-slate-300 leading-relaxed">
              Estos datos son visibles para todos los postulantes en la pantalla de espera y soporte.
            </p>

            {saveError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2 text-[11px]">
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                <span>{saveError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isSaving}
                className="px-3.5 py-2 rounded-xl text-slate-muted hover:text-white font-semibold cursor-pointer transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmSave()}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold hover:bg-mint-brand transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? "Guardando..." : "Confirmar actualización"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
