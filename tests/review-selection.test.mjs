import { test } from 'node:test';
import assert from 'node:assert/strict';
import { latestReviewIds, belongsToReviewTab } from '../src/features/moderation/hooks/review-selection.ts';

test('selects the latest submission per course regardless of input order', () => {
  const reviews = [
    { id: 'old-correction', course_id: 'a', submitted_at: '2026-01-01T00:00:00Z' },
    { id: 'approval', course_id: 'a', submitted_at: '2026-01-02T00:00:00Z' },
    { id: 'other', course_id: 'b', submitted_at: '2026-01-01T00:00:00Z' },
  ];
  assert.deepEqual([...latestReviewIds(reviews)].sort(), ['approval', 'other']);
  assert.deepEqual([...latestReviewIds(reviews.reverse())].sort(), ['approval', 'other']);
});

test('a new submission or withdrawal supersedes an older approval', () => {
  const reviews = [
    { id: 'approved', course_id: 'a', submitted_at: '2026-01-01T00:00:00Z' },
    { id: 'new-request', course_id: 'a', submitted_at: '2026-01-02T00:00:00Z' },
  ];
  assert.deepEqual([...latestReviewIds(reviews)], ['new-request']);
});

test('resolves equal timestamps deterministically and handles empty input', () => {
  assert.equal(latestReviewIds([]).size, 0);
  assert.deepEqual([...latestReviewIds([
    { id: 'a', course_id: 'c', submitted_at: '2026-01-01T00:00:00Z' },
    { id: 'b', course_id: 'c', submitted_at: '2026-01-01T00:00:00Z' },
  ])], ['b']);
});

test('approved tab excludes other decisions while history retains them', () => {
  const records = ['approved', 'changes_requested', 'rejected', 'withdrawn', 'open'].map((status) => ({ status, isCurrent: true }));
  assert.deepEqual(records.filter((r) => belongsToReviewTab(r, 'approved')).map((r) => r.status), ['approved']);
  assert.deepEqual(records.filter((r) => belongsToReviewTab(r, 'history')).map((r) => r.status), ['approved', 'changes_requested', 'rejected', 'withdrawn']);
  assert.equal(belongsToReviewTab({ status: 'changes_requested', isCurrent: false }, 'my'), false);
});

test('a past approval remains in history but not in the current approved tab', () => {
  const records = [
    { id: 'approval', course_id: 'course', submitted_at: '2026-10-06T10:17:04Z', status: 'approved' },
    { id: 'new-request', course_id: 'course', submitted_at: '2026-10-29T07:35:46Z', status: 'open' },
  ];
  const latest = latestReviewIds(records);
  const [oldApproval, newPending] = records.map((r) => ({ ...r, isCurrent: latest.has(r.id) }));
  assert.equal(belongsToReviewTab(oldApproval, 'approved'), false);
  assert.equal(belongsToReviewTab(oldApproval, 'history'), true);
  assert.equal(belongsToReviewTab(newPending, 'open'), true);
  assert.equal(belongsToReviewTab({ status: 'approved', isCurrent: true }, 'approved'), true);
});
