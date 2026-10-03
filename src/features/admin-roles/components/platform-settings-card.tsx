"use client";

import React, { useState, useEffect } from "react";
import {
  getPublicSettingsApi,
  updateSettingApi,
  PublicSettings,
} from "@/services/api/settings";
import { Building2, Mail, Save, Loader2, Globe } from "lucide-react";

interface PlatformSettingsCardProps {
  onNotify: (msg: string) => void;
  isAdmin: boolean;
}

export function PlatformSettingsCard({ onNotify, isAdmin }: PlatformSettingsCardProps) {
  const [settings, setSettings] = useState<PublicSettings>({
    contact_email: "soporte@wordtap.app",
    company_name: "Wordtap Studio",
    support_url: "https://wordtap.app/soporte",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getPublicSettingsApi().then(({ data }) => {
      setIsLoading(false);
      if (data) {
        setSettings(data);
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      onNotify("Solo administradores pueden modificar los datos institucionales");
      return;
    }

    setIsSaving(true);
    try {
      const [resEmail, resName, resUrl] = await Promise.all([
        updateSettingApi("contact_email", settings.contact_email),
        updateSettingApi("company_name", settings.company_name),
        updateSettingApi("support_url", settings.support_url),
      ]);

      if (resEmail.error || resName.error || resUrl.error) {
        onNotify("Error al guardar configuraciones institucionales");
      } else {
        onNotify("¡Datos institucionales actualizados correctamente!");
      }
    } catch {
      onNotify("No fue posible comunicarse con el servidor");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-border-default flex items-center justify-center gap-2 text-slate-muted">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-brand" />
        <span className="text-xs font-mono">Cargando datos institucionales...</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSave}
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
              disabled={!isAdmin || isSaving}
              value={settings.contact_email}
              onChange={(e) =>
                setSettings({ ...settings, contact_email: e.target.value })
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
              disabled={!isAdmin || isSaving}
              value={settings.company_name}
              onChange={(e) =>
                setSettings({ ...settings, company_name: e.target.value })
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
              disabled={!isAdmin || isSaving}
              value={settings.support_url}
              onChange={(e) =>
                setSettings({ ...settings, support_url: e.target.value })
              }
              placeholder="https://wordtap.app/soporte"
              className="w-full pl-9 pr-3 py-2 text-xs bg-canvas rounded-xl border border-border-default focus:border-emerald-brand focus:outline-none text-white font-mono disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={!isAdmin || isSaving}
          className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 cursor-pointer shadow-glow-emerald disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Save size={13} />
          )}
          <span>Guardar Datos Institucionales</span>
        </button>
      </div>
    </form>
  );
}
