// src/component/score/scoreTemplateConfig.js
//
// Mirrors the backend's ResultTemplateConfig.columnsFor, but ONLY the
// input fields — no Sum, no Max, no Total. Those are display-only and
// computed on the backend.
//
// Used by:
//   - AddScore.jsx       → renders one input per entry, per student
//   - AddComponent.jsx   → looks up the header/max for a given field
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
    { field: 'firstTest',  header: 'CA1',  max: 10 },
    { field: 'secondTest', header: 'CA2',  max: 10 },
    { field: 'thirdTest',  header: 'CA3',  max: 10 },
    { field: 'assignment', header: 'Asg',  max: 10 },
    { field: 'exam',       header: 'Exam', max: 60 },
  ],
  TWO_TESTS_ONE_ASSIGNMENT_EXAM_70: [
    { field: 'firstTest',  header: 'CA1',  max: 10 },
    { field: 'secondTest', header: 'CA2',  max: 10 },
    { field: 'assignment', header: 'Asg',  max: 10 },
    { field: 'exam',       header: 'Exam', max: 70 },
  ],
  TEST_20_ASSIGNMENT_20_EXAM_60: [
    { field: 'firstTest',  header: 'CA1',  max: 20 },
    { field: 'assignment', header: 'Asg',  max: 20 },
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
 *
 * Sections are UPPER_SNAKE_CASE (`JUNIOR_SECONDARY`) but the settings
 * fields are camelCase (`juniorSecondaryTemplate`). Using
 * `section.toLowerCase() + 'Template'` would produce
 * `junior_secondaryTemplate` — which doesn't match anything — so we
 * map explicitly.
 *
 * The `SECONDARY` case is a legacy fallback for any class still carrying
 * the old section value (before the JSS/SSS split). It tries the old
 * single field first, then either of the two new fields, so nothing
 * blows up if the DB migration is partial.
 */
export const templateForSection = (settings, section) => {
  if (!settings || !section) return DEFAULT_TEMPLATE;

  switch (section) {
    case 'CRECHE':
      return settings.crecheTemplate         || DEFAULT_TEMPLATE;
    case 'KG':
      return settings.kgTemplate             || DEFAULT_TEMPLATE;
    case 'NURSERY':
      return settings.nurseryTemplate        || DEFAULT_TEMPLATE;
    case 'PRIMARY':
      return settings.primaryTemplate        || DEFAULT_TEMPLATE;

    // ── New split sections ──────────────────────────────────────────
    case 'JUNIOR_SECONDARY':
      return settings.juniorSecondaryTemplate || DEFAULT_TEMPLATE;
    case 'SENIOR_SECONDARY':
      return settings.seniorSecondaryTemplate || DEFAULT_TEMPLATE;

    // ── Legacy fallback ─────────────────────────────────────────────
    // If any class row somehow still has section = 'SECONDARY' (migration
    // not fully applied, or an old cached response), fall back to
    // whichever secondary template is available. Prefer the new fields
    // over the old one.
    case 'SECONDARY':
      return (
        settings.juniorSecondaryTemplate ||
        settings.seniorSecondaryTemplate ||
        settings.secondaryTemplate       ||
        DEFAULT_TEMPLATE
      );

    default:
      return DEFAULT_TEMPLATE;
  }
};