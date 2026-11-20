"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, GraduationCap, Check, AlertCircle, ExternalLink } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { updateTeacherProfileApi } from "@/services/api/auth";
import { SpecialtyTagsInput, MAX_SPECIALTY_LENGTH } from "./specialty-tags-input";

const MAX_BIO_LENGTH = 500;

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal de edición de credenciales académicas del docente (especialidad y biografía).
 */
export function TeacherProfileModal({ isOpen, onClose }: TeacherProfileModalProps) {
  const { user, refreshSession } = useAuth();
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSpecialty(user.specialty ?? "");
      setBio(user.bio ?? "");
      setError(null);
    }
  }, [isOpen, user.specialty, user.bio]);

  if (!isOpen) return null;

  const trimmedBio = bio.trim();
  const trimmedSpecialty = specialty.trim();
  const bioTooLong = trimmedBio.length > MAX_BIO_LENGTH;
  const specialtyTooLong = trimmedSpecialty.length > MAX_SPECIALTY_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bioTooLong) {
      setError(`La biografía académica no puede superar los ${MAX_BIO_LENGTH} caracteres.`);
      return;
    }
    if (specialtyTooLong) {
      setError(`La especialidad no puede superar los ${MAX_SPECIALTY_LENGTH} caracteres.`);
      return;
    }

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
      onClose();
    } catch {
      setError("No se pudo guardar tu perfil académico. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border-default shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-brand/15 border border-emerald-brand/30 flex items-center justify-center text-emerald-brand">
              <GraduationCap size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Perfil Académico Docente</h2>
              <p className="text-xs text-slate-subtle">
                Credenciales visibles para tus estudiantes en el catálogo de cursos.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-muted hover:text-white hover:bg-card-hover transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
              <label htmlFor="teacher-bio" className="text-xs font-semibold text-slate-200">
                Biografía y Trayectoria
              </label>
              <span className={`text-[11px] font-mono ${bioTooLong ? "text-rose-400" : "text-slate-subtle"}`}>
                {trimmedBio.length}/{MAX_BIO_LENGTH}
              </span>
            </div>
            <textarea
              id="teacher-bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe tu experiencia docente, certificaciones y enfoque pedagógico..."
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border-default text-sm text-white placeholder:text-slate-subtle focus:outline-none focus:border-emerald-brand transition-colors resize-none disabled:opacity-60"
            />
          </div>

          <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-border-default">
            <Link
              href="/teacher/profile"
              onClick={onClose}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-brand hover:underline"
            >
              <span>Abrir vista completa</span>
              <ExternalLink size={12} />
            </Link>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-card-hover border border-border-default transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || bioTooLong || specialtyTooLong}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-brand text-canvas hover:bg-mint-brand transition-colors cursor-pointer disabled:opacity-50"
              >
                <Check size={14} />
                <span>{isSubmitting ? "Guardando..." : "Guardar Perfil"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
