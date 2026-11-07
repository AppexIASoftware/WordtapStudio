type Review = { id: string; course_id: string; submitted_at: string };

// Identify the latest submission, not the latest decision, for each course.
export function latestReviewIds(reviews: Review[]): Set<string> {
  const latest = new Map<string, Review>();
  for (const review of reviews) {
    const current = latest.get(review.course_id);
    const timestamp = Date.parse(review.submitted_at) || 0;
    const previous = current ? Date.parse(current.submitted_at) || 0 : -1;
    if (!current || timestamp > previous || (timestamp === previous && review.id > current.id)) {
      latest.set(review.course_id, review);
    }
  }
  return new Set(Array.from(latest.values(), (review) => review.id));
}

export type ReviewTab = "open" | "my" | "approved" | "history";
type ReviewState = { status: string; isCurrent?: boolean };

export function belongsToReviewTab(review: ReviewState, tab: ReviewTab): boolean {
  if (tab === "open") return !!review.isCurrent && (review.status === "open" || review.status === "pending");
  if (tab === "my") return !!review.isCurrent && ["in_review", "changes_requested", "rejected"].includes(review.status);
  if (tab === "approved") return !!review.isCurrent && review.status === "approved";
  return ["approved", "changes_requested", "rejected", "withdrawn"].includes(review.status);
}
