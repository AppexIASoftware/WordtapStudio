"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Volume2,
  Gamepad2,
  Layers,
} from "lucide-react";
import { CONTENT_VAULT_DATA, VAULT_BANK_CONFIGS } from "../data/mock-teacher-data";
import { ContentVaultItem } from "../types";
import { ToastNotification } from "@/components/ui/toast-notification";

export function VaultView() {
  const [items, setItems] = useState<ContentVaultItem[]>(CONTENT_VAULT_DATA);
  const [activeBank, setActiveBank] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [diffFilter, setDiffFilter] = useState<string>("all");
  const [cefrFilter, setCefrFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal states
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [showNewBankModal, setShowNewBankModal] = useState(false);
  const [bankConfigs, setBankConfigs] = useState(VAULT_BANK_CONFIGS);

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

  // Filtrado de elementos
  const filteredItems = items.filter((item) => {
    if (activeBank !== "all" && item.type !== activeBank) return false;
    if (diffFilter !== "all" && item.diff !== parseInt(diffFilter)) return false;
    if (cefrFilter !== "all" && item.cefr !== cefrFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPrompt = item.prompt.toLowerCase().includes(q);
      const matchTarget = item.target.toLowerCase().includes(q);
      const matchIpa = (item.ipa || "").toLowerCase().includes(q);
      const matchCat = (item.cat || "").toLowerCase().includes(q);
      const matchMeta = JSON.stringify(item.meta || {}).toLowerCase().includes(q);
      return matchPrompt || matchTarget || matchIpa || matchCat || matchMeta;
    }

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredItems.length && filteredItems.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map((i) => i.id)));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    triggerToast("Ítem eliminado del Content Vault");
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "vocabulary":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-brand/15 text-emerald-brand border border-emerald-brand/30">
            Vocabulario
          </span>
        );
      case "phrase":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            Oración
          </span>
        );
      case "collocation":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            Colocación
          </span>
        );
      case "minimal_pair":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Par Mínimo
          </span>
        );
      case "false_friend":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            Falso Amigo
          </span>
        );
      case "dialogue":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            Micro-Diálogo
          </span>
        );
      case "idioms":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            Modismo
          </span>
        );
      case "slang":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-600/15 text-amber-400 border border-amber-600/30">
            Slang
          </span>
        );
      case "business_english":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
            Negocios
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-500/20 text-slate-300">
            {type}
          </span>
        );
    }
  };

  const getDiffBadge = (diff: number) => {
    if (diff === 1) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-brand/20 text-emerald-brand">
          Nivel 1 (Fácil)
        </span>
      );
    }
    if (diff === 2) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
          Nivel 2 (Medio)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400">
        Nivel 3 (Desafío)
      </span>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast flotante */}
      <ToastNotification message={toastMessage} variant="emerald" />

      {/* Banner de encabezado con selector multilingüe */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Banco Unificado de Contenidos
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-dark/50 text-emerald-brand border border-emerald-brand/30">
              Content Vault
            </span>

            {/* Selector de par lingüístico */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-card rounded-xl border border-border-default text-xs font-mono">
              <span className="text-slate-subtle text-[10px] uppercase font-bold">
                Par Lingüístico:
              </span>
              <select
                defaultValue="es-en"
                onChange={(e) => triggerToast(`Par lingüístico activo: ${e.target.value.toUpperCase()}`)}
                className="bg-transparent text-emerald-brand font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="es-en">Español (L1) &rarr; Inglés (L2 Target)</option>
                <option value="es-fr" disabled>
                  Español (L1) &rarr; Francés (L2) [Próximo]
                </option>
                <option value="es-de" disabled>
                  Español (L1) &rarr; Alemán (L2) [Próximo]
                </option>
              </select>
            </div>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            Núcleo polimórfico de datos de aprendizaje para alimentar lecciones y minijuegos con niveles automáticos (vocabulario, oraciones, colocaciones, fonética y trampas léxicas).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/teacher/gamification"
            className="px-3.5 py-2 rounded-xl bg-card border border-border-default hover:border-emerald-brand text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-emerald-brand" />
            <span>Crear Minijuego con Niveles</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowNewItemModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ Nuevo Ítem</span>
          </button>
        </div>
      </div>

      {/* Barra dinámica de tipos de bancos (Pills) */}
      <div className="p-3.5 rounded-2xl bg-card border border-border-default space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {Object.keys(bankConfigs).map((key) => {
              const conf = bankConfigs[key];
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
                      ? "bg-canvas text-emerald-brand font-bold border border-emerald-brand/40 shadow-sm"
                      : "bg-card border border-border-default text-slate-muted hover:text-white"
                  }`}
                >
                  <span>{conf.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      isActive
                        ? "bg-emerald-brand/20 text-emerald-brand"
                        : "bg-canvas text-slate-subtle"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setShowNewBankModal(true)}
              className="px-3 py-1.5 rounded-xl border border-dashed border-border-default hover:border-emerald-brand text-slate-muted hover:text-emerald-brand text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3 stroke-[2.5]" />
              <span>+ Personalizar Tipo</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-subtle font-mono">
            {activeBank === "all"
              ? `Mostrando todos los bancos (${items.length} ítems)`
              : `Filtrando: ${bankConfigs[activeBank]?.label}`}
          </span>
        </div>

        {/* Fila secundaria: Dificultad, CEFR y búsqueda en tiempo real */}
        <div className="pt-3 border-t border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-subtle" />
            <input
              type="text"
              placeholder="Buscar por término, estímulo, fonética, trampa o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-canvas border border-border-default rounded-xl text-xs text-white focus:outline-none focus:border-emerald-brand placeholder-slate-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-subtle font-mono uppercase">
                Dificultad:
              </span>
              <select
                value={diffFilter}
                onChange={(e) => setDiffFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-canvas border border-border-default rounded-xl text-slate-200 text-xs focus:outline-none focus:border-emerald-brand cursor-pointer"
              >
                <option value="all">Todas las Dificultades</option>
                <option value="1">Nivel 1 (Básico)</option>
                <option value="2">Nivel 2 (Intermedio)</option>
                <option value="3">Nivel 3 (Desafío)</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-subtle font-mono uppercase">CEFR:</span>
              <select
                value={cefrFilter}
                onChange={(e) => setCefrFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-canvas border border-border-default rounded-xl text-slate-200 text-xs focus:outline-none focus:border-emerald-brand cursor-pointer"
              >
                <option value="all">Todos los Niveles</option>
                <option value="A1">A1 Beginner</option>
                <option value="A2">A2 Elementary</option>
                <option value="B1">B1 Intermediate</option>
                <option value="B2">B2 Upper-Int</option>
                <option value="C1">C1 Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla Universal Polimórfica */}
      <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3.5 w-8">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.size === filteredItems.length && filteredItems.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="accent-emerald-brand cursor-pointer"
                  />
                </th>
                <th className="p-3.5">Banco / Tipo</th>
                <th className="p-3.5">Estímulo (Prompt / Español)</th>
                <th className="p-3.5">Solución (Target / Inglés)</th>
                <th className="p-3.5">Detalle Pedagógico & Metadatos</th>
                <th className="p-3.5">Nivel CEFR</th>
                <th className="p-3.5">Dificultad</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {filteredItems.map((item) => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isSelected ? "bg-emerald-brand/5" : "hover:bg-card-hover/40"
                    }`}
                  >
                    <td className="p-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectItem(item.id)}
                        className="accent-emerald-brand cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5">{getTypeBadge(item.type)}</td>
                    <td className="p-3.5 font-medium text-slate-200">{item.prompt}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => speak(item.target)}
                          className="p-1 rounded-lg bg-canvas text-slate-muted hover:text-emerald-brand border border-border-default transition-colors cursor-pointer"
                          title="Escuchar audio nativo"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-white text-xs">{item.target}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <div className="space-y-0.5">
                        {item.ipa && (
                          <span className="font-mono text-[11px] text-mint-brand mr-2">
                            {item.ipa}
                          </span>
                        )}
                        {item.meta?.example && (
                          <span className="text-[11px] text-slate-400 italic block">
                            {item.meta.example}
                          </span>
                        )}
                        {item.meta?.trap && (
                          <span className="text-[10px] text-amber-300 font-mono block">
                            ⚠️ {item.meta.trap}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-canvas border border-border-default text-emerald-brand">
                        {item.cefr}
                      </span>
                    </td>
                    <td className="p-3.5">{getDiffBadge(item.diff)}</td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-rose-400 hover:text-rose-300 font-medium text-xs cursor-pointer p-1"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border-default flex items-center justify-between text-xs text-slate-subtle font-mono">
          <div className="flex items-center gap-2">
            <span>Mostrando {filteredItems.length} de {items.length} ítems registrados</span>
            {selectedIds.size > 0 && (
              <span className="text-emerald-brand font-bold">
                ({selectedIds.size} seleccionados para Minijuego)
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="px-2.5 py-1 rounded bg-canvas border border-border-default opacity-50 cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => triggerToast("Página 1 de 1")}
              className="px-2.5 py-1 rounded bg-canvas border border-border-default hover:text-white cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: NUEVO ÍTEM DEL VAULT */}
      {showNewItemModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-brand" />
                <span>Añadir Nuevo Ítem al Content Vault</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewItemModal(false)}
                className="text-slate-muted hover:text-white font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Tipo / Banco de Destino
                </label>
                <select
                  id="vault-item-type"
                  className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 outline-none focus:border-emerald-brand"
                >
                  <option value="vocabulary">Vocabulario Fundamental</option>
                  <option value="phrase">Frases & Oraciones</option>
                  <option value="collocation">Colocaciones & Phrasal Verbs</option>
                  <option value="minimal_pair">Fonética & Pares Mínimos</option>
                  <option value="false_friend">Falsos Amigos (Cognados)</option>
                  <option value="idioms">Idioms & Modismos</option>
                  <option value="slang">Slang Urbano</option>
                  <option value="business_english">Negocios & Corporativo</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Estímulo (Español / Prompt)
                  </label>
                  <input
                    type="text"
                    id="vault-item-prompt"
                    placeholder="Ej: tomar una decisión"
                    className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Solución (Inglés / Target)
                  </label>
                  <input
                    type="text"
                    id="vault-item-target"
                    placeholder="Ej: make a decision"
                    className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white font-bold outline-none focus:border-emerald-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">IPA</label>
                  <input
                    type="text"
                    id="vault-item-ipa"
                    placeholder="/meɪk/"
                    className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-mint-brand font-mono outline-none focus:border-emerald-brand"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">CEFR</label>
                  <select
                    id="vault-item-cefr"
                    className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 outline-none focus:border-emerald-brand"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1" selected>B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Dificultad</label>
                  <select
                    id="vault-item-diff"
                    className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 outline-none focus:border-emerald-brand"
                  >
                    <option value="1">1 (Fácil)</option>
                    <option value="2" selected>2 (Medio)</option>
                    <option value="3">3 (Desafío)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Ejemplo o Trampa Léxica (Opcional)
                </label>
                <input
                  type="text"
                  id="vault-item-example"
                  placeholder='Ej: "We must make a decision." / Trampa: no decir "do a decision"'
                  className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowNewItemModal(false)}
                className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const type =
                    (document.getElementById("vault-item-type") as HTMLSelectElement)
                      ?.value || "vocabulary";
                  const prompt =
                    (
                      document.getElementById("vault-item-prompt") as HTMLInputElement
                    )?.value.trim() || "Estímulo";
                  const target =
                    (
                      document.getElementById("vault-item-target") as HTMLInputElement
                    )?.value.trim() || "Target";
                  const ipa =
                    (document.getElementById("vault-item-ipa") as HTMLInputElement)
                      ?.value.trim() || "";
                  const cefr = (
                    (document.getElementById("vault-item-cefr") as HTMLSelectElement)
                      ?.value || "B1"
                  ) as ContentVaultItem["cefr"];
                  const diff = parseInt(
                    (document.getElementById("vault-item-diff") as HTMLSelectElement)
                      ?.value || "2"
                  ) as 1 | 2 | 3;
                  const example = (
                    document.getElementById("vault-item-example") as HTMLInputElement
                  )?.value.trim();

                  const newItem: ContentVaultItem = {
                    id: `v-${Date.now()}`,
                    type,
                    prompt,
                    target,
                    ipa,
                    cefr,
                    diff,
                    meta: { example },
                  };

                  setItems((prev) => [newItem, ...prev]);
                  setShowNewItemModal(false);
                  triggerToast(`¡"${target}" agregado al Vault!`);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold shadow-glow-emerald"
              >
                Guardar Ítem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NUEVO TIPO DE BANCO PERSONALIZADO */}
      {showNewBankModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-brand" />
                <span>Nuevo Tipo de Banco Personalizado</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewBankModal(false)}
                className="text-slate-muted hover:text-white font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">Nombre Visible</label>
                <input
                  type="text"
                  id="new-bank-label"
                  placeholder="Ej: Fonética Británica Especial"
                  className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-200 mb-1">Slug Técnico</label>
                <input
                  type="text"
                  id="new-bank-slug"
                  placeholder="Ej: fonetica_uk"
                  className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white font-mono outline-none focus:border-emerald-brand"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowNewBankModal(false)}
                className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const label =
                    (
                      document.getElementById("new-bank-label") as HTMLInputElement
                    )?.value.trim() || "Nuevo Banco";
                  const slug =
                    (
                      document.getElementById("new-bank-slug") as HTMLInputElement
                    )?.value.trim() || `bank_${Date.now()}`;

                  setBankConfigs((prev) => ({
                    ...prev,
                    [slug]: { label, color: "emerald", desc: "Banco personalizado" },
                  }));
                  setActiveBank(slug);
                  setShowNewBankModal(false);
                  triggerToast(`¡Banco "${label}" registrado!`);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold shadow-glow-emerald"
              >
                Crear Banco
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
