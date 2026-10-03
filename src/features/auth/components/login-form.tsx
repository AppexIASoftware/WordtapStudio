"use client";

import { useLogin } from "../hooks/use-login";
import { DemoAccountsSelector } from "./demo-accounts-selector";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  LockKeyhole,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

export function LoginForm() {
  const {
    selectedRole,
    isLoading,
    statusMessage,
    googleClientReady,
    currentDemo,
    selectRole,
    loginWithDemo,
    handleGoogleSso,
  } = useLogin();

  const isSuspended =
    statusMessage?.toLowerCase().includes("suspend") ||
    statusMessage?.toLowerCase().includes("inactiv");
  const isErrorMessage =
    isSuspended ||
    statusMessage?.toLowerCase().includes("error") ||
    statusMessage?.toLowerCase().includes("bloqueó") ||
    statusMessage?.toLowerCase().includes("denegad") ||
    statusMessage?.toLowerCase().includes("falló");

  return (
    <div className="bg-card border border-border-default rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden backdrop-blur-xl">
      {/* Barra superior de acento */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-brand via-mint-brand to-emerald-dark absolute top-0 left-0" />

      {/* Cabecera */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-bold text-white">Acceso Institucional</h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30 flex items-center gap-1 font-semibold">
            <LockKeyhole className="w-2.5 h-2.5" />
            OAuth 2.0
          </span>
        </div>
        <p className="text-[11px] text-slate-muted mt-1 leading-relaxed">
          Ingreso restringido a docentes, moderadores y personal autorizados en la whitelist del sistema.
        </p>
      </div>

      {/* Banner de aviso de whitelist / proveedor exclusivo */}
      <div className="p-3 rounded-2xl bg-canvas/80 border border-border-default space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-brand flex-shrink-0" />
          <span>Autenticación delegada obligatoria</span>
        </div>
        <p className="text-[10.5px] text-slate-muted leading-relaxed">
          Por políticas de seguridad, Wordtap no utiliza contraseñas locales. Iniciá sesión con tu cuenta corporativa de Google pre-autorizada.
        </p>
      </div>

      {/* Mensaje de estado dinámico */}
      {statusMessage && (
        <div
          className={`p-3 rounded-2xl border text-xs font-medium flex items-start gap-2.5 transition-all ${
            isSuspended
              ? "bg-rose-500/15 border-rose-500/40 text-rose-200"
              : isErrorMessage
              ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
              : "bg-emerald-brand/10 border-emerald-brand/30 text-emerald-brand"
          }`}
        >
          {isSuspended ? (
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          ) : isErrorMessage ? (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-4 h-4 text-emerald-brand flex-shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            {isSuspended && (
              <p className="font-bold text-rose-300 text-xs">
                Acceso Bloqueado • Cuenta Suspendida
              </p>
            )}
            <p className="leading-relaxed text-[11px]">{statusMessage}</p>
          </div>
        </div>
      )}

      {/* Sección principal de inicio de sesión con Google */}
      <div className="space-y-2 pt-1">
        {/* Contenedor oficial Google Identity Services */}
        <div id="google-signin-container" className="w-full flex justify-center min-h-[44px]" />

        {/* Botón de fallback / trigger directo si el SDK no montó iframe aún */}
        {!googleClientReady && (
          <button
            type="button"
            onClick={handleGoogleSso}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand/50 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50 shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {isLoading ? "Procesando autenticación..." : "Continuar con Google Workspace"}
            </span>
          </button>
        )}
      </div>

      {/* Separador elegante para sandbox / pruebas de roles */}
      <div className="relative flex items-center justify-center pt-2">
        <div className="border-t border-border-default w-full" />
        <span className="bg-card px-3 text-[9px] uppercase font-mono text-slate-subtle tracking-wider absolute">
          simulador local de roles
        </span>
      </div>

      {/* Selector y botón de acceso Sandbox (1-Clic sin claves) */}
      <div className="space-y-2.5 bg-canvas/40 p-3 rounded-2xl border border-border-default/80">
        <DemoAccountsSelector
          selectedRole={selectedRole}
          onSelectRole={selectRole}
        />

        <button
          type="button"
          onClick={() => loginWithDemo()}
          disabled={isLoading}
          className="w-full py-2 px-3.5 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand text-emerald-brand hover:text-emerald-300 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>Acceder como {currentDemo.label} (Sandbox)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Aviso de seguridad y cumplimiento */}
      <div className="pt-1 border-t border-border-default/60 flex items-start gap-1.5 text-[9.5px] text-slate-subtle leading-tight">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-brand flex-shrink-0 mt-0.5" />
        <p>
          Aislamiento estricto por RBAC (ADR-30). Token JWT firmado con HMAC-SHA256
          y rotación automática de sesión. Cero credenciales locales almacenadas.
        </p>
      </div>
    </div>
  );
}
