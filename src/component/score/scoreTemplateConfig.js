// src/component/score/scoreTemplateConfig.js
//
// Mirrors the backend's ResultTemplateConfig.columnsFor, but ONLY the
// input fields — no Sum, no Max, no Total. Those are display-only and
// computed on the backend.
//
// Used by:
//   - AddScore.jsx     → renders one input per entry, per student
//   - AddComponent.jsx → looks up the header/max for a given field
//   - TeacherSubject.jsx → decides which single-component buttons to render
//
// If you add a template on the backend, mirror it here so the UI knows
// which inputs to draw.

export const DEFAULT_TEMPLATE = 'DEFAULT_2CA_20_20_EXAM_60';

export const TEMPLATE_INPUTS = {
  DEFAULT_2CA_20_20_EXAM_60: [
    { field: 'firstTest',  header: 'CA1',  max: 20 },
    { field: 'secondTest', header: 'CA2',  max: 20 },
    { field: 'exam',       header: 'Exam', max: 60 },
  ],
  THREE_TESTS_ONE_ASSIGNMENT_EXAM_60: [
    { field: 'firstTest',  header: 'CA1', max: 10 },
    { field: 'secondTest', header: 'CA2', max: 10 },
    { field: 'thirdTest',  header: 'CA3', max: 10 },
    { field: 'assignment', header: 'Asg', max: 10 },
    { field: 'exam',       header: 'Exam', max: 60 },
  ],
  TWO_TESTS_ONE_ASSIGNMENT_EXAM_70: [
    { field: 'firstTest',  header: 'CA1', max: 10 },
    { field: 'secondTest', header: 'CA2', max: 10 },
    { field: 'assignment', header: 'Asg', max: 10 },
    { field: 'exam',       header: 'Exam', max: 70 },
  ],
  TEST_20_ASSIGNMENT_20_EXAM_60: [
    { field: 'firstTest',  header: 'CA1', max: 20 },
    { field: 'assignment', header: 'Asg', max: 20 },
    { field: 'exam',       header: 'Exam', max: 60 },
  ],
};

/**
 * The ordered input list for a given template.
 * Falls back to the default template if the name is unknown.
 */
export const getTemplateInputs = (template) =>
  TEMPLATE_INPUTS[template] || TEMPLATE_INPUTS[DEFAULT_TEMPLATE];

/**
 * Look up a single input entry by field name for a given template.
 * Returns null if not found (e.g. 'thirdTest' under a template that
 * doesn't have one).
 */
export const getInputByField = (template, field) => {
  const list = getTemplateInputs(template);
  return list.find((i) => i.field === field) || null;
};

/**
 * Resolve the template name from the Redux settings object and a section.
 * The settings keys are e.g. `primaryTemplate`, `secondaryTemplate`.
 */
export const templateForSection = (settings, section) => {
  if (!settings || !section) return DEFAULT_TEMPLATE;
  const key = `${section.toLowerCase()}Template`;
  return settings[key] || DEFAULT_TEMPLATE;
};