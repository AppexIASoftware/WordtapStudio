"use client";

import { useEffect, useMemo, useState } from "react";
import { getOfficialVaultItemsApi } from "@/services/api/vault";
import type { ApiVaultItem } from "@/services/api/types";

type Word = { id?: string; term: string; translation: string };

export function VaultPicker({ categoryId, level, itemCount, value, onChange }: {
  categoryId: string; level: string; itemCount: number; value: string; onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ key: string; items: ApiVaultItem[] }>({ key: "", items: [] });
  const key = JSON.stringify([categoryId, level, query]);
  const items = results.key === key ? results.items : [];
  const [error, setError] = useState<string | null>(null);
  const selected = useMemo<Word[]>(() => {
    try { const words = JSON.parse(value); return Array.isArray(words) ? words : []; }
    catch { return []; }
  }, [value]);

  useEffect(() => {
    let current = true;
    getOfficialVaultItemsApi({ category_id: categoryId || undefined, cefr_level: level.slice(0, 2), q: query, limit: 50 })
      .then((result) => {
        if (!current) return;
        setResults({ key, items: result.data?.items ?? [] });
        setError(result.error ? "No se pudo cargar el contenido. Intenta nuevamente." : null);
      })
      .catch(() => { if (current) setError("No se pudo cargar el contenido. Intenta nuevamente."); });
    return () => { current = false; };
  }, [categoryId, level, query, key]);

  const add = (item: ApiVaultItem) => {
    if (selected.some((word) => word.id === item.id)) return;
    onChange(JSON.stringify([...selected, { id: item.id, term: item.target_text, translation: item.prompt_text }]));
  };
  const suggest = () => {
    const next = [...selected];
    for (const item of items) {
      if (next.length >= itemCount) break;
      if (item.target_text && item.prompt_text && !next.some((word) => word.id === item.id))
        next.push({ id: item.id, term: item.target_text, translation: item.prompt_text });
    }
    onChange(JSON.stringify(next));
  };
  return (
    <section className="p-5 rounded-2xl bg-card border border-border-default space-y-3">
      <h3 className="text-sm font-bold text-white">Contenido del juego</h3>
      <p className="text-xs text-slate-300">Revisa las sugerencias de la categoría y el nivel elegidos, o busca y agrega contenido.</p>
      <input aria-label="Buscar contenido" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar contenido" className="w-full px-3 py-2 rounded-lg bg-canvas border border-border-default text-white text-sm" />
      <button type="button" onClick={suggest} disabled={items.length === 0} className="text-sm text-mint-brand">Agregar sugerencias</button>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {selected.length < itemCount && <p role="status" className="text-sm text-amber-300">Seleccionaste {selected.length} de {itemCount} contenidos. Agrega más o ajusta la cantidad.</p>}
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {selected.map((word, index) => <div key={`${word.id ?? word.term}-${index}`} className="flex justify-between gap-2 text-sm text-slate-200"><span>{word.term} — {word.translation}</span><button type="button" onClick={() => onChange(JSON.stringify(selected.filter((_, i) => i !== index)))} aria-label={`Quitar ${word.term}`} className="text-red-300">Quitar</button></div>)}
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {items.filter((item) => item.target_text && item.prompt_text).map((item) => <div key={item.id} className="flex justify-between gap-2 text-sm text-slate-300"><span>{item.target_text} — {item.prompt_text}</span><button type="button" onClick={() => add(item)} disabled={selected.some((word) => word.id === item.id)} aria-label={`Agregar ${item.target_text}`} className="text-mint-brand disabled:opacity-40">Agregar</button></div>)}
        {!error && items.length === 0 && <p className="text-sm text-slate-400">No hay contenido para esta búsqueda.</p>}
      </div>
    </section>
  );
}
