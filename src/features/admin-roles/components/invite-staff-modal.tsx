"use client";

import React, { useState } from "react";
import { UserPlus, X, Mail, Shield, BookOpen, Globe } from "lucide-react";
import { StaffMember, StaffRole } from "../types";

interface InviteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (newMember: StaffMember) => void;
}

export function InviteStaffModal({ isOpen, onClose, onInvite }: InviteStaffModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("Docente");
  const [quota, setQuota] = useState("5 cursos máx.");
  const [scope, setScope] = useState("Global (EN ↔ ES)");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const initials = email
      .split("@")[0]
      .split(".")
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || "")
      .join("") || email.substring(0, 2).toUpperCase();

    const nameParts = email.split("@")[0].replace(/[._-]/g, " ");
    const formattedName =
      (role === "Docente" ? "Prof. " : "Lic. ") +
      nameParts
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");

    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      name: formattedName,
      email: email.trim(),
      role,
      scope,
      quota,
      status: "Invitación Pendiente",
      avatar: initials,
      avatarBg: role === "Docente" ? "bg-emerald-brand/20 text-emerald-brand" : "bg-blue-500/20 text-blue-400",
    };

    onInvite(newStaff);
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl relative overflow-hidden">
        {/* Barra superior de acento */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-brand via-mint-brand to-purple-500 absolute top-0 left-0" />

        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center font-bold">
              <UserPlus size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Invitar Miembro del Staff</h3>
              <p className="text-[11px] text-slate-muted">Envío de invitación con token único seguro (ADR-08)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-canvas text-slate-muted hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <Mail size={13} className="text-emerald-brand" />
              <span>Correo Electrónico Institucional</span>
            </label>
            <input
              type="email"
              required
              placeholder="docente@wordtap.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-canvas border border-border-default rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-brand text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <Shield size={13} className="text-purple-400" />
                <span>Rol a Asignar</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 focus:outline-none focus:border-emerald-brand text-xs cursor-pointer"
              >
                <option value="Docente">Docente (Instructor)</option>
                <option value="Moderador">Moderador Oficial</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <BookOpen size={13} className="text-blue-400" />
                <span>Cuota de Borradores</span>
              </label>
              <select
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 focus:outline-none focus:border-emerald-brand text-xs cursor-pointer"
              >
                <option value="3 cursos máx.">3 cursos</option>
                <option value="5 cursos máx.">5 cursos</option>
                <option value="10 cursos máx.">10 cursos</option>
                <option value="Ilimitado">Ilimitado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <Globe size={13} className="text-mint-brand" />
              <span>Alcance / Idiomas Permitidos</span>
            </label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 focus:outline-none focus:border-emerald-brand text-xs cursor-pointer"
            >
              <option value="Global (EN ↔ ES)">Global (Español ↔ Inglés)</option>
              <option value="Inglés Médico / Especializado">Inglés Médico / Especializado</option>
              <option value="Fonética & Pronunciación">Fonética & Pronunciación</option>
              <option value="Inglés Corporativo & Negocios">Inglés Corporativo & Negocios</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-canvas border border-border-default text-[11px] text-slate-subtle leading-relaxed">
            Se generará un enlace tokenizado de alta seguridad:{" "}
            <code className="text-emerald-brand font-mono">
              studio.wordtap.app/invite?token=wt_tok_...
            </code>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-muted hover:text-white font-semibold cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald flex items-center gap-1.5"
            >
              <UserPlus size={14} />
              <span>Generar y Enviar Enlace</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
