"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/client";
import {
  ClassroomNotification,
  ClassroomNotificationListResponse,
  ClassroomNotificationFilters,
} from "../types";

export interface UseNotificationHistoryOptions {
  scope: "teacher" | "admin";
  classroomId?: string;
  initialFilters?: ClassroomNotificationFilters;
}

export interface UseNotificationHistoryReturn {
  notifications: ClassroomNotification[];
  pagination: { total: number; limit: number; offset: number };
  /** True only while there is no data at all (first load). */
  isLoading: boolean;
  /** True during any request, including background refreshes. */
  isFetching: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  error: string | null;
  filters: ClassroomNotificationFilters;
  lastUpdatedAt: number | null;
  setFilters: (filters: Partial<ClassroomNotificationFilters>) => void;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

const DEFAULT_LIMIT = 20;
const STALE_TIME_MS = 30_000;
const FILTER_DEBOUNCE_MS = 300;

export const NOTIFICATION_HISTORY_KEY = "notification-history";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function buildNotificationHistoryUrl(
  scope: "teacher" | "admin",
  classroomId: string | undefined,
  filters: ClassroomNotificationFilters,
  offset: number,
): string {
  const params = new URLSearchParams();
  params.set("limit", String(filters.limit ?? DEFAULT_LIMIT));
  params.set("offset", String(offset));
  if (filters.status) params.set("status", filters.status);
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);

  if (scope === "teacher") {
    if (!classroomId) throw new Error("classroomId required for teacher scope");
    return `/teacher/classrooms/${classroomId}/notifications?${params.toString()}`;
  }

  if (filters.classroom_id) params.set("classroom_id", filters.classroom_id);
  if (filters.teacher_id) params.set("teacher_id", filters.teacher_id);
  if (filters.course_id) params.set("course_id", filters.course_id);
  if (filters.lesson_id) params.set("lesson_id", filters.lesson_id);
  return `/admin/notifications?${params.toString()}`;
}

export function useNotificationHistory({
  scope,
  classroomId,
  initialFilters = {},
}: UseNotificationHistoryOptions): UseNotificationHistoryReturn {
  const [filters, setFiltersState] = useState<ClassroomNotificationFilters>({
    limit: DEFAULT_LIMIT,
    ...initialFilters,
  });
  const debouncedFilters = useDebouncedValue(filters, FILTER_DEBOUNCE_MS);

  const query = useInfiniteQuery({
    queryKey: [NOTIFICATION_HISTORY_KEY, scope, classroomId ?? null, debouncedFilters],
    initialPageParam: 0,
    staleTime: STALE_TIME_MS,
    placeholderData: keepPreviousData,
    enabled: scope === "admin" || Boolean(classroomId),
    queryFn: async ({ pageParam, signal }) => {
      const url = buildNotificationHistoryUrl(scope, classroomId, debouncedFilters, pageParam);
      const response = await fetchApi<ClassroomNotificationListResponse>(url, { signal });
      if (response.error) throw new Error(response.error);
      return (
        response.data ?? {
          notifications: [],
          pagination: { total: 0, limit: DEFAULT_LIMIT, offset: pageParam },
        }
      );
    },
    getNextPageParam: (lastPage) => {
      const { offset, limit, total } = lastPage.pagination;
      const next = offset + limit;
      return next < total ? next : undefined;
    },
  });

  const notifications = useMemo(
    () => query.data?.pages.flatMap((page) => page.notifications) ?? [],
    [query.data],
  );
  const lastPagination = query.data?.pages[query.data.pages.length - 1]?.pagination;

  const setFilters = useCallback((next: Partial<ClassroomNotificationFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...next }));
  }, []);

  const loadMore = useCallback(async () => {
    if (query.hasNextPage && !query.isFetchingNextPage) await query.fetchNextPage();
  }, [query]);

  const refetch = useCallback(async () => {
    await query.refetch();
  }, [query]);

  return {
    notifications,
    pagination: lastPagination ?? { total: 0, limit: DEFAULT_LIMIT, offset: 0 },
    isLoading: query.isPending,
    isFetching: query.isFetching,
    isFetchingMore: query.isFetchingNextPage,
    hasMore: Boolean(query.hasNextPage),
    error: query.error instanceof Error ? query.error.message : null,
    filters,
    lastUpdatedAt: query.dataUpdatedAt || null,
    setFilters,
    loadMore,
    refetch,
  };
}
