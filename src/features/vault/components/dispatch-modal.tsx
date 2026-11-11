"use client";

import { useState } from "react";
import { X, Send, Radio, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { ApiVaultItem, dispatchVaultWordApi, DispatchVaultWordResult } from "@/services/api";

interface DispatchVaultModalProps {
  item: ApiVaultItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDispatched?: (result: DispatchVaultWordResult) => void;
}

export function DispatchVaultModal({
  item,
  isOpen,
  onClose,
  onDispatched,
}: DispatchVaultModalProps) {
  const [audience, setAudience] = useState<"cefr" | "all" | "classroom">("cefr");
  const [cefrLevel, setCefrLevel] = useState<string>(item?.cefr_level || "A1");
  const [classroomId, setClassroomId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<DispatchVaultWordResult | null>(null);

  if (!isOpen || !item) return null;

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessResult(null);

    const payload = {
      target_audience: audience,
      target_cefr_level: audience === "cefr" ? cefrLevel : undefined,
      target_classroom_id: audience === "classroom" ? classroomId.trim() : undefined,
    };

    const res = await dispatchVaultWordApi(item.id, payload);
    setIsSubmitting(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else if (res.data) {
      setSuccessResult(res.data);
      onDispatched?.(res.data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card border border-border-default rounded-3xl shadow-2xl p-6 sm:p-7 relative space-y-5 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95">
        {/* Barra superior de acento */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-brand via-mint-brand to-emerald-dark absolute top-0 left-0" />

        {/* Cabecera */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border-default">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-brand/10 border border-emerald-brand/20 text-emerald-brand flex items-center justify-center font-bold flex-shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Despachar Reto de Vocabulario</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-brand/15 text-emerald-brand border border-emerald-brand/30 font-semibold">
                  Push + In-App
                </span>
              </div>
              <p className="text-xs text-slate-muted mt-0.5">
                Envía este término como recordatorio instantáneo a los alumnos.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-card text-slate-muted hover:text-white hover:bg-card-hover border border-border-default transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tarjeta del término */}
        <div className="p-4 rounded-2xl bg-canvas border border-border-default space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-white">{item.target_text}</span>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
              Nivel {item.cefr_level}
            </span>
          </div>
          <p className="text-xs text-slate-muted leading-relaxed">{item.prompt_text}</p>
          {item.ipa && (
            <p className="text-xs font-mono text-emerald-brand">{item.ipa}</p>
          )}
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successResult && (
          <div className="p-3.5 bg-emerald-brand/10 border border-emerald-brand/30 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-brand font-medium animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Reto despachado a {successResult.recipients_count} alumnos ({successResult.devices_count} dispositivos notificados).
            </span>
          </div>
        )}

        <form onSubmit={handleDispatch} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Audiencia Destino</label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-canvas rounded-2xl border border-border-default">
              <button
                type="button"
                onClick={() => setAudience("cefr")}
                className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                  audience === "cefr"
                    ? "bg-emerald-brand text-canvas shadow-sm"
                    : "text-slate-muted hover:text-white hover:bg-card-hover font-semibold"
                }`}
              >
                Por Nivel CEFR
              </button>
              <button
                type="button"
                onClick={() => setAudience("all")}
                className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                  audience === "all"
                    ? "bg-emerald-brand text-canvas shadow-sm"
                    : "text-slate-muted hover:text-white hover:bg-card-hover font-semibold"
                }`}
              >
                Todos los Alumnos
              </button>
              <button
                type="button"
                onClick={() => setAudience("classroom")}
                className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                  audience === "classroom"
                    ? "bg-emerald-brand text-canvas shadow-sm"
                    : "text-slate-muted hover:text-white hover:bg-card-hover font-semibold"
                }`}
              >
                Aula Específica
              </button>
            </div>
          </div>

          {audience === "cefr" && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Nivel de los Alumnos</label>
              <select
                value={cefrLevel}
                onChange={(e) => setCefrLevel(e.target.value)}
                className="w-full bg-canvas border border-border-default focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none transition-all cursor-pointer font-mono"
              >
                <option value="A1">A1 - Principiante</option>
                <option value="A2">A2 - Básico</option>
                <option value="B1">B1 - Intermedio</option>
                <option value="B2">B2 - Intermedio Alto</option>
                <option value="C1">C1 - Avanzado</option>
              </select>
            </div>
          )}

          {audience === "classroom" && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">ID del Aula</label>
              <input
                type="text"
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                placeholder="UUID o código del aula"
                className="w-full bg-canvas border border-border-default focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none transition-all font-mono"
                required
              />
            </div>
          )}

          <div className="pt-4 border-t border-border-default flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-canvas border border-border-default text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-brand hover:bg-mint-brand text-canvas font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-glow-emerald disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Despachando...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Lanzar Reto Móvil</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
