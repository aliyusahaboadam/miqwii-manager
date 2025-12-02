// Add these imports at the top
import { useMemo, useCallback, memo } from 'react';

// ... (keep all existing imports)

// CREATE A MEMOIZED STUDENT ROW COMPONENT
const StudentScoreRow = memo(({ 
  row, 
  actualIndex, 
  displayIndex, 
  page, 
  rowsPerPage,
  values,
  handleScoreChange,
  handleBlur,
  disableScoreInputFirstCA,
  disableScoreInputSecondCA,
  disableScoreInputExam,
  inputRefs
}) => {
  return (
    <StyledTableRow>
      <StyledTableCell>{page * rowsPerPage + displayIndex + 1}</StyledTableCell>
      <StyledTableCell>{row.regNo}</StyledTableCell>
      <StyledTableCell>
        {row.firstname + " " + row.surname + " " + row.lastname}
      </StyledTableCell>

      {/* FIRST CA */}
      <StyledTableCell>
        <TextField
          inputRef={(el) => (inputRefs.current[actualIndex * 3] = el)}
          disabled={!disableScoreInputFirstCA}
          label="First CA"
          variant="outlined"
          fullWidth
          margin="dense"
          value={values.students[actualIndex]?.score?.firstTest || ""}
          name={`students[${actualIndex}].score.firstTest`}
          onChange={(e) => handleScoreChange(e, actualIndex * 3 + 1)}
          onBlur={handleBlur}
          slotProps={{
            input: { 
              sx: { 
                fontSize: 16, 
                padding: 0,
                '& input': { padding: '15px 6px' }
              } 
            },
            inputLabel: { sx: { fontSize: 13 } },
            formHelperText: { sx: { fontSize: 12 } },
          }}
        />
      </StyledTableCell>

      {/* SECOND CA */}
      <StyledTableCell>
        <TextField
          inputRef={(el) => (inputRefs.current[actualIndex * 3 + 1] = el)}
          disabled={!disableScoreInputSecondCA}
          label="Second CA"
          variant="outlined"
          fullWidth
          margin="dense"
          value={values.students[actualIndex]?.score?.secondTest || ""}
          name={`students[${actualIndex}].score.secondTest`}
          onChange={(e) => handleScoreChange(e, actualIndex * 3 + 2)}
          onBlur={handleBlur}
          slotProps={{
            input: { 
              sx: { 
                fontSize: 16, 
                padding: 0,
                '& input': { padding: '15px 6px' }
              } 
            },
            inputLabel: { sx: { fontSize: 13 } },
            formHelperText: { sx: { fontSize: 12 } },
          }}
        />
      </StyledTableCell>

      {/* EXAM */}
      <StyledTableCell>
        <TextField
          inputRef={(el) => (inputRefs.current[actualIndex * 3 + 2] = el)}
          disabled={!disableScoreInputExam}
          label="Exam"
          variant="outlined"
          fullWidth
          margin="dense"
          value={values.students[actualIndex]?.score?.exam || ""}
          name={`students[${actualIndex}].score.exam`}
          onChange={(e) => handleScoreChange(e, actualIndex * 3 + 3)}
          onBlur={handleBlur}
          slotProps={{
            input: { 
              sx: { 
                fontSize: 16, 
                padding: 0,
                '& input': { padding: '15px 6px' }
              } 
            },
            inputLabel: { sx: { fontSize: 13 } },
            formHelperText: { sx: { fontSize: 12 } },
          }}
        />
      </StyledTableCell>
    </StyledTableRow>
  );
});

// MAIN COMPONENT - Replace your TeacherSubject component with these changes:
const TeacherSubject = () => {
  // ... (keep all existing state and hooks)

  // MEMOIZE INITIAL VALUES - only recalculate when dependencies change
  const initialValues = useMemo(() => {
    const subjectIdNumber = Number(subjectId);
    
    return {
      students: studentsInClassByClassId.map((student) => {
        let score = {};
        
        if (student.scoreReduced && Array.isArray(student.scoreReduced)) {
          score = student.scoreReduced.find(s => {
            const scoreSubjectId = Number(s.subjectId);
            return scoreSubjectId === subjectIdNumber;
          }) || {};
        }
        
        return {
          studentId: student.id,
          classId: Number(classId),
          subjectId: subjectIdNumber,
          scoreId: score.id || null,
          score: {
            id: score.id || null,
            firstTest: score.firstTest !== null && score.firstTest !== undefined ? score.firstTest : '',
            secondTest: score.secondTest !== null && score.secondTest !== undefined ? score.secondTest : '',
            exam: score.exam !== null && score.exam !== undefined ? score.exam : '',
          },
        };
      }),
    };
  }, [studentsInClassByClassId, subjectId, classId]); // Only recalculate when these change

  // MEMOIZE SUBMIT HANDLER
  const handleFormSubmit = useCallback(async (values, { resetForm }) => {
    try {
      const studentsWithScores = values.students.filter(student => {
        const hasScore = student.score.firstTest !== '' || 
                        student.score.secondTest !== '' || 
                        student.score.exam !== '';
        return hasScore;
      });

      if (studentsWithScores.length === 0) {
        setAlertType("error");
        setMessage("Please enter at least one score before saving");
        setOpen(true);
        return;
      }

      const result = await dispatch(saveScore(studentsWithScores)).unwrap();
      setAlertType("success");
      setMessage(result.message);
      
      await fetchData();
    } catch (error) {
      setAlertType("error");
      setMessage(error.message || "An error occurred while saving scores");
    }
    
    setOpen(true);
  }, [dispatch]);

  return (
    // ... (keep existing JSX until Formik section)
    
    <Formik
      initialValues={initialValues}
      validationSchema={scoreRegistrationSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
    >
      {(formik) => {
        const {
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        } = formik;

        // Initialize refs once
        if (!inputRefs.current.length) {
          inputRefs.current = new Array(rows.length * 3);
        }

        // MEMOIZE the score change handler
        const handleScoreChange = useCallback((e, nextIndex) => {
          const value = e.target.value;
          if (value.length > 2) return;
          
          handleChange(e);
          
          if (value.length === 2 && inputRefs.current[nextIndex]) {
            inputRefs.current[nextIndex].focus();
          }
        }, [handleChange]);

        return (
          <>
            <TableContainer component={Paper} sx={{ marginTop: 1 }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">S/N</StyledTableCell>
                    <StyledTableCell align="left">Reg. No</StyledTableCell>
                    <StyledTableCell align="left">Name</StyledTableCell>
                    <StyledTableCell align="left">1st CA</StyledTableCell>
                    <StyledTableCell align="right">2nd</StyledTableCell>
                    <StyledTableCell align="left">Exam</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {(rowsPerPage > 0
                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : rows
                  ).map((row, displayIndex) => {
                    const actualIndex = rows.findIndex(
                      (student) => student.id === row.id
                    );

                    return (
                      <StudentScoreRow
                        key={row.id}
                        row={row}
                        actualIndex={actualIndex}
                        displayIndex={displayIndex}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        values={values}
                        handleScoreChange={handleScoreChange}
                        handleBlur={handleBlur}
                        disableScoreInputFirstCA={disableScoreInputFirstCA}
                        disableScoreInputSecondCA={disableScoreInputSecondCA}
                        disableScoreInputExam={disableScoreInputExam}
                        inputRefs={inputRefs}
                      />
                    );
                  })}
                </TableBody>

                {/* ... rest of table footer */}
              </Table>
            </TableContainer>

            {/* Submit button */}
            <div className={[dashboard["card--add"], dashboard["card--primary"]].join(" ")}>
              <div className={dashboard["card_body"]}>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  onClick={handleSubmit}
                  className={[
                    dashboard["btn"],
                    dashboard["btn--block"],
                    dashboard["btn--green"],
                  ].join(" ")}
                >
                  {isSubmitting ? "Submitting..." : "Save Scores"}
                </button>
              </div>
            </div>
          </>
        );
      }}
    </Formik>
  );
};