"use client";

import { Database, X } from "lucide-react";
import { CONTENT_VAULT_DATA } from "../../data/mock-teacher-data";
import { LessonItem, Lesson } from "../../types";

interface VaultDrawerProps {
  isOpen: boolean;
  currentLesson: Lesson;
  onClose: () => void;
  onImportItem: (item: Omit<LessonItem, "id">) => void;
}

export function VaultDrawer({
  isOpen,
  currentLesson,
  onClose,
  onImportItem,
}: VaultDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-md bg-card border-l border-border-default h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-default pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-brand" />
              <h3 className="text-sm font-bold text-white">Importar del Content Vault</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg bg-canvas text-slate-muted hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-muted">
            Selecciona términos y frases para inyectar directamente a esta lección (
            {currentLesson.title}):
          </p>

          <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
            {CONTENT_VAULT_DATA.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand/50 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-xs">{item.target}</span>
                    <span className="text-[10px] font-mono text-mint-brand">{item.ipa}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{item.prompt}</p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onImportItem({
                      en: item.target,
                      es: item.prompt,
                      ipa: item.ipa,
                      pos: item.meta?.pos || item.type,
                      example: item.meta?.example || "",
                      note: item.meta?.trap || "Importado desde Vault",
                      noteType: "bulb",
                      itemType: "word",
                    })
                  }
                  className="px-2.5 py-1 rounded-lg bg-emerald-brand/10 text-emerald-brand hover:bg-emerald-brand hover:text-canvas font-bold text-xs transition-colors cursor-pointer"
                >
                  + Añadir
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border-default">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-canvas border border-border-default text-slate-300 text-xs font-semibold hover:text-white cursor-pointer"
          >
            Cerrar Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
