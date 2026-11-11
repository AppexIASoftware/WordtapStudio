"use client";

import { useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { formatRelativeTime } from "./format";

interface RefreshButtonProps {
  onRefresh: () => void;
  isFetching: boolean;
  lastUpdatedAt: number | null;
}

export function RefreshButton({ onRefresh, isFetching, lastUpdatedAt }: RefreshButtonProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {lastUpdatedAt && (
        <span className="hidden sm:inline text-xs text-muted-foreground">
          Actualizado {formatRelativeTime(lastUpdatedAt, now)}
        </span>
      )}
      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
        aria-label="Actualizar"
        title="Actualizar"
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:cursor-wait"
      >
        <ArrowPathIcon
          className={`w-5 h-5 ${isFetching ? "animate-spin text-emerald-500" : "transition-transform duration-500 hover:rotate-180"}`}
        />
      </button>
    </div>
  );
}
