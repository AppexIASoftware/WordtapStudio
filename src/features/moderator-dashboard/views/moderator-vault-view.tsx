"use client";

import { useState } from "react";
import {
  Search,
  Volume2,
  ShieldCheck,
} from "lucide-react";
import { CONTENT_VAULT_DATA, VAULT_BANK_CONFIGS } from "@/features/teacher-dashboard/data/mock-teacher-data";
import { ContentVaultItem } from "@/features/teacher-dashboard/types";

export function ModeratorVaultView() {
  const [items] = useState<ContentVaultItem[]>(CONTENT_VAULT_DATA);
  const [activeBank, setActiveBank] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [diffFilter, setDiffFilter] = useState<string>("all");
  const [cefrFilter, setCefrFilter] = useState<string>("all");
  const [verifiedIds, setVerifiedIds] = useState<Set<string>>(
    new Set(["v-1", "v-2", "v-3", "p-1", "col-1", "mp-1"])
  );

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      triggerToast("Pronunciando: " + text);
    }
  };

  const toggleVerify = (id: string, target: string) => {
    setVerifiedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        triggerToast(`Verificación retirada para "${target}"`);
      } else {
        next.add(id);
        triggerToast(`Sello de Calidad Pedagógica otorgado a "${target}"`);
      }
      return next;
    });
  };

  const filteredItems = items.filter((item) => {
    if (activeBank !== "all" && item.type !== activeBank) return false;
    if (diffFilter !== "all" && item.diff !== parseInt(diffFilter)) return false;
    if (cefrFilter !== "all" && item.cefr !== cefrFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPrompt = item.prompt.toLowerCase().includes(q);
      const matchTarget = item.target.toLowerCase().includes(q);
      const matchIpa = (item.ipa || "").toLowerCase().includes(q);
      return matchPrompt || matchTarget || matchIpa;
    }
    return true;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Toast flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-2.5 rounded-xl bg-slate-900 text-white border border-slate-700/80 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Content Vault Maestro (Supervisión Global)
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Certificación Oficial
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            Auditoría de fonética, precisión sintáctica y verificación de calidad del banco global de aprendizaje.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-card border border-border-default text-xs font-mono text-slate-300">
            Auditados:{" "}
            <strong className="text-emerald-brand">{verifiedIds.size}</strong> / {items.length}
          </span>
        </div>
      </div>

      {/* Píldoras de bancos */}
      <div className="p-3.5 rounded-2xl bg-card border border-border-default space-y-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {Object.keys(VAULT_BANK_CONFIGS).map((key) => {
            const conf = VAULT_BANK_CONFIGS[key];
            const isActive = activeBank === key;
            const count =
              key === "all"
                ? items.length
                : items.filter((i) => i.type === key).length;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveBank(key)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-canvas text-blue-300 font-bold border border-blue-500/40 shadow-sm"
                    : "bg-card border border-border-default text-slate-muted hover:text-white"
                }`}
              >
                <span>{conf.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    isActive ? "bg-blue-500/20 text-blue-300" : "bg-canvas text-slate-subtle"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Búsqueda y filtros */}
        <div className="pt-3 border-t border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-subtle" />
            <input
              type="text"
              placeholder="Buscar por término, traducción o fonética IPA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-canvas border border-border-default rounded-xl text-xs text-white focus:outline-none focus:border-blue-400 placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={diffFilter}
              onChange={(e) => setDiffFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-canvas border border-border-default rounded-xl text-slate-200 text-xs focus:outline-none focus:border-blue-400"
            >
              <option value="all">Todas las Dificultades</option>
              <option value="1">Nivel 1 (Fácil)</option>
              <option value="2">Nivel 2 (Medio)</option>
              <option value="3">Nivel 3 (Desafío)</option>
            </select>

            <select
              value={cefrFilter}
              onChange={(e) => setCefrFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-canvas border border-border-default rounded-xl text-slate-200 text-xs focus:outline-none focus:border-blue-400"
            >
              <option value="all">Todos los CEFR</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Auditoría */}
      <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Certificación</th>
                <th className="p-3.5">Banco / Tipo</th>
                <th className="p-3.5">Estímulo L1 (Español)</th>
                <th className="p-3.5">Solución L2 (Inglés)</th>
                <th className="p-3.5">IPA & Fonética</th>
                <th className="p-3.5">Nivel CEFR</th>
                <th className="p-3.5 text-right">Validación Pedagógica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {filteredItems.map((item) => {
                const isVerified = verifiedIds.has(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-card-hover/40 transition-colors ${
                      isVerified ? "bg-blue-500/5" : ""
                    }`}
                  >
                    <td className="p-3.5">
                      {isVerified ? (
                        <span className="flex items-center gap-1 text-emerald-brand font-mono font-bold text-[10px]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Certificado</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono text-[10px]">Pendiente</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-card border border-border-default text-slate-300">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-200">{item.prompt}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => speak(item.target)}
                          className="p-1 rounded-lg bg-canvas text-slate-muted hover:text-blue-400 border border-border-default transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-white text-xs">{item.target}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-mint-brand">{item.ipa}</td>
                    <td className="p-3.5 font-mono text-slate-300">{item.cefr}</td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => toggleVerify(item.id, item.target)}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                          isVerified
                            ? "bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500 hover:text-white"
                        }`}
                      >
                        {isVerified ? "Verificado ✓" : "Certificar Calidad"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
