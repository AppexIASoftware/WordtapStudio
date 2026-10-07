"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTeacherCoursesApi,
  getTeacherCourseReviewsApi,
  ApiCourse,
  ApiCourseReviewRequest,
} from "@/services/api";

export const TEACHER_COURSES_KEY = ["teacher", "courses"] as const;
export const TEACHER_REVIEWS_KEY = ["teacher", "reviews"] as const;

export function useTeacherCoursesQuery() {
  return useQuery<ApiCourse[]>({
    queryKey: TEACHER_COURSES_KEY,
    queryFn: async () => {
      const res = await getTeacherCoursesApi();
      return res.data || [];
    },
  });
}

export function useTeacherReviewsQuery() {
  return useQuery<ApiCourseReviewRequest[]>({
    queryKey: TEACHER_REVIEWS_KEY,
    queryFn: async () => {
      const res = await getTeacherCourseReviewsApi();
      return res.data || [];
    },
  });
}

export function useInvalidateTeacherData() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["teacher"] });
  };
}
