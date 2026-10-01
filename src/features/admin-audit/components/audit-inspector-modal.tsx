"use client";

import React, { useState } from "react";
import { X, Copy, Check, Activity, Shield, Laptop, Layers } from "lucide-react";
import { AuditEvent } from "../types";

interface AuditInspectorModalProps {
  event: AuditEvent | null;
  onClose: () => void;
  onCopyNotice?: () => void;
}

export function AuditInspectorModal({
  event,
  onClose,
  onCopyNotice,
}: AuditInspectorModalProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "json">("visual");
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(event.payload, null, 2));
      setCopied(true);
      if (onCopyNotice) onCopyNotice();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy JSON:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-brand absolute top-0 left-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border-default pb-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
              <Activity size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{event.badge}</span>
                <span className="text-xs font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                  #{event.id}
                </span>
              </h3>
              <p className="text-[11px] text-slate-muted">
                {event.timestamp_utc} • {event.time_ago}
              </p>
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

        {/* Actor & Security Context Metadata Box */}
        <div className="p-3.5 bg-canvas rounded-2xl border border-border-default grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono flex-shrink-0">
          <div>
            <span className="text-slate-subtle block text-[9px] uppercase flex items-center gap-1">
              <Shield size={10} className="text-purple-400" />
              <span>Actor:</span>
            </span>
            <strong className="text-white truncate block">{event.actor_name}</strong>
          </div>
          <div>
            <span className="text-slate-subtle block text-[9px] uppercase">Rol de Usuario:</span>
            <span className="text-emerald-brand font-bold">{event.actor_role}</span>
          </div>
          <div>
            <span className="text-slate-subtle block text-[9px] uppercase flex items-center gap-1">
              <Laptop size={10} className="text-mint-brand" />
              <span>IP de Origen:</span>
            </span>
            <span className="text-mint-brand">{event.ip_address}</span>
          </div>
          <div>
            <span className="text-slate-subtle block text-[9px] uppercase flex items-center gap-1">
              <Layers size={10} className="text-blue-400" />
              <span>Entidad:</span>
            </span>
            <span className="text-slate-200 truncate block">{event.entity_id}</span>
          </div>
        </div>

        {/* Inspector Tab Switcher */}
        <div className="flex items-center justify-between gap-2 border-b border-border-default pb-2 flex-shrink-0">
          <div className="flex items-center gap-1 bg-canvas p-1 rounded-xl border border-border-default text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("visual")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === "visual"
                  ? "bg-card text-white shadow-sm"
                  : "text-slate-muted hover:text-white"
              }`}
            >
              Comparativa de Campos (Antes vs Después)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("json")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === "json"
                  ? "bg-card text-white shadow-sm"
                  : "text-slate-muted hover:text-white"
              }`}
            >
              Payload JSON Crudo
            </button>
          </div>

          {activeTab === "json" && (
            <button
              type="button"
              onClick={handleCopyJson}
              className="px-2.5 py-1 rounded-lg bg-canvas border border-border-default hover:border-purple-500/40 text-purple-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copied ? <Check size={12} className="text-emerald-brand" /> : <Copy size={12} />}
              <span>{copied ? "Copiado" : "Copiar JSON"}</span>
            </button>
          )}
        </div>

        {/* Inspector Body: Visual Diff Table */}
        {activeTab === "visual" && (
          <div className="flex-1 overflow-y-auto space-y-3">
            <div className="rounded-xl border border-border-default overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-card-hover text-slate-subtle border-b border-border-default font-mono uppercase text-[9px]">
                  <tr>
                    <th className="p-2.5">Campo Modificado</th>
                    <th className="p-2.5">Valor Anterior (Old)</th>
                    <th className="p-2.5">Valor Aplicado (New)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default font-mono">
                  {event.field_diffs.length > 0 ? (
                    event.field_diffs.map((diff, idx) => (
                      <tr key={idx} className="hover:bg-card-hover/40">
                        <td className="p-2.5 font-bold text-white text-xs">{diff.field}</td>
                        <td className="p-2.5 text-rose-400 line-through bg-rose-950/20">
                          {diff.oldVal}
                        </td>
                        <td className="p-2.5 text-emerald-400 font-bold bg-emerald-950/20">
                          {diff.newVal}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-3 text-slate-500 italic text-center">
                        Sin modificaciones directas de campos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-canvas border border-border-default text-[11px] text-slate-muted leading-relaxed">
              <strong className="text-white">Resumen: </strong>
              {event.summary}
            </div>
          </div>
        )}

        {/* Inspector Body: Raw JSON */}
        {activeTab === "json" && (
          <div className="flex-1 overflow-y-auto">
            <pre className="p-4 bg-canvas rounded-2xl border border-border-default font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
              {JSON.stringify(event.payload, null, 2)}
            </pre>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border-default flex-shrink-0 text-[11px] font-mono text-slate-subtle">
          <span>Inmutabilidad de registro garantizada (ADR-20)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-card border border-border-default text-slate-200 hover:text-white font-semibold cursor-pointer transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
