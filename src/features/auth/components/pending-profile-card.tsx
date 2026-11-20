"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { applyTeacherApi } from "@/services/api/teacher-applications";
import {
  SpecialtyTagsInput,
  MAX_SPECIALTY_LENGTH,
  parseSpecialtyTags,
} from "@/features/dashboard/components/specialty-tags-input";

const MAX_BIO_LENGTH = 500;
const MIN_BIO_LENGTH = 20;
const DEFAULT_AUTO_BIO = "Postulante registrado vía Google en Wordtap Studio";

function sanitizeInitialBio(raw?: string | null): string {
  const trimmed = (raw ?? "").trim();
  return trimmed === DEFAULT_AUTO_BIO ? "" : trimmed;
}

interface PendingProfileCardProps {
  initialSpecialty?: string | null;
  initialBio?: string | null;
  submitLabel?: string;
  onSaved?: () => void;
}

export function PendingProfileCard({
  initialSpecialty,
  initialBio,
  submitLabel = "Guardar y Continuar →",
  onSaved,
}: PendingProfileCardProps) {
  const [specialty, setSpecialty] = useState(initialSpecialty ?? "");
  const [bio, setBio] = useState(() => sanitizeInitialBio(initialBio));
  const [savedSnapshot, setSavedSnapshot] = useState({
    specialty: initialSpecialty ?? "",
    bio: sanitizeInitialBio(initialBio),
  });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    const nextSpec = initialSpecialty ?? "";
    const nextBio = sanitizeInitialBio(initialBio);
    setSpecialty(nextSpec);
    setBio(nextBio);
    setSavedSnapshot({ specialty: nextSpec, bio: nextBio });
  }, [initialSpecialty, initialBio]);

  const trimmedSpecialty = specialty.trim();
  const trimmedBio = bio.trim();
  const tags = parseSpecialtyTags(trimmedSpecialty);

  const hasTags = tags.length > 0;
  const hasCustomBio = trimmedBio.length >= MIN_BIO_LENGTH;
  const isComplete = hasTags && hasCustomBio;
  const completionPct = (hasTags ? 50 : 0) + (hasCustomBio ? 50 : 0);

  const isDirty =
    trimmedSpecialty !== savedSnapshot.specialty.trim() ||
    trimmedBio !== savedSnapshot.bio.trim();

  const invalid =
    trimmedSpecialty.length > MAX_SPECIALTY_LENGTH ||
    trimmedBio.length > MAX_BIO_LENGTH;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (invalid) return;
    if (!hasTags) {
      setFeedback({ type: "err", text: "Elige o escribe al menos una especialidad." });
      return;
    }
    if (!hasCustomBio) {
      setFeedback({
        type: "err",
        text: `Escribe una biografía breve (mínimo ${MIN_BIO_LENGTH} caracteres).`,
      });
      return;
    }

    if (!isDirty && isComplete) {
      onSaved?.();
      return;
    }

    setIsSaving(true);
    setFeedback(null);
    try {
      const { error } = await applyTeacherApi({
        specialty: trimmedSpecialty,
        bio: trimmedBio,
      });
      if (error) {
        setFeedback({ type: "err", text: error });
        return;
      }
      setSavedSnapshot({ specialty: trimmedSpecialty, bio: trimmedBio });
      onSaved?.();
    } catch {
      setFeedback({ type: "err", text: "No se pudo guardar tu perfil. Intenta de nuevo." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 text-left">
      {/* Cabecera con icono y barra de progreso */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-brand/15 border border-emerald-brand/30 flex items-center justify-center text-emerald-brand flex-shrink-0 shadow-inner">
              <GraduationCap size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Tu Perfil Docente
              </h2>
              <p className="text-[11px] text-slate-muted">
                Cuéntale a tus alumnos en qué te especializas
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-brand/10 border border-emerald-brand/25 text-[11px] font-mono font-bold text-emerald-brand">
            {completionPct}%
          </span>
        </div>

        <div className="h-1.5 w-full rounded-full bg-canvas overflow-hidden border border-border-default/60">
          <div
            className="h-full bg-gradient-to-r from-emerald-brand to-mint-brand transition-all duration-300"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Especialidades con sugerencias interactivas */}
      <SpecialtyTagsInput
        value={specialty}
        onChange={(val) => {
          setSpecialty(val);
          if (feedback?.type === "err") setFeedback(null);
        }}
        disabled={isSaving}
      />

      {/* Biografía */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="pending-bio" className="text-xs font-semibold text-slate-200">
            Sobre ti (Biografía)
          </label>
          <span
            className={`text-[11px] font-mono ${
              trimmedBio.length > MAX_BIO_LENGTH
                ? "text-rose-400"
                : hasCustomBio
                ? "text-emerald-400"
                : "text-slate-subtle"
            }`}
          >
            {trimmedBio.length}/{MAX_BIO_LENGTH}
          </span>
        </div>
        <textarea
          id="pending-bio"
          rows={3}
          value={bio}
          onChange={(e) => {
            setBio(e.target.value);
            if (feedback?.type === "err") setFeedback(null);
          }}
          disabled={isSaving}
          placeholder="Ej. Docente certificado TESOL con 5 años enseñando inglés de negocios y preparación IELTS..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-border-default text-xs text-white placeholder:text-slate-subtle focus:outline-none focus:border-emerald-brand transition-colors resize-none"
        />
        <div className="flex items-center gap-1.5 text-[11px]">
          {hasCustomBio ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 size={12} />
              <span>Biografía lista</span>
            </span>
          ) : (
            <span className="text-slate-subtle">
              Faltan{" "}
              <span className="text-amber-400 font-mono font-semibold">
                {MIN_BIO_LENGTH - trimmedBio.length}
              </span>{" "}
              caracteres para continuar
            </span>
          )}
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-300">
          <AlertCircle size={13} className="flex-shrink-0" />
          <span>{feedback.text}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSaving || invalid}
        className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-brand to-mint-brand text-canvas hover:brightness-105 active:scale-[0.99] shadow-glow-emerald transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <span>
          {isSaving
            ? "Guardando perfil..."
            : isDirty || !isComplete
            ? submitLabel.replace(/\s*→\s*$/, "")
            : "Continuar a Postulación"}
        </span>
        <ArrowRight size={15} />
      </button>
    </form>
  );
}
