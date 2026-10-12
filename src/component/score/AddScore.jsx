import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { IconButton, Snackbar, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Formik, getIn } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { array, number, object } from 'yup';
import { saveScore } from '../../redux/reducer/scoreSlice';
import { getSettingsState } from '../../redux/reducer/settingsSlice';
import { getStudentsByClassId } from '../../redux/reducer/studentSlice';
import Loading from '../Chunks/loading';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import TeacherDrawer from '../utility/drawer/TeacherDrawer';

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Cancel, Menu as MenuIcon } from '@mui/icons-material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import React from 'react';
import navbar from '../style/dashboard/SchoolDashboard.module.css';

import { AppBar, Box, CssBaseline, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { DEFAULT_TEMPLATE, getTemplateInputs } from './scoreTemplateConfig';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#0e387a',
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const AddScore = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [anchorProfile, setAnchorProfile] = React.useState(null);

  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
  const profilePopup = (event) =>
    setAnchorProfile(anchorProfile ? null : event.currentTarget);
  const openProfile = Boolean(anchorProfile);
  const idProfile = openProfile ? 'simple-popper' : undefined;
  const handleClickAway = () => setAnchorProfile(null);

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [message, setMessage] = useState('');

  const studentsState = useSelector((state) => state.students);
  const { studentsInClassByClassId, fetchingStatus } = studentsState;

  // ------------------------------------------------------------------
  // Settings — new state keys, all `disableX`
  // ------------------------------------------------------------------
  const settingsState = useSelector((state) => state.settings);
  const disableFirstCA = settingsState.disableFirstCA;
  const disableSecondCA = settingsState.disableSecondCA;
  const disableThirdCA = settingsState.disableThirdCA;
  const disableAssignment = settingsState.disableAssignment;
  const disableExam = settingsState.disableExam;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const inputRefs = useRef([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const { subjectId, classId, className, subjectName } = useParams();

  const template = useMemo(() => {
    const url = new URLSearchParams(location.search);
    return url.get('template') || DEFAULT_TEMPLATE;
  }, [location.search]);

  const inputs = useMemo(() => getTemplateInputs(template), [template]);

  // Lookup: field → disabled?
  const isFieldDisabled = (field) => {
    switch (field) {
      case 'firstTest':
        return disableFirstCA;
      case 'secondTest':
        return disableSecondCA;
      case 'thirdTest':
        return disableThirdCA;
      case 'assignment':
        return disableAssignment;
      case 'exam':
        return disableExam;
      default:
        return false;
    }
  };

  const authenticated = false;
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/school/login');
    localStorage.setItem('authenticated', JSON.stringify(authenticated));
  };

  useEffect(() => {
    fetchData();
  }, [params, location.pathname]);

  const fetchData = () => {
    dispatch(getStudentsByClassId(classId));
    dispatch(getSettingsState());
  };

  const rows = Array.isArray(studentsInClassByClassId)
    ? studentsInClassByClassId
    : [];

  const rowIndexMap = useMemo(() => {
    const map = {};
    rows.forEach((row, index) => {
      map[row.id] = index;
    });
    return map;
  }, [rows]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const scoreRegistrationSchema = useMemo(() => {
    const scoreShape = {};
    inputs.forEach((input) => {
      scoreShape[input.field] = number()
        .typeError('Score must be a number')
        .min(0, 'Minimum is 0')
        .max(input.max, `Maximum is ${input.max}`);
    });
    return object({
      students: array().of(object({ score: object(scoreShape) })),
    });
  }, [inputs]);

  const handleFormSubmit = async (values) => {
    try {
      const studentsWithScores = values.students.filter((student) =>
        inputs.some((input) => {
          const v = student.score?.[input.field];
          return v !== '' && v !== null && v !== undefined;
        })
      );

      if (studentsWithScores.length === 0) {
        setAlertType('error');
        setMessage('Please enter at least one score before saving');
        setOpen(true);
        return;
      }

      const result = await dispatch(saveScore(studentsWithScores)).unwrap();
      setAlertType('success');
      setMessage(result.message);
      await fetchData();
    } catch (error) {
      setAlertType('error');
      setMessage(error.message || 'An error occurred while saving scores');
    }
    setOpen(true);
  };

  const subjectIdNumber = Number(subjectId);

  const initialValues = {
    students: studentsInClassByClassId.map((student) => {
      let score = {};
      if (student.scoreReduced && Array.isArray(student.scoreReduced)) {
        score =
          student.scoreReduced.find(
            (s) => Number(s.subjectId) === subjectIdNumber
          ) || {};
      }
      return {
        studentId: student.id,
        classId: Number(classId),
        subjectId: subjectIdNumber,
        scoreId: score.id || null,
        score: {
          id: score.id || null,
          firstTest: score.firstTest ?? '',
          secondTest: score.secondTest ?? '',
          thirdTest: score.thirdTest ?? '',
          assignment: score.assignment ?? '',
          exam: score.exam ?? '',
        },
      };
    }),
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const columnsPerRow = inputs.length;

  return (
    <>
      {fetchingStatus === 'loading' ? (
        <Loading />
      ) : (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar
              position="fixed"
              sx={{ zIndex: 2, background: 'white', color: '#0e387a' }}
            >
              <Toolbar
                sx={{
                  zIndex: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                {!isLargeScreen && (
                  <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                    <MenuIcon sx={{ color: 'inherit', fontSize: 30 }} />
                  </IconButton>
                )}

                <div>
                  <IconButton
                    onClick={profilePopup}
                    sx={{
                      backgroundColor: '#0e387a',
                      '&:hover': { backgroundColor: '#0c3371' },
                    }}
                  >
                    <PersonOutlineOutlinedIcon
                      sx={{ color: 'white', fontSize: 25 }}
                    />
                  </IconButton>

                  <BasePopup
                    sx={{ zIndex: 2 }}
                    id={idProfile}
                    open={openProfile}
                    anchor={anchorProfile}
                  >
                    <div className={navbar['profile--selection__container']}>
                      <div className={navbar['profile']}>
                        <a
                          href="/teacher/teacher-profile"
                          className={[navbar['link--profile'], navbar['']].join(' ')}
                        >
                          Profile
                        </a>
                      </div>
                      <div className={navbar['logout']}>
                        <a
                          onClick={logout}
                          className={[navbar['link--profile'], navbar['']].join(' ')}
                        >
                          Logout
                        </a>
                      </div>
                    </div>
                  </BasePopup>
                </div>
              </Toolbar>
            </AppBar>

            <TeacherDrawer
              isLargeScreen={isLargeScreen}
              isDrawerOpen={isDrawerOpen}
              toggleDrawer={toggleDrawer}
              logout={logout}
            />

            <Box
              component="main"
              sx={{
                flexGrow: 1,
                marginTop: 8,
                fontSize: 23,
                overflowX: 'auto',
                width: '100%',
                color: '#9a99ac',
                transition: 'margin-left 0.3s ease-in-out',
              }}
            >
              <div className={dashboard['secondary--container']}>
                <div
                  className={[
                    dashboard['card--count'],
                    dashboard['card--primary'],
                  ].join(' ')}
                >
                  <div className={dashboard['card_body']}>
                    <div className={dashboard['card_button_and_icon']}>
                      <span
                        className={[dashboard['badge'], dashboard['']].join(' ')}
                      >
                        {subjectName}
                      </span>
                    </div>
                    {className}
                  </div>
                </div>

                <Formik
                  initialValues={initialValues}
                  validationSchema={scoreRegistrationSchema}
                  onSubmit={handleFormSubmit}
                  enableReinitialize
                  validateOnChange={false}
                  validateOnBlur={true}
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

                    if (!inputRefs.current) inputRefs.current = [];

                    const handleScoreChange = (e, nextIndex) => {
                      const value = e.target.value;
                      if (value.length > 2) return;
                      if (value.length === 2 && inputRefs.current[nextIndex]) {
                        inputRefs.current[nextIndex].focus();
                      }
                      handleChange(e);
                    };

                    return (
                      <>
                        <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                          <Table sx={{ minWidth: 650 }} aria-label="add all scores">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell align="left">S/N</StyledTableCell>
                                <StyledTableCell align="left">Reg. No</StyledTableCell>
                                <StyledTableCell align="left">Name</StyledTableCell>
                                {inputs.map((input) => (
                                  <StyledTableCell key={input.field} align="left">
                                    {input.header}
                                  </StyledTableCell>
                                ))}
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {(rowsPerPage > 0
                                ? rows.slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                  )
                                : rows
                              ).map((row, displayIndex) => {
                                const actualIndex = rowIndexMap[row.id];
                                return (
                                  <MemoizedRow
                                    key={row.id}
                                    row={row}
                                    actualIndex={actualIndex}
                                    displayIndex={displayIndex}
                                    inputs={inputs}
                                    columnsPerRow={columnsPerRow}
                                    isFieldDisabled={isFieldDisabled}
                                    values={values}
                                    errors={errors}
                                    touched={touched}
                                    handleBlur={handleBlur}
                                    handleScoreChange={handleScoreChange}
                                    inputRefs={inputRefs}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                  />
                                );
                              })}
                            </TableBody>

                            <TableFooter>
                              <TableRow>
                                <TablePagination
                                  rowsPerPageOptions={[
                                    100,
                                    200,
                                    300,
                                    { label: 'All', value: -1 },
                                  ]}
                                  colSpan={3 + inputs.length}
                                  count={rows.length}
                                  rowsPerPage={rowsPerPage}
                                  page={page}
                                  slotProps={{
                                    select: {
                                      inputProps: { 'aria-label': 'rows per page' },
                                      native: true,
                                    },
                                  }}
                                  onPageChange={handleChangePage}
                                  onRowsPerPageChange={handleChangeRowsPerPage}
                                  ActionsComponent={TablePaginationActions}
                                  sx={{
                                    '& .MuiTablePagination-toolbar': { fontSize: 18 },
                                    '& .MuiTablePagination-selectLabel': {
                                      fontSize: 14,
                                    },
                                    '& .MuiTablePagination-input': { fontSize: 18 },
                                    '& .MuiTablePagination-displayedRows': {
                                      fontSize: 14,
                                    },
                                  }}
                                />
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>

                        <div
                          className={[
                            dashboard['card--add'],
                            dashboard['card--primary'],
                          ].join(' ')}
                        >
                          <div className={dashboard['card_body']}>
                            <button
                              disabled={isSubmitting}
                              type="submit"
                              onClick={handleSubmit}
                              className={[
                                dashboard['btn'],
                                dashboard['btn--block'],
                                dashboard['btn--green'],
                              ].join(' ')}
                            >
                              {isSubmitting ? 'Submitting...' : 'Save Scores'}
                            </button>
                          </div>
                        </div>
                      </>
                    );
                  }}
                </Formik>

                <Snackbar
                  open={open}
                  autoHideDuration={3000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                  <div>
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      BackdropProps={{
                        sx: { backgroundColor: 'rgba(157, 152, 202, 0.5)' },
                      }}
                      sx={{
                        '& .MuiDialog-paper': {
                          width: '100%',
                          borderRadius: '15px',
                        },
                      }}
                    >
                      {alertType === 'success' ? (
                        <div
                          style={{ width: '100%', background: '#fff' }}
                          className={[dashboard['card--alert-success']].join(' ')}
                        >
                          <div className={dashboard['card_body']}>
                            <span
                              className={[
                                dashboard['icon-container'],
                                dashboard['alert-close'],
                              ].join(' ')}
                            >
                              <IconButton onClick={handleClose}>
                                <Cancel sx={{ fontSize: 30 }} />
                              </IconButton>
                            </span>
                            <span className={dashboard['icon-container']}>
                              <svg
                                className={[
                                  dashboard['icon--big'],
                                  dashboard['icon--success'],
                                ].join(' ')}
                              >
                                <use href="/images/sprite.svg#success-icon"></use>
                              </svg>
                            </span>
                            <p className={dashboard['alert-message']}>{message}</p>
                          </div>
                          <p className={dashboard['card_footer']}>success</p>
                        </div>
                      ) : (
                        <div
                          style={{ width: '100%', background: '#fff' }}
                          className={[dashboard['card--alert-error']].join(' ')}
                        >
                          <div className={dashboard['card_body']}>
                            <span
                              className={[
                                dashboard['icon-container'],
                                dashboard['alert-close'],
                              ].join(' ')}
                            >
                              <IconButton onClick={handleClose}>
                                <Cancel sx={{ fontSize: 30 }} />
                              </IconButton>
                            </span>
                            <span className={dashboard['icon-container']}>
                              <svg
                                className={[
                                  dashboard['icon--big'],
                                  dashboard['icon--error'],
                                ].join(' ')}
                              >
                                <use href="/images/sprite.svg#error-icon"></use>
                              </svg>
                            </span>
                            <p className={dashboard['alert-message']}>{message}</p>
                          </div>
                          <p className={dashboard['card_footer']}>error</p>
                        </div>
                      )}
                    </Dialog>
                  </div>
                </Snackbar>
              </div>
            </Box>
          </Box>
        </ClickAwayListener>
      )}
    </>
  );
};

export default AddScore;

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => onPageChange(event, 0);
  const handleBackButtonClick = (event) => onPageChange(event, page - 1);
  const handleNextButtonClick = (event) => onPageChange(event, page + 1);
  const handleLastPageButtonClick = (event) =>
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? (
          <LastPageIcon sx={{ fontSize: 30 }} />
        ) : (
          <FirstPageIcon sx={{ fontSize: 30 }} />
        )}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight sx={{ fontSize: 30 }} />
        ) : (
          <KeyboardArrowLeft sx={{ fontSize: 30 }} />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft sx={{ fontSize: 30 }} />
        ) : (
          <KeyboardArrowRight sx={{ fontSize: 30 }} />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? (
          <FirstPageIcon sx={{ fontSize: 30 }} />
        ) : (
          <LastPageIcon sx={{ fontSize: 30 }} />
        )}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const MemoizedRow = React.memo(
  ({
    row,
    actualIndex,
    displayIndex,
    inputs,
    columnsPerRow,
    isFieldDisabled,
    values,
    errors,
    touched,
    handleBlur,
    handleScoreChange,
    inputRefs,
    page,
    rowsPerPage,
  }) => (
    <StyledTableRow key={row.id}>
      <StyledTableCell>{page * rowsPerPage + displayIndex + 1}</StyledTableCell>
      <StyledTableCell>{row.regNo}</StyledTableCell>
      <StyledTableCell>
        {row.firstname + ' ' + row.surname + ' ' + row.lastname}
      </StyledTableCell>

      {inputs.map((input, colIdx) => (
        <StyledTableCell key={input.field}>
          <TextField
            inputRef={(el) =>
              (inputRefs.current[actualIndex * columnsPerRow + colIdx] = el)
            }
            disabled={isFieldDisabled(input.field)}
            label={input.header}
            variant="outlined"
            fullWidth
            margin="dense"
            value={values.students[actualIndex]?.score?.[input.field] || ''}
            type="tel"
            inputMode="numeric"
            name={`students[${actualIndex}].score.${input.field}`}
            onChange={(e) =>
              handleScoreChange(e, actualIndex * columnsPerRow + colIdx + 1)
            }
            onBlur={handleBlur}
            error={Boolean(
              getIn(errors, `students[${actualIndex}].score.${input.field}`) &&
                getIn(touched, `students[${actualIndex}].score.${input.field}`)
            )}
            helperText={
              getIn(touched, `students[${actualIndex}].score.${input.field}`) &&
              getIn(errors, `students[${actualIndex}].score.${input.field}`)
            }
            slotProps={{
              input: {
                sx: {
                  fontSize: 16,
                  padding: 0,
                  '& input': { padding: '15px 6px' },
                },
              },
              inputLabel: { sx: { fontSize: 13 } },
              formHelperText: { sx: { fontSize: 12 } },
            }}
          />
        </StyledTableCell>
      ))}
    </StyledTableRow>
  )
);