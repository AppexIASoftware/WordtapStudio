"use client";

import { Bell, Wifi, Battery, ExternalLink, Sparkles } from "lucide-react";

interface DevicePreviewProps {
  title: string;
  body: string;
  actionUrl?: string;
  actionLabel?: string;
  type: string;
}

export function DevicePreview({ title, body, actionUrl, actionLabel, type }: DevicePreviewProps) {
  const displayTitle = title.trim() || "Título del aviso...";
  const displayBody =
    body.trim() || "Aquí se verá el mensaje completo que recibirán los alumnos en sus celulares...";

  const displayAction = actionLabel?.trim() || (actionUrl ? "Acción adjunta" : null);

  return (
    <div className="bg-card border border-border-default rounded-2xl p-6 sm:p-7 flex flex-col items-center shadow-sm relative">
      {/* Header sin barra decorativa superior */}
      <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-border-default/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Simulador Móvil
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Cajón de notificaciones en tiempo real</p>
          </div>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Preview
        </span>
      </div>

      {/* Mockup Celular */}
      <div className="w-full max-w-[320px] rounded-[36px] bg-background border-[5px] border-border-default p-3.5 shadow-xl relative ring-1 ring-border-default/40">
        {/* Dynamic Island / Cámara */}
        <div className="w-20 h-4 bg-muted/70 rounded-full mx-auto mb-2 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-background" />
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground px-2 mb-4 font-mono">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Notificación Flotante */}
        <div className="bg-card border border-border-default/90 rounded-2xl p-4 shadow-lg space-y-2.5">
          {/* Header notificación */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-sm font-black text-[10px]">
                W
              </div>
              <span className="text-xs font-semibold text-foreground tracking-tight">
                WordTap
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">• ahora</span>
            </div>
            <div className="w-5 h-5 rounded-full bg-background border border-border-default flex items-center justify-center text-muted-foreground">
              <Bell className="w-2.5 h-2.5" />
            </div>
          </div>

          {/* Cuerpo */}
          <div className="space-y-1 pl-0.5">
            <p className="text-xs font-semibold text-foreground line-clamp-1 leading-snug">
              {displayTitle}
            </p>
            <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed">
              {displayBody}
            </p>
          </div>

          {/* Footer de la notificación */}
          <div className="pt-2 flex items-center justify-between border-t border-border-default/60">
            <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground font-medium">
              {type === "promotion" ? "Promoción" : "Sistema"}
            </span>

            {displayAction && (
              <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium truncate max-w-[170px]" title={displayAction}>
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{displayAction}</span>
              </span>
            )}
          </div>
        </div>

        {/* Home indicator inferior simulado */}
        <div className="mt-8 mb-1.5 flex justify-center">
          <div className="w-24 h-1 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
