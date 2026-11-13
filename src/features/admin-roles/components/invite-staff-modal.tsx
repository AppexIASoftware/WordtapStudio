"use client";

import React, { useState } from "react";
import { UserPlus, X, Mail, Shield, User, AlertCircle } from "lucide-react";
import {
  STAFF_ROLE_VALUE,
  StaffRoleValue,
  ProvisionStaffPayload,
} from "@/services/api/staff";

interface InviteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (payload: ProvisionStaffPayload) => Promise<{ ok: boolean; error?: string }>;
}

export function InviteStaffModal({ isOpen, onClose, onInvite }: InviteStaffModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<StaffRoleValue>(STAFF_ROLE_VALUE.ADMIN);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    setErrorMsg(null);
    const res = await onInvite({
      email: email.trim(),
      name: name.trim() || undefined,
      role,
    });
    setSubmitting(false);

    if (!res.ok) {
      setErrorMsg(res.error || "No se pudo integrar el usuario.");
      return;
    }

    setEmail("");
    setName("");
    setRole(STAFF_ROLE_VALUE.ADMIN);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center font-bold">
              <UserPlus size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Integrar Usuario Staff</h3>
              <p className="text-[11px] text-slate-muted">
                Alta o promoción directa de administradores, moderadores y docentes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-7 h-7 rounded-lg bg-canvas text-slate-muted hover:text-white flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2 text-[11px]">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <Mail size={13} className="text-emerald-brand" />
              <span>Correo Electrónico Institucional</span>
            </label>
            <input
              type="email"
              required
              placeholder="admin@wordtap.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-canvas border border-border-default rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-brand text-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <User size={13} className="text-blue-400" />
              <span>Nombre Completo (opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Ej. Laura Méndez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-canvas border border-border-default rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-brand text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <Shield size={13} className="text-purple-400" />
              <span>Rol a Asignar</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as StaffRoleValue)}
              className="w-full px-3 py-2.5 bg-canvas border border-border-default rounded-xl text-slate-200 focus:outline-none focus:border-emerald-brand text-xs cursor-pointer"
            >
              <option value={STAFF_ROLE_VALUE.ADMIN}>Administrador (Super Admin)</option>
              <option value={STAFF_ROLE_VALUE.MODERATOR}>Moderador Oficial</option>
              <option value={STAFF_ROLE_VALUE.INSTRUCTOR}>Docente (Instructor)</option>
            </select>
          </div>

          {role === STAFF_ROLE_VALUE.ADMIN ? (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[11px] text-purple-200 leading-relaxed">
              Este usuario tendrá acceso completo a gobernanza, facturación, políticas de acceso y gestión de otros administradores.
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-canvas border border-border-default text-[11px] text-slate-subtle leading-relaxed">
              Si la cuenta ya existe, se actualizará su rol inmediatamente. Si es nueva, quedará habilitada para ingresar con Google usando este correo.
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-3.5 py-2 rounded-xl text-slate-muted hover:text-white font-semibold cursor-pointer transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <UserPlus size={14} />
              <span>{submitting ? "Integrando..." : "Integrar al Equipo"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
