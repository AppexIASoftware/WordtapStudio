"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSpeak } from "@/hooks/use-speak";
import {
  Database,
  X,
  Search,
  Globe,
  Lock,
  Loader2,
  Volume2,
  Check,
} from "lucide-react";
import {
  getOfficialVaultItemsApi,
  getTeacherPrivateVaultApi,
  ApiVaultItem,
} from "@/services/api";
import { LessonItem, Lesson } from "@/features/courses/types";

interface VaultDrawerProps {
  isOpen: boolean;
  currentLesson: Lesson;
  onClose: () => void;
  onImportItem: (item: Omit<LessonItem, "id">, contentBankItemId?: string) => void;
  /**
   * "Mi Colección" es la biblioteca privada del docente. El admin cura el
   * catálogo en lugar de tener colección propia, así que no debe verla.
   */
  showPrivateCollection?: boolean;
}

export function VaultDrawer({
  isOpen,
  currentLesson,
  onClose,
  onImportItem,
  showPrivateCollection = true,
}: VaultDrawerProps) {
  const [activeSource, setActiveSource] = useState<"official" | "private">("official");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [bankType, setBankType] = useState("all");
  const [cefrLevel, setCefrLevel] = useState("all");
  const [importingId, setImportingId] = useState<string | null>(null);
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  // Sin fuente privada disponible, la única fuente válida es la oficial.
  useEffect(() => {
    if (!showPrivateCollection && activeSource !== "official") {
      setActiveSource("official");
    }
  }, [showPrivateCollection, activeSource]);

  const { data: officialData, isLoading: loadingOfficial } = useQuery({
    queryKey: ["vault-official", debouncedSearch, bankType, cefrLevel],
    queryFn: async () => {
      const res = await getOfficialVaultItemsApi({
        q: debouncedSearch,
        bank_type: bankType,
        cefr_level: cefrLevel,
        limit: 40,
      });
      return res.data?.items || [];
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
    enabled: isOpen && activeSource === "official",
  });

  const { data: privateData, isLoading: loadingPrivate } = useQuery({
    queryKey: ["vault-private", debouncedSearch, bankType, cefrLevel],
    queryFn: async () => {
      const res = await getTeacherPrivateVaultApi({
        q: debouncedSearch,
        bank_type: bankType,
        cefr_level: cefrLevel,
        limit: 40,
      });
      return res.data?.items || [];
    },
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
    enabled: isOpen && activeSource === "private" && showPrivateCollection,
  });

  const items: ApiVaultItem[] = activeSource === "official" ? officialData || [] : privateData || [];
  const isLoading = activeSource === "official" ? loadingOfficial : loadingPrivate;

  const speak = useSpeak();

  const handleImport = async (item: ApiVaultItem) => {
    setImportingId(item.id);
    let exampleText = "";
    let noteText = "Importado del Content Vault";
    if (item.metadata) {
      try {
        const meta = JSON.parse(item.metadata);
        if (meta.example) exampleText = meta.example;
        if (meta.trap || meta.note) noteText = meta.trap || meta.note;
      } catch {
        // Ignorar JSON malformado
      }
    }

    try {
      await onImportItem(
        {
          en: item.target_text,
          es: item.prompt_text,
          ipa: item.ipa || "",
          pos: item.bank_type,
          example: exampleText || item.explanation || "",
          note: noteText,
          noteType: "bulb",
          itemType: item.bank_type === "phrase" ? "phrase" : "word",
        },
        item.id
      );
      setImportedIds((prev) => new Set(prev).add(item.id));
    } finally {
      setImportingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border-l border-border-default h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-default pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-brand" />
              <h3 className="text-sm font-bold text-white">Importar al Plan de Lección</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg bg-canvas text-slate-muted hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Selector de Fuente: Oficial vs Privado */}
          <div
            className={`grid ${showPrivateCollection ? "grid-cols-2" : "grid-cols-1"} gap-2 p-1 bg-canvas rounded-xl border border-border-default`}
          >
            <button
              type="button"
              onClick={() => setActiveSource("official")}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeSource === "official"
                  ? "bg-card text-emerald-brand shadow-sm border border-border-default"
                  : "text-slate-muted hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Banco Wordtap</span>
            </button>
            {showPrivateCollection && (
              <button
                type="button"
                onClick={() => setActiveSource("private")}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeSource === "private"
                    ? "bg-card text-blue-400 shadow-sm border border-border-default"
                    : "text-slate-muted hover:text-white"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Mi Colección</span>
              </button>
            )}
          </div>

          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeSource === "official" ? "Buscar en banco oficial..." : "Buscar en mis tarjetas..."}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-canvas rounded-xl border border-border-default focus:border-emerald-brand focus:outline-none text-white"
            />
          </div>

          {/* Filtros rápidos: Tipo y CEFR */}
          <div className="grid grid-cols-2 gap-2">
            <select
              value={bankType}
              onChange={(e) => setBankType(e.target.value)}
              className="px-2.5 py-1.5 bg-canvas rounded-xl border border-border-default text-xs text-white focus:outline-none focus:border-emerald-brand"
            >
              <option value="all">Todos los Tipos</option>
              <option value="vocabulary">Vocabulario</option>
              <option value="phrase">Oraciones</option>
              <option value="collocation">Colocaciones</option>
              <option value="idioms">Modismos</option>
              <option value="false_friend">Falsos Amigos</option>
              <option value="minimal_pair">Pares Mínimos</option>
            </select>

            <select
              value={cefrLevel}
              onChange={(e) => setCefrLevel(e.target.value)}
              className="px-2.5 py-1.5 bg-canvas rounded-xl border border-border-default text-xs text-white focus:outline-none focus:border-emerald-brand"
            >
              <option value="all">Nivel CEFR (Todos)</option>
              <option value="A1">A1 - Principiante</option>
              <option value="A2">A2 - Elemental</option>
              <option value="B1">B1 - Intermedio</option>
              <option value="B2">B2 - Intermedio Alto</option>
              <option value="C1">C1 - Avanzado</option>
            </select>
          </div>

          <p className="text-[11px] text-slate-muted">
            Destino: <strong className="text-white">{currentLesson.title}</strong>
          </p>

          {/* Lista de Resultados */}
          <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-muted flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-brand" />
                <span>Cargando unidades del catálogo...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center bg-canvas rounded-xl border border-border-default space-y-1">
                <p className="text-xs text-slate-muted">No se encontraron términos disponibles.</p>
                {activeSource === "private" && (
                  <p className="text-[10px] text-slate-subtle">
                    Podés crear términos en tu biblioteca desde la sección Vault.
                  </p>
                )}
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand/50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-white text-xs">{item.target_text}</span>
                      {item.ipa && (
                        <span className="text-[10px] font-mono text-mint-brand">{item.ipa}</span>
                      )}
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-card text-slate-400 border border-border-default">
                        {item.cefr_level}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate mt-0.5">{item.prompt_text}</p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => speak(item.target_text)}
                      className="p-1.5 rounded-lg bg-card text-slate-400 hover:text-white cursor-pointer"
                      title="Pronunciar"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={importingId === item.id}
                      onClick={() => handleImport(item)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                        importedIds.has(item.id)
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-emerald-brand/10 text-emerald-brand hover:bg-emerald-brand hover:text-canvas"
                      }`}
                    >
                      {importingId === item.id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Añadiendo...</span>
                        </>
                      ) : importedIds.has(item.id) ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Añadida</span>
                        </>
                      ) : (
                        <span>+ Añadir</span>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-border-default">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-canvas border border-border-default text-slate-300 text-xs font-semibold hover:text-white cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
