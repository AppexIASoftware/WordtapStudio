"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface AuditPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (nextPage: number) => void;
}

/** Barra de paginacion simple para tablas de auditoria y reportes. */
export function AuditPagination({
  page,
  pageSize,
  total,
  onPageChange,
}: AuditPaginationProps) {
  if (total <= pageSize) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-card border border-border-default text-xs">
      <span className="text-slate-muted font-mono">
        Mostrando <strong className="text-white">{from}</strong>–
        <strong className="text-white">{to}</strong> de{" "}
        <strong className="text-white">{total}</strong> registros
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default hover:border-purple-500/40 text-slate-300 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Anterior</span>
        </button>

        <span className="px-2.5 font-mono text-slate-300">
          Página {page} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-xl bg-canvas border border-border-default hover:border-purple-500/40 text-slate-300 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Siguiente</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
