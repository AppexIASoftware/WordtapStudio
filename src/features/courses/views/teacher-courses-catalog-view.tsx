"use client";

import { useTeacherCatalog } from "../hooks/use-teacher-catalog";
import { CatalogHeader } from "../components/catalog/catalog-header";
import { CoursesTable } from "../components/catalog/courses-table";
import { NewCourseModal } from "../components/new-course-modal";
import { EditCourseModal } from "../components/edit-course-modal";
import { PricingModal } from "../components/builder/pricing-modal";
import { ToastNotification } from "@/components/ui/toast-notification";

export function TeacherCoursesCatalogView() {
  const catalog = useTeacherCatalog();
  const editing = catalog.editingDetailsCourse;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-canvas p-4 sm:p-6 lg:p-8 space-y-6">
      <ToastNotification message={catalog.toastMessage} variant="emerald" />
      <CatalogHeader
        scope="teacher"
        totalCourses={catalog.totalCount}
        publishedCount={catalog.publishedCount}
        tabTotal={catalog.totalCount}
        tabPublishedCount={catalog.publishedCount}
        tabDraftCount={catalog.draftCount}
        tabInReviewCount={catalog.inReviewCount}
        searchQuery={catalog.searchQuery}
        onSearchChange={catalog.setSearchQuery}
        selectedLevel={catalog.selectedLevel}
        onLevelChange={catalog.setSelectedLevel}
        selectedStatus={catalog.selectedStatus}
        onStatusChange={catalog.setSelectedStatus}
        onOpenNewCourseModal={() => catalog.setShowNewCourseModal(true)}
      />
      <CoursesTable
        scope="teacher"
        selectedStatus={catalog.selectedStatus}
        selectedLevel={catalog.selectedLevel}
        searchQuery={catalog.searchQuery}
        isLoading={catalog.isLoading}
        totalCourses={catalog.totalCount}
        courses={catalog.filteredCourses}
        returnUrl={catalog.currentCatalogUrl}
        editorHref={(course) => `/teacher/builder?courseId=${course.id}&from=/teacher/courses`}
        onCreate={() => catalog.setShowNewCourseModal(true)}
        onEditDetails={catalog.setEditingDetailsCourse}
        onEditPricing={catalog.setEditingPricingCourse}
      />
      <NewCourseModal
        isOpen={catalog.showNewCourseModal}
        isAdmin={false}
        canCreateCategory={true}
        onClose={() => catalog.setShowNewCourseModal(false)}
        onCreated={catalog.handleCourseCreated}
      />
      {catalog.selectedCourseForModal && (
        <PricingModal
          isOpen={true}
          course={catalog.selectedCourseForModal}
          isAdmin={false}
          onClose={() => catalog.setEditingPricingCourse(null)}
          onSavePrice={catalog.handleSavePrice}
        />
      )}
      {editing && (
        <EditCourseModal
          isOpen={true}
          course={{
            id: editing.id,
            title: editing.title,
            description: editing.description,
            level: editing.level,
            categoryId: editing.category_id,
            sourceLang: editing.source_lang,
            targetLang: editing.target_lang,
            tier:
              editing.access_tier === "subscription"
                ? "subscription"
                : editing.access_tier === "course"
                ? "course"
                : "free",
            price: (editing.price_cents ?? 0) / 100,
            currency: "PEN",
            author: editing.author?.name || "Docente",
            lessons: [],
          }}
          isAdmin={false}
          canCreateCategory={true}
          onClose={() => catalog.setEditingDetailsCourse(null)}
          onSave={catalog.handleSaveCourseDetails}
          onDelete={catalog.handleDeleteCourse}
        />
      )}
    </div>
  );
}
