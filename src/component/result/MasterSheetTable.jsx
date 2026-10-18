import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { compact } from 'lodash';

/**
 * Master sheet table — no Reg No column, no Total column.
 * Columns per subject: inputs only (C1, C2, C3, As, Ex).
 * Max, Sum, and Total are filtered out.
 */

const HEADER_OVERRIDES = {
  firstTest: 'C1',
  secondTest: 'C2',
  thirdTest: 'C3',
  assignment: 'As',
  exam: 'Ex',
};

// Inputs only. totalExam and totalTest and max are excluded.
const VISIBLE_FIELDS = [
  'firstTest',
  'secondTest',
  'thirdTest',
  'assignment',
  'exam',
];

export const MasterSheetTable = (params) => {
  const {
    data,
    showCounter = true,
    counterHeader = 'SN',
    nameHeader = 'Name',
  } = params;

  const { students = [], subjectNames = [], columns = [] } = data;

  const sourceColumns =
    Array.isArray(columns) && columns.length > 0
      ? columns
      : [
          { field: 'firstTest', header: 'CA1' },
          { field: 'secondTest', header: 'CA2' },
          { field: 'exam', header: 'Exam' },
        ];

  const effectiveColumns = sourceColumns
    .filter((c) => VISIBLE_FIELDS.includes(c.field))
    .map((c) => ({
      field: c.field,
      header: HEADER_OVERRIDES[c.field] || c.header,
    }));

  const subjectsFromServer = Array.isArray(subjectNames)
    ? subjectNames.map((name) => ({ id: name, name }))
    : [];

  const subjectsFromScores =
    students.length > 0 && Array.isArray(students[0]?.scores)
      ? students[0].scores.map((score) => ({
          id: score.subjectName,
          name: score.subjectName,
        }))
      : [];

  const subjects =
    subjectsFromServer.length > 0 ? subjectsFromServer : subjectsFromScores;

  // Widths — SN(3) + Name(12.6 = 18 - 30%) + subjects split the rest
  const counterWidth = showCounter ? 3 : 0;
  const nameWidth = 12.6;
  const remainingWidth = 100 - counterWidth - nameWidth;
  const subjectGroupWidth =
    subjects.length > 0 ? remainingWidth / subjects.length : 0;
  const perColumnPercent =
    effectiveColumns.length > 0 ? 100 / effectiveColumns.length : 0;

  const getScore = (student, subjectName, field) => {
    if (!student.scores || !Array.isArray(student.scores)) return '';
    const scoreObj = student.scores.find((s) => s.subjectName === subjectName);
    if (!scoreObj) return '';
    const value = scoreObj[field];
    return value !== null && value !== undefined ? value : '';
  };


  console.log('SUBJECTS', subjects);
console.log('FIRST STUDENT SCORES', students[0]?.scores);
  return (
    <View style={styles.tableStyle}>
      {/* Subject Header Row */}
      <View style={styles.tableRowStyle} fixed>
        {showCounter && (
          <View
            style={compact([
              styles.tableColHeaderStyle,
              styles.firstTableColHeaderStyle,
              { width: `${counterWidth}%` },
            ])}
          >
            <Text>{counterHeader}</Text>
          </View>
        )}

        <View
          style={compact([
            styles.tableColHeaderStyle,
            !showCounter ? styles.firstTableColHeaderStyle : null,
            { width: `${nameWidth}%` },
          ])}
        >
          <Text>{nameHeader}</Text>
        </View>

        {subjects.map((subject, idx) => (
          <View
            key={subject.id || idx}
            style={{
              ...styles.subjectHeaderStyle,
              width: `${subjectGroupWidth}%`,
            }}
          >
            <Text>{subject.name}</Text>
          </View>
        ))}
      </View>

      {/* Sub-header Row */}
      <View style={styles.tableRowStyle} fixed>
        {showCounter && (
          <View
            style={compact([
              styles.tableColHeaderStyle,
              styles.firstTableColHeaderStyle,
              { width: `${counterWidth}%` },
            ])}
          >
            <Text></Text>
          </View>
        )}

        <View
          style={compact([
            styles.tableColHeaderStyle,
            !showCounter ? styles.firstTableColHeaderStyle : null,
            { width: `${nameWidth}%` },
          ])}
        >
          <Text></Text>
        </View>

        {subjects.map((subject, subjectIdx) => (
          <View
            key={subject.id || subjectIdx}
            style={{ flexDirection: 'row', width: `${subjectGroupWidth}%` }}
          >
            {effectiveColumns.map((col, colIdx) => (
              <View
                key={col.field || colIdx}
                style={{
                  ...styles.tableColHeaderStyle,
                  ...styles.subHeaderStyle,
                  width: `${perColumnPercent}%`,
                }}
              >
                <Text>{col.header}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Data Rows */}
      {students.map((student, rowIndex) => (
        <View
          key={student.studentId || rowIndex}
          style={styles.tableRowStyle}
          wrap={false}
        >
          {showCounter && (
            <View
              style={compact([
                styles.tableColStyle,
                styles.firstTableColStyle,
                { width: `${counterWidth}%`, textAlign: 'center' },
              ])}
            >
              <Text>{rowIndex + 1}</Text>
            </View>
          )}

          <View
            style={compact([
              styles.tableColStyle,
              !showCounter ? styles.firstTableColStyle : null,
              { width: `${nameWidth}%` },
            ])}
          >
            <Text>{student.studentName || student.name || ''}</Text>
          </View>

          {subjects.map((subject, subjectIdx) => (
            <View
              key={subject.id || subjectIdx}
              style={{ flexDirection: 'row', width: `${subjectGroupWidth}%` }}
            >
              {effectiveColumns.map((col, colIdx) => (
                <View
                  key={col.field || colIdx}
                  style={{
                    ...styles.tableColStyle,
                    ...styles.scoreColumnStyle,
                    width: `${perColumnPercent}%`,
                  }}
                >
                  <Text>{getScore(student, subject.name, col.field)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}

      {/* Empty state */}
      {students.length === 0 && (
        <View style={styles.tableRowStyle}>
          <View
            style={{
              ...styles.tableColStyle,
              ...styles.firstTableColStyle,
              width: '100%',
              paddingVertical: 12,
              textAlign: 'center',
            }}
          >
            <Text>No students enrolled in this class.</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tableColStyle: {
    borderStyle: 'solid',
    borderColor: '#3f3f3f',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    paddingVertical: 2,
    paddingHorizontal: 3,
    fontSize: 8.5,
    fontFamily: 'Roboto',
  },
  tableRowStyle: { flexDirection: 'row' },
  tableStyle: { width: 'auto' },
  firstTableColHeaderStyle: {
    borderStyle: 'solid',
    borderColor: '#3f3f3f',
    borderWidth: 1,
    borderLeftWidth: 1,
    backgroundColor: '#dfdfdf',
  },
  firstTableColStyle: {
    borderStyle: 'solid',
    borderColor: '#3f3f3f',
    borderWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 0,
  },
  tableColHeaderStyle: {
    borderStyle: 'solid',
    borderColor: '#3f3f3f',
    borderWidth: 1,
    borderLeftWidth: 0,
    backgroundColor: '#dfdfdf',
    paddingVertical: 3,
    paddingHorizontal: 3,
    fontSize: 10,
  },
  subjectHeaderStyle: {
    borderStyle: 'solid',
    borderColor: '#3f3f3f',
    borderWidth: 1,
    borderLeftWidth: 0,
    backgroundColor: '#b8b8b8',
    paddingVertical: 3,
    paddingHorizontal: 3,
    fontSize: 7.5,
    textAlign: 'center',
  },
  subHeaderStyle: { fontSize: 6.5, textAlign: 'center' },
  scoreColumnStyle: { textAlign: 'center' },
});