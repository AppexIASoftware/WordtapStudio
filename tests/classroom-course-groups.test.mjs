import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COURSE_GROUP, courseGroup, pendingCourseLabel } from '../src/features/classrooms/components/course-groups.ts';

test('only published courses belong in the available tab', () => {
  for (const status of ['draft', 'in_review', 'archived', undefined]) {
    assert.equal(courseGroup(status), COURSE_GROUP.PENDING);
  }
  assert.equal(courseGroup('published'), COURSE_GROUP.AVAILABLE);
});

test('pending courses retain their actual publication state', () => {
  assert.equal(pendingCourseLabel('draft'), 'Borrador');
  assert.equal(pendingCourseLabel('in_review'), 'En revisión');
  assert.equal(pendingCourseLabel('archived'), 'Archivado');
  assert.equal(pendingCourseLabel(undefined), 'No disponible');
});
