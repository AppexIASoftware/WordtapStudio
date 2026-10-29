"use client";

import { useAdminCatalog } from "../hooks/use-admin-catalog";
import { CatalogHeader } from "../components/catalog/catalog-header";
import { CatalogTabs } from "../components/catalog/catalog-tabs";
import { CoursesTable } from "../components/catalog/courses-table";
import { NewCourseModal } from "../components/new-course-modal";
import { EditCourseModal } from "../components/edit-course-modal";
import { PricingModal } from "../components/builder/pricing-modal";
import { ToastNotification } from "@/components/ui/toast-notification";

export function AdminCoursesCatalogView() {
  const catalog = useAdminCatalog();
  const editing = catalog.editingDetailsCourse;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-canvas p-4 sm:p-6 lg:p-8 space-y-6">
      <ToastNotification message={catalog.toastMessage} variant="emerald" />
      <CatalogHeader
        totalCourses={catalog.courses.length}
        publishedCount={catalog.publishedCount}
        platformPublishedCount={catalog.platformPublishedCount}
        teacherPublishedCount={catalog.teacherPublishedCount}
        proCount={catalog.proCount}
        freeCount={catalog.freeCount}
        teacherCount={catalog.teacherCourses.length}
        tabTotal={catalog.currentTabCourses.length}
        tabPublishedCount={catalog.tabPublishedCount}
        tabDraftCount={catalog.tabDraftCount}
        tabInReviewCount={catalog.tabInReviewCount}
        searchQuery={catalog.searchQuery}
        onSearchChange={catalog.setSearchQuery}
        selectedLevel={catalog.selectedLevel}
        onLevelChange={catalog.setSelectedLevel}
        selectedStatus={catalog.selectedStatus}
        onStatusChange={catalog.setSelectedStatus}
        onOpenNewCourseModal={() => catalog.setShowNewCourseModal(true)}
      />
      <CatalogTabs
        activeTab={catalog.activeTab}
        onChangeTab={catalog.setActiveTab}
        platformCount={catalog.platformCourses.length}
        teacherCount={catalog.teacherCourses.length}
      />
      <CoursesTable
        activeTab={catalog.activeTab}
        selectedStatus={catalog.selectedStatus}
        selectedLevel={catalog.selectedLevel}
        searchQuery={catalog.searchQuery}
        otherTabPublishedCount={catalog.otherTabPublishedCount}
        isLoading={catalog.isLoading}
        totalCourses={catalog.courses.length}
        courses={catalog.filteredCourses}
        returnUrl={catalog.currentCatalogUrl}
        onChangeTab={catalog.setActiveTab}
        onCreate={() => catalog.setShowNewCourseModal(true)}
        onEditDetails={catalog.setEditingDetailsCourse}
        onEditPricing={catalog.setEditingPricingCourse}
        onTogglePublish={catalog.handleTogglePublish}
      />
      <NewCourseModal
        isOpen={catalog.showNewCourseModal}
        isAdmin={true}
        canCreateCategory
        onClose={() => catalog.setShowNewCourseModal(false)}
        onCreated={catalog.handleCourseCreated}
      />
      {catalog.selectedCourseForModal && (
        <PricingModal
          isOpen={true}
          course={catalog.selectedCourseForModal}
          isAdmin={true}
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
            tier: editing.access_tier === "subscription" ? "subscription" : editing.access_tier === "course" ? "course" : "free",
            price: (editing.price_cents ?? 0) / 100,
            currency: "USD",
            author: editing.author?.name || "Wordtap Core",
            lessons: [],
          }}
          isAdmin={true}
          canCreateCategory
          onClose={() => catalog.setEditingDetailsCourse(null)}
          onSave={catalog.handleSaveCourseDetails}
          onDelete={catalog.handleDeleteCourse}
        />
      )}
    </div>
  );
}
