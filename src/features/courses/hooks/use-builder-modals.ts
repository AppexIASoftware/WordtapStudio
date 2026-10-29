"use client";

import { useState } from "react";
import { Lesson } from "@/features/courses/types";

export function useBuilderModals(currentCourseLessons: Lesson[] | undefined) {
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showVaultDrawer, setShowVaultDrawer] = useState(false);
  const [showSubmitReviewModal, setShowSubmitReviewModal] = useState(false);

  const handleOpenModal = (name: string) => {
    if (name.startsWith("editLesson:")) {
      const lessonId = name.slice("editLesson:".length);
      setEditingLesson(currentCourseLessons?.find((l) => l.id === lessonId) || null);
      return;
    }
    const setters: Record<string, (value: boolean) => void> = {
      newCourse: setShowNewCourseModal,
      editCourse: setShowEditCourseModal,
      pricing: setShowPricingModal,
      addLesson: setShowAddLessonModal,
      addStep: setShowAddStepModal,
      export: setShowExportModal,
      vault: setShowVaultDrawer,
      submitReview: setShowSubmitReviewModal,
    };
    setters[name]?.(true);
  };

  const handleCloseModal = (name: string) => {
    if (name === "editLesson") {
      setEditingLesson(null);
      return;
    }
    const setters: Record<string, (value: boolean) => void> = {
      newCourse: setShowNewCourseModal,
      editCourse: setShowEditCourseModal,
      pricing: setShowPricingModal,
      addLesson: setShowAddLessonModal,
      addStep: setShowAddStepModal,
      export: setShowExportModal,
      vault: setShowVaultDrawer,
      submitReview: setShowSubmitReviewModal,
    };
    setters[name]?.(false);
  };

  return {
    showNewCourseModal,
    showEditCourseModal,
    showPricingModal,
    showAddLessonModal,
    editingLesson,
    showAddStepModal,
    showExportModal,
    showVaultDrawer,
    showSubmitReviewModal,
    handleOpenModal,
    handleCloseModal,
  };
}
