import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { compact } from "lodash";



/**
 * StudentScoreTable Component
 * 
 * This component works with the Java backend Score object structure.
 * 
 * Expected data structure from your API:
 * {
 *   students: [
 *     {
 *       studentId: 1,
 *       studentName: "John Doe",
 *       scores: [
 *         {
 *           id: 1,
 *           firstTest: 20,
 *           secondTest: 18,
 *           totalTest: 38,
 *           exam: 75,
 *           totalExam: 75,
 *           grade: "A",
 *           remark: "Excellent",
 *           average: 94.5,
 *           subjectId: 101,
 *           subjectName: "Mathematics",
 *           max: 100,
 *           positionPerSubject: 1,
 *           positionPerSubjectFormatted: "1st",
 *           studentId: 1
 *         },
 *         // ... more subjects
 *       ]
 *     },
 *     // ... more students
 *   ]
 * }
 * 
 * Props:
 * - data: Object with students array
 * - showCounter: boolean (default: true)
 * - counterHeader: string (default: "SN")
 * - nameHeader: string (default: "Student Name")
 * - subHeaders: object with labels for firstTest, secondTest, exam
 */
export const MasterSheetTable = (params) => {
  const { 
    data,
    showCounter = true, 
    counterHeader = "SN",
    nameHeader = "Name",
    subHeaders = {
      firstTest: "CA1",
      secondTest: "CA2",
      exam: "Exm"
    }
  } = params;

  const { students = [] } = data;

  // Extract unique subjects from the first student's scores
  // Assumes all students have the same subjects
  const subjects = students.length > 0 && students[0].scores 
    ? students[0].scores.map(score => ({
        id: score.subjectId,
        name: score.subjectName
      }))
    : [];

  // Calculate widths
  const counterWidth = showCounter ? 3 : 0;
  const nameWidth = 15;
  const remainingWidth = 100 - counterWidth - nameWidth;
  const subjectGroupWidth = subjects.length > 0 ? remainingWidth / subjects.length : 0;
  const scoreColumnWidth = subjectGroupWidth / 3;

  // Helper function to get score for a specific student and subject
  // Uses find() because scores is an array, not an object
  const getScore = (student, subjectId, field) => {
    if (!student.scores || !Array.isArray(student.scores)) return "";
    
    const scoreObj = student.scores.find(s => s.subjectId === subjectId);
    if (!scoreObj) return "";
    
    const value = scoreObj[field];
    return value !== null && value !== undefined ? value : "";
  };

  return (
    <View style={styles.tableStyle}>
      {/* Subject Header Row */}
      <View style={styles.tableRowStyle} fixed>
        {/* Counter Header */}
        {showCounter && (
          <View
            style={compact([
              styles.tableColHeaderStyle,
              styles.firstTableColHeaderStyle,
              { width: `${counterWidth}%` }
            ])}
          >
            <Text>{counterHeader}</Text>
          </View>
        )}

        {/* Name Header */}
        <View
          style={compact([
            styles.tableColHeaderStyle,
            !showCounter ? styles.firstTableColHeaderStyle : null,
            { width: `${nameWidth}%` }
          ])}
        >
          <Text>{nameHeader}</Text>
        </View>

        {/* Subject Headers */}
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

      {/* Sub-header Row - First Test, Second Test, Exam */}
      <View style={styles.tableRowStyle} fixed>
        {/* Empty cell below counter */}
        {showCounter && (
          <View
            style={compact([
              styles.tableColHeaderStyle,
              styles.firstTableColHeaderStyle,
             { width: `${counterWidth}%` }
            ])}
          >
            <Text></Text>
          </View>
        )}

        {/* Empty cell below name */}
        <View
          style={compact([
            styles.tableColHeaderStyle,
            !showCounter ? styles.firstTableColHeaderStyle : null,
            { width: `${nameWidth}%` }
          ])}
        >
          <Text></Text>
        </View>

        {/* Sub-headers for each subject */}
        {subjects.map((subject, subjectIdx) => (
          <View 
            key={subject.id || subjectIdx} 
            style={{ flexDirection: "row", width: `${subjectGroupWidth}%` }}
          >
            <View
              style={{
                ...styles.tableColHeaderStyle,
                ...styles.subHeaderStyle,
                width: "33.33%"
              }}
            >
              <Text>{subHeaders.firstTest}</Text>
            </View>
            <View
              style={{
                ...styles.tableColHeaderStyle,
                ...styles.subHeaderStyle,
                width: "33.33%"
              }}
            >
              <Text>{subHeaders.secondTest}</Text>
            </View>
            <View
              style={{
                ...styles.tableColHeaderStyle,
                ...styles.subHeaderStyle,
                width: "33.34%"
              }}
            >
              <Text>{subHeaders.exam}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Data Rows */}
      {students.map((student, rowIndex) => (
        <View key={student.studentId || rowIndex} style={styles.tableRowStyle} wrap={false}>
          {/* Counter Cell */}
          {showCounter && (
            <View
              style={compact([
                styles.tableColStyle,
                styles.firstTableColStyle,
                { width: `${counterWidth}%`, textAlign: "center" }
              ])}
            >
              <Text>{rowIndex + 1}</Text>
            </View>
          )}

          {/* Name Cell */}
          <View
            style={compact([
              styles.tableColStyle,
              !showCounter ? styles.firstTableColStyle : null,
              { width: `${nameWidth}%` }
            ])}
          >
            <Text>{student.studentName || student.name || ""}</Text>
          </View>

          {/* Score Cells for each subject */}
          {subjects.map((subject, subjectIdx) => (
            <View 
              key={subject.id || subjectIdx} 
              style={{ flexDirection: "row", width: `${subjectGroupWidth}%` }}
            >
              {/* First Test */}
              <View
                style={{
                  ...styles.tableColStyle,
                  ...styles.scoreColumnStyle,
                  width: "33.33%"
                }}
              >
                <Text>{getScore(student, subject.id, "firstTest")}</Text>
              </View>

              {/* Second Test */}
              <View
                style={{
                  ...styles.tableColStyle,
                  ...styles.scoreColumnStyle,
                  width: "33.33%"
                }}
              >
                <Text>{getScore(student, subject.id, "secondTest")}</Text>
              </View>

              {/* Exam */}
              <View
                style={{
                  ...styles.tableColStyle,
                  ...styles.scoreColumnStyle,
                  width: "33.34%"
                }}
              >
                <Text>{getScore(student, subject.id, "exam")}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};




const styles = StyleSheet.create({
  tableColStyle: {
    borderStyle: "solid",
    borderColor: "#3f3f3f",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    paddingVertical: 3,
    paddingHorizontal: 5,
    fontSize: 9.5,
    fontFamily: 'Roboto'
  },
  tableRowStyle: {
    flexDirection: "row",
  },
  tableStyle: {
    width: "auto",
  },
  firstTableColHeaderStyle: {
    borderStyle: "solid",
    borderColor: "#3f3f3f",
    borderWidth: 1,
    borderLeftWidth: 1,
    backgroundColor: "#dfdfdf",
  },
  firstTableColStyle: {
    borderStyle: "solid",
    borderColor: "#3f3f3f",
    borderWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 0,
  },
  tableColHeaderStyle: {
    borderStyle: "solid",
    borderColor: "#3f3f3f",
    borderWidth: 1,
    borderLeftWidth: 0,
    backgroundColor: "#dfdfdf",
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 11,
  },
  subjectHeaderStyle: {
    borderStyle: "solid",
    borderColor: "#3f3f3f",
    borderWidth: 1,
    borderLeftWidth: 0,
    backgroundColor: "#b8b8b8",
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 8,
    textAlign: "center"
  },
  subHeaderStyle: {
    fontSize: 7,
    textAlign: "center"
  },
  nameColumnStyle: {
    width: "15%",
  },
  scoreColumnStyle: {
    textAlign: "center"
  }
});