"use client";

import {
  CalendarDaysIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  CLASSROOM_NOTIFICATION_STATUS,
  ClassroomNotificationFilters,
  ClassroomNotificationStatus,
} from "../../types";
import { STATUS_LABEL, dateInputToIso, isoToDateInput } from "./format";

interface FilterBarProps {
  scope: "teacher" | "admin";
  filters: ClassroomNotificationFilters;
  onChange: (filters: Partial<ClassroomNotificationFilters>) => void;
  onClear: () => void;
}

const FIELD_CLASS =
  "h-10 w-full rounded-xl border border-border-default bg-background px-3 text-sm text-foreground " +
  "placeholder:text-muted-foreground/60 transition-colors hover:border-emerald-500/50 " +
  "focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:[color-scheme:dark]";

const LABEL_CLASS = "block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide";

const STATUS_OPTIONS: ClassroomNotificationStatus[] = [
  CLASSROOM_NOTIFICATION_STATUS.SENT,
  CLASSROOM_NOTIFICATION_STATUS.FAILED,
  CLASSROOM_NOTIFICATION_STATUS.PARTIAL,
];

const DATE_PRESETS = [
  { label: "Hoy", days: 0 },
  { label: "7 días", days: 7 },
  { label: "30 días", days: 30 },
] as const;

const ADMIN_ENTITY_FIELDS = [
  { key: "classroom_id", label: "Aula", placeholder: "ID aula" },
  { key: "teacher_id", label: "Docente", placeholder: "ID docente" },
  { key: "course_id", label: "Curso", placeholder: "ID curso" },
  { key: "lesson_id", label: "Lección", placeholder: "ID lección" },
] as const;

function applyPreset(days: number): Partial<ClassroomNotificationFilters> {
  const from = new Date();
  from.setDate(from.getDate() - days);
  const pad = (n: number) => String(n).padStart(2, "0");
  const toInput = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return {
    date_from: dateInputToIso(toInput(from), "start"),
    date_to: dateInputToIso(toInput(new Date()), "end"),
  };
}

export function NotificationFilterBar({ scope, filters, onChange, onClear }: FilterBarProps) {
  const chips: { key: string; label: string; clear: Partial<ClassroomNotificationFilters> }[] = [];
  if (filters.status) chips.push({ key: "status", label: STATUS_LABEL[filters.status], clear: { status: undefined } });
  if (filters.date_from)
    chips.push({ key: "from", label: `Desde ${isoToDateInput(filters.date_from)}`, clear: { date_from: undefined } });
  if (filters.date_to)
    chips.push({ key: "to", label: `Hasta ${isoToDateInput(filters.date_to)}`, clear: { date_to: undefined } });

  return (
    <div className="border-t border-border-default bg-muted/20 px-4 py-4 space-y-3">
      {scope === "admin" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ADMIN_ENTITY_FIELDS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className={LABEL_CLASS} htmlFor={`nf-${key}`}>{label}</label>
              <input
                id={`nf-${key}`}
                type="text"
                placeholder={placeholder}
                value={filters[key] ?? ""}
                onChange={(e) => onChange({ [key]: e.target.value || undefined })}
                className={FIELD_CLASS}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full sm:w-44">
          <label className={LABEL_CLASS} htmlFor="nf-status">Estado</label>
          <div className="relative">
            <select
              id="nf-status"
              value={filters.status ?? ""}
              onChange={(e) => onChange({ status: (e.target.value as ClassroomNotificationStatus) || undefined })}
              className={`${FIELD_CLASS} appearance-none pr-9 cursor-pointer`}
            >
              <option value="">Todos</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{STATUS_LABEL[status]}</option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        <div className="w-full sm:w-44">
          <label className={LABEL_CLASS} htmlFor="nf-from">Desde</label>
          <input
            id="nf-from"
            type="date"
            value={isoToDateInput(filters.date_from)}
            max={isoToDateInput(filters.date_to) || undefined}
            onChange={(e) => onChange({ date_from: dateInputToIso(e.target.value, "start") })}
            className={`${FIELD_CLASS} cursor-pointer`}
          />
        </div>

        <div className="w-full sm:w-44">
          <label className={LABEL_CLASS} htmlFor="nf-to">Hasta</label>
          <input
            id="nf-to"
            type="date"
            value={isoToDateInput(filters.date_to)}
            min={isoToDateInput(filters.date_from) || undefined}
            onChange={(e) => onChange({ date_to: dateInputToIso(e.target.value, "end") })}
            className={`${FIELD_CLASS} cursor-pointer`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pb-0.5">
          <CalendarDaysIcon className="w-4 h-4 text-muted-foreground" />
          {DATE_PRESETS.map(({ label, days }) => (
            <button
              key={label}
              type="button"
              onClick={() => onChange(applyPreset(days))}
              className="h-8 px-3 rounded-full border border-border-default text-xs font-medium text-muted-foreground hover:text-foreground hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-colors cursor-pointer"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 h-7 pl-3 pr-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium"
            >
              {chip.label}
              <button
                type="button"
                onClick={() => onChange(chip.clear)}
                aria-label={`Quitar filtro ${chip.label}`}
                className="p-0.5 rounded-full hover:bg-emerald-500/20 cursor-pointer"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={onClear}
            className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  );
}
