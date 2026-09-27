// File: src/component/teacher/TeacherSubject.jsx
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { IconButton, Typography } from "@mui/material";
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
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getStudentCountDetailsByClass } from '../../redux/reducer/studentSlice';
import { getTeacherSubjectsByClassId } from '../../redux/reducer/subjectSlice';
import Loading from '../Chunks/loading';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import CirculerProgressLoader from '../utility/CirculerProgressLoader';

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import React from "react";
import navbar from '../style/dashboard/SchoolDashboard.module.css';
import TeacherDrawer from '../utility/drawer/TeacherDrawer';

import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0e387a",
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

const EmptySubjectsMessage = ({ className }) => (
    <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 1rem',
            textAlign: 'center',
            color: '#0e387a',
        }}
    >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#0e387a" strokeWidth="1.5">
            <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z" />
            <path d="M8 9h8M8 13h5" />
        </svg>
        <Typography sx={{ fontSize: 22, fontWeight: 600, mt: 3, color: '#0e387a' }}>
            No Subjects Assigned
        </Typography>
        <Typography sx={{ fontSize: 16, mt: 1, color: '#9a99ac', maxWidth: 420 }}>
            No subjects have been assigned to <strong>{className}</strong> yet.
            Ask the school admin to assign subjects to this class, or check back later.
        </Typography>
    </div>
);

const TeacherSubject = () => {

    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [anchorProfile, setAnchorProfile] = React.useState(null);

    const toggleDrawer = () => {
      setDrawerOpen(!isDrawerOpen);
    };

    const profilePopup = (event) => {
      setAnchorProfile(anchorProfile ? null : event.currentTarget);
    };

    const openProfile = Boolean(anchorProfile);
    const idProfile = openProfile ? 'simple-popper' : undefined;

    const handleClickAway = () => {
        setAnchorProfile(null);
    };

    const studentsState = useSelector((state) => state.students);
    const { studentCountDetailsByClass, fetchingStatus } = studentsState;

    const classState = useSelector((state) => state.classes);
    const { classes } = classState;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();

    const subjectState = useSelector((state) => state.subjects);
    const { teacherSubjects, fetchingStatus: subjectFetchingStatus } = subjectState;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(100);
    const { classId, className } = useParams();

    const authenticated = false;
    const logout = () => {
        localStorage.removeItem('token');
        navigate("/school/login");
        localStorage.setItem('authenticated', JSON.stringify(authenticated));
    };

    useEffect(() => {
        fetchData();
    }, [params, location.pathname]);

    const fetchData = () => {
        dispatch(getTeacherSubjectsByClassId(classId));
        dispatch(getStudentCountDetailsByClass(classId));
    };

    const rows = Array.isArray(teacherSubjects) ? teacherSubjects : [];

    const navigateToDashboard = () => {
        navigate(`/teacher/home`);
    };

    const navigateToAddScore = (subjectId, subjectName) => {
        navigate(`/score/add-score/${subjectId}/${classId}/${className}/${subjectName}`);
    };

    const navigateToAddFirstCA = (subjectId, subjectName) => {
        navigate(`/score/add-first-ca/${subjectId}/${classId}/${className}/${subjectName}`);
    };

    const navigateToAddSecondCA = (subjectId, subjectName) => {
        navigate(`/score/add-second-ca/${subjectId}/${classId}/${className}/${subjectName}`);
    };

    const navigateToAddExam = (subjectId, subjectName) => {
        navigate(`/score/add-exam/${subjectId}/${classId}/${className}/${subjectName}`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
          {fetchingStatus === 'loading' ? (<Loading />) : (
            <ClickAwayListener onClickAway={handleClickAway}>
              <Box sx={{ display: "flex" }}>
                <CssBaseline />

                <AppBar position="fixed" sx={{ zIndex: 2, background: "white", color: "#0e387a" }}>
                  <Toolbar sx={{ zIndex: 2, display: "flex", justifyContent: "space-between" }}>
                    {!isLargeScreen && (
                      <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                        <MenuIcon sx={{ color: "inherit", fontSize: 30 }} />
                      </IconButton>
                    )}
                    <div>
                      <IconButton onClick={profilePopup} sx={{
                        backgroundColor: "#0e387a",
                        "&:hover": { backgroundColor: "#0c3371" }
                      }}>
                        <PersonOutlineOutlinedIcon sx={{ color: "white", fontSize: 25 }} />
                      </IconButton>
                      <BasePopup sx={{ zIndex: 2 }} id={idProfile} open={openProfile} anchor={anchorProfile}>
                        <div className={navbar['profile--selection__container']}>
                          <div className={navbar['profile']}>
                            <a href="/teacher/teacher-profile" className={[navbar['link--profile'], navbar['']].join(' ')}>Profile</a>
                          </div>
                          <div className={navbar['logout']}>
                            <a onClick={logout} className={[navbar['link--profile'], navbar['']].join(' ')}>Logout</a>
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
                    transition: "margin-left 0.3s ease-in-out",
                  }}
                >
                  <div className={dashboard['secondary--container']}>
                    <div class={[dashboard['grid'], dashboard['grid--1x3']].join(' ')}>

                      <div class={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
                        <div class={dashboard['card_body']}>
                          <div class={dashboard['card_button_and_icon']}>
                            <span class={dashboard['icon-container']}>
                              <svg class={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#student"></use>
                              </svg>
                            </span>
                            <span class={[dashboard['badge'], dashboard['']].join(' ')}>{studentCountDetailsByClass?.totalCount}</span>
                          </div>
                          Total {className} Students
                        </div>
                      </div>

                      <div class={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
                        <div class={dashboard['card_body']}>
                          <div class={dashboard['card_button_and_icon']}>
                            <span class={dashboard['icon-container']}>
                              <svg class={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#student"></use>
                              </svg>
                            </span>
                            <span class={[dashboard['badge'], dashboard['']].join(' ')}>{studentCountDetailsByClass?.maleCount}</span>
                          </div>
                          Males {className} Students
                        </div>
                      </div>

                      <div class={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
                        <div class={dashboard['card_body']}>
                          <div class={dashboard['card_button_and_icon']}>
                            <span class={dashboard['icon-container']}>
                              <svg class={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
                                <use href="/images/sprite.svg#student"></use>
                              </svg>
                            </span>
                            <span class={[dashboard['badge'], dashboard['']].join(' ')}>{studentCountDetailsByClass?.femaleCount}</span>
                          </div>
                          Females {className} Students
                        </div>
                      </div>

                    </div>

                    <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                      {subjectFetchingStatus === 'loading'
                        ? <CirculerProgressLoader />
                        : rows.length === 0
                          ? <EmptySubjectsMessage className={className} />
                          : (
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell align="left">S/N</StyledTableCell>
                                  <StyledTableCell align="left">Subjects</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {(rowsPerPage > 0
                                  ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                  : rows
                                ).map((row, index) => (
                                  <StyledTableRow key={row.id}>
                                    <StyledTableCell component="th" scope="row">
                                      {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                      <div class={[dashboard['add-score-subject-text'], dashboard['']].join(' ')}>
                                        {row.name}
                                      </div>
                                      <div class={[dashboard['card--add-in-table'], dashboard['--primary']].join(' ')}>
                                        <button onClick={() => navigateToAddScore(row.id, row.name)} className={[dashboard['btn'], dashboard[''], dashboard['btn--score-add-all']].join(' ')}> Add All</button>
                                        <button onClick={() => navigateToAddFirstCA(row.id, row.name)} className={[dashboard['btn'], dashboard[''], dashboard['btn--score-add-ca1']].join(' ')}> Add CA1</button>
                                        <button onClick={() => navigateToAddSecondCA(row.id, row.name)} className={[dashboard['btn'], dashboard[''], dashboard['btn--score-add-ca2']].join(' ')}> Add CA2</button>
                                        <button onClick={() => navigateToAddExam(row.id, row.name)} className={[dashboard['btn'], dashboard[''], dashboard['btn--score-add-exam']].join(' ')}> Add Exam</button>
                                      </div>
                                    </StyledTableCell>
                                  </StyledTableRow>
                                ))}
                              </TableBody>
                              <TableFooter>
                                <TableRow>
                                  <TablePagination
                                    rowsPerPageOptions={[100, 200, 300, { label: 'All', value: -1 }]}
                                    colSpan={3}
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
                                      "& .MuiTablePagination-toolbar": { fontSize: 18 },
                                      "& .MuiTablePagination-selectLabel": { fontSize: 14 },
                                      "& .MuiTablePagination-input": { fontSize: 18 },
                                      "& .MuiTablePagination-displayedRows": { fontSize: 14 },
                                    }}
                                  />
                                </TableRow>
                              </TableFooter>
                            </Table>
                          )}
                    </TableContainer>

                    <div class={[dashboard['card--add'], dashboard['card--primary']].join(' ')}>
                      <div class={dashboard['card_body']}>
                        <button onClick={() => navigateToDashboard()} className={[dashboard['btn'], dashboard['btn--block'], dashboard['btn--accent']].join(' ')}>BACK</button>
                      </div>
                    </div>

                  </div>
                </Box>
              </Box>
            </ClickAwayListener>
          )}
        </>
    );
};

export default TeacherSubject;

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => onPageChange(event, 0);
    const handleBackButtonClick = (event) => onPageChange(event, page - 1);
    const handleNextButtonClick = (event) => onPageChange(event, page + 1);
    const handleLastPageButtonClick = (event) => onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                {theme.direction === 'rtl' ? <LastPageIcon sx={{ fontSize: 30 }} /> : <FirstPageIcon sx={{ fontSize: 30 }} />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight sx={{ fontSize: 30 }} /> : <KeyboardArrowLeft sx={{ fontSize: 30 }} />}
            </IconButton>
            <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
                {theme.direction === 'rtl' ? <KeyboardArrowLeft sx={{ fontSize: 30 }} /> : <KeyboardArrowRight sx={{ fontSize: 30 }} />}
            </IconButton>
            <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
                {theme.direction === 'rtl' ? <FirstPageIcon sx={{ fontSize: 30 }} /> : <LastPageIcon sx={{ fontSize: 30 }} />}
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