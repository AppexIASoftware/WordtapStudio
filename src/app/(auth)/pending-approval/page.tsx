"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { useRouter } from "next/navigation";
import {
  getMyApplicationStatusApi,
  TeacherApplicationStatusResponse,
} from "@/services/api/teacher-applications";
import {
  getPublicSettingsApi,
  PublicSettings,
} from "@/services/api/settings";
import { setStoredRole } from "@/services/api";
import {
  Clock,
  CheckCircle2,
  Lock,
  RotateCcw,
  LogOut,
  AlertCircle,
  ShieldAlert,
  Mail,
  ExternalLink,
  Sun,
  Moon,
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { PendingProfileCard } from "@/features/auth/components/pending-profile-card";
import { parseSpecialtyTags } from "@/features/dashboard/components/specialty-tags-input";

const DEFAULT_AUTO_BIO = "Postulante registrado vía Google en Wordtap Studio";

function hasCompletedProfile(data: TeacherApplicationStatusResponse | null): boolean {
  if (!data) return false;
  const tags = parseSpecialtyTags(data.specialty || "");
  const bio = (data.bio || "").trim();
  return tags.length > 0 && bio.length >= 20 && bio !== DEFAULT_AUTO_BIO;
}

export default function PendingApprovalPage() {
  const { user, logout, refreshSession } = useAuth();
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  const [statusData, setStatusData] = useState<TeacherApplicationStatusResponse | null>(null);
  const [publicSettings, setPublicSettings] = useState<PublicSettings | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [stepInitialized, setStepInitialized] = useState(false);

  const fetchStatus = async () => {
    setIsChecking(true);
    setFeedbackMsg(null);
    try {
      const [resStatus, resSettings] = await Promise.all([
        getMyApplicationStatusApi(),
        getPublicSettingsApi(),
      ]);
      if (resSettings.data) {
        setPublicSettings(resSettings.data);
      }
      if (resStatus.data) {
        setStatusData(resStatus.data);
        if (!stepInitialized) {
          const skipToStatus =
            resStatus.data.status === "approved" ||
            resStatus.data.status === "suspended" ||
            hasCompletedProfile(resStatus.data);
          setActiveStep(skipToStatus ? 2 : 1);
          setStepInitialized(true);
        }
        if (resStatus.data.status === "approved") {
          setFeedbackMsg("¡Cuenta aprobada! Sincronizando credenciales docentes...");
          setStoredRole("instructor");
          await refreshSession();
          setFeedbackMsg("¡Cuenta aprobada! Redirigiendo al panel docente...");
          setTimeout(() => {
            router.push("/teacher");
          }, 800);
        } else if (resStatus.data.status === "suspended") {
          setFeedbackMsg("Tu cuenta docente se encuentra temporalmente suspendida.");
        } else if (resStatus.data.status === "rejected") {
          setFeedbackMsg("Tu postulación fue rechazada por el equipo de moderación.");
        }
      }
    } catch {
      setFeedbackMsg("No fue posible consultar el estado con el servidor.");
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      if (!active) return;
      await fetchStatus();
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isApproved = statusData?.status === "approved";
  const isRejected = statusData?.status === "rejected";
  const isSuspended = statusData?.status === "suspended";

  const showProfileEditor = !isApproved && !isSuspended;
  const currentSlide: 1 | 2 = showProfileEditor ? activeStep : 2;

  return (
    <div className="min-h-screen bg-canvas text-slate-100 flex flex-col justify-center items-center px-4 py-4 select-none relative">
      {/* Conmutador de tema discreto en esquina superior derecha */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-6">
        <button
          onClick={toggleTheme}
          className="px-2.5 py-1 rounded-xl bg-card border border-border-default hover:border-emerald-brand/40 text-xs text-slate-muted hover:text-emerald-brand transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          title="Cambiar Tema"
        >
          {isDark ? <Sun size={12} /> : <Moon size={12} />}
          <span className="text-[11px]">{isDark ? "Claro" : "Oscuro"}</span>
        </button>
      </div>

      {/* Contenedor central integrado: Marca + Stepper + Card + Footer */}
      <div className="w-full max-w-lg space-y-3">
        {/* Identidad de Marca integrada sobre la card */}
        <div className="text-center space-y-1">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-brand to-mint-brand flex items-center justify-center text-canvas font-black text-base shadow-glow-emerald mx-auto">
            W
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="font-black text-sm tracking-tight text-white">Wordtap</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wide badge-studio">
              Studio
            </span>
          </div>
        </div>

        {/* Indicador de pasos animado */}
        {showProfileEditor && (
          <div className="flex items-center justify-center gap-2 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                currentSlide === 1
                  ? "bg-emerald-brand/15 border-emerald-brand/40 text-emerald-brand font-bold"
                  : "bg-card border-border-default text-slate-muted hover:text-white"
              }`}
            >
              1. Perfil Académico
            </button>
            <span className="text-slate-subtle">→</span>
            <button
              type="button"
              disabled={!hasCompletedProfile(statusData)}
              onClick={() => setActiveStep(2)}
              className={`px-2.5 py-1 rounded-full border transition-all ${
                currentSlide === 2
                  ? "bg-emerald-brand/15 border-emerald-brand/40 text-emerald-brand font-bold"
                  : "bg-card border-border-default text-slate-muted"
              } disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer`}
            >
              2. Postulación
            </button>
          </div>
        )}

        {/* Card Principal con desplazamiento animado entre pasos */}
        <main className="bg-card border border-border-default rounded-3xl shadow-2xl overflow-hidden">
          <div
            className="flex w-[200%] transition-transform duration-300 ease-out"
            style={{
              transform: currentSlide === 1 ? "translateX(0%)" : "translateX(-50%)",
            }}
          >
            {/* Paso 1: Completar Perfil Académico */}
            <div className="w-1/2 p-5 sm:p-6 flex flex-col justify-between">
              <PendingProfileCard
                initialSpecialty={statusData?.specialty}
                initialBio={statusData?.bio}
                submitLabel="Guardar y Continuar →"
                onSaved={() => {
                  void fetchStatus();
                  setActiveStep(2);
                }}
              />
            </div>

            {/* Paso 2: Estado de Postulación Docente */}
            <div className="w-1/2 p-5 sm:p-6 space-y-3.5">
          {/* Header del estado */}
          <div className="text-center space-y-1.5">
            <div
              className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center border shadow-inner ${
                isApproved
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : isSuspended
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : isRejected
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse"
              }`}
            >
              {isApproved ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : isSuspended ? (
                <ShieldAlert className="w-6 h-6" />
              ) : isRejected ? (
                <AlertCircle className="w-6 h-6" />
              ) : (
                <Clock className="w-6 h-6" />
              )}
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {isApproved
                ? "¡Postulación Aprobada!"
                : isSuspended
                ? "Cuenta Docente Suspendida"
                : isRejected
                ? "Postulación Rechazada"
                : "Postulación Docente en Revisión"}
            </h1>

            <p className="text-[11px] text-slate-muted max-w-xs mx-auto leading-relaxed">
              {isApproved
                ? "Tu cuenta docente fue autorizada para publicar cursos y lecciones."
                : isSuspended
                ? `Motivo de la suspensión: ${statusData?.rejection_reason || "Suspensión administrativa preventiva."}`
                : isRejected
                ? `Motivo: ${statusData?.rejection_reason || "No cumple con los requisitos mínimos."}`
                : "Tu perfil fue recibido mediante Google OAuth y está en evaluación por moderación."}
            </p>
          </div>

          {/* Banner de alerta de suspensión */}
          {isSuspended && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-1 text-left">
              <div className="flex items-center gap-1.5 font-bold text-rose-300">
                <ShieldAlert size={14} className="flex-shrink-0" />
                <span>Acceso Restringido por Administración</span>
              </div>
              <p className="text-[11px] text-rose-200/90 leading-relaxed">
                Tu acceso al portal de autoría y publicación ha sido inhabilitado temporalmente. Si considerás que se trata de un error o deseás solicitar una reconsideración, contactá al equipo institucional.
              </p>
            </div>
          )}

          {/* Tarjeta de usuario */}
          <div className="p-3 rounded-2xl bg-canvas border border-border-default flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate pr-2">
              <div className="w-8 h-8 rounded-full bg-emerald-brand/10 border border-emerald-brand/30 text-emerald-brand font-bold text-xs flex items-center justify-center flex-shrink-0">
                {user.avatarInitials}
              </div>
              <div className="text-left truncate">
                <p className="text-xs font-bold text-white truncate leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-subtle font-mono truncate">{user.email}</p>
              </div>
            </div>
            <span
              className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border flex-shrink-0 ${
                isApproved
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : isSuspended
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                  : isRejected
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}
            >
              {statusData?.status || "pending"}
            </span>
          </div>

          {/* Fases compactas (3 pasos en grid) */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-canvas border border-border-default flex flex-col items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-brand" />
              <span className="text-[10px] font-bold text-white">1. Registro</span>
              <span className="text-[9px] text-slate-subtle font-mono">Completado</span>
            </div>

            <div
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
                isApproved
                  ? "bg-canvas border-border-default"
                  : isSuspended || isRejected
                  ? "bg-rose-500/5 border-rose-500/30 text-rose-300"
                  : "bg-amber-500/5 border-amber-500/30 text-amber-300"
              }`}
            >
              {isApproved ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-brand" />
              ) : isSuspended ? (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              ) : isRejected ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              )}
              <span className="text-[10px] font-bold text-white">
                {isSuspended ? "2. Estado" : "2. Revisión"}
              </span>
              <span
                className={`text-[9px] font-mono ${
                  isSuspended || isRejected ? "text-rose-400 font-bold" : "text-amber-400"
                }`}
              >
                {isSuspended ? "Suspendido" : isRejected ? "Rechazado" : "En proceso"}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-canvas/40 border border-border-default/60 opacity-60 flex flex-col items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-muted" />
              <span className="text-[10px] font-bold text-slate-300">3. Acceso</span>
              <span className="text-[9px] text-slate-subtle font-mono">Docente</span>
            </div>
          </div>

          {/* Contacto institucional compacto */}
          <div className="p-3 rounded-2xl bg-canvas border border-border-default flex items-center justify-between text-left">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-brand flex-shrink-0" />
              <span className="text-[11px] text-slate-muted">Contacto institucional:</span>
            </div>
            <a
              href={`mailto:${publicSettings?.contact_email || "soporte@wordtap.app"}`}
              className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-brand hover:underline"
            >
              <span>{publicSettings?.contact_email || "soporte@wordtap.app"}</span>
              <ExternalLink size={10} />
            </a>
          </div>

          {/* Feedback mensaje solo si existe alerta */}
          {feedbackMsg && (
            <p className="text-[11px] text-center p-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-mono">
              {feedbackMsg}
            </p>
          )}

          {/* Botones de acción */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={fetchStatus}
              disabled={isChecking}
              className="py-2.5 px-3 rounded-xl bg-card border border-border-default hover:border-emerald-brand text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`} />
              <span>{isChecking ? "Verificando..." : "Comprobar"}</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="py-2.5 px-3 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          {showProfileEditor && (
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="w-full py-1.5 text-[11px] font-semibold text-slate-muted hover:text-emerald-brand transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={12} />
              <span>Editar mi perfil académico</span>
            </button>
          )}
          </div>
          </div>
        </main>

        {/* Pie inferior limpio sin especificaciones técnicas */}
        <footer className="text-[10px] text-slate-subtle font-mono text-center">
          © 2026 Wordtap Inc. • Todos los derechos reservados
        </footer>
      </div>
    </div>
  );
}
