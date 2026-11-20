"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, Check, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { updateTeacherProfileApi } from "@/services/api/auth";
import { ToastNotification } from "@/components/ui/toast-notification";
import {
  SpecialtyTagsInput,
  MAX_SPECIALTY_LENGTH,
  parseSpecialtyTags,
} from "../components/specialty-tags-input";

const MAX_BIO_LENGTH = 500;

export function TeacherProfileView() {
  const { user, refreshSession } = useAuth();
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setSpecialty(user.specialty ?? "");
    setBio(user.bio ?? "");
  }, [user.specialty, user.bio]);

  const trimmedBio = bio.trim();
  const trimmedSpecialty = specialty.trim();
  const bioTooLong = trimmedBio.length > MAX_BIO_LENGTH;
  const specialtyTooLong = trimmedSpecialty.length > MAX_SPECIALTY_LENGTH;
  const previewTags = parseSpecialtyTags(trimmedSpecialty);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bioTooLong || specialtyTooLong) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const { error: apiError } = await updateTeacherProfileApi({
        specialty: trimmedSpecialty,
        bio: trimmedBio,
      });
      if (apiError) {
        setError(apiError);
        return;
      }
      await refreshSession();
      setToast("¡Perfil académico actualizado con éxito!");
      setTimeout(() => setToast(null), 3500);
    } catch {
      setError("No se pudo actualizar tu perfil académico.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <ToastNotification message={toast} variant="emerald" />

      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-emerald-brand/15 border border-emerald-brand/30 flex items-center justify-center text-emerald-brand">
          <GraduationCap size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Mi Perfil Académico Docente
          </h1>
          <p className="text-xs text-slate-muted">
            Personaliza tu especialidad y biografía. Esta información es visible para tus estudiantes en aulas y cursos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 p-6 rounded-2xl bg-card border border-border-default space-y-5"
        >
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <SpecialtyTagsInput
            value={specialty}
            onChange={setSpecialty}
            disabled={isSubmitting}
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="profile-bio" className="text-xs font-semibold text-slate-200">
                Biografía y Trayectoria
              </label>
              <span
                className={`text-[11px] font-mono ${
                  bioTooLong ? "text-rose-400" : "text-slate-subtle"
                }`}
              >
                {trimmedBio.length}/{MAX_BIO_LENGTH}
              </span>
            </div>
            <textarea
              id="profile-bio"
              rows={5}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isSubmitting}
              placeholder="Describe tu experiencia docente, certificaciones y enfoque pedagógico..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border-default text-sm text-white placeholder:text-slate-subtle focus:outline-none focus:border-emerald-brand transition-colors resize-none disabled:opacity-60"
            />
          </div>

          <div className="flex justify-end pt-2 border-t border-border-default">
            <button
              type="submit"
              disabled={isSubmitting || bioTooLong || specialtyTooLong}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-brand text-canvas hover:bg-mint-brand transition-colors cursor-pointer disabled:opacity-50"
            >
              <Check size={14} />
              <span>{isSubmitting ? "Guardando..." : "Guardar Perfil"}</span>
            </button>
          </div>
        </form>

        {/* Vista previa en vivo para estudiantes */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-card border border-border-default space-y-4 h-fit">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            <Sparkles size={13} className="text-emerald-brand" />
            <span>Vista previa del estudiante</span>
          </div>

          <div className="p-4 rounded-2xl bg-canvas border border-border-default space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-brand to-mint-brand flex items-center justify-center text-canvas font-bold text-sm flex-shrink-0">
                {user.avatarInitials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-brand/15 text-emerald-brand font-semibold">
                    Docente
                  </span>
                </div>
                <p className="text-[11px] text-slate-subtle truncate">{user.email}</p>
              </div>
            </div>

            {previewTags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {previewTags.map((tag, i) => (
                  <span
                    key={`${tag}-${i}`}
                    className="px-2 py-0.5 rounded-md bg-emerald-brand/10 border border-emerald-brand/25 text-emerald-brand text-[11px] font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-subtle italic">
                Agrega tags de especialidad para destacar tu perfil.
              </p>
            )}

            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {trimmedBio || "Tu biografía académica aparecerá aquí para tus alumnos."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
