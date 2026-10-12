// src/component/result/resultHelpers.js
//
// Shared helpers for the three result PDF renderers.
//
// Layout conventions changed: the backend now sends `disableX` flags
// (matching the Settings entity). `false` = the box is shown. The render
// sites use `!layout.disableX` to decide whether to draw a box.

/**
 * Fallback layout when the backend didn't send one.
 * All `false` = nothing disabled = everything shown.
 */
export const DEFAULT_LAYOUT = {
  disableTeacherRemark: false,
  disableNextTermFees: false,
  disableQrCode: false,
  disableTermPerformanceSummary: false,
  disablePositioning: false,
};

/**
 * Merge the backend's layout with the default. Any missing flag defaults
 * to `false` (box shown).
 */
export const resolveLayout = (raw) => ({
  ...DEFAULT_LAYOUT,
  ...(raw || {}),
});

/**
 * Fallback columns when the backend didn't send any.
 */
export const DEFAULT_COLUMNS = [
  { field: 'max',        header: 'Max',   max: 100 },
  { field: 'firstTest',  header: 'CA1',   max: 20 },
  { field: 'secondTest', header: 'CA2',   max: 20 },
  { field: 'totalTest',  header: 'Sum',   max: 40 },
  { field: 'exam',       header: 'Exam',  max: 60 },
  { field: 'totalExam',  header: 'Total', max: 100, bold: true },
];

export const resolveColumns = (raw) =>
  Array.isArray(raw) && raw.length > 0 ? raw : DEFAULT_COLUMNS;

/**
 * Build the ScoreTable columns array.
 *
 * Weights are the original 50/15/16 layout. Subject is 50, each component
 * 15, Sum 16, Pos 16, Grade 16, Remark 30. Total exceeds 100, react-pdf
 * squeezes proportionally, and all templates produce exactly 10 columns
 * so they render with identical proportions.
 */
export const buildScoreColumns = (backendColumns) => {
  const cols = resolveColumns(backendColumns);

  const head = [
    { accessorKey: 'subjectName', header: () => 'Subject', size: 50 },
  ];

  const middle = cols.map((c) => ({
    accessorKey: c.field,
    header: () => c.header,
    size: c.field === 'totalTest' ? 16 : 15,
    bold: !!c.bold,
  }));

  const tail = [
    { accessorKey: 'positionPerSubjectFormatted', header: () => 'Pos',    size: 16 },
    { accessorKey: 'grade',                       header: () => 'Grade',  size: 16 },
    { accessorKey: 'remark',                      header: () => 'Remark', size: 30 },
  ];

  return [...head, ...middle, ...tail];
};

/**
 * KeyTable columns for the KEYS box — A/B/C/D/E.
 */
export const scoreKeyColumns = () => [
  { accessorKey: 'a', size: 35, bold: false },
  { accessorKey: 'b', size: 35 },
  { accessorKey: 'c', size: 20 },
  { accessorKey: 'd', size: 20 },
  { accessorKey: 'e', size: 20 },
];

/**
 * KeyTable columns for the SCHOOL NEXT TERM FEES box.
 */
export const feesKeyColumns = () => [
  { accessorKey: 'nextSSSTermFee', header: () => 'SSS Class', size: 35, bold: false },
  { accessorKey: 'nextJSSTermFee', header: () => 'JSS Class', size: 35 },
  { accessorKey: 'nextPRITermFee', header: () => 'PRI Class', size: 35 },
  { accessorKey: 'nextNURTermFee', header: () => 'NUR Class', size: 35 },
];

/**
 * Static KEYS data — A/B/C/D/E across two rows.
 */
export const SCORE_KEY_DATA = [
  { a: 'A', b: 'B', c: 'C', d: 'D', e: 'E' },
  { a: 'Excellence', b: 'Very Good', c: 'Good', d: 'Pass', e: 'Fail' },
];

/**
 * Term performance summary rows.
 */
export const TERM_PERF_ROWS = [
  { accessorKey: 'subjectOffered', header: () => 'Total Subject Offered', bold: true },
  { accessorKey: 'marksObtained', header: () => 'Total Marks Obtained', bold: true },
  { accessorKey: 'marksObtainable', header: () => 'Total Marks Obtainable', bold: true },
  { accessorKey: 'personalAvg', header: () => 'Personal Average Marks', bold: true },
  { accessorKey: 'avgObtainable', header: () => 'Average Marks Obtainable', bold: true },
];

/**
 * Compute the five term-performance numbers from a result.
 */
export const getTermPerformanceRow = (result) => {
  const scores = Array.isArray(result?.scores) ? result.scores : [];

  const subjectsOffered = scores.length;
  const totalObtained = scores.reduce(
    (sum, s) => sum + (Number(s?.totalExam) || 0),
    0
  );
  const totalObtainable = scores.reduce(
    (sum, s) => sum + (Number(s?.max) || 0),
    0
  );
  const personalAverage = Number(result?.overallAverage) || 0;
  const averageObtainable =
    subjectsOffered > 0 ? totalObtainable / subjectsOffered : 0;

  return {
    subjectOffered: subjectsOffered,
    marksObtained: totalObtained,
    marksObtainable: totalObtainable,
    personalAvg: personalAverage.toFixed(2),
    avgObtainable: averageObtainable.toFixed(2),
  };
};

/**
 * Teacher remark from average.
 */
export const getAverageRemark = (average) => {
  const a = Number(average);
  if (!Number.isFinite(a)) return 'Keep working hard!';
  if (a >= 75) return 'Outstanding! Keep up the excellent effort.';
  if (a >= 70) return "Excellent! You're among the very best.";
  if (a >= 60) return 'Very good performance. Keep it up!';
  if (a >= 50) return 'Good effort. You can do better. Aim higher!';
  if (a >= 40) return 'Fair performance. More effort is needed.';
  if (a >= 30) return 'Put in more effort. Seek help when needed.';
  return 'Much improvement needed. Work harder!';
};

/**
 * Teacher remark from position.
 */
export const getPositionRemark = (position, totalStudents) => {
  if (!totalStudents || totalStudents <= 0) return 'Keep working hard!';
  const percentile = ((totalStudents - position) / totalStudents) * 100;
  if (totalStudents === 1) return 'Only student in class. Keep it up!';
  if (percentile >= 95) return 'Outstanding! Keep up the excellent effort.';
  if (percentile >= 90) return "Excellent! You're among the very best.";
  if (percentile >= 80) return 'Very good performance. Keep it up!';
  if (percentile >= 60) return 'Good effort. You can do better. Aim higher!';
  if (percentile >= 40) return 'Fair performance. More effort is needed.';
  if (percentile >= 20) return 'Put in more effort. Seek help when needed.';
  return 'Much improvement needed. Work harder!';
};

/**
 * QR code payload builder.
 */
export const buildQrText = (result) =>
  `Student Result\n` +
  `Name: ${result.student.firstname} ${result.student.surname} ${result.student.lastname}\n` +
  `School: ${result.school.name}\n` +
  `Class: ${result.class1.name}\n` +
  `Session: ${result.academicSession.session}\n` +
  `Term: ${result.academicSession.term}\n` +
  `Position: ${result.position}\n` +
  `Average: ${result.overallAverage}`;

/**
 * Amount formatter.
 */
export const formatAmount = (amount) =>
  `N${new Intl.NumberFormat('en-NG').format(amount)}`;

/**
 * Build the fee key data row from a result.
 */
export const buildFeeKeyData = (result) => [
  {
    nextSSSTermFee: formatAmount(result?.academicSession?.nextSSSTermFee || 'Unset'),
    nextJSSTermFee: formatAmount(result?.academicSession?.nextJSSTermFee || 'Unset'),
    nextPRITermFee: formatAmount(result?.academicSession?.nextPRITermFee || 'Unset'),
    nextNURTermFee: formatAmount(result?.academicSession?.nextNURTermFee || 'Unset'),
  },
];